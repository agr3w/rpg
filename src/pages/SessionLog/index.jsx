import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
  Switch,
  FormControlLabel,
  InputAdornment,
} from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";
import { auth } from "APIs/firebaseConfig";
import { T_IN } from "config/transitions";
import { motion } from "framer-motion";
import RpgSection from "components/RpgSection";
import { RPG_TOKENS } from "theme/rpgTokens";
import { buildCampaignQuery } from "service/campaignPath";
import { useSessionLogs } from "hooks/useSessionLogs";
import { useDebounce } from "hooks/useDebounce";
import { fmtDate, fmtMonth, parseTags } from "Utils/textHelpers";

// Ícones
import SearchIcon from "@mui/icons-material/Search";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import EditNoteIcon from "@mui/icons-material/EditNote";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

const DEFAULT_CAMPAIGN_ID = "default";

// --- Estilos Visuais D&D ---
const DND_THEME = {
  ink: "#2c1a10",
  paperBg: "linear-gradient(135deg, #fffbf0 0%, #f3eacb 100%)",
  paperBorder: "1px solid rgba(92, 64, 51, 0.3)",
  goldAccent: "#bf8f00",
  leatherBg: "#2c1a10",
};

const SESSION_TEMPLATES = [
  { id: "livre", label: "Livre (Página em Branco)", build: () => "" },
  {
    id: "dnd_padrao",
    label: "Registro de Aventura (Padrão)",
    build: () =>
      [
        "📜 Resumo dos Eventos:",
        "-",
        "",
        "⚔️ Encontros & Combates:",
        "-",
        "",
        "👥 NPCs Encontrados:",
        "-",
        "",
        "💰 Tesouros & Recompensas:",
        "-",
        "",
        "🔜 Próximos Passos:",
        "-",
      ].join("\n"),
  },
];

