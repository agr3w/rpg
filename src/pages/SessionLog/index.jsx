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
} from "@mui/material";
import { Link, useSearchParams } from "react-router-dom"; // ✅ add
import { database, auth, firebase } from "APIs/firebaseConfig";
import { T_IN } from "config/transitions";
import { motion } from "framer-motion";

const DEFAULT_CAMPAIGN_ID = "default";

function fmtDate(ms) {
  if (!ms) return "—";
  try {
    return new Date(ms).toLocaleString("pt-BR");
  } catch {
    return "—";
  }
}

export default function SessionLog() {
  const user = auth.currentUser;
  const uid = user?.uid;

  const [searchParams] = useSearchParams(); // ✅
  const campaignId = searchParams.get("c") || DEFAULT_CAMPAIGN_ID; // ✅

  const [status, setStatus] = useState({ type: "info", msg: "" });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [saving, setSaving] = useState(false);

  const baseRef = useMemo(() => {
    if (!uid) return null;
    return database.ref(`users/${uid}/campaigns/${campaignId}`);
  }, [uid, campaignId]);

  useEffect(() => {
    if (!uid || !baseRef) {
      setLogs([]);
      setLoading(false);
      return;
    }

    // garante que existe uma campanha default (para evoluirmos depois)
    baseRef.child("meta").update({
      name: "Minha Campanha",
      updatedAt: firebase.database.ServerValue.TIMESTAMP,
    });

    const logsRef = baseRef.child("sessionLogs");

    const handle = (snap) => {
      const data = snap.val();
      const arr = data ? Object.values(data) : [];
      arr.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
      setLogs(arr);
      setLoading(false);
    };

    logsRef.on("value", handle);
    return () => logsRef.off("value", handle);
  }, [uid, baseRef]);

  const createLog = async () => {
    setStatus({ type: "info", msg: "" });
    if (!uid || !baseRef) {
      setStatus({ type: "error", msg: "Usuário não autenticado." });
      return;
    }
    const t = title.trim();
    const s = summary.trim();

    if (!t) {
      setStatus({ type: "warning", msg: "Informe um título para a sessão." });
      return;
    }

    setSaving(true);
    try {
      const logsRef = baseRef.child("sessionLogs");
      const newRef = logsRef.push();
      const id = newRef.key;

      await newRef.set({
        id,
        title: t,
        summary: s || "",
        tags: [],
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
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
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { duration: T_IN * 0.18 } }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            p: { xs: 2, md: 2.5 },
            border: "1px solid rgba(0,0,0,0.10)",
            bgcolor: "rgba(223, 214, 205, 0.92)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
          }}
        >
          <Stack spacing={0.75}>
            <Typography variant="h4" sx={{ fontWeight: 1000, color: "var(--rpg-ink)" }}>
              Diário de Campanha
            </Typography>
            <Typography sx={{ opacity: 0.85, color: "rgba(44,26,16,0.85)" }}>
              Registre cada sessão: decisões, NPCs, loot, XP e ganchos.
            </Typography>

            <Box sx={{ pt: 1 }}>
              <Button variant="contained" onClick={() => setOpen(true)} sx={{ fontWeight: 900 }}>
                Nova sessão
              </Button>
            </Box>
          </Stack>
        </Paper>

        {status.msg ? (
          <Alert severity={status.type} sx={{ mt: 2 }}>
            {status.msg}
          </Alert>
        ) : null}

        <Paper elevation={0} sx={{ mt: 2, p: { xs: 1.5, md: 2 }, borderRadius: 3, border: "1px solid rgba(0,0,0,0.10)" }}>
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
                  component={Link} // ✅ vira link
                  to={`/diario/${l.id}?c=${encodeURIComponent(campaignId)}`} // ✅ leva campaign junto
                  sx={{
                    p: 1.5,
                    borderRadius: 2.5,
                    border: "1px solid rgba(0,0,0,0.10)",
                    textDecoration: "none",
                    color: "inherit",
                    background: "linear-gradient(180deg, rgba(255,250,244,1) 0%, rgba(245,238,229,1) 100%)",
                    "&:hover": { borderColor: "rgba(131,60,11,0.45)" },
                  }}
                >
                  <Stack spacing={0.5}>
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ gap: 1, flexWrap: "wrap" }}>
                      <Typography sx={{ fontWeight: 950, color: "#2c1a10" }}>
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
      </motion.div>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nova sessão</DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} sx={{ mt: 1 }}>
            <TextField
              label="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              placeholder="Sessão 01 — A Taverna do Grifo"
            />
            <TextField
              label="Resumo"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              fullWidth
              multiline
              minRows={5}
              placeholder="O grupo investigou..., encontrou..., decidiu..."
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