import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { auth } from "APIs/firebaseConfig";
import { fetchUserPreferences, saveUserPreferences } from "service/userPreferences";

const STORAGE_KEY = "rpg:preferences:v1";

const DEFAULTS = {
  themeMode: "system",     // "system" | "light" | "dark"
  themeStyle: "parchment", // "default" | "parchment"
  reduceMotion: false,
  pageTransition: "dragon", // "dragon" | "simple"
};

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function loadLocalPrefs() {
  const raw = localStorage.getItem(STORAGE_KEY);
  const parsed = raw ? safeParse(raw) : null;
  return { ...DEFAULTS, ...(parsed || {}) };
}

function saveLocalPrefs(prefs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

const PreferencesContext = createContext(null);

export function PreferencesProvider({ children }) {
  const [prefs, setPrefs] = useState(() => loadLocalPrefs());

  const uidRef = useRef(null);
  const hydratedFromRemoteRef = useRef(false);
  const saveTimerRef = useRef(null);

  const update = useCallback((patch) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      saveLocalPrefs(next);
      return next;
    });
  }, []);

  // ✅ 1) Ao logar: buscar do Firebase e aplicar (remote sobrepõe local)
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      uidRef.current = user?.uid || null;
      hydratedFromRemoteRef.current = false;

      if (!user?.uid) return;

      try {
        const remote = await fetchUserPreferences(user.uid);
        if (remote) {
          setPrefs((prev) => {
            const merged = { ...prev, ...remote };
            saveLocalPrefs(merged);
            return merged;
          });
        }
      } finally {
        hydratedFromRemoteRef.current = true;
      }
    });

    return () => unsub?.();
  }, []);

  // ✅ 2) Ao mudar prefs: salvar no Firebase (com debounce) se logado
  useEffect(() => {
    // evita salvar antes de terminar a hidratação do remote
    if (!uidRef.current) return;
    if (!hydratedFromRemoteRef.current) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(() => {
      saveUserPreferences(uidRef.current, prefs).catch(() => null);
    }, 450);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [prefs]);

  const value = useMemo(
    () => ({
      prefs,
      update,
      setThemeMode: (themeMode) => update({ themeMode }),
      setThemeStyle: (themeStyle) => update({ themeStyle }),
      setReduceMotion: (reduceMotion) => update({ reduceMotion }),
      setPageTransition: (pageTransition) => update({ pageTransition }),
    }),
    [prefs, update]
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences deve ser usado dentro de PreferencesProvider");
  return ctx;
}