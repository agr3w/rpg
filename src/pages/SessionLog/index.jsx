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
} from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";
import { auth } from "APIs/firebaseConfig";
import { T_IN } from "config/transitions";
import { motion } from "framer-motion";
import RpgSection from "./components/RpgSection";
import { RPG_TOKENS } from "theme/rpgTokens";
import { createSessionLog, ensureCampaignMeta, listenSessionLogs } from "service/sessionLogService";

const DEFAULT_CAMPAIGN_ID = "default";

function fmtDate(ms) {
  if (!ms) return "—";
  try {
    return new Date(ms).toLocaleString("pt-BR");
  } catch {
    return "—";
  }
}

function fmtMonth(ms) {
  if (!ms) return "Sem data";
  try {
    const d = new Date(ms);
    const label = d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
    return label.charAt(0).toUpperCase() + label.slice(1);
  } catch {
    return "Sem data";
  }
}

function parseTags(raw) {
  return String(raw || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 16);
}

const SESSION_TEMPLATES = [
  { id: "livre", label: "Livre", build: () => "" },
  {
    id: "dnd_padrao",
    label: "D&D 5e (padrão)",
    build: () =>
      [
        "Resumo rápido:",
        "-",
        "",
        "Cenas / Eventos:",
        "-",
        "",
        "NPCs importantes:",
        "-",
        "",
        "Loot / Recompensas:",
        "-",
        "",
        "Próximos passos (objetivos):",
        "-",
      ].join("\n"),
  },
];

