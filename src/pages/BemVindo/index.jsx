import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { motion, MotionConfig } from "framer-motion";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import AuthShell from "components/Auth/AuthShell";

const panelVariants = {
  hidden: { opacity: 0, scale: 0.985, y: 10 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function BemVindo() {
  return (
    <MotionConfig reducedMotion="user">
      <AuthShell
        title="Bem-vindo"
        subtitle="Uma plataforma para organizar sua campanha com vibe de fantasia: fichas, diário, NPCs, quests e recursos."
        right={
          <Stack spacing={1.25}>
            <Typography variant="h6" sx={{ fontWeight: 950 }}>
              Comece em 30 segundos
            </Typography>
            <Typography sx={{ opacity: 0.85 }}>
              Assista ao vídeo e já entre para começar a registrar sua jornada.
            </Typography>
            <Divider />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <Button component={RouterLink} to="/login" variant="contained" sx={{ fontWeight: 900 }}>
                Fazer login
              </Button>
              <Button component={RouterLink} to="/Registrar-se" variant="outlined" sx={{ fontWeight: 900 }}>
                Criar conta
              </Button>
            </Stack>
          </Stack>
        }
      >
        <Box component={motion.div} initial="hidden" animate="show" variants={panelVariants}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              aspectRatio: "16 / 9",
              borderRadius: 2.5,
              overflow: "hidden",
              bgcolor: "rgba(0,0,0,0.18)",
              border: "1px solid var(--rpg-stroke)",
            }}
          >
            <Box
              component="iframe"
              loading="lazy"
              src="https://www.youtube.com/embed/lRb5rnWd_Xc?si=7f-b6SULaUMct2yp"
              title="Introdução - RPG Organizer"
              allowFullScreen
              sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
            />
          </Box>

          <Typography sx={{ mt: 2, opacity: 0.9 }}>
            Dica: após entrar, comece pelo <b>Diário de Campanha</b> e vincule sua ficha para aplicar XP e loot.
          </Typography>
        </Box>
      </AuthShell>
    </MotionConfig>
  );
}