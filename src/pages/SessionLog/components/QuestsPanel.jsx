import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Collapse,
  LinearProgress,
} from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AddTaskRoundedIcon from "@mui/icons-material/AddTaskRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import MapIcon from '@mui/icons-material/Map'; // Ícone de Mapa
import { database, firebase } from "APIs/firebaseConfig";
import { useNavigate } from "react-router-dom";
import QuestFlowPreview from "components/Quests/QuestFlowPreview";
import { computeFlowProgress } from "components/Quests/questFlowUtils";
import { RPG_TOKENS } from "theme/rpgTokens";
import RpgSection from "components/RpgSection";
import { buildCampaignQuery, getCampaignBasePath } from "service/campaignPath";

function normalizeKey(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const STATUS = [
  { value: "ativa", label: "Ativa" },
  { value: "pendente", label: "Pendente" },
  { value: "concluida", label: "Concluída" },
];

function statusColor(status) {
  switch (status) {
    case "concluida":
      return "success";
    case "ativa":
      return "warning";
    default:
      return "default";
  }
}

function pushQuestTimelineEvent({ uid, campaignId, campaignMode, questId, session, type, status, note, title, milestoneId }) {
  const basePath = getCampaignBasePath({ uid, campaignId, mode: campaignMode });
  if (!basePath || !questId) return Promise.resolve();
  const timelineRef = database.ref(`${basePath}/quests/${questId}/timeline`).push();
  const eventId = timelineRef.key;

  return timelineRef.set({
    id: eventId,
    type: type || "update",
    title: title || "",
    milestoneId: milestoneId || "",
    questId,
    sessionId: session?.id || "",
    sessionTitle: session?.title || "",
    status: status || "",
    note: note || "",
    occurredAt: firebase.database.ServerValue.TIMESTAMP,
    createdAt: firebase.database.ServerValue.TIMESTAMP,
  });
}

export default function QuestsPanel({ uid, campaignId, campaignMode = "legacy", sessionRef, session, setStatus }) {
  const navigate = useNavigate();
  const campaignBasePath = useMemo(
    () => getCampaignBasePath({ uid, campaignId, mode: campaignMode }),
    [uid, campaignId, campaignMode]
  );

  const [options, setOptions] = useState([]); // array de strings (títulos)
  const [questTitle, setQuestTitle] = useState("");
  const [questNote, setQuestNote] = useState("");
  const [questStatus, setQuestStatus] = useState("ativa");

  // ✅ master quests (pra exibir plano/checklist na sessão)
  const [questMap, setQuestMap] = useState({}); // { [questId]: questMaster }

  // ✅ expansão por quest
  const [expanded, setExpanded] = useState({}); // { [questId]: boolean }

  // ✅ modal: adicionar objetivo (to-do no plano)
  const [objectiveOpen, setObjectiveOpen] = useState(false);
  const [objectiveQuest, setObjectiveQuest] = useState(null); // { questId, title }
  const [objectiveText, setObjectiveText] = useState("");
  const [objectiveMilestoneId, setObjectiveMilestoneId] = useState("");

  const questsInSession = useMemo(() => {
    const obj = session?.quests || {};
    const arr = Object.values(obj);
    arr.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
    return arr;
  }, [session]);

  const questsWithMaster = useMemo(() => {
    return questsInSession.map((row) => {
      const master = row?.questId ? questMap[row.questId] : null;
      return { row, master };
    });
  }, [questsInSession, questMap]);

  useEffect(() => {
    if (!campaignBasePath) return;

    const idxRef = database.ref(`${campaignBasePath}/questIndex`);
    const handle = (snap) => {
      const data = snap.val() || {};
      const arr = Object.values(data)
        .map((x) => x?.title)
        .filter(Boolean)
        .sort((a, b) => String(a).localeCompare(String(b), "pt-BR"));
      setOptions(arr);
    };

    idxRef.on("value", handle);
    return () => idxRef.off("value", handle);
  }, [campaignBasePath]);

  // ✅ carrega quests master da campanha (uma vez, listener)
  useEffect(() => {
    if (!campaignBasePath) return;

    const ref = database.ref(`${campaignBasePath}/quests`);
    const onValue = (snap) => {
      const data = snap.val() || {};
      setQuestMap(data);
    };

    ref.on("value", onValue);
    return () => ref.off("value", onValue);
  }, [campaignBasePath]);

  const openQuest = (questId) => {
    if (!questId) return;
    navigate(`/quests/${encodeURIComponent(questId)}?${buildCampaignQuery({ campaignId, mode: campaignMode })}`);
  };

  const toggleExpanded = (questId) => {
    if (!questId) return;
    setExpanded((m) => ({ ...m, [questId]: !m[questId] }));
  };

  const ensureMilestoneForObjectives = async (questId) => {
    const qRef = database.ref(`${campaignBasePath}/quests/${questId}`);
    const flowSnap = await qRef.child("flow/milestones").once("value");
    const milestonesObj = flowSnap.val() || {};
    const milestones = Object.values(milestonesObj).filter(Boolean);

    // tenta achar um “Próximos passos”
    const existing = milestones.find((m) => String(m?.title || "").toLowerCase() === "próximos passos" || String(m?.title || "").toLowerCase() === "proximos passos");
    if (existing?.id) return existing.id;

    // cria
    const ref = qRef.child("flow/milestones").push();
    await ref.set({
      id: ref.key,
      title: "Próximos passos",
      note: "Objetivos adicionados via sessão",
      order: Date.now(),
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      updatedAt: firebase.database.ServerValue.TIMESTAMP,
    });
    return ref.key;
  };

  // ✅ renomeia UI de “objetivo” para “follow-up (objetivo)”
  const openObjectiveDialog = async (row) => {
    if (!row?.questId) return;
    setObjectiveQuest({ questId: row.questId, title: row.title || "Quest" });

    // default: primeiro marco, senão cria “Próximos passos”
    const master = questMap[row.questId];
    const mObj = master?.flow?.milestones || {};
    const mArr = Object.values(mObj).filter(Boolean).sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
    const first = mArr[0]?.id || "";

    setObjectiveMilestoneId(first);
    setObjectiveText(row?.note || "");
    setObjectiveOpen(true);
  };

  const createObjectiveTodo = async () => {
    setStatus?.({ type: "info", msg: "" });
    if (!campaignBasePath || !objectiveQuest?.questId) return;

    const questId = objectiveQuest.questId;
    const text = String(objectiveText || "").trim();
    if (!text) {
      setStatus?.({ type: "warning", msg: "Escreva o objetivo (to-do)." });
      return;
    }

    try {
      let milestoneId = String(objectiveMilestoneId || "").trim();
      if (!milestoneId) {
        milestoneId = await ensureMilestoneForObjectives(questId);
      }

      const todoRef = database
        .ref(`${campaignBasePath}/quests/${questId}/flow/milestones/${milestoneId}/todos`)
        .push();

      await todoRef.set({
        id: todoRef.key,
        text,
        done: false,
        doneAt: 0,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });

      // timeline (orgânico: evento “novo objetivo”)
      await pushQuestTimelineEvent({
        uid,
        campaignId,
        campaignMode,
        questId,
        session,
        type: "objective",
        status: "pendente",
        title: "Novo objetivo adicionado",
        note: text,
        milestoneId,
      });

      setObjectiveOpen(false);
      setObjectiveQuest(null);
      setObjectiveText("");
      setObjectiveMilestoneId("");
      setStatus?.({ type: "success", msg: "Objetivo adicionado na quest." });
    } catch (e) {
      setStatus?.({ type: "error", msg: e?.message || "Erro ao adicionar objetivo." });
    }
  };

  const toggleTodo = async (questId, milestoneId, todo) => {
    if (!campaignBasePath || !questId || !milestoneId || !todo?.id) return;

    try {
      const next = !Boolean(todo.done);
      await database
        .ref(`${campaignBasePath}/quests/${questId}/flow/milestones/${milestoneId}/todos/${todo.id}`)
        .update({
          done: next,
          doneAt: next ? firebase.database.ServerValue.TIMESTAMP : 0,
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
        });

      // timeline (opcional, mas deixa vivo)
      await pushQuestTimelineEvent({
        uid,
        campaignId,
        campaignMode,
        questId,
        session,
        type: next ? "objective_done" : "objective_undo",
        status: "",
        title: next ? "Objetivo concluído" : "Objetivo reaberto",
        note: todo.text || "",
        milestoneId,
      });
    } catch (e) {
      setStatus?.({ type: "error", msg: e?.message || "Erro ao marcar objetivo." });
    }
  };

  const addQuest = async () => {
    setStatus?.({ type: "info", msg: "" });
    if (!campaignBasePath || !sessionRef) return;

    const title = String(questTitle || "").trim();
    const note = String(questNote || "").trim();
    const status = String(questStatus || "ativa");

    if (!title) {
      setStatus?.({ type: "warning", msg: "Informe o título da quest." });
      return;
    }

    const key = normalizeKey(title);
    if (!key) {
      setStatus?.({ type: "warning", msg: "Título inválido para quest." });
      return;
    }

    try {
      const idxRef = database.ref(`${campaignBasePath}/questIndex/${key}`);
      const idxSnap = await idxRef.once("value");
      const idx = idxSnap.val();

      let questId = idx?.questId;

      if (!questId) {
        const questRef = database.ref(`${campaignBasePath}/quests`).push();
        questId = questRef.key;

        await questRef.set({
          id: questId,
          indexKey: key,
          title,
          description: "",
          tags: [],
          currentStatus: status,
          lastSeenNote: note || "",
          lastSeenAt: firebase.database.ServerValue.TIMESTAMP,
          lastSeenSessionId: session?.id || "",
          createdAt: firebase.database.ServerValue.TIMESTAMP,
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
        });

        await idxRef.set({
          key,
          questId,
          title,
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
        });
      } else {
        await idxRef.update({
          title,
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
        });

        await database.ref(`${campaignBasePath}/quests/${questId}`).update({
          title,
          currentStatus: status,
          lastSeenNote: note || "",
          lastSeenAt: firebase.database.ServerValue.TIMESTAMP,
          lastSeenSessionId: session?.id || "",
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
        });
      }

      const already = questsInSession.some((q) => q?.questId && q.questId === questId);
      if (already) {
        setQuestTitle("");
        setQuestNote("");
        setQuestStatus("ativa");
        setStatus?.({ type: "info", msg: "Essa quest já está registrada nesta sessão." });
        return;
      }

      const rowRef = sessionRef.child("quests").push();
      await rowRef.set({
        id: rowRef.key,
        questId,
        title,
        status,
        note: note || "",
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });

      await pushQuestTimelineEvent({
        uid,
        campaignId,
        campaignMode,
        questId,
        session,
        type: "seen",
        status,
        title: "Quest registrada na sessão",
        note,
      });

      setQuestTitle("");
      setQuestNote("");
      setQuestStatus("ativa");
      setStatus?.({ type: "success", msg: "Quest adicionada na sessão." });
    } catch (e) {
      setStatus?.({ type: "error", msg: e?.message || "Erro ao adicionar quest." });
    }
  };

  const removeQuestFromSession = async (rowId) => {
    setStatus?.({ type: "info", msg: "" });
    if (!sessionRef || !rowId) return;

    try {
      await sessionRef.child(`quests/${rowId}`).remove();
      setStatus?.({ type: "success", msg: "Quest removida da sessão." });
    } catch (e) {
      setStatus?.({ type: "error", msg: e?.message || "Erro ao remover quest." });
    }
  };

  const updateQuestStatus = async (row, newStatus) => {
    setStatus?.({ type: "info", msg: "" });
    if (!campaignBasePath || !sessionRef || !row?.id) return;

    try {
      await sessionRef.child(`quests/${row.id}`).update({
        status: newStatus,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });

      if (row?.questId) {
        await database.ref(`${campaignBasePath}/quests/${row.questId}`).update({
          currentStatus: newStatus,
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
        });
      }

      await pushQuestTimelineEvent({
        uid,
        campaignId,
        campaignMode,
        questId: row?.questId,
        session,
        type: "status",
        status: newStatus,
        title: "Status atualizado",
        note: row?.note || "",
      });
    } catch (e) {
      setStatus?.({ type: "error", msg: e?.message || "Erro ao atualizar status da quest." });
    }
  };

  const markConcluded = async (row) => {
    setStatus?.({ type: "info", msg: "" });
    if (!campaignBasePath || !sessionRef || !row?.id) return;

    try {
      await sessionRef.child(`quests/${row.id}`).update({
        status: "concluida",
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });

      if (row?.questId) {
        await database.ref(`${campaignBasePath}/quests/${row.questId}`).update({
          currentStatus: "concluida",
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
        });
      }

      await pushQuestTimelineEvent({
        uid,
        campaignId,
        campaignMode,
        questId: row?.questId,
        session,
        type: "concluded",
        status: "concluida",
        title: "Quest concluída",
        note: row?.note || "",
      });

      setStatus?.({ type: "success", msg: "Quest marcada como concluída." });
    } catch (e) {
      setStatus?.({ type: "error", msg: e?.message || "Erro ao concluir quest." });
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 2,
        bgcolor: "#fffbf0",
        border: "1px solid rgba(92, 64, 51, 0.2)",
        position: "relative",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <MapIcon sx={{ color: "#833c0b" }} />
        <Typography variant="h6" sx={{ fontFamily: "Cinzel", fontWeight: 800, color: "#2c1a10" }}>
          Quests & Missões
        </Typography>
      </Stack>

      <Stack spacing={2}>
        {/* Form: adicionar quest */}
        <Paper elevation={0} sx={{ p: 1.5, bgcolor: "rgba(0,0,0,0.03)", borderRadius: 1 }}>
          <Stack spacing={1}>
            <TextField
              size="small"
              value={questTitle}
              onChange={(e) => setQuestTitle(e.target.value)}
              placeholder="Nova Quest (Título)"
              fullWidth
              sx={{ bgcolor: "#fff" }}
            />
            <Stack direction="row" spacing={1}>
              <Select
                value={questStatus}
                onChange={(e) => setQuestStatus(e.target.value)}
                size="small"
                sx={{ minWidth: 100, bgcolor: "#fff" }}
              >
                {STATUS.map((s) => (
                  <MenuItem key={s.value} value={s.value}>
                    {s.label}
                  </MenuItem>
                ))}
              </Select>
              <Button variant="contained" onClick={addQuest} sx={{ bgcolor: "#833c0b", flexGrow: 1 }}>
                Adicionar
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Divider sx={{ borderColor: "rgba(92, 64, 51, 0.1)" }} />

        {/* Lista: quests na sessão + plano */}
        {questsWithMaster.length === 0 ? (
          <Typography sx={{ opacity: 0.6, fontStyle: "italic", textAlign: "center" }}>
            Nenhuma missão ativa nesta sessão.
          </Typography>
        ) : (
          <Stack spacing={1.5}>
            {questsWithMaster.map(({ row: q, master }) => {
              const qid = q?.questId || "";
              const isOpen = Boolean(expanded[qid]);

              const milestonesObj = master?.flow?.milestones || {};
              const overall = computeFlowProgress(milestonesObj);

              return (
                <Paper
                  key={q.id}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    bgcolor: "#fff",
                    border: "1px solid rgba(92, 64, 51, 0.15)",
                    borderLeft: `4px solid ${q.status === 'concluida' ? '#2e7d32' : '#ed6c02'}`,
                    transition: "transform 0.2s",
                    "&:hover": { transform: "translateX(2px)" }
                  }}
                >
                  <Stack spacing={1}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontFamily: "Cinzel", fontWeight: 700, color: "#2c1a10", lineHeight: 1.2 }}>
                          {q.title || "—"}
                        </Typography>
                        {q.note && (
                          <Typography variant="caption" sx={{ color: "rgba(44, 26, 16, 0.7)", display: "block", mt: 0.5 }}>
                            Nota: {q.note}
                          </Typography>
                        )}
                      </Box>
                      <Chip 
                        label={STATUS.find((s) => s.value === q.status)?.label} 
                        size="small" 
                        color={statusColor(q.status)} 
                        variant="outlined"
                        sx={{ height: 20, fontSize: "0.65rem", fontWeight: 700 }}
                      />
                    </Box>

                    {/* Barra de Progresso Visual */}
                    {qid && overall.total > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: "#833c0b" }}>Progresso</Typography>
                          <Typography variant="caption">{overall.done}/{overall.total}</Typography>
                        </Stack>
                        <LinearProgress 
                          variant="determinate" 
                          value={overall.pct} 
                          sx={{ 
                            height: 6, 
                            borderRadius: 3, 
                            bgcolor: "rgba(0,0,0,0.1)",
                            "& .MuiLinearProgress-bar": { bgcolor: "#833c0b" }
                          }} 
                        />
                      </Box>
                    )}

                    <Divider sx={{ borderStyle: "dashed" }} />

                    {/* Ações Rápidas */}
                    <Stack direction="row" justifyContent="flex-end" spacing={0}>
                      <Tooltip title="Ver Detalhes">
                        <IconButton size="small" onClick={() => openQuest(qid)}><OpenInNewRoundedIcon fontSize="small" /></IconButton>
                      </Tooltip>
                      <Tooltip title="Adicionar Objetivo">
                        <IconButton size="small" onClick={() => openObjectiveDialog(q)}><AddTaskRoundedIcon fontSize="small" /></IconButton>
                      </Tooltip>
                      <Tooltip title="Concluir">
                        <IconButton size="small" onClick={() => markConcluded(q)} color={q.status === 'concluida' ? 'success' : 'default'}><CheckCircleRoundedIcon fontSize="small" /></IconButton>
                      </Tooltip>
                      <Tooltip title="Expandir">
                        <IconButton size="small" onClick={() => toggleExpanded(qid)}>
                          {isOpen ? <ExpandLessRoundedIcon fontSize="small" /> : <ExpandMoreRoundedIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                    </Stack>

                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                      <Box sx={{ mt: 1, p: 1, bgcolor: "rgba(0,0,0,0.02)", borderRadius: 1 }}>
                        <QuestFlowPreview
                          milestonesObj={milestonesObj}
                          previewMilestones={2}
                          previewTodos={6}
                          onToggleTodo={(milestoneId, todo) => toggleTodo(qid, milestoneId, todo)}
                        />
                      </Box>
                    </Collapse>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        )}

        {/* Modal: adicionar objetivo (to-do) */}
        <Dialog 
          open={objectiveOpen} 
          onClose={() => setObjectiveOpen(false)} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{ sx: { bgcolor: "#fffbf0", border: "4px double #5c4033" } }}
        >
          <DialogTitle sx={{ fontFamily: "Cinzel", color: "#58180D" }}>Novo Objetivo</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Typography variant="body2">
                Quest: <strong>{objectiveQuest?.title || "—"}</strong>
              </Typography>
              <TextField
                label="O que precisa ser feito?"
                value={objectiveText}
                onChange={(e) => setObjectiveText(e.target.value)}
                fullWidth
                multiline
                minRows={2}
                sx={{ bgcolor: "#fff" }}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ bgcolor: "rgba(92,64,51,0.05)" }}>
            <Button onClick={() => setObjectiveOpen(false)} sx={{ color: "#5c4033" }}>Cancelar</Button>
            <Button variant="contained" onClick={createObjectiveTodo} sx={{ bgcolor: "#833c0b" }}>
              Adicionar
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Paper>
  );
}