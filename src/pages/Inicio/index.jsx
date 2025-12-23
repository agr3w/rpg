// Inicio.js
import React, { memo } from "react";
import { motion, MotionConfig, useReducedMotion } from "framer-motion"; // ✅ add useReducedMotion
import {
  Box,
  Container,
  Paper,
  Stack,
  Typography,
  Divider,
  Chip,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import { T_IN } from "../../config/transitions";

import bg from "./tumblr_okx6d5BR4K1rnbw6mo1_540.webp";
import AppCard from "components/Cards/AppCard";
import { HOME_SECTIONS } from "components/Cards/cardsRegistry";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, when: "beforeChildren" },
  },
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: T_IN * 0.44, ease: [0.22, 1, 0.36, 1] },
  },
};

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
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2.5,
        bgcolor: alpha(theme.palette.background.paper, 0.92),
        boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
        p: { xs: 1.5, sm: 2, md: 2.25 },

        // ✅ diferenciação visual por seção
        border: `1px solid ${alpha(accentColor, 0.22)}`,
        backgroundImage: `
          linear-gradient(180deg,
            ${alpha(accentColor, 0.10)} 0%,
            ${alpha(theme.palette.background.paper, 0.92)} 42%,
            ${alpha(theme.palette.background.paper, 0.92)} 100%
          )
        `,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          borderRadius: 2.5,
          pointerEvents: "none",
          boxShadow: `inset 0 0 0 1px ${alpha("#000", 0.06)}`,
        },

        // ✅ PERF: renderização preguiçosa (ótimo quando você tiver mais cards/seções)
        contentVisibility: "auto",
        containIntrinsicSize: "420px",
      }}
    >
      <Stack spacing={0.75}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="space-between"
          sx={{ gap: 1, flexWrap: "wrap" }}
        >
          <Typography variant="h6" sx={{ fontWeight: 900, color: "#2c1a10" }}>
            {title}
          </Typography>

          {chipLabel ? (
            <Chip
              size="small"
              label={chipLabel}
              sx={{
                fontWeight: 900,
                bgcolor: alpha(accentColor, 0.14),
                border: `1px solid ${alpha(accentColor, 0.35)}`,
                color: alpha("#2c1a10", 0.92),
              }}
            />
          ) : null}
        </Stack>

        {subtitle ? (
          <Typography sx={{ color: "rgba(44,26,16,0.85)" }}>{subtitle}</Typography>
        ) : null}

        <Divider sx={{ borderColor: alpha(accentColor, 0.20) }} />

        {children}
      </Stack>
    </Paper>
  );
});

export default function Inicio() {
  const prefersReducedMotion = useReducedMotion(); // ✅ PERF: respeita config do usuário

  const sections = HOME_SECTIONS;

  return (
    <MotionConfig reducedMotion="user">
      <Box
        component={motion.div}
        initial="hidden"
        animate="show"
        variants={prefersReducedMotion ? undefined : containerVariants} // ✅ PERF: sem stagger quando reduz motion
        sx={{
          minHeight: "100vh",
          position: "relative",

          // ✅ PERF: "fixed" em mobile costuma causar engasgo em scroll
          "&::before": {
            content: '""',
            position: { xs: "absolute", md: "fixed" }, // ✅
            inset: 0,
            zIndex: -2,
            backgroundImage: `linear-gradient(rgba(16, 18, 16, 0.55), rgba(16, 18, 16, 0.55)), url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          },
          "&::after": {
            content: '""',
            position: { xs: "absolute", md: "fixed" }, // ✅
            inset: 0,
            zIndex: -1,
            background:
              "radial-gradient(80% 60% at 50% 30%, rgba(255,255,255,0.08), rgba(0,0,0,0.35))",
            pointerEvents: "none",
          },

          py: { xs: 2, md: 5 },
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
                Escolha um caminho — campanha primeiro, ou ferramentas do seu acervo.
              </Typography>
            </Stack>
          </Paper>

          <Stack spacing={2}>
            {sections.map((section) => (
              <Section
                key={section.key}
                title={section.title}
                subtitle={section.subtitle}
                chipLabel={section.chipLabel}
                accent={section.accent}
              >
                <Box
                  sx={{
                    display: "grid",
                    gap: 1.5,
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1fr 1fr",
                      lg: "1fr 1fr 1fr",
                    },
                  }}
                >
                  {section.items.map((card) => {
                    const Wrapper = prefersReducedMotion ? Box : motion.div; // ✅ PERF: sem motion quando reduz
                    return (
                      <Box key={card.id} component={Wrapper} variants={cardItemVariants}>
                        <AppCard {...card} />
                      </Box>
                    );
                  })}
                </Box>
              </Section>
            ))}
          </Stack>

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
