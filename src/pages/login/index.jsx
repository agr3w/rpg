// src/pages/login/index.jsx
import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Typography,
  useTheme
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import LoginIcon from "@mui/icons-material/Login";
import { usePreferences } from "contexts/PreferencesContext";
import AuthComponent from "components/SingIn";
import RegisterComponent from "components/ComponentRegistrar";
import AuthDragonVisual from "components/Auth/AuthDragonVisual";

export default function LoginPage({ initialTab = 0 }) {
  const [tabIndex, setTabIndex] = useState(initialTab);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { prefs, updatePrefs } = usePreferences();

  const handleToggleTheme = () => {
    updatePrefs({ themeMode: isDark ? "light" : "dark" });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        bgcolor: isDark ? "#0c0806" : "#f5eee1",
        backgroundImage: isDark
          ? "radial-gradient(circle at 50% 10%, #20130c 0%, #0c0806 80%)"
          : "radial-gradient(circle at 50% 10%, #fffcf5 0%, #ebe0ce 80%)",
        color: isDark ? "#f5f0e6" : "#24140b",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        py: { xs: 2.5, md: 4 },
        px: { xs: 2, sm: 3, md: 4 },
        boxSizing: "border-box"
      }}
    >
      {/* Barra Superior com Logo e Seletor de Tema */}
      <Container maxWidth="lg" sx={{ mb: { xs: 2, md: 3.5 }, px: { xs: 0.5, md: 2 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2.5,
                bgcolor: isDark ? "rgba(255,215,0,0.15)" : "rgba(131,60,11,0.12)",
                border: isDark ? "1.5px solid rgba(255,215,0,0.45)" : "1.5px solid rgba(131,60,11,0.35)",
                display: "grid",
                placeItems: "center",
                color: isDark ? "#ffd700" : "#833c0b",
                boxShadow: isDark ? "0 0 15px rgba(255,215,0,0.3)" : "0 4px 12px rgba(131,60,11,0.15)"
              }}
            >
              <AutoAwesomeIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontFamily: "Cinzel, serif", fontWeight: 900, color: isDark ? "#ffd700" : "#6d3008", lineHeight: 1.1 }}>
                RPG Organizer
              </Typography>
              <Typography variant="caption" sx={{ color: isDark ? "#b8ab99" : "#6e4b31", fontFamily: "Roboto, sans-serif", fontSize: "0.76rem" }}>
                Sua Mesa Virtual & Grimório
              </Typography>
            </Box>
          </Box>

          <Tooltip title={isDark ? "Alternar para Modo Claro" : "Alternar para Modo Escuro"}>
            <IconButton
              onClick={handleToggleTheme}
              sx={{
                bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                border: isDark ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(0,0,0,0.12)",
                color: isDark ? "#ffd700" : "#833c0b",
                p: 1.2,
                boxShadow: isDark ? "0 4px 12px rgba(0,0,0,0.5)" : "0 2px 8px rgba(0,0,0,0.08)",
                "&:hover": {
                  bgcolor: isDark ? "rgba(255,215,0,0.15)" : "rgba(131,60,11,0.12)",
                  transform: "scale(1.05)"
                }
              }}
            >
              {isDark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      </Container>

      {/* Container Principal Dividido (Split-Screen) */}
      <Container maxWidth="lg" sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: { xs: 0.5, md: 2 } }}>
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.05fr 1fr" },
            gap: { xs: 3, md: 4 },
            alignItems: "stretch"
          }}
        >
          {/* Coluna 1: O Grimório de Acesso (Login / Cadastro com Tabs) */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3.5, md: 4.5 },
              borderRadius: 4,
              bgcolor: isDark ? "rgba(18, 12, 9, 0.92)" : "rgba(255, 252, 245, 0.95)",
              border: isDark ? "1px solid rgba(212,175,55,0.35)" : "1px solid rgba(139,94,60,0.35)",
              boxShadow: isDark 
                ? "0 25px 70px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,215,0,0.2)" 
                : "0 20px 60px rgba(100,60,20,0.18), inset 0 1px 2px rgba(255,255,255,0.8)",
              backdropFilter: "blur(14px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            {/* Seletor de Abas de Autenticação Estilo Pílula 3D */}
            <Tabs
              value={tabIndex}
              onChange={(e, val) => setTabIndex(val)}
              variant="fullWidth"
              sx={{
                mb: 3.5,
                bgcolor: isDark ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.05)",
                boxShadow: isDark ? "inset 0 2px 6px rgba(0,0,0,0.7)" : "inset 0 2px 6px rgba(0,0,0,0.08)",
                border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
                borderRadius: 2.5,
                p: 0.6,
                "& .MuiTab-root": {
                  fontFamily: "Cinzel, serif",
                  fontWeight: 900,
                  fontSize: "0.92rem",
                  color: isDark ? "#b8ab99" : "#77553b",
                  borderRadius: 2,
                  minHeight: 44,
                  transition: "all 0.25s ease"
                },
                "& .Mui-selected": {
                  color: isDark ? "#120e0a !important" : "#fff !important",
                  bgcolor: isDark ? "#ffd700" : "#833c0b",
                  boxShadow: isDark 
                    ? "0 4px 16px rgba(212,175,55,0.45)" 
                    : "0 4px 14px rgba(131,60,11,0.35)",
                  transform: "scale(1.02)"
                },
                "& .MuiTabs-indicator": {
                  display: "none"
                }
              }}
            >
              <Tab icon={<LoginIcon fontSize="small" />} iconPosition="start" label="Entrar" />
              <Tab icon={<HowToRegIcon fontSize="small" />} iconPosition="start" label="Criar Conta" />
            </Tabs>

            <AnimatePresence mode="wait">
              {tabIndex === 0 ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25 }}
                >
                  <AuthComponent onSwitchToRegister={() => setTabIndex(1)} />
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <RegisterComponent onSwitchToLogin={() => setTabIndex(0)} />
                </motion.div>
              )}
            </AnimatePresence>
          </Paper>

          {/* Coluna 2: Dragão Místico & Vitrine com os 4 Elementos */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <AuthDragonVisual />
          </Box>
        </Box>
      </Container>

      {/* Rodapé */}
      <Container maxWidth="lg" sx={{ mt: { xs: 3, md: 4 }, textAlign: "center" }}>
        <Typography variant="caption" sx={{ color: isDark ? "#777" : "#888", fontFamily: "Roboto, sans-serif" }}>
          RPG Organizer © {new Date().getFullYear()} • Forjado para Mestres e Aventureiros
        </Typography>
      </Container>
    </Box>
  );
}
