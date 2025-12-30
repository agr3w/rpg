// MapasPage.js
import React from "react";
import mapas from "Array/MapasArray";
import MapaCard from "components/MapasPage/CardsMapas";
import { Box, Container, Paper, Stack, Typography, Link as MuiLink } from "@mui/material";
import { motion } from "framer-motion";
import { T_IN } from "config/transitions";

import castleBg from "./Castle.gif";

const ART_CREDIT = {
  label: "ThoaYYN",
  href: "https://imgur.com/ThoaYYN",
};

export default function MapasPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        py: { xs: 2, md: 4 },

        // ✅ background “da página” (imagem + overlay), sem CSS module
        "&::before": {
          content: '""',
          position: { xs: "absolute", md: "fixed" },
          inset: 0,
          zIndex: 0,
          backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${castleBg})`,
          backgroundSize: "cover",
          backgroundPosition: "bottom",
          backgroundRepeat: "no-repeat",
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { duration: T_IN * 0.18 } }}
        >
          <Stack spacing={2}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 2.5 },
                borderRadius: 3,
                border: "1px solid rgba(255,255,255,0.14)",
                bgcolor: "rgba(0,0,0,0.28)",
                backdropFilter: "blur(6px)",
              }}
            >
              <Typography
                variant="h3"
                sx={{ fontWeight: 1000, color: "#000000ff", textAlign: "center" }}
              >
                Mapas
              </Typography>
              <Typography sx={{ color: "rgba(0, 0, 0, 0.85)", textAlign: "center" }}>
                Biblioteca rápida de mapas para abrir e usar na sessão.
              </Typography>
            </Paper>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                gap: 2,
                alignItems: "stretch",
              }}
            >
              {mapas.map((mapa) => (
                <MapaCard
                  key={mapa?.titulo || mapa?.link || JSON.stringify(mapa)}
                  imagem={mapa.imagem}
                  link={mapa.link}
                  titulo={mapa.titulo}
                  icone={mapa.icone}
                />
              ))}
            </Box>

            <Typography variant="caption" sx={{ opacity: 0.85, color: "rgba(255,255,255,0.85)", textAlign: "center" }}>
              BackGround Art By:{" "}
              <MuiLink
                href={ART_CREDIT.href}
                target="_blank"
                rel="noreferrer"
                underline="hover"
                sx={{ fontWeight: 800, color: "inherit" }}
              >
                {ART_CREDIT.label}
              </MuiLink>
            </Typography>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
}
