import { database } from "APIs/firebaseConfig";

export async function fetchUserPreferences(uid) {
  if (!uid) return null;
  const snap = await database.ref(`preferences/${uid}`).once("value");
  return snap.val() || null;
}

export async function saveUserPreferences(uid, prefs) {
  if (!uid) return;
  // manter só o que é preferências (evita lixo)
  const payload = {
    themeMode: prefs?.themeMode ?? "system",
    themeStyle: prefs?.themeStyle ?? "parchment",
    reduceMotion: Boolean(prefs?.reduceMotion),
    pageTransition: prefs?.pageTransition ?? "dragon",
    updatedAt: Date.now(),
  };
  await database.ref(`preferences/${uid}`).set(payload);
}