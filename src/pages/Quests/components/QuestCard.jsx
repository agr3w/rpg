import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { Link } from "react-router-dom";
import { database, firebase } from "APIs/firebaseConfig";

function snippet(text, max = 120) {
  const t = String(text || "").trim();
  if (!t) return "";
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
}

function fmtDate(ms) {
  if (!ms) return "";
  try {
    return new Date(ms).toLocaleDateString("pt-BR");
  } catch {
    return "";
  }
}

function statusMeta(status) {
  switch (status) {
    case "concluida":
      return { label: "Concluída", color: "success" };
    case "ativa":
      return { label: "Ativa", color: "warning" };
    case "pendente":
    default:
      return { label: "Pendente", color: "default" };
  }
}

export default function QuestCard({ uid, campaignId, quest }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [marking, setMarking] = useState(false);

  const tags = useMemo(() => (Array.isArray(quest?.tags) ? quest.tags : []), [quest]);
  const desc = useMemo(() => snippet(quest?.description, 120), [quest]);
  const note = useMemo(() => snippet(quest?.lastSeenNote, 90), [quest]);
  const st = statusMeta(quest?.currentStatus);

  const markDone = async () => {
    if (!uid || !campaignId || !quest?.id) return;
    setMarking(true);
    try {
      await database.ref(`users/${uid}/campaigns/${campaignId}/quests/${quest.id}`).update({
        currentStatus: "concluida",
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });
    } finally {
      setMarking(false);
    }
  };

  const deleteQuest = async () => {
    if (!uid || !campaignId || !quest?.id) return;

    setDeleting(true);
    try {
      await database.ref(`users/${uid}/campaigns/${campaignId}/quests/${quest.id}`).remove();

      // remove índices que apontem para esse questId
      const idxRef = database.ref(`users/${uid}/campaigns/${campaignId}/questIndex`);
      const idxSnap = await idxRef.once("value");
      const idx = idxSnap.val() || {};

      const updates = {};
      Object.entries(idx).forEach(([k, v]) => {
        if (v?.questId === quest.id) updates[k] = null;
      });

      if (Object.keys(updates).length) await idxRef.update(updates);

      setConfirmOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid rgba(0,0,0,0.10)",
          overflow: "hidden",
          background: "linear-gradient(180deg, rgba(255,250,244,1) 0%, rgba(245,238,229,1) 100%)",
          boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
        }}
      >
        <Box sx={{ p: 1.5 }}>
          <Stack spacing={0.9}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ gap: 1 }}>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 1000, color: "#2c1a10" }} noWrap title={quest?.title || ""}>
                  {quest?.title || "Quest"}
                </Typography>

                <Stack direction="row" spacing={0.75} sx={{ mt: 0.6, flexWrap: "wrap", gap: 0.75 }}>
                  <Chip size="small" label={st.label} color={st.color} variant="outlined" />
                  {quest?.lastSeenAt ? (
                    <Chip size="small" label={`visto ${fmtDate(quest.lastSeenAt)}`} variant="outlined" />
                  ) : null}
                </Stack>
              </Box>

              <Stack direction="row" spacing={0.5} alignItems="center">
                <Tooltip title="Marcar concluída">
                  <span>
                    <IconButton size="small" onClick={markDone} disabled={marking || quest?.currentStatus === "concluida"}>
                      <CheckCircleRoundedIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>

                <Tooltip title="Abrir Quest">
                  <IconButton
                    size="small"
                    component={Link}
                    to={`/quests/${encodeURIComponent(quest.id)}?c=${encodeURIComponent(campaignId)}`}
                  >
                    <OpenInNewRoundedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Excluir Quest">
                  <IconButton size="small" onClick={() => setConfirmOpen(true)}>
                    <DeleteRoundedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>

            {desc ? (
              <Typography variant="body2" sx={{ opacity: 0.88, whiteSpace: "pre-wrap" }}>
                {desc}
              </Typography>
            ) : (
              <Typography variant="body2" sx={{ opacity: 0.65 }}>(Sem descrição)</Typography>
            )}

            {note ? (
              <Paper
                elevation={0}
                sx={{
                  p: 1,
                  borderRadius: 2,
                  border: "1px dashed rgba(0,0,0,0.18)",
                  bgcolor: "rgba(0,0,0,0.02)",
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 900, opacity: 0.9 }}>
                  Última nota rápida
                </Typography>
                <Typography variant="caption" sx={{ display: "block", opacity: 0.85 }}>
                  {note}
                </Typography>
              </Paper>
            ) : null}

            {tags.length ? (
              <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                {tags.slice(0, 5).map((t) => (
                  <Chip key={t} label={t} size="small" variant="outlined" />
                ))}
                {tags.length > 5 ? <Chip label={`+${tags.length - 5}`} size="small" /> : null}
              </Box>
            ) : null}

            <Button
              size="small"
              variant="outlined"
              component={Link}
              to={`/quests/${encodeURIComponent(quest.id)}?c=${encodeURIComponent(campaignId)}`}
              sx={{ width: "fit-content", fontWeight: 900 }}
            >
              Abrir detalhes
            </Button>
          </Stack>
        </Box>
      </Paper>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Excluir Quest?</DialogTitle>
        <DialogContent>
          <Typography sx={{ opacity: 0.85 }}>
            Isso remove a quest desta campanha. As referências antigas em sessões podem continuar existindo.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={deleteQuest} disabled={deleting}>
            {deleting ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}