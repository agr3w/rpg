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
import { auth, database } from "APIs/firebaseConfig";
import { T_IN } from "config/transitions";
import { motion } from "framer-motion";
import RpgSection from "components/RpgSection";
import { RPG_TOKENS } from "theme/rpgTokens";
import { buildCampaignQuery } from "service/campaignPath";
import { useSessionLogs } from "hooks/useSessionLogs";
import { useDebounce } from "hooks/useDebounce";
import { fmtDate, fmtMonth } from "Utils/textHelpers";
import NovaCronicaModal from "components/DiarioCampanha/NovaCronicaModal";

// Ícones
import SearchIcon from "@mui/icons-material/Search";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import EditNoteIcon from "@mui/icons-material/EditNote";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

const DEFAULT_CAMPAIGN_ID = "default";

export default function SessionLog() {
  const user = auth.currentUser;
  const uid = user?.uid;

  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get("c") || DEFAULT_CAMPAIGN_ID;
  const campaignMode = searchParams.get("m") === "shared" ? "shared" : "legacy";

  const [status, setStatus] = useState({ type: "info", msg: "" });

  const [open, setOpen] = useState(false);
  const [fichas, setFichas] = useState([]);
  const [saving, setSaving] = useState(false);

  // Filtros
  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 200);
  const [tagFilter, setTagFilter] = useState([]);
  const [onlyLast10, setOnlyLast10] = useState(false);

  const {
    logs,
    loading,
    createLog: createLogAction,
  } = useSessionLogs(uid, campaignId, campaignMode);

  // Carregar fichas disponíveis do usuário para vincular à sessão
  useEffect(() => {
    if (!uid) {
      setFichas([]);
      return;
    }
    const fichasRef = database.ref(`fichas/${uid}`);
    const handleFichas = (snap) => {
      const data = snap.val();
      const arr = data
        ? Object.entries(data).map(([key, val]) => ({ id: key, ...val }))
        : [];
      arr.sort((a, b) => String(a.nome || "").localeCompare(String(b.nome || ""), "pt-BR"));
      setFichas(arr);
    };
    fichasRef.on("value", handleFichas);
    return () => fichasRef.off("value", handleFichas);
  }, [uid]);

  const tagOptions = useMemo(() => {
    const set = new Set();
    logs.forEach((l) => {
      (Array.isArray(l.tags) ? l.tags : []).forEach((t) => set.add(String(t)));
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [logs]);

  const filtered = useMemo(() => {
    const needle = debouncedQ.trim().toLowerCase();
    const tagsNeed = new Set(tagFilter.map((t) => String(t).toLowerCase()));

    const list = logs.filter((l) => {
      const matchText =
        !needle ||
        String(l.title || "").toLowerCase().includes(needle) ||
        String(l.summary || "").toLowerCase().includes(needle) ||
        (Array.isArray(l.tags) ? l.tags.join(" ").toLowerCase() : "").includes(needle);

      const logTags = new Set((Array.isArray(l.tags) ? l.tags : []).map((t) => String(t).toLowerCase()));
      const matchTags =
        tagsNeed.size === 0 || Array.from(tagsNeed).every((t) => logTags.has(t));

      return matchText && matchTags;
    });

    if (onlyLast10) {
      return list.slice(0, 10);
    }
    return list;
  }, [logs, debouncedQ, tagFilter, onlyLast10]);

  const grouped = useMemo(() => {
    const map = new Map();
    filtered.forEach((l) => {
      const label = fmtMonth(l.createdAt);
      if (!map.has(label)) map.set(label, []);
      map.get(label).push(l);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const handleSaveSession = async (newSessionData) => {
    setStatus({ type: "info", msg: "" });
    if (!uid) {
      setStatus({ type: "error", msg: "Usuário não autenticado." });
      return;
    }

    setSaving(true);
    try {
      await createLogAction({
        ...newSessionData,
        summary: newSessionData.content,
      });

      setOpen(false);
      setStatus({ type: "success", msg: "Crônica registrada com sucesso no tomo da campanha!" });
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || "Erro ao salvar crônica." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
        <RpgSection
          title="Diário de Campanha"
          subtitle="As crônicas de suas aventuras, registradas para a posteridade."
          actions={
            <Button
              variant="contained"
              startIcon={<HistoryEduIcon />}
              onClick={() => setOpen(true)}
              sx={{
                fontWeight: 800,
                bgcolor: "secondary.main",
                color: "#2c1a10",
                fontFamily: "Cinzel",
                "&:hover": { bgcolor: "secondary.dark" },
              }}
            >
              Escrever Sessão
            </Button>
          }
        >
          {status.msg ? <Alert severity={status.type} sx={{ mb: 2 }}>{status.msg}</Alert> : null}

          {/* Filtros Estilizados (Índice do Livro) */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: (t) => `1px solid ${t.palette.rpg?.stroke || "rgba(92, 64, 51, 0.2)"}`,
              bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(255, 251, 240, 0.6)"),
              mb: 3,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Detalhe decorativo de marcador */}
            <Box sx={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", bgcolor: "secondary.main" }} />

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
                        <SearchIcon sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                    sx: {
                      bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.5)"),
                      fontFamily: "Cinzel",
                    },
                  }}
                />

                <FormControlLabel
                  control={
                    <Switch 
                      checked={onlyLast10} 
                      onChange={(e) => setOnlyLast10(e.target.checked)} 
                      color="secondary"
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
                    sx={{
                      "& .MuiInputLabel-root": { fontFamily: "Cinzel" },
                      "& .MuiInputBase-root": {
                        bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.5)"),
                      },
                    }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip 
                      key={option}
                      label={option} 
                      size="small" 
                      {...getTagProps({ index })} 
                      sx={{ bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(229,179,36,0.15)" : "#e0d0b0"), fontWeight: 600 }}
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
                      <BookmarkBorderIcon sx={{ color: "secondary.main", mr: 1 }} />
                      <Typography variant="h6" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: "text.primary", letterSpacing: 1 }}>
                        {monthLabel}
                      </Typography>
                      <Divider sx={{ flexGrow: 1, ml: 2, borderColor: (t) => t.palette.rpg?.stroke || "rgba(255,255,255,0.1)" }} />
                    </Box>

                    <Stack spacing={2}>
                      {monthLogs.map((l) => (
                        <Paper
                          key={l.id}
                          component={Link}
                          to={`/diario/${l.id}?${buildCampaignQuery({ campaignId, mode: campaignMode })}`}
                          elevation={2}
                          sx={{
                            p: 2.5,
                            borderRadius: "2px 12px 12px 2px",
                            textDecoration: "none",
                            color: "text.primary",
                            bgcolor: (t) => (t.palette.mode === "dark" ? "#1e1814" : "#fffbf0"),
                            border: (t) => `1px solid ${t.palette.rpg?.stroke || "rgba(92, 64, 51, 0.3)"}`,
                            borderLeft: (t) => `4px solid ${t.palette.secondary.main}`,
                            transition: "transform 0.15s ease, box-shadow 0.15s ease",
                            position: "relative",
                            "&:hover": {
                              transform: "translateX(4px)",
                              boxShadow: (t) => (t.palette.mode === "dark" ? "0 8px 24px rgba(0,0,0,0.5)" : "0 8px 20px rgba(0,0,0,0.2)"),
                              "& .edit-icon": { opacity: 1 }
                            },
                          }}
                        >
                          <Stack spacing={1}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                              <Box>
                                <Typography variant="h6" sx={{ fontFamily: "Cinzel", fontWeight: 800, lineHeight: 1.2 }}>
                                  {l.sessionNumber ? `Sessão #${l.sessionNumber}: ` : ""}{l.title || "Sessão Sem Título"}
                                </Typography>
                                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                                  {fmtDate(l.createdAt)} {l.inGameDate ? `• ${l.inGameDate}` : ""}
                                </Typography>
                              </Box>
                              <EditNoteIcon className="edit-icon" sx={{ opacity: 0, transition: "opacity 0.2s", color: "primary.main" }} />
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
                                      bgcolor: (tTheme) => (tTheme.palette.mode === "dark" ? "rgba(212, 122, 55, 0.15)" : "rgba(131, 60, 11, 0.1)"), 
                                      color: "primary.main",
                                      border: (tTheme) => `1px solid ${tTheme.palette.rpg?.stroke || "rgba(131, 60, 11, 0.2)"}`
                                    }} 
                                  />
                                ))}
                              </Stack>
                            )}

                            <Divider sx={{ borderColor: (t) => t.palette.rpg?.stroke || "rgba(92, 64, 51, 0.15)" }} />

                            <Typography 
                              variant="body2" 
                              sx={{ 
                                opacity: 0.85, 
                                whiteSpace: "pre-wrap", 
                                fontFamily: "'Merriweather', serif",
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

      {/* Modal de Nova Crônica em Pergaminho & Runas */}
      <NovaCronicaModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSave={handleSaveSession}
        availableCharacters={fichas}
      />
    </Container>
  );
}