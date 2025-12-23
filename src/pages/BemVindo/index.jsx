import React from "react";
import { Link } from "react-router-dom";
import { motion, MotionConfig } from "framer-motion";
import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";

const panelVariants = {
  hidden: { opacity: 0, scale: 0.985, y: 10 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function BemVindo() {
  return (
    <MotionConfig reducedMotion="user">
      <Box
        component={motion.div}
        initial="hidden"
        animate="show"
        variants={panelVariants}
        sx={{ minHeight: "100vh", position: "relative" }}
      >
        <Box sx={{ position: "fixed", inset: 0, bgcolor: "rgba(0,0,0,0.55)" }} />

        <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1, py: { xs: 3, md: 8 } }}>
          <Paper
            elevation={0}
            sx={{
              bgcolor: "#2c332f",
              color: "#fff",
              borderRadius: 2,
              p: { xs: 2, md: 4 },
              boxShadow: "0 0 10px rgba(0,0,0,0.5)",
            }}
          >
            <Typography variant="h4" sx={{ textAlign: "center", pb: 2 }}>
              Seja bem-Vindo
            </Typography>

            <Box
              sx={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 9",
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "rgba(0,0,0,0.25)",
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

            <Box sx={{ mt: 2, lineHeight: 1.6 }}>
              <Typography sx={{ mb: 1 }}>
                Bem-vindo ao RPG Organizer! Esta plataforma foi criada para tornar sua vida como mestre de RPG mais fácil.
              </Typography>
              <Typography>
                Assista ao vídeo acima para uma introdução rápida e comece a explorar o RPG Organizer para uma experiência de RPG mais organizada e envolvente!
              </Typography>
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 3, justifyContent: "center" }}>
              <Button component={Link} to="/login" variant="contained" color="primary">
                Fazer o Login
              </Button>

              <Button component={Link} to="/Registrar-se" variant="contained" color="primary">
                Fazer o Registro
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </MotionConfig>
  );
}