import React from "react";
import { Snackbar, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Sucesso
import ErrorIcon from "@mui/icons-material/Error"; // Erro Genérico
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'; // Burn
import WifiOffIcon from '@mui/icons-material/WifiOff'; // Conexão/Curse

const ArcaneAlert = ({ open, onClose, severity = "success", message }) => {
  
  // Configurações visuais baseadas no tipo de severidade
  const getConfig = () => {
    switch (severity) {
      case "success":
        return {
          color: "#2e7d32",
          icon: <CheckCircleIcon fontSize="large" />,
          title: "Sucesso",
          bg: "#fdfbf7"
        };
      case "error":
        return {
          color: "#d32f2f",
          icon: <ErrorIcon fontSize="large" />,
          title: "Falha no Ritual",
          bg: "#fff5f5"
        };
      case "burn":
        return {
          color: "#d84315", // Laranja queimado
          icon: <LocalFireDepartmentIcon fontSize="large" sx={{ filter: "drop-shadow(0 0 5px orange)" }} />,
          title: "Incinerado",
          bg: "#fff3e0"
        };
      case "curse": // Para erros de conexão
        return {
          color: "#455a64", // Cinza azulado escuro
          icon: <WifiOffIcon fontSize="large" />,
          title: "Maldição de Silêncio",
          bg: "#eceff1"
        };
      default:
        return {
          color: "#0288d1",
          icon: <CheckCircleIcon fontSize="large" />,
          title: "Informação",
          bg: "#e1f5fe"
        };
    }
  };

  const config = getConfig();

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Box
        sx={{
          minWidth: "320px",
          bgcolor: config.bg,
          border: `2px solid ${config.color}`,
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          position: "relative",
          backgroundImage: `url("https://www.transparenttextures.com/patterns/paper.png")`,
          overflow: "hidden",
          "&::before": { // Faixa lateral
            content: '""',
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "8px",
            bgcolor: config.color,
          }
        }}
      >
        {/* Ícone */}
        <Box sx={{ display: "flex", alignItems: "center", color: config.color, zIndex: 1 }}>
          {config.icon}
        </Box>

        {/* Texto */}
        <Box sx={{ flexGrow: 1, zIndex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontFamily: "Cinzel", fontWeight: "bold", color: "#2e1e14" }}>
            {config.title}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: '"Crimson Text", serif', color: "#5d4037", lineHeight: 1.2 }}>
            {message}
          </Typography>
        </Box>

        {/* Botão Fechar */}
        <IconButton size="small" onClick={onClose} sx={{ color: "rgba(0,0,0,0.3)", zIndex: 1 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    </Snackbar>
  );
};

export default ArcaneAlert;