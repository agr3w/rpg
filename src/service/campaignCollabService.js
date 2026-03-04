import { database, firebase } from "APIs/firebaseConfig";

const DEFAULT_ROLE = "player";

function now() {
  return firebase.database.ServerValue.TIMESTAMP;
}

export async function createSharedCampaign({ ownerUid, name = "Nova Campanha" }) {
  if (!ownerUid) throw new Error("ownerUid é obrigatório.");

  const ref = database.ref("campaigns").push();
  const campaignId = ref.key;

  const payload = {
    id: campaignId,
    meta: {
      id: campaignId,
      name,
      ownerUid,
      visibility: "private",
      createdAt: now(),
      updatedAt: now(),
    },
  };

  const ownerMember = {
    uid: ownerUid,
    role: "dm",
    status: "active",
    joinedAt: now(),
    updatedAt: now(),
  };

  await database.ref().update({
    [`campaigns/${campaignId}`]: payload,
    [`campaignMembers/${campaignId}/${ownerUid}`]: ownerMember,
    [`userCampaigns/${ownerUid}/${campaignId}`]: {
      campaignId,
      name,
      role: "dm",
      ownerUid,
      updatedAt: now(),
    },
  });

  return campaignId;
}

export async function addCampaignMember({ campaignId, memberUid, role = DEFAULT_ROLE, actorUid }) {
  if (!campaignId || !memberUid) throw new Error("campaignId e memberUid são obrigatórios.");
  if (!actorUid) throw new Error("actorUid é obrigatório.");

  const metaSnap = await database.ref(`campaigns/${campaignId}/meta`).once("value");
  const meta = metaSnap.val();
  if (!meta) throw new Error("Campanha não encontrada.");

  const actorRoleSnap = await database.ref(`campaignMembers/${campaignId}/${actorUid}/role`).once("value");
  const actorRole = actorRoleSnap.val();
  if (!["dm", "co-dm"].includes(actorRole)) {
    throw new Error("Somente DM/Co-DM pode gerenciar membros.");
  }

  await database.ref().update({
    [`campaignMembers/${campaignId}/${memberUid}`]: {
      uid: memberUid,
      role,
      status: "active",
      joinedAt: now(),
      updatedAt: now(),
    },
    [`userCampaigns/${memberUid}/${campaignId}`]: {
      campaignId,
      name: meta.name || campaignId,
      role,
      ownerUid: meta.ownerUid || "",
      updatedAt: now(),
    },
  });
}

export async function updateCampaignMemberRole({ campaignId, memberUid, role, actorUid }) {
  if (!campaignId || !memberUid || !role) throw new Error("Parâmetros inválidos.");
  if (!actorUid) throw new Error("actorUid é obrigatório.");

  const actorRoleSnap = await database.ref(`campaignMembers/${campaignId}/${actorUid}/role`).once("value");
  const actorRole = actorRoleSnap.val();
  if (!["dm", "co-dm"].includes(actorRole)) {
    throw new Error("Somente DM/Co-DM pode alterar papéis.");
  }

  await database.ref(`campaignMembers/${campaignId}/${memberUid}`).update({
    role,
    updatedAt: now(),
  });

  await database.ref(`userCampaigns/${memberUid}/${campaignId}`).update({
    role,
    updatedAt: now(),
  });
}

export async function removeCampaignMember({ campaignId, memberUid, actorUid }) {
  if (!campaignId || !memberUid) throw new Error("Parâmetros inválidos.");
  if (!actorUid) throw new Error("actorUid é obrigatório.");

  const actorRoleSnap = await database.ref(`campaignMembers/${campaignId}/${actorUid}/role`).once("value");
  const actorRole = actorRoleSnap.val();
  if (!["dm", "co-dm"].includes(actorRole)) {
    throw new Error("Somente DM/Co-DM pode remover membros.");
  }

  await database.ref().update({
    [`campaignMembers/${campaignId}/${memberUid}`]: null,
    [`userCampaigns/${memberUid}/${campaignId}`]: null,
  });
}

export function listenUserCampaigns({ uid, onValue }) {
  if (!uid) return () => {};

  const ref = database.ref(`userCampaigns/${uid}`);
  const handle = (snap) => {
    const data = snap.val() || {};
    const arr = Object.values(data)
      .filter(Boolean)
      .sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "pt-BR"));
    onValue?.(arr);
  };

  ref.on("value", handle);
  return () => ref.off("value", handle);
}

export async function migrateLegacyCampaignToShared({ uid, legacyCampaignId = "default", name }) {
  if (!uid) throw new Error("uid é obrigatório.");

  const legacyRef = database.ref(`users/${uid}/campaigns/${legacyCampaignId}`);
  const legacySnap = await legacyRef.once("value");
  const legacyData = legacySnap.val();
  if (!legacyData) throw new Error("Campanha legada não encontrada.");

  const campaignId = database.ref("campaigns").push().key;
  const campaignName = name || legacyData?.meta?.name || `Campanha ${legacyCampaignId}`;

  const merged = {
    ...legacyData,
    id: campaignId,
    meta: {
      ...(legacyData.meta || {}),
      id: campaignId,
      ownerUid: uid,
      name: campaignName,
      migratedFrom: `users/${uid}/campaigns/${legacyCampaignId}`,
      migratedAt: now(),
      updatedAt: now(),
    },
  };

  await database.ref().update({
    [`campaigns/${campaignId}`]: merged,
    [`campaignMembers/${campaignId}/${uid}`]: {
      uid,
      role: "dm",
      status: "active",
      joinedAt: now(),
      updatedAt: now(),
    },
    [`userCampaigns/${uid}/${campaignId}`]: {
      campaignId,
      name: campaignName,
      role: "dm",
      ownerUid: uid,
      updatedAt: now(),
    },
  });

  return campaignId;
}
