// Inicio.js
import React, { memo } from "react";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";
import {
  Box,
  Container,
  Paper,
  Stack,
  Typography,
  Divider,
  Chip,
  Button,
  Grid,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Link as RouterLink } from "react-router-dom";

import { T_IN } from "../../config/transitions";
import bg from "./tumblr_okx6d5BR4K1rnbw6mo1_540.webp";
import AppCard from "components/Cards/AppCard";
import { HOME_SECTIONS } from "components/Cards/cardsRegistry";

// Animações
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, when: "beforeChildren" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Componente Hero (Banner Principal)
const HeroBanner = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        mb: 4,
        p: { xs: 3, md: 5 },
        borderRadius: 3,
        position: "relative",
        overflow: "hidden",
        color: "#fff",
        // Estilo "Couro Escuro"
        background: `linear-gradient(135deg, #2c1a10 0%, #4a2c1d 100%)`,
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
      }}
    >
      {/* Detalhe Dourado de Fundo */}
      <Box
        sx={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(191, 143, 0, 0.2) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={8}>
          <Stack spacing={2}>
            <Box>
              <Typography
                variant="overline"
                sx={{ color: "#bf8f00", fontWeight: 800, letterSpacing: 2 }}
              >
                Bem-vindo, Viajante
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Cinzel",
                  fontWeight: 900,
                  lineHeight: 1,
                  background: "linear-gradient(45deg, #fff 30%, #e0c097 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                }}
              >
                RPG Organizer
              </Typography>
            </Box>
            <Typography sx={{ color: "rgba(255,255,255,0.7)", maxWidth: 600, lineHeight: 1.6 }}>
              Sua mesa virtual está pronta. Acesse suas campanhas, consulte o grimório ou
              crie novos personagens para a próxima aventura.
            </Typography>

            <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
              <Button
                component={RouterLink}
                to="/fichas"
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                sx={{
                  bgcolor: "#bf8f00",
                  color: "#2c1a10",
                  fontWeight: 800,
                  "&:hover": { bgcolor: "#a67c00" },
                }}
              >
                Criar Ficha
              </Button>
              <Button
                component={RouterLink}
                to="/diario"
                variant="outlined"
                startIcon={<AutoStoriesIcon />}
                sx={{
                  borderColor: "rgba(255,255,255,0.3)",
                  color: "#fff",
                  "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.05)" },
                }}
              >
                Diário
              </Button>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Componente de Seção (Estilo Pergaminho)
const Section = memo(function Section({
  title,
  subtitle,
  chipLabel,
  accent = "primary",
  children,
}) {
  const theme = useTheme();
  const accentColor = theme.palette?.[accent]?.main || theme.palette.primary.main;

  return (
    <Box component={motion.div} variants={itemVariants} sx={{ mb: 4 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2, px: 1 }}>
        <Box
          sx={{
            width: 4,
            height: 24,
            bgcolor: accentColor,
            borderRadius: 1,
            boxShadow: `0 0 10px ${alpha(accentColor, 0.5)}`,
          }}
        />
        <Typography variant="h5" sx={{ fontFamily: "Cinzel", fontWeight: 800, color: "#fff" }}>
          {title}
        </Typography>
        {chipLabel && (
          <Chip
            label={chipLabel}
            size="small"
            sx={{
              bgcolor: alpha(accentColor, 0.2),
              color: "#fff", // Melhor contraste no fundo escuro
              border: `1px solid ${alpha(accentColor, 0.3)}`,
              fontWeight: 700,
            }}
          />
        )}
      </Stack>

      {/* Container dos Cards */}
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            lg: "1fr 1fr 1fr",
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );
});

export default function Inicio() {
  const prefersReducedMotion = useReducedMotion();
  const sections = HOME_SECTIONS;

  return (
    <MotionConfig reducedMotion="user">
      <Box
        component={motion.div}
        initial="hidden"
        animate="show"
        variants={prefersReducedMotion ? undefined : containerVariants}
        sx={{
          minHeight: "100vh",
          position: "relative",
          py: { xs: 2, md: 4 },
          // Background fixo e escuro para contraste
          "&::before": {
            content: '""',
            position: "fixed",
            inset: 0,
            zIndex: -2,
            backgroundImage: `linear-gradient(rgba(16, 18, 16, 0.85), rgba(16, 18, 16, 0.75)), url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          },
        }}
      >
        <Container maxWidth="lg">
          {/* Hero Section */}
          <motion.div variants={itemVariants}>
            <HeroBanner />
          </motion.div>

          {/* Seções */}
          {sections.map((section) => (
            <Section
              key={section.key}
              title={section.title}
              subtitle={section.subtitle}
              chipLabel={section.chipLabel}
              accent={section.accent}
            >
              {section.items.map((card) => {
                const Wrapper = prefersReducedMotion ? Box : motion.div;
                return (
                  <Box key={card.id} component={Wrapper} variants={itemVariants}>
                    <AppCard {...card} />
                  </Box>
                );
              })}
            </Section>
          ))}

          {/* Footer discreto */}
          <Typography
            align="center"
            sx={{
              mt: 6,
              fontSize: 12,
              opacity: 0.6,
              color: "#fff",
              fontFamily: "Cinzel",
            }}
          >
            "A aventura espera por aqueles que ousam escrever seu destino."
            <br />
            <Box
              component="a"
              href="https://waneella.tumblr.com/"
              target="_blank"
              rel="noreferrer"
              sx={{ color: "inherit", textDecoration: "none", opacity: 0.7 }}
            >
              Arte por Waneella
            </Box>
          </Typography>
        </Container>
      </Box>
    </MotionConfig>
  );
}
