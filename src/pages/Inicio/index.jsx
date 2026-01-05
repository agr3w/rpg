// Inicio.jsx
import React, { memo } from "react";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";
import {
  Box,
  Container,
  Paper,
  Stack,
  Typography,
  Chip,
  Button,
  Grid,
} from "@mui/material";
import { alpha, styled, useTheme } from "@mui/material/styles";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Link as RouterLink } from "react-router-dom";

// ✅ IMPORTAR o novo Hook
import { useSystem } from "hooks/useSystem";

import bg from "./tumblr_okx6d5BR4K1rnbw6mo1_540.webp";
import AppCard from "components/Cards/AppCard";
import { HOME_SECTIONS } from "components/Cards/cardsRegistry";

// --- OTIMIZAÇÃO 1: Styled Components (Zero Runtime Overhead no render) ---

const PageContainer = styled(motion.div)({
  minHeight: "100vh",
  position: "relative",
  paddingTop: 32,
  paddingBottom: 32,
  // Background fixo otimizado para GPU
  "&::before": {
    content: '""',
    position: "fixed",
    inset: 0,
    zIndex: -2,
    backgroundImage: `linear-gradient(rgba(16, 18, 16, 0.85), rgba(16, 18, 16, 0.75)), url(${bg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    willChange: "transform", // Instrui o navegador a preparar a GPU
    backfaceVisibility: "hidden", // Evita flickering em alguns navegadores
  },
});

const HeroPaper = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 3,
  position: "relative",
  overflow: "hidden",
  color: "#fff",
  background: `linear-gradient(135deg, #2c1a10 0%, #4a2c1d 100%)`,
  border: "1px solid rgba(255,255,255,0.1)",
  boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(5),
  },
}));

// --- OTIMIZAÇÃO 2: Variantes de Animação Ajustadas ---

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06, // Mais rápido para parecer ágil
      when: "beforeChildren",
    },
  },
  // Saída instantânea para não brigar com a Transição do Dragão
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 }, // Movimento menor = menos repaint
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

// Botões com feedback tátil (Game Feel)
const buttonMotionProps = {
  component: motion.button,
  whileHover: { scale: 1.02, filter: "brightness(1.1)" },
  whileTap: { scale: 0.96 },
  transition: { type: "spring", stiffness: 400, damping: 17 },
};

// --- COMPONENTES ---

const HeroBanner = memo(() => {
  return (
    <HeroPaper elevation={0}>
      {/* Gradiente leve substituindo Blur pesado */}
      <Box
        sx={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 240,
          height: 240,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(191, 143, 0, 0.15) 0%, transparent 70%)",
          pointerEvents: "none",
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
            <Typography
              sx={{
                color: "rgba(255,255,255,0.7)",
                maxWidth: 600,
                lineHeight: 1.6,
              }}
            >
              Sua mesa virtual está pronta. Acesse suas campanhas, consulte o grimório ou
              crie novos personagens para a próxima aventura.
            </Typography>

            <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
              <Button
                component={RouterLink}
                to="/fichas"
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                {...buttonMotionProps} // ✅ Aplica a física de botão
                sx={{
                  bgcolor: "#bf8f00",
                  color: "#2c1a10",
                  fontWeight: 800,
                  border: "none", // Remove borda padrão do button HTML
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
                {...buttonMotionProps} // ✅ Aplica a física de botão
                sx={{
                  borderColor: "rgba(255,255,255,0.3)",
                  color: "#fff",
                  "&:hover": {
                    borderColor: "#fff",
                    bgcolor: "rgba(255,255,255,0.05)",
                  },
                }}
              >
                Diário
              </Button>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </HeroPaper>
  );
});

const Section = memo(function Section({
  title,
  chipLabel,
  accent = "primary",
  children,
  prefersReducedMotion,
}) {
  const theme = useTheme();
  const accentColor = theme.palette?.[accent]?.main || theme.palette.primary.main;

  // Wrapper condicional para evitar overhead de animação se o usuário preferir movimento reduzido
  const CardWrapper = prefersReducedMotion ? Box : motion.div;

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
              color: "#fff",
              border: `1px solid ${alpha(accentColor, 0.3)}`,
              fontWeight: 700,
            }}
          />
        )}
      </Stack>

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
        {React.Children.map(children, (child) => (
          <CardWrapper variants={itemVariants} style={{ height: "100%" }}>
            {child}
          </CardWrapper>
        ))}
      </Box>
    </Box>
  );
});

export default function Inicio() {
  const prefersReducedMotion = useReducedMotion();
  const sections = HOME_SECTIONS;
  
  // ✅ Usar o hook aqui
  const system = useSystem();

  return (
    <MotionConfig reducedMotion="user">
      <PageContainer
        initial="hidden"
        animate="show"
        exit="exit" // ✅ Garante saída limpa para o DragonTransition
        variants={prefersReducedMotion ? undefined : containerVariants}
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
              prefersReducedMotion={prefersReducedMotion}
            >
              {section.items.map((card) => (
                <AppCard key={card.id} {...card} />
              ))}
            </Section>
          ))}

          {/* Footer discreto */}
          <Box sx={{ mt: 8, pb: 2, textAlign: "center", opacity: 0.6 }}>
            <Typography
              sx={{
                fontSize: 12,
                color: "#fff",
                fontFamily: "Cinzel",
                mb: 1,
              }}
            >
              "A aventura espera por aqueles que ousam escrever seu destino."
            </Typography>
            
            <Box
              component="a"
              href="https://waneella.tumblr.com/"
              target="_blank"
              rel="noreferrer"
              sx={{ 
                color: "inherit", 
                textDecoration: "none", 
                fontSize: 11, 
                display: "block", 
                mb: 3 
              }}
            >
              Arte por Waneella
            </Box>

            {/* ✅ VERSÃO DO SISTEMA (Dinâmica via Firebase) */}
            <Stack 
              direction="row" 
              justifyContent="center" 
              alignItems="center" 
              spacing={1}
              sx={{ 
                opacity: 0.5, 
                transition: "opacity 0.3s", 
                "&:hover": { opacity: 1 } 
              }}
            >
              <Typography variant="caption" sx={{ fontFamily: "Cinzel", color: "#bf8f00" }}>
                v{system.number}
              </Typography>
              <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.3)" }} />
              <Typography 
                variant="caption" 
                sx={{ 
                  fontFamily: "Cinzel", 
                  fontWeight: 700, 
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  color: "#fff"
                }}
              >
                {system.codename}
              </Typography>
              {system.build && (
                <Chip 
                  label={system.build} 
                  size="small" 
                  sx={{ 
                    height: 16, 
                    fontSize: "0.6rem", 
                    bgcolor: "rgba(255,255,255,0.1)", 
                    color: "#aaa",
                    border: "1px solid rgba(255,255,255,0.1)"
                  }} 
                />
              )}
            </Stack>
          </Box>
        </Container>
      </PageContainer>
    </MotionConfig>
  );
}
