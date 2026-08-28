import { useCallback, useEffect, useMemo, useState } from "react";
import { database, firebase } from "APIs/firebaseConfig";
import { getCampaignBasePath } from "service/campaignPath";
import { normalizeKey, parseTags } from "Utils/textHelpers";

export function useQuestDetail(uid, campaignId, campaignMode = "legacy", questId) {
  const [quest, setQuest] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [appearedIn, setAppearedIn] = useState([]);
  const [questOptions, setQuestOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const campaignBasePath = useMemo(
    () => getCampaignBasePath({ uid, campaignId, mode: campaignMode }),
    [uid, campaignId, campaignMode]
  );

  const questRef = useMemo(() => {
    if (!campaignBasePath || !questId) return null;
    return database.ref(`${campaignBasePath}/quests/${questId}`);
  }, [campaignBasePath, questId]);

  // Listener da Quest
  useEffect(() => {
    if (!questRef) {
      setQuest(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const onQuest = (snap) => {
      const v = snap.val() || null;
      setQuest(v);
      setLoading(false);
    };

    questRef.on("value", onQuest);
    return () => questRef.off("value", onQuest);
  }, [questRef]);

  // Listener da Timeline
  useEffect(() => {
    if (!questRef) {
      setTimeline([]);
      return;
    }

    const tlRef = questRef.child("timeline");
    const onTl = (snap) => {
      const data = snap.val() || {};
      const arr = Object.values(data).sort(
        (a, b) => Number(b.occurredAt || 0) - Number(a.occurredAt || 0)
      );
      setTimeline(arr);
    };

    tlRef.on("value", onTl);
    return () => tlRef.off("value", onTl);
  }, [questRef]);

  // Listener de Aparições em Sessões
  useEffect(() => {
    if (!campaignBasePath || !questId) {
      setAppearedIn([]);
      return;
    }

    const logsRef = database.ref(`${campaignBasePath}/sessionLogs`);
    const onLogs = (snap) => {
      const data = snap.val() || {};
      const found = Object.values(data)
        .filter((s) => {
          const rows = Object.values(s?.quests || {});
          return rows.some((r) => r?.questId === questId);
        })
        .map((s) => ({
          sessionId: s.id,
          title: s.title || "Sessão",
          createdAt: s.createdAt || 0,
          note: Object.values(s.quests).find((r) => r.questId === questId)?.note || "",
        }))
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      setAppearedIn(found);
    };

    logsRef.on("value", onLogs);
    return () => logsRef.off("value", onLogs);
  }, [campaignBasePath, questId]);

  // Listener do Índice de Quests (para vincular subquests)
  useEffect(() => {
    if (!campaignBasePath) {
      setQuestOptions([]);
      return;
    }

    const idxRef = database.ref(`${campaignBasePath}/questIndex`);
    const onIdx = (snap) => {
      const data = snap.val() || {};
      const arr = Object.values(data)
        .map((x) => ({ questId: x?.questId, title: x?.title }))
        .filter((x) => x.questId && x.title)
        .sort((a, b) => String(a.title).localeCompare(String(b.title), "pt-BR"));
      setQuestOptions(arr);
    };

    idxRef.on("value", onIdx);
    return () => idxRef.off("value", onIdx);
  }, [campaignBasePath]);

  // Computed Milestones
  const milestones = useMemo(() => {
    const obj = quest?.flow?.milestones || {};
    return Object.values(obj)
      .filter(Boolean)
      .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
  }, [quest?.flow?.milestones]);

  // Computed Subquests
  const subquests = useMemo(() => {
    const obj = quest?.links?.subquests || {};
    return Object.values(obj)
      .filter((x) => x?.questId && x?.title)
      .sort((a, b) => String(a.title).localeCompare(String(b.title), "pt-BR"));
  }, [quest?.links?.subquests]);

  // Mutations
  const saveQuest = useCallback(
    async ({ title, currentStatus, description, tags }) => {
      if (!questRef || !uid) throw new Error("Quest não inicializada.");
      const newTitle = String(title || "").trim();
      if (!newTitle) throw new Error("Título é obrigatório.");

      const newKey = normalizeKey(newTitle);
      const oldKey = quest?.indexKey || normalizeKey(quest?.title || "");

      if (oldKey && oldKey !== newKey) {
        await database.ref(`${campaignBasePath}/questIndex/${oldKey}`).remove();
      }
      await database.ref(`${campaignBasePath}/questIndex/${newKey}`).set({
        key: newKey,
        questId,
        title: newTitle,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });

      const parsed = Array.isArray(tags) ? tags : parseTags(tags, 32);

      await questRef.update({
        title: newTitle,
        indexKey: newKey,
        currentStatus: currentStatus || "pendente",
        description: String(description || "").trim(),
        tags: parsed,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });
    },
    [questRef, uid, quest, campaignBasePath, questId]
  );

  const addMilestone = useCallback(
    async ({ title: mTitle, note: mNote }) => {
      if (!questRef) throw new Error("Quest não inicializada.");
      const t = String(mTitle || "").trim();
      if (!t) throw new Error("Informe o título do marco.");

      const ref = questRef.child("flow/milestones").push();
      await ref.set({
        id: ref.key,
        title: t,
        note: String(mNote || "").trim(),
        order: Date.now(),
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });
      return ref.key;
    },
    [questRef]
  );

  const removeMilestone = useCallback(
    async (milestoneId) => {
      if (!questRef || !milestoneId) return;
      await questRef.child(`flow/milestones/${milestoneId}`).remove();
    },
    [questRef]
  );

  const addTodo = useCallback(
    async (milestoneId, text) => {
      if (!questRef || !milestoneId) throw new Error("Marco não especificado.");
      const t = String(text || "").trim();
      if (!t) throw new Error("Informe o texto do to-do.");

      const ref = questRef.child(`flow/milestones/${milestoneId}/todos`).push();
      await ref.set({
        id: ref.key,
        text: t,
        done: false,
        doneAt: 0,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });
      return ref.key;
    },
    [questRef]
  );

  const toggleTodo = useCallback(
    async (milestoneId, todo) => {
      if (!questRef || !milestoneId || !todo?.id) return;
      const next = !Boolean(todo.done);
      await questRef.child(`flow/milestones/${milestoneId}/todos/${todo.id}`).update({
        done: next,
        doneAt: next ? firebase.database.ServerValue.TIMESTAMP : 0,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });
    },
    [questRef]
  );

  const removeTodo = useCallback(
    async (milestoneId, todoId) => {
      if (!questRef || !milestoneId || !todoId) return;
      await questRef.child(`flow/milestones/${milestoneId}/todos/${todoId}`).remove();
    },
    [questRef]
  );

  const addSubquest = useCallback(
    async (subquestTarget) => {
      if (!questRef || !subquestTarget?.questId) throw new Error("Subquest inválida.");
      if (subquestTarget.questId === questId) {
        throw new Error("Você não pode linkar a quest nela mesma.");
      }

      await questRef.child(`links/subquests/${subquestTarget.questId}`).set({
        questId: subquestTarget.questId,
        title: subquestTarget.title || "Quest",
        createdAt: firebase.database.ServerValue.TIMESTAMP,
      });
    },
    [questRef, questId]
  );

  const removeSubquest = useCallback(
    async (subId) => {
      if (!questRef || !subId) return;
      await questRef.child(`links/subquests/${subId}`).remove();
    },
    [questRef]
  );

  const addManualEvent = useCallback(
    async ({ title: evTitle, note: evNote, type = "manual", status: evStatus, milestoneId = "" }) => {
      if (!questRef) throw new Error("Quest não inicializada.");
      const t = String(evTitle || "").trim();
      const n = String(evNote || "").trim();
      if (!t) throw new Error("Informe um título para o evento.");
      if (!n) throw new Error("Escreva uma nota para o evento.");

      const ref = questRef.child("timeline").push();
      await ref.set({
        id: ref.key,
        type: String(type || "manual"),
        title: t,
        milestoneId: String(milestoneId || ""),
        questId,
        sessionId: "",
        sessionTitle: "",
        status: String(evStatus || quest?.currentStatus || ""),
        note: n,
        occurredAt: firebase.database.ServerValue.TIMESTAMP,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
      });
      return ref.key;
    },
    [questRef, questId, quest?.currentStatus]
  );

  const actions = useMemo(
    () => ({
      saveQuest,
      addMilestone,
      removeMilestone,
      addTodo,
      toggleTodo,
      removeTodo,
      addSubquest,
      removeSubquest,
      addManualEvent,
    }),
    [
      saveQuest,
      addMilestone,
      removeMilestone,
      addTodo,
      toggleTodo,
      removeTodo,
      addSubquest,
      removeSubquest,
      addManualEvent,
    ]
  );

  return {
    quest,
    timeline,
    appearedIn,
    questOptions,
    milestones,
    subquests,
    loading,
    error,
    questRef,
    actions,
    saveQuest,
    addMilestone,
    removeMilestone,
    addTodo,
    toggleTodo,
    removeTodo,
    addSubquest,
    removeSubquest,
    addManualEvent,
  };
}

export default useQuestDetail;
