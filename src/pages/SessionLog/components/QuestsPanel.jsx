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
import { database, firebase } from "APIs/firebaseConfig";
import { useNavigate } from "react-router-dom";
import QuestFlowPreview from "components/Quests/QuestFlowPreview";
import { computeFlowProgress } from "components/Quests/questFlowUtils";
import { RPG_TOKENS } from "theme/rpgTokens";
import RpgSection from "components/RpgSection";

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

function pushQuestTimelineEvent({ uid, campaignId, questId, session, type, status, note, title, milestoneId }) {
  if (!uid || !campaignId || !questId) return Promise.resolve();
  const timelineRef = database.ref(`users/${uid}/campaigns/${campaignId}/quests/${questId}/timeline`).push();
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

export default function QuestsPanel({ uid, campaignId, sessionRef, session, setStatus }) {
  const navigate = useNavigate();

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
    if (!uid || !campaignId) return;

    const idxRef = database.ref(`users/${uid}/campaigns/${campaignId}/questIndex`);
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
  }, [uid, campaignId]);

  // ✅ carrega quests master da campanha (uma vez, listener)
  useEffect(() => {
    if (!uid || !campaignId) return;

    const ref = database.ref(`users/${uid}/campaigns/${campaignId}/quests`);
    const onValue = (snap) => {
      const data = snap.val() || {};
      setQuestMap(data);
    };

    ref.on("value", onValue);
    return () => ref.off("value", onValue);
  }, [uid, campaignId]);

  const openQuest = (questId) => {
    if (!questId) return;
    navigate(`/quests/${encodeURIComponent(questId)}?c=${encodeURIComponent(campaignId)}`);
  };

  const toggleExpanded = (questId) => {
    if (!questId) return;
    setExpanded((m) => ({ ...m, [questId]: !m[questId] }));
  };

  const ensureMilestoneForObjectives = async (questId) => {
    const qRef = database.ref(`users/${uid}/campaigns/${campaignId}/quests/${questId}`);
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
    if (!uid || !campaignId || !objectiveQuest?.questId) return;

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
        .ref(`users/${uid}/campaigns/${campaignId}/quests/${questId}/flow/milestones/${milestoneId}/todos`)
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
    if (!uid || !campaignId || !questId || !milestoneId || !todo?.id) return;

    try {
      const next = !Boolean(todo.done);
      await database
        .ref(`users/${uid}/campaigns/${campaignId}/quests/${questId}/flow/milestones/${milestoneId}/todos/${todo.id}`)
        .update({
          done: next,
          doneAt: next ? firebase.database.ServerValue.TIMESTAMP : 0,
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
        });

      // timeline (opcional, mas deixa vivo)
      await pushQuestTimelineEvent({
        uid,
        campaignId,
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
    if (!uid || !campaignId || !sessionRef) return;

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
      const idxRef = database.ref(`users/${uid}/campaigns/${campaignId}/questIndex/${key}`);
      const idxSnap = await idxRef.once("value");
      const idx = idxSnap.val();

      let questId = idx?.questId;

      if (!questId) {
        const questRef = database.ref(`users/${uid}/campaigns/${campaignId}/quests`).push();
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

        await database.ref(`users/${uid}/campaigns/${campaignId}/quests/${questId}`).update({
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
    if (!uid || !campaignId || !sessionRef || !row?.id) return;

    try {
      await sessionRef.child(`quests/${row.id}`).update({
        status: newStatus,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });

      if (row?.questId) {
        await database.ref(`users/${uid}/campaigns/${campaignId}/quests/${row.questId}`).update({
          currentStatus: newStatus,
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
        });
      }

      await pushQuestTimelineEvent({
        uid,
        campaignId,
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
    if (!uid || !campaignId || !sessionRef || !row?.id) return;

    try {
      await sessionRef.child(`quests/${row.id}`).update({
        status: "concluida",
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });

      if (row?.questId) {
        await database.ref(`users/${uid}/campaigns/${campaignId}/quests/${row.questId}`).update({
          currentStatus: "concluida",
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
        });
      }

      await pushQuestTimelineEvent({
        uid,
        campaignId,
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
    <RpgSection
      title="Quests"
      subtitle="Registre quests tocadas e transforme follow-ups em objetivos."
    >
      <Stack spacing={1.25}>
        {/* Form: adicionar quest */}
        <Stack direction={{ xs: "column", md: "column" }} spacing={1} alignItems={{ md: "center", lg: "center" }}>
          <TextField
            freeSolo
            value={questTitle}
            onChange={(e) => setQuestTitle(e.target.value)}
            label="Título da quest"
            placeholder="Ex.: Investigar o sumiço na taverna"
            sx={{ flex: 2, minWidth: 160 }}
          />

          <Select
            value={questStatus}
            onChange={(e) => setQuestStatus(e.target.value)}
            size="small"
            sx={{ minWidth: 160, flex: { xs: "unset", md: 0 } }}
          >
            {STATUS.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </Select>

          <TextField
            label="Nota (opcional)"
            value={questNote}
            onChange={(e) => setQuestNote(e.target.value)}
            placeholder='Ex.: "o taverneiro mentiu"'
            sx={{ flex: 2, minWidth: 160 }}
          />

          <Button variant="outlined" onClick={addQuest}>
            Adicionar
          </Button>
        </Stack>

        <Divider />

        {/* Lista: quests na sessão + plano */}
        {questsWithMaster.length === 0 ? (
          <Typography sx={{ opacity: 0.8 }}>Nenhuma quest registrada nesta sessão.</Typography>
        ) : (
          <Stack spacing={1}>
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
                    p: 1.25,
                    borderRadius: 2.5,
                    border: RPG_TOKENS.border,
                    background: RPG_TOKENS.cardBg,
                  }}
                >
                  <Stack spacing={1}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0, flexWrap: "wrap", gap: 1 }}>
                          <Chip label="Quest" size="small" variant="outlined" />
                          <Chip
                            label={STATUS.find((s) => s.value === q.status)?.label || "Pendente"}
                            size="small"
                            color={statusColor(q.status)}
                            variant="outlined"
                          />
                          <Typography sx={{ fontWeight: 900, color: "#2c1a10" }} noWrap title={q.title || ""}>
                            {q.title || "—"}
                          </Typography>
                        </Stack>

                        {q.note ? (
                          <Typography variant="caption" sx={{ opacity: 0.85 }}>
                            Nota: {q.note}
                          </Typography>
                        ) : null}

                        {qid && overall.total ? (
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5, flexWrap: "wrap", gap: 1 }}>
                            <Chip size="small" label={`Objetivos: ${overall.done}/${overall.total}`} variant="outlined" />
                            <Box sx={{ width: 180 }}>
                              <LinearProgress variant="determinate" value={overall.pct} sx={{ height: 10, borderRadius: 2 }} />
                            </Box>
                          </Stack>
                        ) : null}
                      </Stack>

                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Select
                          value={q.status || "pendente"}
                          onChange={(e) => updateQuestStatus(q, e.target.value)}
                          size="small"
                          sx={{ height: 32 }}
                        >
                          {STATUS.map((s) => (
                            <MenuItem key={s.value} value={s.value}>
                              {s.label}
                            </MenuItem>
                          ))}
                        </Select>

                        <Tooltip title="Abrir quest">
                          <span>
                            <IconButton size="small" onClick={() => openQuest(qid)} disabled={!qid}>
                              <OpenInNewRoundedIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>

                        <Tooltip title="Adicionar follow-up (objetivo)">
                          <span>
                            <IconButton size="small" onClick={() => openObjectiveDialog(q)} disabled={!qid}>
                              <AddTaskRoundedIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>

                        <Tooltip title="Marcar concluída">
                          <span>
                            <IconButton size="small" onClick={() => markConcluded(q)} disabled={q.status === "concluida"}>
                              <CheckCircleRoundedIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>

                        <Tooltip title={isOpen ? "Ocultar objetivos" : "Ver objetivos"}>
                          <span>
                            <IconButton size="small" onClick={() => toggleExpanded(qid)} disabled={!qid}>
                              {isOpen ? <ExpandLessRoundedIcon fontSize="small" /> : <ExpandMoreRoundedIcon fontSize="small" />}
                            </IconButton>
                          </span>
                        </Tooltip>

                        <Tooltip title="Remover da sessão">
                          <IconButton size="small" onClick={() => removeQuestFromSession(q.id)}>
                            <DeleteRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Box>

                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                      <Divider sx={{ my: 1 }} />

                      {!qid ? (
                        <Typography sx={{ opacity: 0.8 }}>Sem questId.</Typography>
                      ) : (
                        <QuestFlowPreview
                          milestonesObj={milestonesObj}
                          previewMilestones={2}
                          previewTodos={6}
                          onToggleTodo={(milestoneId, todo) => toggleTodo(qid, milestoneId, todo)}
                        />
                      )}
                    </Collapse>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        )}

        {/* Modal: adicionar objetivo (to-do) */}
        <Dialog open={objectiveOpen} onClose={() => setObjectiveOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Adicionar follow-up (objetivo)</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={1.25} sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                Quest: <strong>{objectiveQuest?.title || "—"}</strong>
              </Typography>

              <Select
                value={objectiveMilestoneId}
                onChange={(e) => setObjectiveMilestoneId(e.target.value)}
                size="small"
                sx={{ width: "fit-content" }}
                displayEmpty
              >
                <MenuItem value="">
                  <em>(Criar/usar “Próximos passos”)</em>
                </MenuItem>

                {(() => {
                  const master = objectiveQuest?.questId ? questMap[objectiveQuest.questId] : null;
                  const mObj = master?.flow?.milestones || {};
                  const mArr = Object.values(mObj).filter(Boolean).sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
                  return mArr.map((m) => (
                    <MenuItem key={m.id} value={m.id}>
                      {m.title}
                    </MenuItem>
                  ));
                })()}
              </Select>

              <TextField
                label="Follow-up (to-do)"
                value={objectiveText}
                onChange={(e) => setObjectiveText(e.target.value)}
                fullWidth
                multiline
                minRows={3}
                placeholder='Ex.: "Voltar à taverna e confrontar o dono"'
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setObjectiveOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={createObjectiveTodo} sx={{ fontWeight: 900 }}>
              Adicionar
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </RpgSection>
  );
}