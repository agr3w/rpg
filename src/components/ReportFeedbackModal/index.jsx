// src/components/ReportFeedbackModal/index.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Stack,
  Chip,
  MenuItem,
  CircularProgress,
  Alert,
  IconButton
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import BugReportIcon from "@mui/icons-material/BugReport";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import FeedbackIcon from "@mui/icons-material/Feedback";
import { database, auth } from "APIs/firebaseConfig";

export default function ReportFeedbackModal({ open, onClose, defaultType = "bug" }) {
  const [type, setType] = useState(defaultType);
  const [severity, setSeverity] = useState("media");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setStatusMsg({ type: "error", text: "Por favor, preencha o título e a descrição do relato." });
      return;
    }

    setLoading(true);
    setStatusMsg(null);

    try {
      const user = auth.currentUser;
      const reportData = {
        type,
        severity,
        title: title.trim(),
        description: description.trim(),
        userEmail: user?.email || "Anônimo",
        userId: user?.uid || null,
        userName: user?.displayName || user?.email?.split("@")[0] || "Viajante",
        currentUrl: window.location.href,
        pathname: window.location.pathname,
        userAgent: navigator.userAgent,
        createdAt: new Date().toISOString(),
        timestamp: Date.now(),
        status: "pendente"
      };

      try {
        await database.ref("reports").push(reportData);
      } catch (e1) {
        await database.ref("system/reports").push(reportData);
      }

      setStatusMsg({ type: "success", text: "Relatório enviado aos Mestres com sucesso! Obrigado pelo seu apoio." });
      setTitle("");
      setDescription("");
      setTimeout(() => {
        setStatusMsg(null);
        onClose();
      }, 1800);
    } catch (error) {
      console.error("Erro ao enviar relatório:", error);
      setStatusMsg({ type: "error", text: "Falha ao enviar relatório: " + error.message });
    } finally {
      setLoading(false);
    }
  };

  const reportTypes = [
    { id: "bug", label: "Problema / Bug", icon: <BugReportIcon fontSize="small" />, color: "#ef5350" },
    { id: "suggestion", label: "Sugestão de Melhoria", icon: <AutoFixHighIcon fontSize="small" />, color: "#ffa726" },
    { id: "feedback", label: "Dúvida / Feedback", icon: <HelpOutlineIcon fontSize="small" />, color: "#29b6f6" }
  ];

  return (
    <Dialog 
      open={open} 
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#140e0b",
          backgroundImage: "radial-gradient(circle at 50% 0%, #2a1810 0%, #120b08 100%)",
          border: "1px solid rgba(212,175,55,0.45)",
          borderRadius: 3,
          boxShadow: "0 24px 70px rgba(0,0,0,0.95)",
          color: "#f5f0e6",
          fontFamily: "Cinzel, sans-serif"
        }
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1.5, borderBottom: "1px solid rgba(212,175,55,0.25)", bgcolor: "rgba(0,0,0,0.3)" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <FeedbackIcon sx={{ color: "#ffd700", fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontFamily: "Cinzel", fontWeight: 800, color: "#ffd700" }}>
            Central de Suporte & Feedback
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} disabled={loading} sx={{ color: "#bbb", "&:hover": { color: "#fff" } }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2.5, display: "flex", flexDirection: "column", gap: 2.5 }}>
          {statusMsg && (
            <Alert severity={statusMsg.type} sx={{ borderRadius: 2 }}>
              {statusMsg.text}
            </Alert>
          )}

          <Box>
            <Typography variant="caption" sx={{ color: "#ffd700", fontWeight: 700, mb: 1, display: "block", fontFamily: "Cinzel" }}>
              Tipo de Relato
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {reportTypes.map((t) => (
                <Chip
                  key={t.id}
                  icon={t.icon}
                  label={t.label}
                  clickable
                  onClick={() => setType(t.id)}
                  sx={{
                    bgcolor: type === t.id ? alpha(t.color, 0.3) : "rgba(0,0,0,0.5)",
                    border: `1px solid ${type === t.id ? t.color : "rgba(255,255,255,0.15)"}`,
                    color: type === t.id ? (type === "suggestion" ? "#ffcc80" : type === "feedback" ? "#81d4fa" : "#ff8a80") : "#dcd3c2",
                    fontWeight: 700,
                    fontFamily: "Cinzel",
                    "& .MuiChip-icon": { color: type === t.id ? (type === "suggestion" ? "#ffcc80" : type === "feedback" ? "#81d4fa" : "#ff8a80") : "#bbb" }
                  }}
                />
              ))}
            </Stack>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Gravidade / Impacto"
              select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              fullWidth
              variant="filled"
              sx={{
                "& .MuiFilledInput-root": { bgcolor: "rgba(0,0,0,0.6)", border: "1px solid rgba(212,175,55,0.3)", color: "#f5f0e6" },
                "& .MuiInputLabel-root": { color: "#ffd700", fontFamily: "Cinzel" }
              }}
            >
              <MenuItem value="baixa">Baixa (Visual / Detalhe)</MenuItem>
              <MenuItem value="media">Média (Inconveniente)</MenuItem>
              <MenuItem value="alta">Alta (Impede uma ação)</MenuItem>
              <MenuItem value="critica">Crítica (Erro grave / Travamento)</MenuItem>
            </TextField>
          </Stack>

          <TextField
            label="Título do Ocorrido / Ideia"
            placeholder="Ex: Erro ao calcular pontos de vida no nível 3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            variant="filled"
            sx={{
              "& .MuiFilledInput-root": { bgcolor: "rgba(0,0,0,0.6)", border: "1px solid rgba(212,175,55,0.3)", color: "#f5f0e6" },
              "& .MuiInputLabel-root": { color: "#ffd700", fontFamily: "Cinzel" }
            }}
          />

          <TextField
            label="Descrição Detalhada"
            placeholder="Descreva o que aconteceu, o que você esperava que acontecesse ou como reproduzir..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            required
            multiline
            rows={4}
            variant="filled"
            sx={{
              "& .MuiFilledInput-root": { bgcolor: "rgba(0,0,0,0.6)", border: "1px solid rgba(212,175,55,0.3)", color: "#f5f0e6" },
              "& .MuiInputLabel-root": { color: "#ffd700", fontFamily: "Cinzel" }
            }}
          />

          <Typography variant="caption" sx={{ color: "#b8ab99", fontSize: "0.8rem", lineHeight: 1.5 }}>
            Informações técnicas do navegador e rota atual ({window.location.pathname}) serão anexadas automaticamente para facilitar o diagnóstico pelos desenvolvedores.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, borderTop: "1px solid rgba(212,175,55,0.25)", bgcolor: "rgba(0,0,0,0.3)", gap: 1 }}>
          <Button onClick={onClose} disabled={loading} sx={{ color: "#dcd3c2", fontFamily: "Cinzel" }}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
            sx={{
              bgcolor: "#bf8f00",
              color: "#120e0a",
              fontFamily: "Cinzel",
              fontWeight: 800,
              px: 3,
              "&:hover": { bgcolor: "#ffd700" }
            }}
          >
            {loading ? "Enviando..." : "Enviar Relatório"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
