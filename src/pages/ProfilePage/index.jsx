import React, { useMemo, useState } from "react";
import {
  Alert, Box, Container, Paper, Stack, Typography, List,
  ListItemButton, ListItemIcon, ListItemText, Divider,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { usePreferences } from "contexts/PreferencesContext";

// Ícones
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

// Seções
import AccountSection from "./sections/AccountSection";
import SecuritySection from "./sections/SecuritySection";
import ContentSection from "./sections/ContentSection";
import DangerSection from "./sections/DangerSection";
import PreferencesSection from "./sections/PreferencesSection";

// Componente Visual: Selo de Cera
const WaxSeal = ({ color = "#833c0b" }) => (
  <Box
    sx={{
      width: 40, height: 40, borderRadius: "50%",
      bgcolor: color,
      boxShadow: "inset 0 0 10px rgba(0,0,0,0.5), 2px 2px 5px rgba(0,0,0,0.4)",
      display: "flex", alignItems: "center", justifyContent: "center",
      border: "2px dashed rgba(255,255,255,0.2)"
    }}
  >
    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)", fontFamily: "Cinzel", fontWeight: "bold" }}>
      RPG
    </Typography>
  </Box>
);

export default function Perfil() {
  const theme = useTheme();
  const { prefs } = usePreferences();
  const [status, setStatus] = useState({ type: "info", msg: "" });
  const [active, setActive] = useState("conta");

  const sections = useMemo(() => [
    { id: "conta", label: "Ficha do Jogador", accent: "primary", icon: <PersonOutlineRoundedIcon />, node: <AccountSection setStatus={setStatus} /> },
    { id: "preferencias", label: "Grimório & Sistema", accent: "info", icon: <TuneRoundedIcon />, node: <PreferencesSection /> },
    { id: "seguranca", label: "Selos de Proteção", accent: "warning", icon: <SecurityRoundedIcon />, node: <SecuritySection setStatus={setStatus} /> },
    { id: "conteudo", label: "Baú de Recursos", accent: "success", icon: <FolderOpenRoundedIcon />, node: <ContentSection setStatus={setStatus} /> },
    { id: "risco", label: "Zona Proibida", accent: "error", icon: <WarningAmberRoundedIcon />, node: <DangerSection setStatus={setStatus} /> },
  ], []);

  const current = sections.find((s) => s.id === active) || sections[0];
  const accentColor = theme.palette?.[current.accent]?.main || theme.palette.primary.main;

  // Estilos Temáticos
  const parchmentTexture = "url('https://www.transparenttextures.com/patterns/aged-paper.png')"; // Exemplo de textura leve
  const inkColor = "#2c1a10";
  const goldColor = "#bf8f00";

  return (
    <MotionConfig reducedMotion={prefs.reduceMotion ? "always" : "user"}>
      <Box sx={{ py: 4, minHeight: "100vh", bgcolor: "#121212" }}>
        <Container maxWidth="lg">

          {/* Header */}
          <Box sx={{ mb: 4, textAlign: "center", position: "relative" }}>
            <Typography variant="h3" sx={{ fontFamily: "Cinzel", color: goldColor, textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>
              Configurações do Reino
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#aaa", fontStyle: "italic", fontFamily: "Merriweather" }}>
              Gerencie sua identidade e a magia que rege este sistema.
            </Typography>
            <Divider sx={{ mt: 2, borderColor: alpha(goldColor, 0.3), width: "50%", mx: "auto" }} />
          </Box>

          {status.msg && (
            <Alert severity={status.type} onClose={() => setStatus({ ...status, msg: "" })} sx={{ mb: 3, bgcolor: "#1e1e1e", color: "#fff", border: `1px solid ${theme.palette[status.type].main}` }}>
              {status.msg}
            </Alert>
          )}

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "280px 1fr" }, gap: 3 }}>

            {/* SIDEBAR (Marcador de Livro) */}
            <Paper
              elevation={4}
              sx={{
                bgcolor: "#1e1e1e",
                backgroundImage: parchmentTexture,
                border: `1px solid ${alpha(goldColor, 0.2)}`,
                borderRadius: "4px",
                overflow: "hidden"
              }}
            >
              <Box sx={{ p: 2, bgcolor: alpha(goldColor, 0.05), borderBottom: `1px solid ${alpha(goldColor, 0.1)}` }}>
                <Typography variant="overline" sx={{ color: goldColor, letterSpacing: 2, fontWeight: "bold" }}>
                  Índice
                </Typography>
              </Box>
              <List sx={{ p: 1 }}>
                {sections.map((s) => {
                  const selected = active === s.id;
                  return (
                    <ListItemButton
                      key={s.id}
                      selected={selected}
                      onClick={() => setActive(s.id)}
                      sx={{
                        mb: 1, borderRadius: 1,
                        borderLeft: selected ? `4px solid ${theme.palette[s.accent].main}` : "4px solid transparent",
                        bgcolor: selected ? alpha(theme.palette[s.accent].main, 0.08) : "transparent",
                        "&:hover": { bgcolor: alpha(theme.palette[s.accent].main, 0.05) },
                        transition: "all 0.3s ease"
                      }}
                    >
                      <ListItemIcon sx={{ color: selected ? theme.palette[s.accent].main : "#666", minWidth: 40 }}>
                        {s.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={s.label}
                        primaryTypographyProps={{
                          fontFamily: "Cinzel",
                          fontWeight: selected ? 700 : 400,
                          color: selected ? "#e0e0e0" : "#888"
                        }}
                      />
                    </ListItemButton>
                  );
                })}
              </List>
            </Paper>

            {/* CONTEÚDO PRINCIPAL (Página do Livro) */}
            <Paper
              elevation={6}
              sx={{
                position: "relative",
                minHeight: 500,
                bgcolor: "#fdf6e3", // Cor de pergaminho claro
                color: inkColor,
                backgroundImage: parchmentTexture,
                borderRadius: "2px 12px 12px 2px",
                border: "1px solid #dcd0c0",
                boxShadow: "inset 20px 0 50px rgba(0,0,0,0.05), 5px 5px 15px rgba(0,0,0,0.3)",
                p: { xs: 2, md: 5 }
              }}
            >
              {/* Detalhe visual de canto */}
              <Box sx={{ position: "absolute", top: 0, right: 0, width: 60, height: 60, background: `linear-gradient(45deg, transparent 50%, ${alpha(accentColor, 0.8)} 50%)`, opacity: 0.2 }} />

              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4, borderBottom: `2px solid ${alpha(accentColor, 0.3)}`, pb: 2 }}>
                <WaxSeal color={theme.palette[current.accent].dark} />
                <Box>
                  <Typography variant="h4" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: inkColor }}>
                    {current.label}
                  </Typography>
                  <Typography variant="caption" sx={{ fontFamily: "Merriweather", color: alpha(inkColor, 0.6) }}>
                    Capítulo {sections.findIndex(s => s.id === active) + 1}
                  </Typography>
                </Box>
              </Stack>

              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {current.node}
                </motion.div>
              </AnimatePresence>

            </Paper>
          </Box>
        </Container>
      </Box>
    </MotionConfig>
  );
}