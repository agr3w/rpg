import { database } from "APIs/firebaseConfig";

export async function fetchUserPreferences(uid) {
  if (!uid) return null;
  const snap = await database.ref(`preferences/${uid}`).once("value");
  return snap.val() || null;
}

export async function saveUserPreferences(uid, prefs) {
  if (!uid) return;
  
  // ✅ CORREÇÃO: Incluindo visualQuality e volume no payload
  const payload = {
    themeMode: prefs?.themeMode ?? "system",
    themeStyle: prefs?.themeStyle ?? "parchment",
    reduceMotion: Boolean(prefs?.reduceMotion),
    pageTransition: prefs?.pageTransition ?? "dragon",
    visualQuality: prefs?.visualQuality ?? 2,
    updatedAt: Date.now(), // timestamp compatível
  };
  
  await database.ref(`preferences/${uid}`).set(payload);
}