export default function SessionLog() {
  const user = auth.currentUser;
  const uid = user?.uid;

  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get("c") || DEFAULT_CAMPAIGN_ID;
  const campaignMode = searchParams.get("m") === "shared" ? "shared" : "legacy";

  const [status, setStatus] = useState({ type: "info", msg: "" });

  const [open, setOpen] = useState(false);
  const [templateId, setTemplateId] = useState("dnd_padrao");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [tagsRaw, setTagsRaw] = useState("");
  const [saving, setSaving] = useState(false);

  // Filtros
  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 200);
  const [tagFilter, setTagFilter] = useState([]);
  const [onlyLast10, setOnlyLast10] = useState(false);

  const { logs, loading, createLog: createLogAction } = useSessionLogs(
    uid,
    campaignId,
    campaignMode,
    { limit: onlyLast10 ? 60 : 250 }
  );

  const applyTemplateIfEmpty = (nextTemplateId) => {
    const t = SESSION_TEMPLATES.find((x) => x.id === nextTemplateId) || SESSION_TEMPLATES[0];
    if (!String(summary || "").trim()) setSummary(t.build());
  };

  const tagOptions = useMemo(() => {
    const set = new Set();
    logs.forEach((l) => (Array.isArray(l?.tags) ? l.tags : []).forEach((t) => set.add(String(t))));
    return Array.from(set)
      .filter(Boolean)
      .sort((a, b) => String(a).localeCompare(String(b), "pt-BR"));
  }, [logs]);

  const filtered = useMemo(() => {
    const needle = debouncedQ.trim().toLowerCase();
    const needTags = new Set(tagFilter.map((t) => String(t).toLowerCase()));

    const hitText = (l) => {
      if (!needle) return true;
      const t = String(l?.title || "").toLowerCase();
      const s = String(l?.summary || "").toLowerCase();
      const tags = Array.isArray(l?.tags) ? l.tags.join(" ").toLowerCase() : "";
      return t.includes(needle) || s.includes(needle) || tags.includes(needle);
    };

    const hitTags = (l) => {
      if (!needTags.size) return true;
      const tags = new Set((Array.isArray(l?.tags) ? l.tags : []).map((t) => String(t).toLowerCase()));
      for (const t of needTags) if (!tags.has(t)) return false;
      return true;
    };

    const arr = logs.filter((l) => hitText(l) && hitTags(l));
    return onlyLast10 ? arr.slice(0, 10) : arr;
  }, [logs, debouncedQ, tagFilter, onlyLast10]);

  const grouped = useMemo(() => {
    const map = new Map();
    filtered.forEach((l) => {
      const label = fmtMonth(l?.createdAt);
      if (!map.has(label)) map.set(label, []);
      map.get(label).push(l);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const createLog = async () => {
    setStatus({ type: "info", msg: "" });
    if (!uid) {
      setStatus({ type: "error", msg: "Usuário não autenticado." });
      return;
    }

    setSaving(true);
    try {
      await createLogAction({
        title,
        summary,
        tags: parseTags(tagsRaw),
      });

      setOpen(false);
      setTitle("");
      setSummary("");
      setTagsRaw("");
      setStatus({ type: "success", msg: "Sessão adicionada ao diário." });
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || "Erro ao salvar sessão." });
    } finally {
      setSaving(false);
    }
  };

  const draftTags = useMemo(() => parseTags(tagsRaw), [tagsRaw]);

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { duration: T_IN * 0.18 } }}>
        <RpgSection
          title="Diário de Campanha"
          subtitle="As crônicas de suas aventuras, registradas para a posteridade."
          actions={
            <Button
              variant="contained"
              startIcon={<HistoryEduIcon />}
              onClick={() => {
                setOpen(true);
                applyTemplateIfEmpty(templateId);
              }}
              sx={{
                fontWeight: 800,
                bgcolor: DND_THEME.goldAccent,
                color: "#2c1a10",
                fontFamily: "Cinzel",
                "&:hover": { bgcolor: "#a67c00" },
              }}
            >
              Escrever Sessão
            </Button>
          }
        >
          {status.msg ? <Alert severity={status.type} sx={{ mb: 2 }}>{status.msg}</Alert> : null}

          {/* ✅ Filtros Estilizados (Índice do Livro) */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid rgba(92, 64, 51, 0.2)",
              bgcolor: "rgba(255, 251, 240, 0.6)", // Translúcido
              mb: 3,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Detalhe decorativo de "marcador de página" */}
            <Box sx={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", bgcolor: DND_THEME.goldAccent }} />

            <Stack spacing={2}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
                <TextField
                  size="small"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Buscar nas crônicas..."
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "rgba(44, 26, 16, 0.5)" }} />
                      </InputAdornment>
                    ),
                    sx: { bgcolor: "rgba(255,255,255,0.5)", fontFamily: "Cinzel" }
                  }}
                />

                <FormControlLabel
                  control={
                    <Switch 
                      checked={onlyLast10} 
                      onChange={(e) => setOnlyLast10(e.target.checked)} 
                      color="warning"
                    />
                  }
                  label={<Typography variant="body2" sx={{ fontFamily: "Cinzel", fontWeight: 700 }}>Últimas 10</Typography>}
                />
              </Stack>

              <Autocomplete
                multiple
                size="small"
                options={tagOptions}
                value={tagFilter}
                onChange={(_, v) => setTagFilter(v)}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Filtrar por Tags" 
                    placeholder="Selecione..." 
                    sx={{ "& .MuiInputLabel-root": { fontFamily: "Cinzel" } }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip 
                      label={option} 
                      size="small" 
                      {...getTagProps({ index })} 
                      sx={{ bgcolor: "#e0d0b0", color: "#2c1a10", fontWeight: 600 }}
                    />
                  ))
                }
              />
            </Stack>
          </Paper>

          {/* ✅ Lista de Sessões (Páginas do Diário) */}
          <Box sx={{ position: "relative", minHeight: 200 }}>
            {loading ? (
              <Typography sx={{ textAlign: "center", mt: 4, fontStyle: "italic", color: "rgba(255,255,255,0.5)" }}>
                Consultando os arquivos...
              </Typography>
            ) : filtered.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: "center", bgcolor: "rgba(0,0,0,0.2)", color: "#fff" }}>
                <AutoStoriesIcon sx={{ fontSize: 40, opacity: 0.5, mb: 1 }} />
                <Typography>Nenhuma crônica encontrada.</Typography>
              </Paper>
            ) : (
              <Stack spacing={4}>
                {grouped.map(([monthLabel, monthLogs]) => (
                  <Box key={monthLabel}>
                    {/* Cabeçalho do Mês (Capítulo) */}
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <BookmarkBorderIcon sx={{ color: DND_THEME.goldAccent, mr: 1 }} />
                      <Typography variant="h6" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: "#fff", letterSpacing: 1 }}>
                        {monthLabel}
                      </Typography>
                      <Divider sx={{ flexGrow: 1, ml: 2, borderColor: "rgba(255,255,255,0.1)" }} />
                    </Box>

                    <Stack spacing={2}>
                      {monthLogs.map((l) => (
                        <Paper
                          key={l.id}
                          component={Link}
                          to={`/diario/${l.id}?${buildCampaignQuery({ campaignId, mode: campaignMode })}`}
                          elevation={3}
                          sx={{
                            p: 2.5,
                            borderRadius: "2px 12px 12px 2px", // Canto arredondado estilo página
                            textDecoration: "none",
                            color: DND_THEME.ink,
                            background: DND_THEME.paperBg,
                            border: DND_THEME.paperBorder,
                            borderLeft: `4px solid ${DND_THEME.goldAccent}`, // Lombada
                            transition: "all 0.3s ease",
                            position: "relative",
                            "&:hover": {
                              transform: "translateX(4px) scale(1.01)",
                              boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                              "& .edit-icon": { opacity: 1 }
                            },
                          }}
                        >
                          <Stack spacing={1}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                              <Box>
                                <Typography variant="h6" sx={{ fontFamily: "Cinzel", fontWeight: 800, lineHeight: 1.2 }}>
                                  {l.title || "Sessão Sem Título"}
                                </Typography>
                                <Typography variant="caption" sx={{ color: "rgba(44, 26, 16, 0.6)", fontWeight: 600 }}>
                                  {fmtDate(l.createdAt)}
                                </Typography>
                              </Box>
                              <EditNoteIcon className="edit-icon" sx={{ opacity: 0, transition: "opacity 0.2s", color: "#833c0b" }} />
                            </Stack>

                            {Array.isArray(l?.tags) && l.tags.length > 0 && (
                              <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap", gap: 0.5 }}>
                                {l.tags.slice(0, 6).map((t) => (
                                  <Chip 
                                    key={t} 
                                    label={t} 
                                    size="small" 
                                    sx={{ 
                                      height: 20, 
                                      fontSize: "0.65rem", 
                                      bgcolor: "rgba(131, 60, 11, 0.1)", 
                                      color: "#58180D",
                                      border: "1px solid rgba(131, 60, 11, 0.2)"
                                    }} 
                                  />
                                ))}
                              </Stack>
                            )}

                            <Divider sx={{ borderColor: "rgba(92, 64, 51, 0.15)" }} />

                            <Typography 
                              variant="body2" 
                              sx={{ 
                                opacity: 0.85, 
                                whiteSpace: "pre-wrap", 
                                fontFamily: "'Merriweather', serif", // Fonte serifada para leitura
                                maxHeight: 60,
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {l.summary || "(Sem resumo registrado...)"}
                            </Typography>
                          </Stack>
                        </Paper>
                      ))}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        </RpgSection>
      </motion.div>

      {/* ✅ Dialog de Criação (Mesa de Escrita) */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            background: "#fdf6e3",
            backgroundImage: `url("https://www.transparenttextures.com/patterns/aged-paper.png"), linear-gradient(to bottom, #fffbf0, #f3eacb)`,
            border: "4px double #5c4033",
            borderRadius: 2
          }
        }}
      >
        <DialogTitle sx={{ fontFamily: "Cinzel", fontWeight: 900, color: "#58180D", textAlign: "center", borderBottom: "1px solid rgba(92,64,51,0.2)" }}>
          Nova Crônica
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ fontFamily: "Cinzel" }}>Modelo de Registro</InputLabel>
              <Select
                value={templateId}
                label="Modelo de Registro"
                onChange={(e) => {
                  const next = e.target.value;
                  setTemplateId(next);
                  applyTemplateIfEmpty(next);
                }}
                sx={{ fontFamily: "Cinzel" }}
              >
                {SESSION_TEMPLATES.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Título da Sessão"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              placeholder="Ex: A Queda do Rei Louco"
              variant="outlined"
              sx={{
                "& .MuiInputBase-root": { bgcolor: "rgba(255,255,255,0.5)" }
              }}
            />

            <TextField
              label="Tags (separadas por vírgula)"
              value={tagsRaw}
              onChange={(e) => setTagsRaw(e.target.value)}
              fullWidth
              placeholder="dungeon, boss, level-up"
              size="small"
            />
            
            {draftTags.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                {draftTags.map((t) => (
                  <Chip key={t} label={t} size="small" sx={{ bgcolor: "#e0d0b0" }} />
                ))}
              </Stack>
            )}

            <TextField
              label="Conteúdo do Diário"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              fullWidth
              multiline
              minRows={8}
              placeholder="Escreva aqui os feitos do grupo..."
              sx={{
                "& .MuiInputBase-root": { 
                  bgcolor: "rgba(255,255,255,0.3)",
                  fontFamily: "'Merriweather', serif",
                  fontSize: "0.95rem",
                  lineHeight: 1.6
                }
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid rgba(92,64,51,0.2)", bgcolor: "rgba(92,64,51,0.05)" }}>
          <Button onClick={() => setOpen(false)} sx={{ color: "#5c4033" }}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={createLog} 
            disabled={saving}
            sx={{ 
              bgcolor: "#833c0b", 
              fontFamily: "Cinzel", 
              fontWeight: 700,
              "&:hover": { bgcolor: "#5e2708" },
            }}
          >
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}