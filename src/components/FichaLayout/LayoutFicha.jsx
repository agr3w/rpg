import React from "react";
import { Container, Box, Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";

// Cores inspiradas no Livro do Jogador (PHB)
const DND_THEME = {
  paperBg: "#fdf6e3", // Bege claro (base)
  paperTexture: `
    linear-gradient(to right, rgba(0,0,0,0.02), rgba(0,0,0,0) 10%, rgba(0,0,0,0) 90%, rgba(0,0,0,0.02)),
    url("https://www.transparenttextures.com/patterns/aged-paper.png")
  `, // Textura sutil (opcional, se não carregar fica bege)
  borderInner: "2px solid #c9ad6a", // Dourado fosco
  borderOuter: "1px solid #5c4033", // Marrom escuro (couro)
  ink: "#2c1a10", // Cor de tinta
  headerRed: "#58180D", // Vermelho sangue seco (títulos)
};

export default function LayoutFicha({ title, children }) {
  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Box
          sx={{
            position: "relative",
            p: "6px", // Espaço para a borda dupla
            borderRadius: "12px",
            background: "linear-gradient(135deg, #463020 0%, #2a1a10 100%)", // Fundo da "mesa" ou couro atrás do papel
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)", // Sombra profunda
          }}
        >
          {/* O "Papel" em si */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: "8px",
              backgroundColor: DND_THEME.paperBg,
              // Truque para parecer papel envelhecido usando CSS puro
              backgroundImage: `
                radial-gradient(circle at center, #fffbf0 0%, #f3eacb 100%)
              `,
              // Vinheta interna (bordas escurecidas)
              boxShadow: "inset 0 0 60px rgba(139, 69, 19, 0.15)",
              border: DND_THEME.borderInner,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Detalhe decorativo nos cantos (CSS puro) */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: "linear-gradient(90deg, transparent, #c9ad6a, transparent)",
                opacity: 0.6,
              }}
            />

            <Typography
              variant="h4"
              component="h1"
              align="center"
              sx={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 900,
                color: DND_THEME.headerRed,
                mb: 1,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                textShadow: "0 1px 1px rgba(255,255,255,0.8)",
                borderBottom: `2px solid ${DND_THEME.headerRed}`,
                pb: 1,
                mx: 2,
              }}
            >
              {title}
            </Typography>

            {/* Conteúdo da etapa */}
            <Box
              sx={{
                mt: 3,
                width: "100%",
                "& .MuiTypography-root": {
                  color: DND_THEME.ink,
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(44, 26, 16, 0.7)",
                  fontFamily: "'Cinzel', serif",
                },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255,255,255,0.4)",
                  "& fieldset": {
                    borderColor: "rgba(92, 64, 51, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "#c9ad6a",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: DND_THEME.headerRed,
                  },
                },
                // Estiliza os Selects e Menus
                "& .MuiSelect-select": {
                  color: DND_THEME.ink,
                  fontWeight: 600,
                },
              }}
            >
              {children}
            </Box>
          </Paper>
        </Box>
      </motion.div>
    </Container>
  );
}