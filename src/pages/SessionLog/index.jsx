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
} from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";
import { auth } from "APIs/firebaseConfig";
import { T_IN } from "config/transitions";
import { motion } from "framer-motion";
import RpgSection from "components/RpgSection";
import { RPG_TOKENS } from "theme/rpgTokens";
import {
  createSessionLog,
  ensureCampaignMeta,
  listenSessionLogs,
} from "service/sessionLogService";

const DEFAULT_CAMPAIGN_ID = "default";

function fmtDate(ms) {
  if (!ms) return "—";
  try {
    return new Date(ms).toLocaleString("pt-BR");
  } catch {
    return "—";
  }
}

const SESSION_TEMPLATES = [
  {
    id: "livre",
    label: "Livre",
    build: () => "",
  },
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
  const [saving, setSaving] = useState(false);

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
        tags: [],
      });

      setOpen(false);
      setTitle("");
      setSummary("");
      setStatus({ type: "success", msg: "Sessão adicionada ao diário." });
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || "Erro ao salvar sessão." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0, transition: { duration: T_IN * 0.18 } }}
      >
        <RpgSection
          title="Diário de Campanha"
          subtitle="Registre cada sessão: decisões, NPCs, loot, XP e ganchos."
          actions={
            <Button variant="contained" onClick={() => { setOpen(true); applyTemplateIfEmpty(templateId); }} sx={{ fontWeight: 900 }}>
              Nova sessão
            </Button>
          }
        >
          {status.msg ? <Alert severity={status.type}>{status.msg}</Alert> : null}

          <Paper elevation={0} sx={{ p: { xs: 1.5, md: 2 }, borderRadius: 3, border: RPG_TOKENS.border, bgcolor: "transparent" }}>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
              Sessões
            </Typography>
            <Divider sx={{ mb: 1.5 }} />

            {loading ? (
              <Typography sx={{ opacity: 0.8 }}>Carregando…</Typography>
            ) : logs.length === 0 ? (
              <Typography sx={{ opacity: 0.85 }}>Nenhuma sessão ainda. Crie a primeira.</Typography>
            ) : (
              <Stack spacing={1.25}>
                {logs.map((l) => (
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
                    <Stack spacing={0.5}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="baseline"
                        sx={{ gap: 1, flexWrap: "wrap" }}
                      >
                        <Typography sx={{ fontWeight: 950, color: RPG_TOKENS.ink }}>
                          {l.title || "—"}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.75 }}>
                          {fmtDate(l.createdAt)}
                        </Typography>
                      </Stack>

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