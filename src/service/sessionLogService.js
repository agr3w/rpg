import { database, firebase } from "APIs/firebaseConfig";

export function sessionLogBaseRef(uid, campaignId) {
  if (!uid || !campaignId) return null;
  return database.ref(`users/${uid}/campaigns/${campaignId}`);
}

export async function ensureCampaignMeta({ uid, campaignId, name = "Minha Campanha" }) {
  const baseRef = sessionLogBaseRef(uid, campaignId);
  if (!baseRef) return;

  await baseRef.child("meta").update({
    name,
    updatedAt: firebase.database.ServerValue.TIMESTAMP,
  });
}

export function listenSessionLogs({ uid, campaignId, onValue }) {
  const baseRef = sessionLogBaseRef(uid, campaignId);
  if (!baseRef) return () => {};

  const logsRef = baseRef.child("sessionLogs");
  const handle = (snap) => {
    const data = snap.val();
    const arr = data ? Object.values(data) : [];
    arr.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
    onValue?.(arr);
  };

  logsRef.on("value", handle);
  return () => logsRef.off("value", handle);
}

export async function createSessionLog({ uid, campaignId, title, summary, tags = [] }) {
  const baseRef = sessionLogBaseRef(uid, campaignId);
  if (!baseRef) throw new Error("Usuário/campanha inválidos.");

  const t = String(title || "").trim();
  const s = String(summary || "").trim();
  if (!t) throw new Error("Informe um título para a sessão.");

  const logsRef = baseRef.child("sessionLogs");
  const newRef = logsRef.push();
  const id = newRef.key;

  await newRef.set({
    id,
    title: t,
    summary: s,
    tags,
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    updatedAt: firebase.database.ServerValue.TIMESTAMP,
  });

  return id;
}