export default function SessionLog() {
  const user = auth.currentUser;
  const uid = user?.uid;

  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get("c") || DEFAULT_CAMPAIGN_ID;

  const [status, setStatus] = useState({ type: "info", msg: "" });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [templateId, setTemplateId] = useState("dnd_padrao");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [tagsRaw, setTagsRaw] = useState("");
  const [saving, setSaving] = useState(false);

  // ✅ filtros
  const [q, setQ] = useState("");
  const [tagFilter, setTagFilter] = useState([]); // array de strings
  const [onlyLast10, setOnlyLast10] = useState(false);

  useEffect(() => {
    if (!uid) {
      setLogs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    ensureCampaignMeta({ uid, campaignId }).catch(() => {});

    const off = listenSessionLogs({
      uid,
      campaignId,
      onValue: (arr) => {
        setLogs(arr);
        setLoading(false);
      },
    });

    return () => off();
  }, [uid, campaignId]);

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
    const needle = q.trim().toLowerCase();
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
  }, [logs, q, tagFilter, onlyLast10]);

  const grouped = useMemo(() => {
    const map = new Map(); // label -> logs[]
    filtered.forEach((l) => {
      const label = fmtMonth(l?.createdAt);
      if (!map.has(label)) map.set(label, []);
      map.get(label).push(l);
    });
    return Array.from(map.entries()); // mantém ordem do filtered (já vem desc)
  }, [filtered]);

  const createLog = async () => {
    setStatus({ type: "info", msg: "" });
    if (!uid) {
      setStatus({ type: "error", msg: "Usuário não autenticado." });
      return;
    }

    setSaving(true);
    try {
      await createSessionLog({
        uid,
        campaignId,
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
          subtitle="Registre cada sessão: decisões, NPCs, loot, XP e ganchos."
          actions={
            <Button
              variant="contained"
              onClick={() => {
                setOpen(true);
                applyTemplateIfEmpty(templateId);
              }}
              sx={{ fontWeight: 900 }}
            >
              Nova sessão
            </Button>
          }
        >
          {status.msg ? <Alert severity={status.type}>{status.msg}</Alert> : null}

          {/* ✅ Filtros */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 1.5, md: 2 },
              borderRadius: 3,
              border: RPG_TOKENS.border,
              bgcolor: "transparent",
              mb: 1.5,
            }}
          >
            <Stack spacing={1}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={1} alignItems={{ md: "center" }}>
                <TextField
                  label="Buscar"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="título, resumo, tags..."
                  fullWidth
                />

                <FormControlLabel
                  control={<Switch checked={onlyLast10} onChange={(e) => setOnlyLast10(e.target.checked)} />}
                  label="Últimas 10"
                />
              </Stack>

              <Autocomplete
                multiple
                options={tagOptions}
                value={tagFilter}
                onChange={(_, v) => setTagFilter(v)}
                renderInput={(params) => <TextField {...params} label="Filtrar por tags" placeholder="Selecione tags" />}
              />

              {tagFilter.length ? (
                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                  {tagFilter.map((t) => (
                    <Chip key={t} label={t} onDelete={() => setTagFilter((arr) => arr.filter((x) => x !== t))} />
                  ))}
                </Stack>
              ) : null}
            </Stack>
          </Paper>

          {/* ✅ Lista com agrupamento */}
          <Paper elevation={0} sx={{ p: { xs: 1.5, md: 2 }, borderRadius: 3, border: RPG_TOKENS.border, bgcolor: "transparent" }}>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
              Sessões
            </Typography>
            <Divider sx={{ mb: 1.5 }} />

            {loading ? (
              <Typography sx={{ opacity: 0.8 }}>Carregando…</Typography>
            ) : filtered.length === 0 ? (
              <Typography sx={{ opacity: 0.85 }}>Nenhuma sessão encontrada com esses filtros.</Typography>
            ) : (
              <Stack spacing={2}>
                {grouped.map(([monthLabel, monthLogs]) => (
                  <Box key={monthLabel}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 950, mb: 0.75, color: RPG_TOKENS.ink }}>
                      {monthLabel}
                    </Typography>

                    <Stack spacing={1.25}>
                      {monthLogs.map((l) => (
                        <Paper
                          key={l.id}
                          elevation={0}
                          component={Link}
                          to={`/diario/${l.id}?c=${encodeURIComponent(campaignId)}`}
                          sx={{
                            p: 1.5,
                            borderRadius: 2.5,
                            border: RPG_TOKENS.border,
                            textDecoration: "none",
                            color: "inherit",
                            background: RPG_TOKENS.cardBg,
                            "&:hover": { borderColor: RPG_TOKENS.hoverBorder },
                          }}
                        >
                          <Stack spacing={0.75}>
                            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ gap: 1, flexWrap: "wrap" }}>
                              <Typography sx={{ fontWeight: 950, color: RPG_TOKENS.ink }}>
                                {l.title || "—"}
                              </Typography>
                              <Typography variant="caption" sx={{ opacity: 0.75 }}>
                                {fmtDate(l.createdAt)}
                              </Typography>
                            </Stack>

                            {Array.isArray(l?.tags) && l.tags.length ? (
                              <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap", gap: 0.75 }}>
                                {l.tags.slice(0, 8).map((t) => (
                                  <Chip key={t} label={t} size="small" variant="outlined" />
                                ))}
                                {l.tags.length > 8 ? <Chip label={`+${l.tags.length - 8}`} size="small" /> : null}
                              </Stack>
                            ) : null}

                            {l.summary ? (
                              <Typography variant="body2" sx={{ opacity: 0.92, whiteSpace: "pre-wrap" }}>
                                {l.summary}
                              </Typography>
                            ) : (
                              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                                (Sem resumo)
                              </Typography>
                            )}
                          </Stack>
                        </Paper>
                      ))}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>
        </RpgSection>
      </motion.div>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nova sessão</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1.5}>
            <FormControl fullWidth size="small">
              <InputLabel id="tpl-label">Template</InputLabel>
              <Select
                labelId="tpl-label"
                label="Template"
                value={templateId}
                onChange={(e) => {
                  const next = e.target.value;
                  setTemplateId(next);
                  applyTemplateIfEmpty(next);
                }}
              >
                {SESSION_TEMPLATES.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              placeholder="Sessão 01 — A Taverna do Grifo"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  createLog();
                }
              }}
            />

            {/* ✅ tags */}
            <TextField
              label="Tags (separadas por vírgula)"
              value={tagsRaw}
              onChange={(e) => setTagsRaw(e.target.value)}
              fullWidth
              placeholder="Ex.: combate, cidade, dungeon"
            />
            {draftTags.length ? (
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                {draftTags.map((t) => (
                  <Chip key={t} label={t} size="small" variant="outlined" />
                ))}
              </Stack>
            ) : null}

            <TextField
              label="Resumo"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              fullWidth
              multiline
              minRows={7}
              placeholder="O grupo investigou..., encontrou..., decidiu..."
              onKeyDown={(e) => {
                // Ctrl+Enter salva; Enter normal mantém quebra de linha
                if (e.key === "Enter" && e.ctrlKey) {
                  e.preventDefault();
                  createLog();
                }
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={createLog} disabled={saving}>
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}