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
import { buildCampaignQuery, getCampaignBasePath } from "service/campaignPath";
import { fmtDate } from "Utils/textHelpers";

function snippet(text, max = 110) {
  const t = String(text || "").trim();
  if (!t) return "";
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
}

function NpcCard({ uid, campaignId, campaignMode = "legacy", npc }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const campaignBasePath = useMemo(
    () => getCampaignBasePath({ uid, campaignId, mode: campaignMode }),
    [uid, campaignId, campaignMode]
  );

  const tags = useMemo(() => (Array.isArray(npc?.tags) ? npc.tags : []), [npc]);
  const desc = useMemo(() => snippet(npc?.description, 120), [npc]);
  const note = useMemo(() => snippet(npc?.lastSeenNote, 90), [npc]);
  const objective = useMemo(() => snippet(npc?.objective || npc?.goal, 80), [npc]);
  const attitude = useMemo(() => snippet(npc?.attitude || "", 40), [npc]);

  const deleteNpc = async () => {
    if (!campaignBasePath || !npc?.id) return;

    setDeleting(true);
    try {
      // remove NPC master
      await database
        .ref(`${campaignBasePath}/npcs/${npc.id}`)
        .remove();

      // remove índices que apontem para esse npcId (scan simples, ok p/ volume baixo)
      const idxRef = database.ref(`${campaignBasePath}/npcIndex`);
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
          border: "1px solid rgba(191,143,0,0.35)",
          overflow: "hidden",
          bgcolor: (t) => (t.palette.mode === "dark" ? "#1e1814" : "#fff8e8"),
          backgroundImage: (t) => t.palette.rpg?.paperBg || "none",
          border: (t) => `1px solid ${t.palette.rpg?.stroke || "rgba(191,143,0,0.22)"}`,
          boxShadow: (t) => (t.palette.mode === "dark" ? "0 10px 24px rgba(0,0,0,0.5)" : "0 10px 24px rgba(0,0,0,0.16)"),
          transition: "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
          position: "relative",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: (t) => (t.palette.mode === "dark" ? "0 14px 28px rgba(0,0,0,0.7)" : "0 14px 28px rgba(0,0,0,0.22)"),
            borderColor: "secondary.main",
          },
        }}
      >
        <Box sx={{ p: 1.5, pt: 2 }}>
          <Stack alignItems="center" spacing={1.2}>
            <Box
              sx={{
                width: 116,
                height: 116,
                borderRadius: "50%",
                border: (t) => `3px solid ${t.palette.rpg?.stroke || "rgba(131,60,11,0.55)"}`,
                boxShadow: (t) => `0 0 0 4px ${t.palette.mode === "dark" ? "rgba(229,179,36,0.15)" : "rgba(191,143,0,0.22)"}`,
                overflow: "hidden",
                bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(44,26,16,0.10)"),
                display: "grid",
                placeItems: "center",
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
                  }}
                />
              ) : (
                <Typography sx={{ fontWeight: 1000, color: "text.secondary", fontSize: 38 }}>
                  {npc?.name ? npc.name.slice(0, 1).toUpperCase() : "?"}
                </Typography>
              )}
            </Box>

            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap justifyContent="center">
              {attitude ? <Chip label={`Atitude: ${attitude}`} size="small" sx={{ bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(212,122,55,0.15)" : "rgba(131,60,11,0.1)") }} /> : null}
              {npc?.faction ? <Chip label={`Facção: ${npc.faction}`} size="small" sx={{ bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(229,179,36,0.15)" : "rgba(191,143,0,0.12)") }} /> : null}
            </Stack>
          </Stack>

          <Box sx={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 0.5 }}>
            <Tooltip title="Abrir NPC">
              <IconButton
                size="small"
                component={Link}
                to={`/npcs/${encodeURIComponent(npc.id)}?${buildCampaignQuery({ campaignId, mode: campaignMode })}`}
                sx={{
                  bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.78)"),
                  border: (t) => `1px solid ${t.palette.rpg?.stroke || "rgba(0,0,0,0.10)"}`,
                  "&:hover": { bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.92)") },
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
                  bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.78)"),
                  border: (t) => `1px solid ${t.palette.rpg?.stroke || "rgba(0,0,0,0.10)"}`,
                  "&:hover": { bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.92)") },
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
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ gap: 1, mt: -0.5 }}>
              <Typography sx={{ fontWeight: 1000, color: "text.primary" }} noWrap title={npc?.name || ""}>
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

            {objective ? (
              <Paper
                elevation={0}
                sx={{
                  p: 1,
                  borderRadius: 2,
                  border: "1px dashed rgba(131,60,11,0.25)",
                  bgcolor: "rgba(191,143,0,0.07)",
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 900, opacity: 0.9 }}>
                  Objetivo em cena
                </Typography>
                <Typography variant="caption" sx={{ display: "block", opacity: 0.85 }}>
                  {objective}
                </Typography>
              </Paper>
            ) : null}

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
              to={`/npcs/${encodeURIComponent(npc.id)}?${buildCampaignQuery({ campaignId, mode: campaignMode })}`}
              sx={{ width: "fit-content", fontWeight: 900, borderColor: "rgba(131,60,11,0.35)", color: "#5a2811" }}
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

export default React.memo(NpcCard);