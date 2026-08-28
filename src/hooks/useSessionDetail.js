import { useCallback, useEffect, useMemo, useState } from "react";
import { database, firebase } from "APIs/firebaseConfig";
import { getCampaignBasePath } from "service/campaignPath";

export function useSessionDetail(uid, campaignId, campaignMode = "legacy", sessionId) {
  const [session, setSession] = useState(null);
  const [fichas, setFichas] = useState([]);
  const [linkedFichaId, setLinkedFichaId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const campaignBasePath = useMemo(
    () => getCampaignBasePath({ uid, campaignId, mode: campaignMode }),
    [uid, campaignId, campaignMode]
  );

  const baseRef = useMemo(() => {
    if (!campaignBasePath) return null;
    return database.ref(campaignBasePath);
  }, [campaignBasePath]);

  const sessionRef = useMemo(() => {
    if (!baseRef || !sessionId) return null;
    return baseRef.child(`sessionLogs/${sessionId}`);
  }, [baseRef, sessionId]);

  useEffect(() => {
    if (!uid || !sessionRef || !baseRef) {
      setSession(null);
      setFichas([]);
      setLinkedFichaId("");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const handleSession = (snap) => {
      setSession(snap.val() || null);
      setLoading(false);
    };

    const fichasRef = database.ref(`fichas/${uid}`);
    const handleFichas = (snap) => {
      const data = snap.val();
      const arr = data ? Object.values(data) : [];
      arr.sort((a, b) => String(a.nome || "").localeCompare(String(b.nome || ""), "pt-BR"));
      setFichas(arr);
    };

    const metaRef = baseRef.child("meta");
    const handleMeta = (snap) => {
      const v = snap.val();
      setLinkedFichaId(v?.linkedFichaId || "");
    };

    sessionRef.on("value", handleSession);
    fichasRef.on("value", handleFichas);
    metaRef.on("value", handleMeta);

    return () => {
      sessionRef.off("value", handleSession);
      fichasRef.off("value", handleFichas);
      metaRef.off("value", handleMeta);
    };
  }, [uid, sessionRef, baseRef]);

  const updateSession = useCallback(
    async (patch) => {
      if (!sessionRef) throw new Error("Referência da sessão não inicializada.");
      await sessionRef.update({
        ...patch,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });
    },
    [sessionRef]
  );

  const saveLinkedFicha = useCallback(
    async (newId) => {
      if (!baseRef) throw new Error("Referência da campanha não inicializada.");
      await baseRef.child("meta").update({
        linkedFichaId: newId || "",
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });
    },
    [baseRef]
  );

  const actions = useMemo(
    () => ({
      updateSession,
      saveLinkedFicha,
      linkFicha: saveLinkedFicha,
    }),
    [updateSession, saveLinkedFicha]
  );

  return {
    session,
    fichas,
    linkedFichaId,
    loading,
    error,
    sessionRef,
    baseRef,
    actions,
    updateSession,
    saveLinkedFicha,
    linkFicha: saveLinkedFicha,
  };
}

export default useSessionDetail;
