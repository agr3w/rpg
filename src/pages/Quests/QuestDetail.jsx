import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Checkbox,
  Container,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Autocomplete,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { auth, database, firebase } from "APIs/firebaseConfig";
import { T_IN } from "config/transitions";
import { motion } from "framer-motion";

const DEFAULT_CAMPAIGN_ID = "default";

function normalizeKey(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseTags(raw) {
  return String(raw || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 32);
}

const STATUS = [
  { value: "ativa", label: "Ativa" },
  { value: "pendente", label: "Pendente" },
  { value: "concluida", label: "Concluída" },
];

function fmtDateTime(ms) {
  if (!ms) return "";
  try {
    return new Date(ms).toLocaleString("pt-BR");
  } catch {
    return "";
  }
}

function statusChip(status) {
  const s = String(status || "");
  if (s === "concluida") return { label: "Concluída", color: "success" };
  if (s === "ativa") return { label: "Ativa", color: "warning" };
  if (s === "pendente") return { label: "Pendente", color: "default" };
  return { label: s || "—", color: "default" };
}

export default function QuestDetail() {
  const user = auth.currentUser;
  const uid = user?.uid;

  const { questId } = useParams();
  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get("c") || DEFAULT_CAMPAIGN_ID;

  const [status, setStatus] = useState({ type: "info", msg: "" });
  const [loading, setLoading] = useState(true);
  const [quest, setQuest] = useState(null);

  const questRef = useMemo(() => {
    if (!uid || !campaignId || !questId) return null;
    return database.ref(`users/${uid}/campaigns/${campaignId}/quests/${questId}`);
  }, [uid, campaignId, questId]);

  const [title, setTitle] = useState("");
  const [currentStatus, setCurrentStatus] = useState("pendente");
  const [description, setDescription] = useState("");
  const [tagsRaw, setTagsRaw] = useState("");

  const [appearedIn, setAppearedIn] = useState([]);
  const [timeline, setTimeline] = useState([]);

  // ✅ Plano/Flow da quest: marcos + todos
  const [milestoneOpen, setMilestoneOpen] = useState(false);
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneNote, setMilestoneNote] = useState("");
  const [todoDraft, setTodoDraft] = useState({});

  // ✅ Timeline manual
  const [eventOpen, setEventOpen] = useState(false);
  const [eventType, setEventType] = useState("manual");
  const [eventStatus, setEventStatus] = useState("pendente");
  const [eventNote, setEventNote] = useState("");

  // ✅ Subquests
  const [questOptions, setQuestOptions] = useState([]);
  const [subquestTarget, setSubquestTarget] = useState(null);

  // ✅ Timeline manual (melhorada)
  const [eventTitle, setEventTitle] = useState("");
  const [eventMilestoneId, setEventMilestoneId] = useState("");

  // ✅ MIGRAÇÃO hooks -> objetivos + eventos
  const [migratingHooks, setMigratingHooks] = useState(false);

  const legacyHookIds = useMemo(() => {
    const obj = quest?.followUps || null;
    return obj ? Object.keys(obj) : [];
  }, [quest?.followUps]);

  useEffect(() => {
    if (!questRef) {
      setLoading(false);
      return;
    }

    const onQuest = (snap) => {
      const v = snap.val() || null;
      setQuest(v);

      setTitle(v?.title || "");
      setCurrentStatus(v?.currentStatus || "pendente");
      setDescription(v?.description || "");
      setTagsRaw(Array.isArray(v?.tags) ? v.tags.join(", ") : "");

      setLoading(false);
    };

    questRef.on("value", onQuest);
    return () => questRef.off("value", onQuest);
  }, [questRef]);

  // Mantém (por enquanto) — pode virar opcional depois
  useEffect(() => {
    if (!uid || !campaignId || !questId) return;

    const logsRef = database.ref(`users/${uid}/campaigns/${campaignId}/sessionLogs`);
    const onLogs = (snap) => {
      const data = snap.val() || {};
      const sessions = Object.values(data);

      const found = [];
      for (const s of sessions) {
        const questsObj = s?.quests || {};
        const rows = Object.values(questsObj);
        const row = rows.find((r) => r?.questId === questId);
        if (row) {
          found.push({
            sessionId: s?.id,
            title: s?.title || "Sessão",
            createdAt: s?.createdAt || 0,
            note: row?.note || "",
            status: row?.status || "",
          });
        }
      }

      found.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
      setAppearedIn(found);
    };

    logsRef.on("value", onLogs);
    return () => logsRef.off("value", onLogs);
  }, [uid, campaignId, questId]);

  useEffect(() => {
    if (!questRef) return;

    const tlRef = questRef.child("timeline");
    const onTl = (snap) => {
      const data = snap.val() || {};
      const arr = Object.values(data);
      arr.sort((a, b) => Number(b.occurredAt || 0) - Number(a.occurredAt || 0));
      setTimeline(arr);
    };

    tlRef.on("value", onTl);
    return () => tlRef.off("value", onTl);
  }, [questRef]);

  const milestones = useMemo(() => {
    const obj = quest?.flow?.milestones || {};
    const arr = Object.values(obj).filter(Boolean);
    arr.sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
    return arr;
  }, [quest?.flow?.milestones]);

  useEffect(() => {
    if (!uid || !campaignId) return;

    const idxRef = database.ref(`users/${uid}/campaigns/${campaignId}/questIndex`);
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
  }, [uid, campaignId]);

  const subquests = useMemo(() => {
    const obj = quest?.links?.subquests || {};
    const arr = Object.values(obj).filter((x) => x?.questId && x?.title);
    arr.sort((a, b) => String(a.title).localeCompare(String(b.title), "pt-BR"));
    return arr;
  }, [quest?.links?.subquests]);

  const save = async () => {
    setStatus({ type: "info", msg: "" });
    if (!questRef || !uid) return;

    const newTitle = title.trim();
    if (!newTitle) {
      setStatus({ type: "warning", msg: "Título é obrigatório." });
      return;
    }

    const newKey = normalizeKey(newTitle);
    if (!newKey) {
      setStatus({ type: "warning", msg: "Título inválido." });
      return;
    }

    try {
      const oldKey = quest?.indexKey || normalizeKey(quest?.title || "");
      const idxBase = database.ref(`users/${uid}/campaigns/${campaignId}/questIndex`);

      if (oldKey && oldKey !== newKey) {
        await idxBase.child(oldKey).remove();
      }
      await idxBase.child(newKey).set({
        key: newKey,
        questId,
        title: newTitle,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });

      await questRef.update({
        title: newTitle,
        indexKey: newKey,
        currentStatus,
        description: description.trim(),
        tags: parseTags(tagsRaw),
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });

      setStatus({ type: "success", msg: "Quest salva." });
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || "Erro ao salvar quest." });
    }
  };

  // ✅ adicionar marco (ponto principal)
  const addMilestone = async () => {
    setStatus({ type: "info", msg: "" });
    if (!questRef) return;

    const t = String(milestoneTitle || "").trim();
    const n = String(milestoneNote || "").trim();

    if (!t) {
      setStatus({ type: "warning", msg: "Informe o título do marco." });
      return;
    }

    try {
      const ref = questRef.child("flow/milestones").push();
      await ref.set({
        id: ref.key,
        title: t,
        note: n || "",
        order: Date.now(),
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });

      setMilestoneOpen(false);
      setMilestoneTitle("");
      setMilestoneNote("");
      setStatus({ type: "success", msg: "Marco adicionado." });
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || "Erro ao adicionar marco." });
    }
  };

  const removeMilestone = async (milestoneId) => {
    setStatus({ type: "info", msg: "" });
    if (!questRef || !milestoneId) return;

    try {
      await questRef.child(`flow/milestones/${milestoneId}`).remove();
      setStatus({ type: "success", msg: "Marco removido." });
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || "Erro ao remover marco." });
    }
  };

  // ✅ adicionar item do checklist
  const addTodo = async (milestoneId) => {
    setStatus({ type: "info", msg: "" });
    if (!questRef || !milestoneId) return;

    const text = String(todoDraft[milestoneId] || "").trim();
    if (!text) {
      setStatus({ type: "warning", msg: "Informe o texto do to-do." });
      return;
    }

    try {
      const ref = questRef.child(`flow/milestones/${milestoneId}/todos`).push();
      await ref.set({
        id: ref.key,
        text,
        done: false,
        doneAt: 0,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });

      setTodoDraft((m) => ({ ...m, [milestoneId]: "" }));
      setStatus({ type: "success", msg: "To-do adicionado." });
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || "Erro ao adicionar to-do." });
    }
  };

  const toggleTodo = async (milestoneId, todo) => {
    if (!questRef || !milestoneId || !todo?.id) return;

    try {
      const next = !Boolean(todo.done);
      await questRef.child(`flow/milestones/${milestoneId}/todos/${todo.id}`).update({
        done: next,
        doneAt: next ? firebase.database.ServerValue.TIMESTAMP : 0,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || "Erro ao marcar to-do." });
    }
  };

  const removeTodo = async (milestoneId, todoId) => {
    if (!questRef || !milestoneId || !todoId) return;
    try {
      await questRef.child(`flow/milestones/${milestoneId}/todos/${todoId}`).remove();
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || "Erro ao remover to-do." });
    }
  };

  // ✅ adicionar subquest
  const addSubquest = async () => {
    setStatus({ type: "info", msg: "" });
    if (!questRef || !subquestTarget?.questId) return;
    if (subquestTarget.questId === questId) {
      setStatus({ type: "warning", msg: "Você não pode linkar a quest nela mesma." });
      return;
    }

    try {
      await questRef.child(`links/subquests/${subquestTarget.questId}`).set({
        questId: subquestTarget.questId,
        title: subquestTarget.title || "Quest",
        createdAt: firebase.database.ServerValue.TIMESTAMP,
      });
      setSubquestTarget(null);
      setStatus({ type: "success", msg: "Subquest adicionada." });
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || "Erro ao adicionar subquest." });
    }
  };

  const removeSubquest = async (qid) => {
    setStatus({ type: "info", msg: "" });
    if (!questRef || !qid) return;
    try {
      await questRef.child(`links/subquests/${qid}`).remove();
      setStatus({ type: "success", msg: "Subquest removida." });
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || "Erro ao remover subquest." });
    }
  };

  // ✅ adicionar evento manual na timeline (com title + milestoneId)
  const addManualEvent = async () => {
    setStatus({ type: "info", msg: "" });
    if (!questRef) return;

    const t = String(eventTitle || "").trim();
    const note = String(eventNote || "").trim();

    if (!t) {
      setStatus({ type: "warning", msg: "Informe um título para o evento." });
      return;
    }
    if (!note) {
      setStatus({ type: "warning", msg: "Escreva uma nota para o evento." });
      return;
    }

    try {
      const ref = questRef.child("timeline").push();
      await ref.set({
        id: ref.key,
        type: String(eventType || "manual"),
        title: t,
        milestoneId: String(eventMilestoneId || ""),
        questId,
        sessionId: "",
        sessionTitle: "",
        status: String(eventStatus || currentStatus || ""),
        note,
        occurredAt: firebase.database.ServerValue.TIMESTAMP,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
      });

      setEventOpen(false);
      setEventType("manual");
      setEventStatus(currentStatus || "pendente");
      setEventTitle("");
      setEventMilestoneId("");
      setEventNote("");
      setStatus({ type: "success", msg: "Evento adicionado na timeline." });
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || "Erro ao adicionar evento." });
    }
  };

  const ensureMilestoneByTitle = async (wantedTitle, note = "") => {
    if (!questRef) return "";
    const snap = await questRef.child("flow/milestones").once("value");
    const obj = snap.val() || {};
    const arr = Object.values(obj).filter(Boolean);

    const found = arr.find((m) => String(m?.title || "").trim().toLowerCase() === String(wantedTitle).trim().toLowerCase());
    if (found?.id) return found.id;

    const ref = questRef.child("flow/milestones").push();
    await ref.set({
      id: ref.key,
      title: wantedTitle,
      note: note || "",
      order: Date.now(),
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      updatedAt: firebase.database.ServerValue.TIMESTAMP,
    });
    return ref.key;
  };

  const pushTimeline = async ({ type, title, note, milestoneId, status: st }) => {
    if (!questRef) return;
    const ref = questRef.child("timeline").push();
    await ref.set({
      id: ref.key,
      type: type || "update",
      title: title || "",
      milestoneId: milestoneId || "",
      questId,
      sessionId: "",
      sessionTitle: "",
      status: st || "",
      note: note || "",
      occurredAt: firebase.database.ServerValue.TIMESTAMP,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
    });
  };

  const migrateLegacyHooksToObjectives = async () => {
    setStatus({ type: "info", msg: "" });
    if (!uid || !campaignId || !questRef || !legacyHookIds.length) return;
    if (migratingHooks) return;

    setMigratingHooks(true);
    try {
      const milestoneId = await ensureMilestoneByTitle(
        "Follow-ups (migrado)",
        "Hooks antigos migrados para objetivos do plano. Você pode mover/editar estes objetivos depois."
      );

      let migratedCount = 0;

      for (const hookId of legacyHookIds) {
        const hookRef = database.ref(`users/${uid}/campaigns/${campaignId}/hooks/${hookId}`);
        const hookSnap = await hookRef.once("value");
        const hook = hookSnap.val();
        if (!hook) continue;

        const hookTitle = String(hook?.title || "Hook").trim();
        const hookNote = String(hook?.note || "").trim();

        const mergedText = hookNote ? `${hookTitle} — ${hookNote}` : hookTitle;

        const isDone =
          String(hook?.status || "").toLowerCase() === "concluido" ||
          String(hook?.status || "").toLowerCase() === "concluida" ||
          String(hook?.status || "").toLowerCase() === "concluída";

        const todoRef = questRef.child(`flow/milestones/${milestoneId}/todos`).push();
        await todoRef.set({
          id: todoRef.key,
          text: mergedText,
          done: Boolean(isDone),
          doneAt: isDone ? firebase.database.ServerValue.TIMESTAMP : 0,
          createdAt: firebase.database.ServerValue.TIMESTAMP,
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
          legacy: { hookId },
        });

        // marca hook como depreciado (não deleta por segurança)
        await hookRef.update({
          deprecated: true,
          migratedToQuestId: questId,
          migratedAt: firebase.database.ServerValue.TIMESTAMP,
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
        });

        migratedCount += 1;
      }

      // remove o mapa antigo da quest
      await questRef.child("followUps").remove();

      await pushTimeline({
        type: "migration",
        title: "Hooks migrados para objetivos",
        note: `${migratedCount} hook(s) migrado(s) para o marco “Follow-ups (migrado)”.`,
        milestoneId,
        status: currentStatus || "",
      });

      setStatus({ type: "success", msg: "Migração concluída: hooks viraram objetivos + evento na timeline." });
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || "Erro ao migrar hooks." });
    } finally {
      setMigratingHooks(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography sx={{ opacity: 0.8 }}>Carregando quest…</Typography>
      </Container>
    );
  }

  if (!quest) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">Quest não encontrada.</Alert>
        <Button component={Link} to={`/quests?c=${encodeURIComponent(campaignId)}`} sx={{ mt: 2 }}>
          Voltar
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { duration: T_IN * 0.18 } }}>
        <Stack spacing={2}>
          <Paper elevation={0} sx={{ p: 2.25, borderRadius: 3, border: "1px solid rgba(0,0,0,0.10)", bgcolor: "rgba(223, 214, 205, 0.92)" }}>
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ gap: 1, flexWrap: "wrap" }}>
                <Typography variant="h5" sx={{ fontWeight: 1000, color: "#2c1a10" }}>
                  Quest — {quest?.title || "—"}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Button variant="outlined" onClick={() => {
                    setEventStatus(currentStatus || "pendente");
                    setEventOpen(true);
                  }}>
                    Adicionar evento
                  </Button>

                  <Button component={Link} to={`/quests?c=${encodeURIComponent(campaignId)}`}>
                    Voltar
                  </Button>
                </Stack>
              </Stack>

              {quest?.lastSeenNote ? (
                <Paper elevation={0} sx={{ p: 1.25, borderRadius: 2, border: "1px dashed rgba(0,0,0,0.18)", bgcolor: "rgba(0,0,0,0.02)" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
                    Última nota rápida
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, whiteSpace: "pre-wrap" }}>
                    {quest.lastSeenNote}
                  </Typography>
                </Paper>
              ) : null}
            </Stack>
          </Paper>

          {status.msg ? <Alert severity={status.type}>{status.msg}</Alert> : null}

          {/* ✅ Painel de migração (aparece apenas se existir legado) */}
          {legacyHookIds.length ? (
            <Paper elevation={0} sx={{ p: 2.25, borderRadius: 3, border: "1px solid rgba(0,0,0,0.10)" }}>
              <Stack spacing={1}>
                <Typography sx={{ fontWeight: 950 }}>Migração de Follow-ups (hooks)</Typography>
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  Esta quest possui <strong>{legacyHookIds.length}</strong> hook(s) antigo(s). Agora follow-up ={" "}
                  <strong>objetivo do plano</strong> + <strong>evento na timeline</strong>.
                </Typography>
                <Button variant="contained" onClick={migrateLegacyHooksToObjectives} disabled={migratingHooks} sx={{ width: "fit-content", fontWeight: 900 }}>
                  {migratingHooks ? "Migrando..." : "Migrar hooks agora"}
                </Button>
              </Stack>
            </Paper>
          ) : null}

          {/* ✅ Subquests (visual e navegável) */}
          <Paper elevation={0} sx={{ p: 2.25, borderRadius: 3, border: "1px solid rgba(0,0,0,0.10)" }}>
            <Stack spacing={1.25}>
              <Typography variant="h6" sx={{ fontWeight: 950 }}>
                Subquests (Quest Journal)
              </Typography>
              <Divider />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ sm: "center" }}>
                <Autocomplete
                  options={questOptions.filter((o) => o.questId !== questId)}
                  getOptionLabel={(o) => o?.title || ""}
                  value={subquestTarget}
                  onChange={(_, v) => setSubquestTarget(v)}
                  renderInput={(params) => <TextField {...params} label="Linkar subquest" placeholder="Selecione uma quest existente" />}
                  sx={{ flex: 1 }}
                />
                <Button variant="outlined" onClick={addSubquest} disabled={!subquestTarget}>
                  Adicionar
                </Button>
              </Stack>

              {subquests.length === 0 ? (
                <Typography sx={{ opacity: 0.8 }}>
                  Nenhuma subquest linkada. (Use isso pra criar uma árvore tipo “Main quest → objetivos → subquests”.)
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {subquests.map((sq) => (
                    <Paper
                      key={sq.questId}
                      elevation={0}
                      sx={{
                        p: 1.25,
                        borderRadius: 2,
                        border: "1px solid rgba(0,0,0,0.10)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography sx={{ fontWeight: 900, color: "#2c1a10" }} noWrap title={sq.title}>
                        {sq.title}
                      </Typography>

                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Tooltip title="Abrir subquest">
                          <IconButton
                            size="small"
                            component={Link}
                            to={`/quests/${encodeURIComponent(sq.questId)}?c=${encodeURIComponent(campaignId)}`}
                          >
                            <OpenInNewRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Remover link">
                          <IconButton size="small" onClick={() => removeSubquest(sq.questId)}>
                            <DeleteRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              )}
            </Stack>
          </Paper>

          {/* ✅ Plano / Flow (marcos + checklist) */}
          <Paper elevation={0} sx={{ p: 2.25, borderRadius: 3, border: "1px solid rgba(0,0,0,0.10)" }}>
            <Stack spacing={1.25}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ gap: 1, flexWrap: "wrap" }}>
                <Typography variant="h6" sx={{ fontWeight: 950 }}>
                  Plano da Quest
                </Typography>
                <Button startIcon={<AddRoundedIcon />} variant="outlined" onClick={() => setMilestoneOpen(true)}>
                  Adicionar marco
                </Button>
              </Stack>

              <Divider />

              {milestones.length === 0 ? (
                <Typography sx={{ opacity: 0.8 }}>
                  Sem marcos ainda. Crie pontos principais e use o checklist para acompanhar o progresso.
                </Typography>
              ) : (
                <Stack spacing={1.25}>
                  {milestones.map((m) => {
                    const todosObj = m?.todos || {};
                    const todos = Object.values(todosObj).filter(Boolean);
                    const done = todos.filter((t) => t?.done).length;
                    const total = todos.length;
                    const pct = total ? Math.round((done / total) * 100) : 0;

                    return (
                      <Paper key={m.id} elevation={0} sx={{ p: 1.5, borderRadius: 2.5, border: "1px solid rgba(0,0,0,0.10)" }}>
                        <Stack spacing={1}>
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ gap: 1 }}>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography sx={{ fontWeight: 950, color: "#2c1a10" }} noWrap title={m.title || ""}>
                                {m.title || "Marco"}
                              </Typography>
                              {m.note ? (
                                <Typography variant="body2" sx={{ opacity: 0.85, whiteSpace: "pre-wrap", mt: 0.25 }}>
                                  {m.note}
                                </Typography>
                              ) : null}
                            </Box>

                            <Tooltip title="Remover marco">
                              <IconButton size="small" onClick={() => removeMilestone(m.id)}>
                                <DeleteRoundedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>

                          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap", gap: 1 }}>
                            <Chip size="small" label={`Progresso: ${done}/${total}`} variant="outlined" />
                            <Box sx={{ flex: 1, minWidth: 160 }}>
                              <LinearProgress variant="determinate" value={pct} sx={{ height: 10, borderRadius: 2 }} />
                            </Box>
                          </Stack>

                          {/* todos */}
                          {todos.length ? (
                            <Stack spacing={0.5}>
                              {todos.map((t) => (
                                <Box
                                  key={t.id}
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 1,
                                    border: "1px dashed rgba(0,0,0,0.16)",
                                    borderRadius: 2,
                                    px: 1,
                                    py: 0.5,
                                  }}
                                >
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                                    <Checkbox checked={Boolean(t.done)} onChange={() => toggleTodo(m.id, t)} />
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        opacity: t.done ? 0.7 : 0.95,
                                        textDecoration: t.done ? "line-through" : "none",
                                      }}
                                      noWrap
                                      title={t.text || ""}
                                    >
                                      {t.text || "—"}
                                    </Typography>
                                  </Box>

                                  <Tooltip title="Remover to-do">
                                    <IconButton size="small" onClick={() => removeTodo(m.id, t.id)}>
                                      <DeleteRoundedIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              ))}
                            </Stack>
                          ) : (
                            <Typography variant="caption" sx={{ opacity: 0.75 }}>
                              Nenhum to-do ainda.
                            </Typography>
                          )}

                          {/* add todo */}
                          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                            <TextField
                              label="Novo to-do"
                              value={todoDraft[m.id] ?? ""}
                              onChange={(e) => setTodoDraft((mm) => ({ ...mm, [m.id]: e.target.value }))}
                              placeholder='Ex.: "Interrogar o taverneiro"'
                              fullWidth
                              size="small"
                            />
                            <Button variant="outlined" onClick={() => addTodo(m.id)} sx={{ whiteSpace: "nowrap" }}>
                              Adicionar
                            </Button>
                          </Stack>
                        </Stack>
                      </Paper>
                    );
                  })}
                </Stack>
              )}
            </Stack>
          </Paper>

          {/* Links bidirecionais */}
          <Paper elevation={0} sx={{ p: 2.25, borderRadius: 3, border: "1px solid rgba(0,0,0,0.10)" }}>
            <Stack spacing={1.25}>
              <Typography variant="h6" sx={{ fontWeight: 950 }}>
                Links
              </Typography>
              <Divider />

              <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
                Apareceu em sessões
              </Typography>

              {appearedIn.length === 0 ? (
                <Typography sx={{ opacity: 0.8 }}>Ainda não aparece em nenhuma sessão nesta campanha.</Typography>
              ) : (
                <Stack spacing={1}>
                  {appearedIn.map((s) => (
                    <Paper
                      key={s.sessionId}
                      elevation={0}
                      sx={{
                        p: 1.25,
                        borderRadius: 2,
                        border: "1px solid rgba(0,0,0,0.10)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 900, color: "#2c1a10" }} noWrap>
                          {s.title}
                        </Typography>
                        {s.note ? (
                          <Typography variant="caption" sx={{ opacity: 0.85 }}>
                            Nota: {s.note}
                          </Typography>
                        ) : null}
                      </Box>

                      <Button size="small" component={Link} to={`/diario/${encodeURIComponent(s.sessionId)}?c=${encodeURIComponent(campaignId)}`}>
                        Abrir sessão
                      </Button>
                    </Paper>
                  ))}
                </Stack>
              )}

              <Divider />

              <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
                Follow-ups
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                Agora follow-up é um <strong>objetivo</strong> no Plano da Quest (use “Próximos passos”).
              </Typography>
            </Stack>
          </Paper>

          {/* Detalhes */}
          <Paper elevation={0} sx={{ p: 2.25, borderRadius: 3, border: "1px solid rgba(0,0,0,0.10)" }}>
            <Stack spacing={1.25}>
              <Typography variant="h6" sx={{ fontWeight: 950 }}>
                Detalhes
              </Typography>
              <Divider />

              <TextField label="Título" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />

              <Select value={currentStatus} onChange={(e) => setCurrentStatus(e.target.value)} size="small" sx={{ width: "fit-content" }}>
                {STATUS.map((s) => (
                  <MenuItem key={s.value} value={s.value}>
                    {s.label}
                  </MenuItem>
                ))}
              </Select>

              <TextField
                label="Tags (separadas por vírgula)"
                value={tagsRaw}
                onChange={(e) => setTagsRaw(e.target.value)}
                fullWidth
                placeholder="Ex.: principal, investigação, dungeon"
              />

              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                {parseTags(tagsRaw).map((t) => (
                  <Chip key={t} label={t} size="small" />
                ))}
              </Stack>

              <TextField
                label="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                minRows={6}
                placeholder="Contexto, objetivos, pistas, recompensas..."
              />

              <Button variant="contained" onClick={save} sx={{ fontWeight: 900, width: "fit-content" }}>
                Salvar
              </Button>
            </Stack>
          </Paper>

          {/* Timeline (render melhorado com title + milestone chip) */}
          <Paper elevation={0} sx={{ p: 2.25, borderRadius: 3, border: "1px solid rgba(0,0,0,0.10)" }}>
            <Stack spacing={1.25}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ gap: 1, flexWrap: "wrap" }}>
                <Typography variant="h6" sx={{ fontWeight: 950 }}>
                  Timeline da Quest
                </Typography>
                <Button variant="outlined" startIcon={<AddRoundedIcon />} onClick={() => {
                  setEventStatus(currentStatus || "pendente");
                  setEventOpen(true);
                }}>
                  Adicionar evento
                </Button>
              </Stack>

              <Divider />

              {timeline.length === 0 ? (
                <Typography sx={{ opacity: 0.8 }}>
                  Ainda sem eventos. (Registre a quest nas sessões ou adicione eventos manuais aqui.)
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {timeline.map((ev) => {
                    const st = statusChip(ev.status);
                    const milestoneTitle = ev.milestoneId
                      ? milestones.find((m) => m.id === ev.milestoneId)?.title || "Marco"
                      : "";

                    return (
                      <Paper
                        key={ev.id}
                        elevation={0}
                        sx={{
                          p: 1.25,
                          borderRadius: 2,
                          border: "1px solid rgba(0,0,0,0.10)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }} alignItems="center">
                            <Chip size="small" label={st.label} color={st.color} variant="outlined" />
                            <Typography variant="caption" sx={{ opacity: 0.75 }}>
                              {fmtDateTime(ev.occurredAt)}
                            </Typography>
                            {ev.type ? <Chip size="small" label={String(ev.type)} variant="outlined" /> : null}
                            {milestoneTitle ? <Chip size="small" label={`Marco: ${milestoneTitle}`} variant="outlined" /> : null}
                          </Stack>

                          {ev.title ? (
                            <Typography sx={{ fontWeight: 950, color: "#2c1a10", mt: 0.6 }} noWrap title={ev.title}>
                              {ev.title}
                            </Typography>
                          ) : null}

                          {ev.note ? (
                            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5, whiteSpace: "pre-wrap" }}>
                              {ev.note}
                            </Typography>
                          ) : null}

                          {ev.sessionTitle ? (
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                              Sessão: {ev.sessionTitle}
                            </Typography>
                          ) : null}
                        </Box>

                        {ev.sessionId ? (
                          <Button size="small" component={Link} to={`/diario/${encodeURIComponent(ev.sessionId)}?c=${encodeURIComponent(campaignId)}`}>
                            Abrir sessão
                          </Button>
                        ) : null}
                      </Paper>
                    );
                  })}
                </Stack>
              )}
            </Stack>
          </Paper>

          {/* Dialog: adicionar marco */}
          <Dialog open={milestoneOpen} onClose={() => setMilestoneOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Novo marco da quest</DialogTitle>
            <DialogContent dividers>
              <Stack spacing={1.25} sx={{ mt: 1 }}>
                <TextField label="Título" value={milestoneTitle} onChange={(e) => setMilestoneTitle(e.target.value)} fullWidth />
                <TextField
                  label="Nota (opcional)"
                  value={milestoneNote}
                  onChange={(e) => setMilestoneNote(e.target.value)}
                  fullWidth
                  multiline
                  minRows={3}
                  placeholder='Ex.: "Entrar na taverna e conseguir o nome do contato"'
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setMilestoneOpen(false)}>Cancelar</Button>
              <Button variant="contained" onClick={addMilestone} sx={{ fontWeight: 900 }}>
                Criar
              </Button>
            </DialogActions>
          </Dialog>

          {/* Dialog: adicionar evento manual (com title + milestone) */}
          <Dialog open={eventOpen} onClose={() => setEventOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Adicionar evento na timeline</DialogTitle>
            <DialogContent dividers>
              <Stack spacing={1.25} sx={{ mt: 1 }}>
                <TextField
                  label="Título do evento"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  fullWidth
                  placeholder='Ex.: "Descoberta importante"'
                />

                <TextField
                  label="Tipo"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  placeholder='Ex.: "manual", "descoberta", "plot", "combate"'
                  fullWidth
                />

                <Select
                  value={eventMilestoneId}
                  onChange={(e) => setEventMilestoneId(e.target.value)}
                  size="small"
                  sx={{ width: "fit-content" }}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Sem marco</em>
                  </MenuItem>
                  {milestones.map((m) => (
                    <MenuItem key={m.id} value={m.id}>
                      {m.title}
                    </MenuItem>
                  ))}
                </Select>

                <Select value={eventStatus} onChange={(e) => setEventStatus(e.target.value)} size="small" sx={{ width: "fit-content" }}>
                  {STATUS.map((s) => (
                    <MenuItem key={s.value} value={s.value}>
                      {s.label}
                    </MenuItem>
                  ))}
                </Select>

                <TextField
                  label="Nota do evento"
                  value={eventNote}
                  onChange={(e) => setEventNote(e.target.value)}
                  fullWidth
                  multiline
                  minRows={4}
                  placeholder='Ex.: "O grupo descobriu que o taverneiro está sendo chantageado."'
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEventOpen(false)}>Cancelar</Button>
              <Button variant="contained" onClick={addManualEvent} sx={{ fontWeight: 900 }}>
                Adicionar
              </Button>
            </DialogActions>
          </Dialog>
        </Stack>
      </motion.div>
    </Container>
  );
}