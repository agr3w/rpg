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
import { Link } from "react-router-dom";
import { database } from "APIs/firebaseConfig";

function snippet(text, max = 110) {
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

export default function NpcCard({ uid, campaignId, npc }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const tags = useMemo(() => (Array.isArray(npc?.tags) ? npc.tags : []), [npc]);
  const desc = useMemo(() => snippet(npc?.description, 120), [npc]);
  const note = useMemo(() => snippet(npc?.lastSeenNote, 90), [npc]);

  const deleteNpc = async () => {
    if (!uid || !campaignId || !npc?.id) return;

    setDeleting(true);
    try {
      // remove NPC master
      await database
        .ref(`users/${uid}/campaigns/${campaignId}/npcs/${npc.id}`)
        .remove();

      // remove índices que apontem para esse npcId (scan simples, ok p/ volume baixo)
      const idxRef = database.ref(`users/${uid}/campaigns/${campaignId}/npcIndex`);
      const idxSnap = await idxRef.once("value");
      const idx = idxSnap.val() || {};

      const updates = {};
      Object.entries(idx).forEach(([k, v]) => {
        if (v?.npcId === npc.id) updates[k] = null;
      });

      if (Object.keys(updates).length) {
        await idxRef.update(updates);
      }

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
          background:
            "linear-gradient(180deg, rgba(255,250,244,1) 0%, rgba(245,238,229,1) 100%)",
          boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
        }}
      >
        {/* Header + imagem */}
        <Box
          sx={{
            position: "relative",
            height: 140,
            bgcolor: "rgba(44,26,16,0.06)",
          }}
        >
          {npc?.imageUrl ? (
            <Box
              component="img"
              src={npc.imageUrl}
              alt={npc?.name || "NPC"}
              loading="lazy"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                filter: "saturate(1.05) contrast(1.02)",
              }}
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "grid",
                placeItems: "center",
                background:
                  "radial-gradient(120% 120% at 20% 10%, rgba(131,60,11,0.25) 0%, rgba(0,0,0,0.02) 62%)",
              }}
            >
              <Typography sx={{ fontWeight: 1000, color: "rgba(44,26,16,0.75)" }}>
                {npc?.name ? npc.name.slice(0, 1).toUpperCase() : "?"}
              </Typography>
            </Box>
          )}

          {/* Ações rápidas flutuantes */}
          <Box sx={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 0.5 }}>
            <Tooltip title="Abrir NPC">
              <IconButton
                size="small"
                component={Link}
                to={`/npcs/${encodeURIComponent(npc.id)}?c=${encodeURIComponent(campaignId)}`}
                sx={{
                  bgcolor: "rgba(255,255,255,0.78)",
                  border: "1px solid rgba(0,0,0,0.10)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.92)" },
                }}
              >
                <OpenInNewRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Excluir NPC">
              <IconButton
                size="small"
                onClick={() => setConfirmOpen(true)}
                sx={{
                  bgcolor: "rgba(255,255,255,0.78)",
                  border: "1px solid rgba(0,0,0,0.10)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.92)" },
                }}
              >
                <DeleteRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Conteúdo */}
        <Box sx={{ p: 1.5 }}>
          <Stack spacing={0.75}>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ gap: 1 }}>
              <Typography sx={{ fontWeight: 1000, color: "#2c1a10" }} noWrap title={npc?.name || ""}>
                {npc?.name || "NPC"}
              </Typography>

              {npc?.lastSeenAt ? (
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  visto {fmtDate(npc.lastSeenAt)}
                </Typography>
              ) : null}
            </Stack>

            {desc ? (
              <Typography variant="body2" sx={{ opacity: 0.88, whiteSpace: "pre-wrap" }}>
                {desc}
              </Typography>
            ) : (
              <Typography variant="body2" sx={{ opacity: 0.65 }}>
                (Sem descrição)
              </Typography>
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
                {tags.slice(0, 4).map((t) => (
                  <Chip key={t} label={t} size="small" variant="outlined" />
                ))}
                {tags.length > 4 ? <Chip label={`+${tags.length - 4}`} size="small" /> : null}
              </Box>
            ) : null}

            <Button
              size="small"
              variant="outlined"
              component={Link}
              to={`/npcs/${encodeURIComponent(npc.id)}?c=${encodeURIComponent(campaignId)}`}
              sx={{ width: "fit-content", fontWeight: 900 }}
            >
              Abrir detalhes
            </Button>
          </Stack>
        </Box>
      </Paper>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Excluir NPC?</DialogTitle>
        <DialogContent>
          <Typography sx={{ opacity: 0.85 }}>
            Isso remove o NPC desta campanha. (Os “visto em sessões” podem continuar listando referências antigas.)
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={deleteNpc} disabled={deleting}>
            {deleting ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}