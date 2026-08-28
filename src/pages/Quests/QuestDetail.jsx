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
import { auth } from "APIs/firebaseConfig";
import { T_IN } from "config/transitions";
import { motion } from "framer-motion";
import { buildCampaignQuery } from "service/campaignPath";
import { useQuestDetail } from "hooks/useQuestDetail";
import { fmtDateTime } from "Utils/textHelpers";

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

const STATUS = [
  { value: "ativa", label: "Ativa" },
  { value: "pendente", label: "Pendente" },
  { value: "concluida", label: "Concluída" },
];

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
  const campaignMode = searchParams.get("m") === "shared" ? "shared" : "legacy";

  const [status, setStatus] = useState({ type: "info", msg: "" });
  const [tabIndex, setTabIndex] = useState(0);

  const {
    quest,
    timeline,
    appearedIn,
    questOptions,
    milestones,
    subquests,
    loading,
    saveQuest,
    addMilestone: addMilestoneAction,
    removeMilestone: removeMilestoneAction,
    addTodo: addTodoAction,
    toggleTodo: toggleTodoAction,
    removeTodo: removeTodoAction,
    addSubquest: addSubquestAction,
    removeSubquest: removeSubquestAction,
    addManualEvent: addManualEventAction,
  } = useQuestDetail(uid, campaignId, campaignMode, questId);

  // Form States
  const [title, setTitle] = useState("");
  const [currentStatus, setCurrentStatus] = useState("pendente");
  const [description, setDescription] = useState("");
  const [tagsRaw, setTagsRaw] = useState("");

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

  useEffect(() => {
    if (quest) {
      setTitle(quest.title || "");
      setCurrentStatus(quest.currentStatus || "pendente");
      setDescription(quest.description || "");
      setTagsRaw(Array.isArray(quest.tags) ? quest.tags.join(", ") : "");
    }
  }, [quest]);

  // --- Actions ---
  const save = async () => {
    setStatus({ type: "info", msg: "" });
    if (!uid) return;
    const newTitle = title.trim();
    if (!newTitle) return setStatus({ type: "warning", msg: "Título é obrigatório." });

    try {
      await saveQuest({
        title: newTitle,
        currentStatus,
        description,
        tags: tagsRaw,
      });
      setStatus({ type: "success", msg: "Quest salva." });
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || "Erro ao salvar." });
    }
  };

  // ✅ adicionar marco (ponto principal)
  const addMilestone = async () => {
    setStatus({ type: "info", msg: "" });
    const t = String(milestoneTitle || "").trim();
    const n = String(milestoneNote || "").trim();

    if (!t) {
      setStatus({ type: "warning", msg: "Informe o título do marco." });
      return;
    }

    try {
      await addMilestoneAction({ title: t, note: n });
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
    if (!milestoneId) return;

    try {
      await removeMilestoneAction(milestoneId);
      setStatus({ type: "success", msg: "Marco removido." });
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || "Erro ao remover marco." });
    }
  };

  // ✅ adicionar item do checklist
  const addTodo = async (milestoneId) => {
    setStatus({ type: "info", msg: "" });
    if (!milestoneId) return;

    const text = String(todoDraft[milestoneId] || "").trim();
    if (!text) {
      setStatus({ type: "warning", msg: "Informe o texto do to-do." });
      return;
    }

    try {
      await addTodoAction(milestoneId, text);
      setTodoDraft((m) => ({ ...m, [milestoneId]: "" }));
      setStatus({ type: "success", msg: "To-do adicionado." });
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || "Erro ao adicionar to-do." });
    }
  };

  const toggleTodo = async (milestoneId, todo) => {
    if (!milestoneId || !todo?.id) return;
    try {
      await toggleTodoAction(milestoneId, todo);
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || "Erro ao marcar to-do." });
    }
  };

  const removeTodo = async (milestoneId, todoId) => {
    if (!milestoneId || !todoId) return;
    try {
      await removeTodoAction(milestoneId, todoId);
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || "Erro ao remover to-do." });
    }
  };

  // ✅ adicionar subquest
  const addSubquest = async () => {
    setStatus({ type: "info", msg: "" });
    if (!subquestTarget?.questId) return;
    if (subquestTarget.questId === questId) {
      setStatus({ type: "warning", msg: "Você não pode linkar a quest nela mesma." });
      return;
    }

    try {
      await addSubquestAction(subquestTarget);
      setSubquestTarget(null);
      setStatus({ type: "success", msg: "Subquest adicionada." });
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || "Erro ao adicionar subquest." });
    }
  };

  const removeSubquest = async (qid) => {
    setStatus({ type: "info", msg: "" });
    if (!qid) return;
    try {
      await removeSubquestAction(qid);
      setStatus({ type: "success", msg: "Subquest removida." });
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || "Erro ao remover subquest." });
    }
  };

  // ✅ adicionar evento manual na timeline (com title + milestoneId)
  const addManualEvent = async () => {
    setStatus({ type: "info", msg: "" });
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
      await addManualEventAction({
        title: t,
        note,
        type: eventType,
        status: eventStatus,
        milestoneId: eventMilestoneId,
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
        <Button component={Link} to={`/quests?${buildCampaignQuery({ campaignId, mode: campaignMode })}`} sx={{ mt: 2 }}>
          Voltar
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { duration: T_IN * 0.18 } }}>
        
        {/* Header Fixo */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 3, 
            border: "1px solid rgba(191,143,0,0.38)",
            bgcolor: "rgba(33,18,11,0.82)",
            color: "#f7eddc",
            backgroundImage:
              "radial-gradient(120% 140% at 0% 0%, rgba(191,143,0,0.18) 0%, transparent 46%), radial-gradient(130% 160% at 100% 100%, rgba(131,60,11,0.24) 0%, transparent 56%)",
            position: "relative"
          }}
        >
          <Button 
            startIcon={<ArrowBackIcon />} 
            component={Link} 
            to={`/quests?${buildCampaignQuery({ campaignId, mode: campaignMode })}`}
            sx={{ position: "absolute", top: 16, left: 16, color: "#ffdf9e" }}
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
              inputProps={{ style: { textAlign: "center", fontFamily: "Cinzel", fontSize: "2rem", fontWeight: 900, color: "#ffd37d" } }}
              InputProps={{ disableUnderline: true }}
            />
            
            <Stack direction="row" spacing={2} alignItems="center">
              <Select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value)}
                size="small"
                variant="standard"
                disableUnderline
                sx={{ fontFamily: "Cinzel", fontWeight: 700, color: "#ffdeb0", fontSize: "1.1rem" }}
              >
                {STATUS.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
              </Select>
              <Button 
                variant="contained" 
                startIcon={<SaveIcon />} 
                onClick={save}
                sx={{ bgcolor: "#bf8f00", color: "#2c1a10", fontFamily: "Cinzel", fontWeight: 900 }}
              >
                Salvar Alterações
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {status.msg && <Alert severity={status.type} sx={{ mb: 2 }}>{status.msg}</Alert>}

        {/* Navegação por Abas */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid rgba(191,143,0,0.28)",
            bgcolor: "rgba(255,251,240,0.94)",
            boxShadow: "0 16px 30px rgba(0,0,0,0.2)",
          }}
        >
          <Tabs 
            value={tabIndex} 
            onChange={(_, v) => setTabIndex(v)} 
            variant="fullWidth"
            sx={{ 
              bgcolor: "rgba(44,26,16,0.06)",
              borderBottom: "1px solid rgba(131,60,11,0.2)",
              "& .MuiTabs-indicator": { backgroundColor: DND_THEME.gold, height: 3 },
              "& .MuiTab-root": {
                fontFamily: "Cinzel",
                fontWeight: 800,
                color: "rgba(44,26,16,0.7)",
                minHeight: 56,
              },
              "& .Mui-selected": { color: DND_THEME.leather }
            }}
          >
            <Tab icon={<DescriptionIcon />} label="Geral" />
            <Tab icon={<ListAltIcon />} label="Plano" />
            <Tab icon={<HistoryIcon />} label="Crônicas" />
            <Tab icon={<LinkIcon />} label="Conexões" />
          </Tabs>

          <Box
            sx={{
              minHeight: 400,
              p: { xs: 1.5, md: 2.25 },
              backgroundImage:
                "linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(255,248,233,0.9) 100%)",
            }}
          >
            
            {/* ABA 1: GERAL */}
            <TabPanel value={tabIndex} index={0}>
              <Stack spacing={2.2}>
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

                <Divider sx={{ borderColor: "rgba(131,60,11,0.18)", borderStyle: "dashed" }} />

                <Paper elevation={0} sx={{ p: 1.6, borderRadius: 2.2, border: "1px solid rgba(131,60,11,0.18)", bgcolor: "rgba(255,255,255,0.72)" }}>
                  <Typography variant="h6" sx={{ fontFamily: "Cinzel", color: DND_THEME.ink, mb: 2 }}>Subquests & Dependências</Typography>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mb: 2 }}>
                    <Autocomplete
                      options={questOptions.filter((o) => o.questId !== questId)}
                      getOptionLabel={(o) => o?.title || ""}
                      value={subquestTarget}
                      onChange={(_, v) => setSubquestTarget(v)}
                      renderInput={(params) => <TextField {...params} label="Vincular outra quest" size="small" />}
                      sx={{ flex: 1 }}
                    />
                    <Button variant="outlined" onClick={addSubquest} disabled={!subquestTarget} sx={{ borderColor: "rgba(131,60,11,0.45)", color: DND_THEME.leather, fontWeight: 800 }}>
                      Adicionar
                    </Button>
                  </Stack>
                  
                  <Stack spacing={1}>
                    {subquests.map((sq) => (
                      <Paper key={sq.questId} variant="outlined" sx={{ p: 1.2, display: "flex", justifyContent: "space-between", alignItems: "center", borderColor: "rgba(131,60,11,0.2)", bgcolor: "rgba(255,251,240,0.7)" }}>
                        <Typography sx={{ fontWeight: 600 }}>{sq.title}</Typography>
                        <Stack direction="row">
                          <IconButton size="small" component={Link} to={`/quests/${sq.questId}?${buildCampaignQuery({ campaignId, mode: campaignMode })}`} sx={{ color: DND_THEME.leather }}><OpenInNewRoundedIcon /></IconButton>
                          <IconButton size="small" onClick={() => removeSubquest(sq.questId)} sx={{ color: "rgba(44,26,16,0.45)" }}><DeleteRoundedIcon /></IconButton>
                        </Stack>
                      </Paper>
                    ))}
                    {subquests.length === 0 && <Typography variant="caption" sx={{ fontStyle: "italic" }}>Nenhuma subquest vinculada.</Typography>}
                  </Stack>
                </Paper>
              </Stack>
            </TabPanel>

            {/* ABA 2: PLANO */}
            <TabPanel value={tabIndex} index={1}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.2 }}>
                <Typography variant="h6" sx={{ fontFamily: "Cinzel", color: DND_THEME.ink }}>Marcos & Objetivos</Typography>
                <Button startIcon={<AddRoundedIcon />} variant="contained" onClick={() => setMilestoneOpen(true)} sx={{ bgcolor: DND_THEME.leather, fontFamily: "Cinzel", fontWeight: 800 }}>
                  Novo Marco
                </Button>
              </Stack>

              {milestones.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 4, opacity: 0.65 }}>
                  <Typography>O plano está vazio. Adicione marcos importantes para organizar a missão.</Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {milestones.map((m) => {
                    const todos = Object.values(m.todos || {}).filter(Boolean);
                    const done = todos.filter(t => t.done).length;
                    const pct = todos.length ? (done / todos.length) * 100 : 0;

                    return (
                      <Paper
                        key={m.id}
                        variant="outlined"
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "rgba(255,255,255,0.78)",
                          borderColor: "rgba(131,60,11,0.24)",
                          "&:hover .del-btn": { opacity: 1 },
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: DND_THEME.ink }}>{m.title}</Typography>
                            {m.note && <Typography variant="caption" sx={{ display: "block", mb: 1 }}>{m.note}</Typography>}
                          </Box>
                          <IconButton size="small" onClick={() => removeMilestone(m.id)} sx={{ color: "rgba(44,26,16,0.45)" }}><DeleteRoundedIcon /></IconButton>
                        </Stack>

                        <LinearProgress variant="determinate" value={pct} sx={{ my: 1.5, height: 6, borderRadius: 3, bgcolor: "#e0e0e0", "& .MuiLinearProgress-bar": { bgcolor: DND_THEME.gold } }} />

                        <Stack spacing={0.5}>
                          {todos.map(t => (
                            <Box key={t.id} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Checkbox checked={t.done} onChange={() => toggleTodo(m.id, t)} size="small" sx={{ color: DND_THEME.leather, '&.Mui-checked': { color: DND_THEME.leather } }} />
                              <Typography sx={{ textDecoration: t.done ? "line-through" : "none", opacity: t.done ? 0.6 : 1, fontSize: "0.9rem" }}>{t.text}</Typography>
                              <IconButton size="small" onClick={() => removeTodo(m.id, t.id)} sx={{ ml: "auto", opacity: 0, color: "rgba(44,26,16,0.45)" }} className="del-btn"><DeleteRoundedIcon fontSize="small" /></IconButton>
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
                          <Button variant="outlined" onClick={() => addTodo(m.id)} sx={{ borderColor: "rgba(131,60,11,0.45)", color: DND_THEME.leather, fontWeight: 800 }}>Add</Button>
                        </Stack>
                      </Paper>
                    );
                  })}
                </Stack>
              )}
            </TabPanel>

            {/* ABA 3: TIMELINE */}
            <TabPanel value={tabIndex} index={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.2 }}>
                <Typography variant="h6" sx={{ fontFamily: "Cinzel", color: DND_THEME.ink }}>Linha do Tempo</Typography>
                <Button startIcon={<AddRoundedIcon />} variant="outlined" onClick={() => setEventOpen(true)} sx={{ borderColor: "rgba(131,60,11,0.45)", color: DND_THEME.leather, fontWeight: 800 }}>
                  Evento Manual
                </Button>
              </Stack>

              <Box sx={{ position: "relative", pl: 2.2, borderLeft: `2px solid ${DND_THEME.gold}` }}>
                {timeline.map((ev) => (
                  <Box key={ev.id} sx={{ mb: 3, position: "relative" }}>
                    <Box sx={{ position: "absolute", left: -23, top: 0, width: 11, height: 11, borderRadius: "50%", bgcolor: DND_THEME.gold, border: "2px solid #fff8ea" }} />
                    <Typography variant="caption" sx={{ color: "rgba(44,26,16,0.6)", fontWeight: 700 }}>{fmtDateTime(ev.occurredAt)}</Typography>
                    <Paper elevation={0} sx={{ p: 1.5, mt: 0.5, bgcolor: "rgba(255,255,255,0.8)", border: "1px solid rgba(131,60,11,0.2)", borderRadius: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: DND_THEME.ink }}>{ev.title}</Typography>
                      {ev.note && <Typography variant="body2" sx={{ mt: 0.5 }}>{ev.note}</Typography>}
                      {ev.sessionTitle && (
                        <Chip 
                          label={`Sessão: ${ev.sessionTitle}`} 
                          size="small" 
                          component={Link} 
                          to={`/diario/${ev.sessionId}?${buildCampaignQuery({ campaignId, mode: campaignMode })}`}
                          clickable
                          sx={{ mt: 1, cursor: "pointer", bgcolor: "rgba(191,143,0,0.12)", border: "1px solid rgba(191,143,0,0.35)", color: DND_THEME.leather, fontWeight: 700 }} 
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
                  <Paper key={s.sessionId} variant="outlined" sx={{ p: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center", borderColor: "rgba(131,60,11,0.2)", bgcolor: "rgba(255,255,255,0.8)", borderRadius: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: DND_THEME.ink }}>{s.title}</Typography>
                      {s.note && <Typography variant="caption" sx={{ opacity: 0.8 }}>Nota: {s.note}</Typography>}
                    </Box>
                    <Button size="small" component={Link} to={`/diario/${s.sessionId}?${buildCampaignQuery({ campaignId, mode: campaignMode })}`} sx={{ borderColor: "rgba(131,60,11,0.45)", color: DND_THEME.leather, fontWeight: 800 }} variant="outlined">
                      Ver Sessão
                    </Button>
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