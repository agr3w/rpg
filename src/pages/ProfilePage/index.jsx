import React, { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Container,
  Paper,
  Stack,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { usePreferences } from "contexts/PreferencesContext";

import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";

import AccountSection from "./sections/AccountSection";
import SecuritySection from "./sections/SecuritySection";
import ContentSection from "./sections/ContentSection";
import DangerSection from "./sections/DangerSection";
import PreferencesSection from "./sections/PreferencesSection";

function RuneMark({ size = 22 }) {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-grid",
        placeItems: "center",
        width: size,
        height: size,
        borderRadius: "999px",
        border: "1px solid rgba(0,0,0,0.18)",
        background:
          "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.55), rgba(0,0,0,0.05))",
        fontWeight: 1000,
        lineHeight: 1,
        fontFamily: "serif",
        color: "rgba(44,26,16,0.90)",
      }}
      aria-hidden
    >
      ⟡
    </Box>
  );
}

export default function Perfil() {
  const theme = useTheme();
  const { prefs } = usePreferences(); // ✅

  const [status, setStatus] = useState({ type: "info", msg: "" });
  const [active, setActive] = useState("conta");

  const sections = useMemo(
    () => [
      {
        id: "conta",
        label: "Conta",
        accent: "primary",
        icon: <PersonOutlineRoundedIcon />,
        node: <AccountSection setStatus={setStatus} />,
      },
      {
        id: "seguranca",
        label: "Segurança",
        accent: "secondary",
        icon: <SecurityRoundedIcon />,
        node: <SecuritySection setStatus={setStatus} />,
      },
      {
        id: "preferencias",
        label: "Preferências",
        accent: "primary",
        icon: <TuneRoundedIcon />,
        node: <PreferencesSection />,
      },
      {
        id: "conteudo",
        label: "Conteúdo",
        accent: "secondary",
        icon: <FolderOpenRoundedIcon />,
        node: <ContentSection setStatus={setStatus} />,
      },
      {
        id: "risco",
        label: "Zona de risco",
        accent: "error",
        icon: <WarningAmberRoundedIcon />,
        node: <DangerSection setStatus={setStatus} />,
      },
    ],
    []
  );

  const current = sections.find((s) => s.id === active) || sections[0];

  const accentColor =
    theme.palette?.[current.accent]?.main || theme.palette.primary.main;

  const parchmentBg =
    "linear-gradient(180deg, rgba(243,235,224,0.98), rgba(232,222,210,0.94))";
  const ink = "rgba(44,26,16,0.92)";

  return (
    <MotionConfig reducedMotion={prefs.reduceMotion ? "always" : "user"}>
      <Box
        sx={{
          py: { xs: 2, md: 4 },
          // “textura” leve (sem asset)
          backgroundImage:
            "radial-gradient(70% 50% at 30% 10%, rgba(255,255,255,0.06), rgba(0,0,0,0.0)), radial-gradient(70% 50% at 70% 0%, rgba(255,255,255,0.04), rgba(0,0,0,0.0))",
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={2}>
            {/* Cabeçalho mais “tema” */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                p: { xs: 2, md: 2.5 },
                backgroundImage: parchmentBg,
                border: `1px solid ${alpha(accentColor, 0.25)}`,
                boxShadow: "0 16px 45px rgba(0,0,0,0.22)",
                position: "relative",
                overflow: "hidden",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  background:
                    "repeating-linear-gradient(90deg, rgba(0,0,0,0.00), rgba(0,0,0,0.00) 14px, rgba(0,0,0,0.02) 15px)",
                  opacity: 0.55,
                },
              }}
            >
              <Stack direction="row" spacing={1.25} alignItems="center">
                <RuneMark />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 1000, color: ink }}>
                    Perfil & Configurações
                  </Typography>
                  <Typography sx={{ opacity: 0.85, color: ink }}>
                    Ajuste sua conta e preferências sem sair da imersão.
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {status.msg ? (
              <Alert
                severity={status.type}
                sx={{
                  borderRadius: 2.5,
                  border: "1px solid rgba(0,0,0,0.10)",
                }}
              >
                {status.msg}
              </Alert>
            ) : null}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "300px 1fr" },
                gap: 2,
                alignItems: "start",
              }}
            >
              {/* Sidebar “menu” mais marcada */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  p: 1,
                  backgroundImage: parchmentBg,
                  border: `1px solid ${alpha("#000", 0.10)}`,
                  boxShadow: "0 14px 40px rgba(0,0,0,0.20)",
                  position: { md: "sticky" },
                  top: { md: 18 },
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 1.25, pt: 1, pb: 0.5 }}>
                  <RuneMark size={18} />
                  <Typography sx={{ fontWeight: 1000, color: ink }}>
                    Seções
                  </Typography>
                </Stack>

                <Divider sx={{ mb: 0.5, borderColor: alpha("#000", 0.10) }} />

                <List dense sx={{ pb: 0.5, position: "relative" }}>
                  {sections.map((s) => {
                    const c = theme.palette?.[s.accent]?.main || theme.palette.primary.main;
                    const selected = active === s.id;

                    return (
                      <ListItemButton
                        key={s.id}
                        selected={selected}
                        onClick={() => setActive(s.id)}
                        sx={{
                          borderRadius: 2,
                          mx: 0.5,
                          my: 0.25,
                          border: `1px solid ${alpha(c, selected ? 0.35 : 0.14)}`,
                          bgcolor: selected ? alpha(c, 0.06) : "transparent",
                          "&:hover": { bgcolor: alpha(c, 0.10) },
                          "&.Mui-selected:hover": { bgcolor: alpha(c, 0.10) },

                          // ✅ necessário para o highlight ficar “atrás” e deslizar
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        {/* ✅ highlight com layoutId: o Framer “move” o mesmo elemento entre itens */}
                        {selected ? (
                          <Box
                            component={motion.div}
                            layoutId="profile-sidebar-highlight"
                            transition={{ type: "spring", stiffness: 520, damping: 42 }}
                            sx={{
                              position: "absolute",
                              inset: 0,
                              borderRadius: 2,
                              pointerEvents: "none",
                              backgroundImage: `linear-gradient(90deg, ${alpha(c, 0.16)}, ${alpha("#fff", 0.06)})`,
                              boxShadow: `inset 0 0 0 1px ${alpha(c, 0.22)}`,
                              zIndex: 0,
                            }}
                          />
                        ) : null}

                        <ListItemIcon sx={{ minWidth: 38, color: alpha(ink, 0.9), position: "relative", zIndex: 1 }}>
                          {s.icon}
                        </ListItemIcon>

                        <ListItemText
                          sx={{ position: "relative", zIndex: 1 }}
                          primary={s.label}
                          primaryTypographyProps={{ sx: { fontWeight: selected ? 950 : 800, color: ink } }}
                        />
                      </ListItemButton>
                    );
                  })}
                </List>
              </Paper>

              {/* Painel do conteúdo (com “moldura” e acento por seção) */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  p: { xs: 2, md: 3 },
                  backgroundImage: parchmentBg,
                  border: `1px solid ${alpha(accentColor, 0.25)}`,
                  boxShadow: "0 18px 52px rgba(0,0,0,0.22)",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 10,
                    borderRadius: 2.5,
                    pointerEvents: "none",
                    border: `1px solid ${alpha(accentColor, 0.22)}`,
                  },
                }}
              >
                <Stack spacing={1.25} sx={{ mb: 1.5 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <RuneMark size={18} />
                    <Typography sx={{ fontWeight: 1000, color: ink }}>
                      {current.label}
                    </Typography>
                  </Stack>
                  <Divider sx={{ borderColor: alpha(accentColor, 0.20) }} />
                </Stack>

                {/* ✅ troca de seções com animação */}
                <AnimatePresence mode="wait" initial={false}>
                  <Box
                    key={current.id}
                    component={motion.div}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.18 } }}
                    exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }}
                  >
                    {current.node}
                  </Box>
                </AnimatePresence>
              </Paper>
            </Box>
          </Stack>
        </Container>
      </Box>
    </MotionConfig>
  );
}