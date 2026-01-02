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
  Tabs,
  Tab,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { auth, database, firebase } from "APIs/firebaseConfig";
import { T_IN } from "config/transitions";
import { motion } from "framer-motion";

// Ícones das Abas
import DescriptionIcon from '@mui/icons-material/Description';
import ListAltIcon from '@mui/icons-material/ListAlt';
import HistoryIcon from '@mui/icons-material/History';
import LinkIcon from '@mui/icons-material/Link';

const DEFAULT_CAMPAIGN_ID = "default";

// --- Estilos D&D ---
const DND_THEME = {
  paperBg: "linear-gradient(135deg, #fffbf0 0%, #f3eacb 100%)",
  ink: "#2c1a10",
  gold: "#bf8f00",
  leather: "#833c0b",
};

function normalizeKey(name) {
  return String(name || "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function parseTags(raw) {
  return String(raw || "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 32);
}

const STATUS = [
  { value: "ativa", label: "Ativa" },
  { value: "pendente", label: "Pendente" },
  { value: "concluida", label: "Concluída" },
];

function fmtDateTime(ms) {
  if (!ms) return "";
  try { return new Date(ms).toLocaleString("pt-BR"); } catch { return ""; }
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
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
  const [tabIndex, setTabIndex] = useState(0);

  // Form States
  const [title, setTitle] = useState("");
  const [currentStatus, setCurrentStatus] = useState("pendente");
  const [description, setDescription] = useState("");
  const [tagsRaw, setTagsRaw] = useState("");

  // Data States
  const [appearedIn, setAppearedIn] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [questOptions, setQuestOptions] = useState([]);
  const [subquestTarget, setSubquestTarget] = useState(null);

  // UI States
  const [milestoneOpen, setMilestoneOpen] = useState(false);
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneNote, setMilestoneNote] = useState("");
  const [todoDraft, setTodoDraft] = useState({});
  const [eventOpen, setEventOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventType, setEventType] = useState("manual");
  const [eventStatus, setEventStatus] = useState("pendente");
  const [eventNote, setEventNote] = useState("");
  const [eventMilestoneId, setEventMilestoneId] = useState("");

  const questRef = useMemo(() => {
    if (!uid || !campaignId || !questId) return null;
    return database.ref(`users/${uid}/campaigns/${campaignId}/quests/${questId}`);
  }, [uid, campaignId, questId]);

  // --- Effects ---
  useEffect(() => {
    if (!questRef) { setLoading(false); return; }
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

  useEffect(() => {
    if (!questRef) return;
    const tlRef = questRef.child("timeline");
    const onTl = (snap) => {
      const data = snap.val() || {};
      const arr = Object.values(data).sort((a, b) => Number(b.occurredAt || 0) - Number(a.occurredAt || 0));
      setTimeline(arr);
    };
    tlRef.on("value", onTl);
    return () => tlRef.off("value", onTl);
  }, [questRef]);

  useEffect(() => {
    if (!uid || !campaignId || !questId) return;
    const logsRef = database.ref(`users/${uid}/campaigns/${campaignId}/sessionLogs`);
    const onLogs = (snap) => {
      const data = snap.val() || {};
      const found = Object.values(data).filter(s => {
        const rows = Object.values(s?.quests || {});
        return rows.some(r => r?.questId === questId);
      }).map(s => ({
        sessionId: s.id,
        title: s.title || "Sessão",
        createdAt: s.createdAt || 0,
        note: Object.values(s.quests).find(r => r.questId === questId)?.note || ""
      })).sort((a, b) => b.createdAt - a.createdAt);
      setAppearedIn(found);
    };
    logsRef.on("value", onLogs);
    return () => logsRef.off("value", onLogs);
  }, [uid, campaignId, questId]);

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

  // --- Computed ---
  const milestones = useMemo(() => {
    const obj = quest?.flow?.milestones || {};
    const arr = Object.values(obj).filter(Boolean).sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
    return arr;
  }, [quest?.flow?.milestones]);

  const subquests = useMemo(() => {
    const obj = quest?.links?.subquests || {};
    return Object.values(obj).filter((x) => x?.questId && x?.title).sort((a, b) => String(a.title).localeCompare(String(b.title), "pt-BR"));
  }, [quest?.links?.subquests]);

  // --- Actions ---
  const save = async () => {
    setStatus({ type: "info", msg: "" });
    if (!questRef || !uid) return;
    const newTitle = title.trim();
    if (!newTitle) return setStatus({ type: "warning", msg: "Título é obrigatório." });
    
    try {
      const newKey = normalizeKey(newTitle);
      const oldKey = quest?.indexKey || normalizeKey(quest?.title || "");
      
      if (oldKey && oldKey !== newKey) {
        await database.ref(`users/${uid}/campaigns/${campaignId}/questIndex/${oldKey}`).remove();
      }
      await database.ref(`users/${uid}/campaigns/${campaignId}/questIndex/${newKey}`).set({
        key: newKey, questId, title: newTitle, updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });

      await questRef.update({
        title: newTitle, indexKey: newKey, currentStatus, description: description.trim(),
        tags: parseTags(tagsRaw), updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });
      setStatus({ type: "success", msg: "Quest salva." });
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || "Erro ao salvar." });
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
        
        {/* Header Fixo */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 2, 
            background: DND_THEME.paperBg,
            border: "1px solid rgba(92, 64, 51, 0.3)",
            position: "relative"
          }}
        >
          <Button 
            startIcon={<ArrowBackIcon />} 
            component={Link} 
            to={`/quests?c=${encodeURIComponent(campaignId)}`}
            sx={{ position: "absolute", top: 16, left: 16, color: DND_THEME.leather }}
          >
            Voltar
          </Button>

          <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
            <TextField
              variant="standard"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título da Missão"
              fullWidth
              inputProps={{ style: { textAlign: "center", fontFamily: "Cinzel", fontSize: "2rem", fontWeight: 900, color: DND_THEME.ink } }}
              InputProps={{ disableUnderline: true }}
            />
            
            <Stack direction="row" spacing={2} alignItems="center">
              <Select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value)}
                size="small"
                variant="standard"
                disableUnderline
                sx={{ fontFamily: "Cinzel", fontWeight: 700, color: DND_THEME.leather, fontSize: "1.1rem" }}
              >
                {STATUS.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
              </Select>
              <Button 
                variant="contained" 
                startIcon={<SaveIcon />} 
                onClick={save}
                sx={{ bgcolor: DND_THEME.leather, fontFamily: "Cinzel", fontWeight: 700 }}
              >
                Salvar Alterações
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {status.msg && <Alert severity={status.type} sx={{ mb: 2 }}>{status.msg}</Alert>}

        {/* Navegação por Abas */}
        <Paper elevation={0} sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid rgba(0,0,0,0.1)" }}>
          <Tabs 
            value={tabIndex} 
            onChange={(_, v) => setTabIndex(v)} 
            variant="fullWidth"
            sx={{ 
              bgcolor: "#f5f5f5", 
              "& .MuiTab-root": { fontFamily: "Cinzel", fontWeight: 700, color: "#666" },
              "& .Mui-selected": { color: DND_THEME.leather }
            }}
          >
            <Tab icon={<DescriptionIcon />} label="Geral" />
            <Tab icon={<ListAltIcon />} label="Plano" />
            <Tab icon={<HistoryIcon />} label="Crônicas" />
            <Tab icon={<LinkIcon />} label="Conexões" />
          </Tabs>

          <Box sx={{ bgcolor: "#fff", minHeight: 400, p: 2 }}>
            
            {/* ABA 1: GERAL */}
            <TabPanel value={tabIndex} index={0}>
              <Stack spacing={3}>
                <TextField
                  label="Descrição da Missão"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  multiline
                  minRows={6}
                  fullWidth
                  placeholder="Descreva o contrato, o cliente e os objetivos principais..."
                  variant="filled"
                  sx={{ "& .MuiFilledInput-root": { bgcolor: "#fffbf0" } }}
                />
                
                <TextField
                  label="Tags (separadas por vírgula)"
                  value={tagsRaw}
                  onChange={(e) => setTagsRaw(e.target.value)}
                  fullWidth
                  helperText="Ex: principal, dungeon, investigação"
                />

                <Divider sx={{ borderColor: "rgba(0,0,0,0.1)" }} />

                <Box>
                  <Typography variant="h6" sx={{ fontFamily: "Cinzel", color: DND_THEME.ink, mb: 2 }}>Subquests & Dependências</Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Autocomplete
                      options={questOptions.filter((o) => o.questId !== questId)}
                      getOptionLabel={(o) => o?.title || ""}
                      value={subquestTarget}
                      onChange={(_, v) => setSubquestTarget(v)}
                      renderInput={(params) => <TextField {...params} label="Vincular outra quest" size="small" />}
                      sx={{ flex: 1 }}
                    />
                    <Button variant="outlined" onClick={addSubquest} disabled={!subquestTarget}>Adicionar</Button>
                  </Stack>
                  
                  <Stack spacing={1}>
                    {subquests.map((sq) => (
                      <Paper key={sq.questId} variant="outlined" sx={{ p: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography sx={{ fontWeight: 600 }}>{sq.title}</Typography>
                        <Stack direction="row">
                          <IconButton size="small" component={Link} to={`/quests/${sq.questId}?c=${campaignId}`}><OpenInNewRoundedIcon /></IconButton>
                          <IconButton size="small" onClick={() => removeSubquest(sq.questId)}><DeleteRoundedIcon /></IconButton>
                        </Stack>
                      </Paper>
                    ))}
                    {subquests.length === 0 && <Typography variant="caption" sx={{ fontStyle: "italic" }}>Nenhuma subquest vinculada.</Typography>}
                  </Stack>
                </Box>
              </Stack>
            </TabPanel>

            {/* ABA 2: PLANO */}
            <TabPanel value={tabIndex} index={1}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontFamily: "Cinzel", color: DND_THEME.ink }}>Marcos & Objetivos</Typography>
                <Button startIcon={<AddRoundedIcon />} variant="contained" onClick={() => setMilestoneOpen(true)} sx={{ bgcolor: DND_THEME.leather }}>
                  Novo Marco
                </Button>
              </Stack>

              {milestones.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4, opacity: 0.6 }}>
                  <Typography>O plano está vazio. Adicione marcos importantes para organizar a missão.</Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {milestones.map((m) => {
                    const todos = Object.values(m.todos || {}).filter(Boolean);
                    const done = todos.filter(t => t.done).length;
                    const pct = todos.length ? (done / todos.length) * 100 : 0;

                    return (
                      <Paper key={m.id} variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: "#fafafa" }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: DND_THEME.ink }}>{m.title}</Typography>
                            {m.note && <Typography variant="caption" sx={{ display: "block", mb: 1 }}>{m.note}</Typography>}
                          </Box>
                          <IconButton size="small" onClick={() => removeMilestone(m.id)}><DeleteRoundedIcon /></IconButton>
                        </Stack>

                        <LinearProgress variant="determinate" value={pct} sx={{ my: 1.5, height: 6, borderRadius: 3, bgcolor: "#e0e0e0", "& .MuiLinearProgress-bar": { bgcolor: DND_THEME.gold } }} />

                        <Stack spacing={0.5}>
                          {todos.map(t => (
                            <Box key={t.id} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Checkbox checked={t.done} onChange={() => toggleTodo(m.id, t)} size="small" sx={{ color: DND_THEME.leather, '&.Mui-checked': { color: DND_THEME.leather } }} />
                              <Typography sx={{ textDecoration: t.done ? "line-through" : "none", opacity: t.done ? 0.6 : 1, fontSize: "0.9rem" }}>{t.text}</Typography>
                              <IconButton size="small" onClick={() => removeTodo(m.id, t.id)} sx={{ ml: "auto", opacity: 0 }} className="del-btn"><DeleteRoundedIcon fontSize="small" /></IconButton>
                            </Box>
                          ))}
                        </Stack>

                        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                          <TextField 
                            size="small" 
                            placeholder="Novo objetivo..." 
                            fullWidth 
                            value={todoDraft[m.id] || ""} 
                            onChange={(e) => setTodoDraft(prev => ({...prev, [m.id]: e.target.value}))}
                            onKeyDown={(e) => e.key === 'Enter' && addTodo(m.id)}
                          />
                          <Button variant="outlined" onClick={() => addTodo(m.id)}>Add</Button>
                        </Stack>
                      </Paper>
                    );
                  })}
                </Stack>
              )}
            </TabPanel>

            {/* ABA 3: TIMELINE */}
            <TabPanel value={tabIndex} index={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontFamily: "Cinzel", color: DND_THEME.ink }}>Linha do Tempo</Typography>
                <Button startIcon={<AddRoundedIcon />} variant="outlined" onClick={() => setEventOpen(true)}>Evento Manual</Button>
              </Stack>

              <Box sx={{ position: "relative", pl: 2, borderLeft: `2px solid ${DND_THEME.gold}` }}>
                {timeline.map((ev) => (
                  <Box key={ev.id} sx={{ mb: 3, position: "relative" }}>
                    <Box sx={{ position: "absolute", left: -21, top: 0, width: 10, height: 10, borderRadius: "50%", bgcolor: DND_THEME.gold, border: "2px solid #fff" }} />
                    <Typography variant="caption" sx={{ color: "#999", fontWeight: 700 }}>{fmtDateTime(ev.occurredAt)}</Typography>
                    <Paper elevation={0} sx={{ p: 1.5, mt: 0.5, bgcolor: "#f9f9f9", border: "1px solid #eee" }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: DND_THEME.ink }}>{ev.title}</Typography>
                      {ev.note && <Typography variant="body2" sx={{ mt: 0.5 }}>{ev.note}</Typography>}
                      {ev.sessionTitle && (
                        <Chip 
                          label={`Sessão: ${ev.sessionTitle}`} 
                          size="small" 
                          component={Link} 
                          to={`/diario/${ev.sessionId}?c=${campaignId}`}
                          clickable
                          sx={{ mt: 1, cursor: "pointer" }} 
                        />
                      )}
                    </Paper>
                  </Box>
                ))}
                {timeline.length === 0 && <Typography sx={{ fontStyle: "italic", opacity: 0.6 }}>Nenhum evento registrado.</Typography>}
              </Box>
            </TabPanel>

            {/* ABA 4: CONEXÕES */}
            <TabPanel value={tabIndex} index={3}>
              <Typography variant="h6" sx={{ fontFamily: "Cinzel", color: DND_THEME.ink, mb: 2 }}>Aparições em Sessões</Typography>
              <Stack spacing={1}>
                {appearedIn.map((s) => (
                  <Paper key={s.sessionId} variant="outlined" sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{s.title}</Typography>
                      {s.note && <Typography variant="caption">Nota: {s.note}</Typography>}
                    </Box>
                    <Button size="small" component={Link} to={`/diario/${s.sessionId}?c=${campaignId}`}>Ver Sessão</Button>
                  </Paper>
                ))}
                {appearedIn.length === 0 && <Typography sx={{ fontStyle: "italic", opacity: 0.6 }}>Esta quest ainda não foi citada em nenhuma sessão.</Typography>}
              </Stack>
            </TabPanel>

          </Box>
        </Paper>

        {/* Dialogs (Milestone & Event) */}
        <Dialog open={milestoneOpen} onClose={() => setMilestoneOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Novo Marco</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField label="Título" value={milestoneTitle} onChange={(e) => setMilestoneTitle(e.target.value)} fullWidth />
              <TextField label="Nota (opcional)" value={milestoneNote} onChange={(e) => setMilestoneNote(e.target.value)} fullWidth multiline rows={2} />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setMilestoneOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={addMilestone}>Criar</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={eventOpen} onClose={() => setEventOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Evento Manual</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField label="Título" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} fullWidth />
              <TextField label="Nota" value={eventNote} onChange={(e) => setEventNote(e.target.value)} fullWidth multiline rows={3} />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEventOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={addManualEvent}>Registrar</Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
}