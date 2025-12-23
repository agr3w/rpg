// Inicio.js
import React, { Suspense, lazy } from "react";
import { motion, MotionConfig } from "framer-motion";
import { Box, Container, Paper, Stack, Typography, Skeleton } from "@mui/material";

import bg from "./tumblr_okx6d5BR4K1rnbw6mo1_540.webp";

// Lazy-load dos cards (reduz custo do primeiro paint do HUB)
const LivrosCard = lazy(() => import("components/Cards/livors"));
const AnotacoesCard = lazy(() => import("components/Cards/anotacoes"));
const MusicasCard = lazy(() => import("components/Cards/musicas"));
const FichaCard = lazy(() => import("components/Cards/ficha"));
const MapsCard = lazy(() => import("components/Cards/maps/indsx"));

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, when: "beforeChildren" } },
};
const cardItemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } },
};

function GridFallback() {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 1.5,
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" },
      }}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Paper key={i} elevation={0} sx={{ borderRadius: 2.5, p: 2, bgcolor: "rgba(223,214,205,0.85)" }}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="rounded" height={170} sx={{ mt: 1 }} />
        </Paper>
      ))}
    </Box>
  );
}

export default function Inicio() {
  return (
    <MotionConfig reducedMotion="user">
      <Box
        component={motion.div}
        initial="hidden"
        animate="show"
        variants={containerVariants}
        sx={{
          minHeight: "100vh",
          position: "relative",
          "&::before": {
            content: '""',
            position: "fixed",
            inset: 0,
            zIndex: -2,
            backgroundImage: `linear-gradient(rgba(16, 18, 16, 0.55), rgba(16, 18, 16, 0.55)), url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "scroll", // teste: elimina custo do fixed
          },
          "&::after": {
            content: '""',
            position: "fixed",
            inset: 0,
            zIndex: -1,
            background: "radial-gradient(80% 60% at 50% 30%, rgba(255,255,255,0.08), rgba(0,0,0,0.35))",
            pointerEvents: "none",
          },
          py: { xs: 2, md: 6 },
        }}
      >
        <Container maxWidth="lg">
          <Paper
            elevation={0}
            sx={{
              mb: 2,
              p: { xs: 2, md: 2.5 },
              borderRadius: 2.5,
              bgcolor: "rgba(223, 214, 205, 0.92)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
            }}
          >
            <Stack spacing={0.75}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: "#2c1a10" }}>
                RPG Organizer
              </Typography>
              <Typography sx={{ color: "rgba(44,26,16,0.85)" }}>
                Seu acervo de campanha — escolha uma seção e continue sua jornada.
              </Typography>
            </Stack>
          </Paper>

          <Suspense fallback={<GridFallback />}>
            <Box
              sx={{
                display: "grid",
                gap: 1.5,
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" },
              }}
            >
              <Box component={motion.div} variants={cardItemVariants}><AnotacoesCard /></Box>
              <Box component={motion.div} variants={cardItemVariants}><MusicasCard /></Box>
              <Box component={motion.div} variants={cardItemVariants}><MapsCard /></Box>
              <Box component={motion.div} variants={cardItemVariants}><LivrosCard /></Box>
              <Box component={motion.div} variants={cardItemVariants}><FichaCard /></Box>
            </Box>
          </Suspense>

          <Typography sx={{ mt: 2, fontSize: 12, opacity: 0.85, color: "rgba(255,255,255,0.8)" }}>
            BackGround Art By:{" "}
            <Box
              component="a"
              href="https://waneella.tumblr.com/post/156858332747/preparing-pixel-art-video-backgrounds-for"
              target="_blank"
              rel="noreferrer"
              sx={{ color: "inherit", textDecoration: "underline" }}
            >
              Waneella Pixel Art
            </Box>
          </Typography>
        </Container>
      </Box>
    </MotionConfig>
  );
}
