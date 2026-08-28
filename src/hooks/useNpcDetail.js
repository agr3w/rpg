import { useCallback, useEffect, useMemo, useState } from "react";
import { database, firebase, storage } from "APIs/firebaseConfig";
import { getCampaignBasePath } from "service/campaignPath";
import { parseTags } from "Utils/textHelpers";

function coerceRelationshipsToArray(v) {
  if (!v) return [];
  if (Array.isArray(v)) {
    return v
      .map((r) => ({
        npcId: r?.npcId || r?.id || "",
        name: r?.name || "",
        relation: r?.relation || "",
      }))
      .filter((r) => r.npcId && r.name);
  }
  return Object.values(v)
    .map((r) => ({
      npcId: r?.npcId || "",
      name: r?.name || "",
      relation: r?.relation || "",
    }))
      .filter((r) => r.npcId && r.name);
}

export function useNpcDetail(uid, campaignId, campaignMode = "legacy", npcId) {
  const [npc, setNpc] = useState(null);
  const [npcOptions, setNpcOptions] = useState([]);
  const [appearedIn, setAppearedIn] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const campaignBasePath = useMemo(
    () => getCampaignBasePath({ uid, campaignId, mode: campaignMode }),
    [uid, campaignId, campaignMode]
  );

  const npcRef = useMemo(() => {
    if (!campaignBasePath || !npcId) return null;
    return database.ref(`${campaignBasePath}/npcs/${npcId}`);
  }, [campaignBasePath, npcId]);

  // Listener do NPC
  useEffect(() => {
    if (!npcRef) {
      setNpc(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const onNpc = (snap) => {
      const v = snap.val() || null;
      setNpc(v);
      setLoading(false);
    };

    npcRef.on("value", onNpc);
    return () => npcRef.off("value", onNpc);
  }, [npcRef]);

  // Listener do Índice de NPCs (para relacionamentos)
  useEffect(() => {
    if (!campaignBasePath) {
      setNpcOptions([]);
      return;
    }

    const idxRef = database.ref(`${campaignBasePath}/npcIndex`);
    const onIdx = (snap) => {
      const data = snap.val() || {};
      const arr = Object.values(data)
        .map((x) => ({ npcId: x?.npcId, name: x?.name }))
        .filter((x) => x.npcId && x.name && x.npcId !== npcId)
        .sort((a, b) => String(a.name).localeCompare(String(b.name), "pt-BR"));
      setNpcOptions(arr);
    };

    idxRef.on("value", onIdx);
    return () => idxRef.off("value", onIdx);
  }, [campaignBasePath, npcId]);

  // Listener de Aparições em Sessões
  useEffect(() => {
    if (!campaignBasePath || !npcId) {
      setAppearedIn([]);
      return;
    }

    const logsRef = database.ref(`${campaignBasePath}/sessionLogs`);
    const onLogs = (snap) => {
      const data = snap.val() || {};
      const sessions = Object.values(data);

      const found = [];
      for (const s of sessions) {
        const npcsSeenObj = s?.npcsSeen || {};
        const rows = Object.values(npcsSeenObj);
        const row = rows.find((r) => r?.npcId === npcId);
        if (row) {
          found.push({
            sessionId: s?.id,
            title: s?.title || "Sessão",
            createdAt: s?.createdAt || 0,
            note: row?.note || "",
          });
        }
      }

      found.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
      setAppearedIn(found);
    };

    logsRef.on("value", onLogs);
    return () => logsRef.off("value", onLogs);
  }, [campaignBasePath, npcId]);

  // Computed Relationships
  const relationships = useMemo(
    () =>
      coerceRelationshipsToArray(npc?.relationships).sort((a, b) =>
        String(a.name).localeCompare(String(b.name), "pt-BR")
      ),
    [npc?.relationships]
  );

  // Mutations
  const saveNpc = useCallback(
    async (npcData) => {
      if (!npcRef) throw new Error("NPC não inicializado.");

      const tags = Array.isArray(npcData?.tags)
        ? npcData.tags
        : parseTags(npcData?.tagsRaw || npcData?.tags, 24);

      await npcRef.update({
        name: String(npcData.name || "").trim(),
        faction: String(npcData.faction || "").trim(),
        roleInScene: String(npcData.roleInScene || "").trim(),
        attitude: String(npcData.attitude || "").trim(),
        dangerLevel: String(npcData.dangerLevel || "").trim(),
        location: String(npcData.location || "").trim(),
        voice: String(npcData.voice || "").trim(),
        mannerism: String(npcData.mannerism || "").trim(),
        objective: String(npcData.objective || npcData.goal || "").trim(),
        secret: String(npcData.secret || "").trim(),
        hook: String(npcData.hook || "").trim(),
        lastSeenNote: String(npcData.lastSeenNote || "").trim(),
        description: String(npcData.description || "").trim(),
        tags,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });
    },
    [npcRef]
  );

  const uploadAvatar = useCallback(
    async (file) => {
      if (!uid || !campaignId || !npcId || !npcRef || !file) {
        throw new Error("Parâmetros inválidos para envio de imagem.");
      }

      setUploading(true);
      try {
        const ref = storage.ref().child(`arquivos/npcs/${uid}/${campaignId}/${npcId}/${file.name}`);
        await ref.put(file);
        const url = await ref.getDownloadURL();

        await npcRef.update({
          imageUrl: url,
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
        });
        return url;
      } finally {
        setUploading(false);
      }
    },
    [uid, campaignId, npcId, npcRef]
  );

  const addRelationship = useCallback(
    async (targetNpc, relationText) => {
      if (!npcRef) throw new Error("NPC não inicializado.");
      if (!targetNpc?.npcId || !targetNpc?.name) {
        throw new Error("Selecione um NPC para vincular.");
      }

      await npcRef.child(`relationships/${targetNpc.npcId}`).set({
        npcId: targetNpc.npcId,
        name: targetNpc.name,
        relation: String(relationText || "").trim(),
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
      });
    },
    [npcRef]
  );

  const removeRelationship = useCallback(
    async (targetNpcId) => {
      if (!npcRef || !targetNpcId) return;
      await npcRef.child(`relationships/${targetNpcId}`).remove();
    },
    [npcRef]
  );

  const actions = useMemo(
    () => ({
      saveNpc,
      uploadAvatar,
      uploadImage: uploadAvatar,
      addRelationship,
      addOrUpdateRelationship: addRelationship,
      removeRelationship,
    }),
    [saveNpc, uploadAvatar, addRelationship, removeRelationship]
  );

  return {
    npc,
    npcOptions,
    appearedIn,
    relationships,
    loading,
    error,
    uploading,
    npcRef,
    actions,
    saveNpc,
    uploadAvatar,
    uploadImage: uploadAvatar,
    addRelationship,
    addOrUpdateRelationship: addRelationship,
    removeRelationship,
  };
}

export default useNpcDetail;
