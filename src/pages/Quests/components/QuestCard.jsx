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

function statusMeta(status) {
  switch (status) {
    case "concluida":
      return { label: "Concluída", color: "#2e7d32", bg: "#e8f5e9", border: "#a5d6a7" };
    case "ativa":
      return { label: "Ativa", color: "#e65100", bg: "#fff3e0", border: "#ffcc80" };
    case "pendente":
    default:
      return { label: "Pendente", color: "#424242", bg: "#f5f5f5", border: "#e0e0e0" };
  }
}

export default function QuestCard({ uid, campaignId, quest }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [marking, setMarking] = useState(false);

  const tags = useMemo(() => (Array.isArray(quest?.tags) ? quest.tags : []), [quest]);
  const desc = useMemo(() => snippet(quest?.description, 100), [quest]);
  const st = statusMeta(quest?.currentStatus);

  const markDone = async (e) => {
    e.preventDefault();
    e.stopPropagation();
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
      // Limpeza de índices omitida para brevidade, mas idealmente deve existir
      setConfirmOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Paper
        component={Link}
        to={`/quests/${encodeURIComponent(quest.id)}?c=${encodeURIComponent(campaignId)}`}
        elevation={0}
        sx={{
          textDecoration: "none",
          borderRadius: 2,
          overflow: "hidden",
          position: "relative",
          background: "#fffbf0",
          backgroundImage: `linear-gradient(to bottom right, #fffbf0, #f7f1e3)`,
          border: "1px solid rgba(92, 64, 51, 0.2)",
          transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 24px -4px rgba(0,0,0,0.2)",
            borderColor: "#bf8f00",
            "& .quest-title": { color: "#bf8f00" }
          }
        }}
      >
        {/* Faixa de Status Lateral */}
        <Box 
          sx={{ 
            position: "absolute", 
            left: 0, 
            top: 0, 
            bottom: 0, 
            width: 4, 
            bgcolor: st.color 
          }} 
        />

        <Box sx={{ p: 2, pl: 3, display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
            <Typography 
              className="quest-title"
              variant="h6" 
              sx={{ 
                fontFamily: "Cinzel", 
                fontWeight: 800, 
                color: "#2c1a10", 
                lineHeight: 1.2,
                transition: "color 0.2s"
              }}
            >
              {quest?.title || "Quest Sem Título"}
            </Typography>
            
            {/* Selo de Status */}
            <Chip 
              label={st.label} 
              size="small" 
              sx={{ 
                height: 20, 
                fontSize: "0.65rem", 
                fontWeight: 700, 
                bgcolor: st.bg, 
                color: st.color, 
                border: `1px solid ${st.border}`,
                fontFamily: "Cinzel"
              }} 
            />
          </Stack>

          <Typography 
            variant="body2" 
            sx={{ 
              mt: 1.5, 
              mb: 2,
              color: "rgba(44, 26, 16, 0.75)", 
              fontFamily: "'Merriweather', serif",
              fontSize: "0.85rem",
              lineHeight: 1.6,
              flexGrow: 1
            }}
          >
            {desc || <span style={{ opacity: 0.5, fontStyle: "italic" }}>Sem descrição disponível...</span>}
          </Typography>

          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: "auto", pt: 2, borderTop: "1px dashed rgba(92,64,51,0.1)" }}>
            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
              {tags.slice(0, 3).map((t) => (
                <Chip key={t} label={t} size="small" sx={{ height: 20, fontSize: "0.65rem", bgcolor: "rgba(0,0,0,0.05)" }} />
              ))}
            </Box>

            <Stack direction="row" spacing={0}>
              <Tooltip title="Concluir Rápido">
                <IconButton 
                  size="small" 
                  onClick={markDone} 
                  disabled={marking || quest?.currentStatus === "concluida"}
                  sx={{ color: quest?.currentStatus === "concluida" ? "success.main" : "rgba(0,0,0,0.3)", "&:hover": { color: "success.main" } }}
                >
                  <CheckCircleRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Excluir">
                <IconButton 
                  size="small" 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirmOpen(true); }}
                  sx={{ color: "rgba(0,0,0,0.3)", "&:hover": { color: "error.main" } }}
                >
                  <DeleteRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Box>
      </Paper>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle sx={{ fontFamily: "Cinzel" }}>Queimar este contrato?</DialogTitle>
        <DialogContent>
          <Typography>A quest será removida permanentemente.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
          <Button color="error" onClick={deleteQuest} disabled={deleting}>Excluir</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}