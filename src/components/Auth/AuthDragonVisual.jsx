// src/components/Auth/AuthDragonVisual.jsx
import React from "react";
import { Box, Typography, Stack, Paper, Chip, useTheme } from "@mui/material";
import { alpha, keyframes } from "@mui/material/styles";
import ShieldIcon from "@mui/icons-material/Shield";
import MapIcon from "@mui/icons-material/Map";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import ScienceIcon from "@mui/icons-material/Science";
import BoltIcon from "@mui/icons-material/Bolt";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

// Animações
const rotateRune = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const counterRotate = keyframes`
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
`;

const pulseDragon = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 15px rgba(255, 69, 0, 0.5)) drop-shadow(0 0 35px rgba(0, 176, 255, 0.4));
    transform: scale(1);
  }
  50% {
    filter: drop-shadow(0 0 30px rgba(255, 215, 0, 0.8)) drop-shadow(0 0 55px rgba(0, 230, 118, 0.5));
    transform: scale(1.04);
  }
`;

export default function AuthDragonVisual() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const dragonPillars = [
    {
      element: "Fogo",
      title: "Grimório & Fichas D&D 5e",
      desc: "Automações completas, cálculo de atributos, magias e modal de Level Up com rolagem de HP.",
      icon: <WhatshotIcon sx={{ fontSize: 24 }} />,
      color: "#ff3d00",
      glowColor: "rgba(255, 61, 0, 0.35)",
      bgGrad: isDark 
        ? "linear-gradient(135deg, rgba(255,61,0,0.12) 0%, rgba(30,10,5,0.7) 100%)" 
        : "linear-gradient(135deg, rgba(255,61,0,0.08) 0%, rgba(255,245,240,0.9) 100%)",
    
      
    },
    {
      element: "Ácido",
      title: "Mapas & VTT Tático",
      desc: "Grid inteligente com snap-to-grid, névoa de guerra dinâmica, réguas 5e e exportação .dd2vtt.",
      icon: <ScienceIcon sx={{ fontSize: 24 }} />,
      color: "#00e676",
      glowColor: "rgba(0, 230, 118, 0.3)",
      bgGrad: isDark 
        ? "linear-gradient(135deg, rgba(0,230,118,0.12) 0%, rgba(5,25,12,0.7) 100%)" 
        : "linear-gradient(135deg, rgba(0,230,118,0.08) 0%, rgba(240,255,245,0.9) 100%)",
    
      
    },
    {
      element: "Raio",
      title: "Diário de Campanhas",
      desc: "Registro cronológico de sessões, linha do tempo, distribuição de XP e árvore de missões.",
      icon: <BoltIcon sx={{ fontSize: 24 }} />,
      color: "#00b0ff",
      glowColor: "rgba(0, 176, 255, 0.35)",
      bgGrad: isDark 
        ? "linear-gradient(135deg, rgba(0,176,255,0.12) 0%, rgba(5,15,30,0.7) 100%)" 
        : "linear-gradient(135deg, rgba(0,176,255,0.08) 0%, rgba(240,250,255,0.9) 100%)",
    
      
    },
    {
      element: "Gelo",
      title: "Taverna do Bardo & Biblioteca",
      desc: "Player de trilhas sonoras atmosféricas e grimório de documentos, enigmas e segredos.",
      icon: <AcUnitIcon sx={{ fontSize: 24 }} />,
      color: "#b388ff",
      glowColor: "rgba(179, 136, 255, 0.35)",
      bgGrad: isDark 
        ? "linear-gradient(135deg, rgba(179,136,255,0.12) 0%, rgba(20,10,35,0.7) 100%)" 
        : "linear-gradient(135deg, rgba(179,136,255,0.08) 0%, rgba(250,245,255,0.9) 100%)",
    
      
    }
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        p: { xs: 2.5, md: 3.5 },
        borderRadius: 4,
        bgcolor: isDark ? "rgba(18, 12, 9, 0.92)" : "rgba(255, 252, 245, 0.95)",
        border: isDark ? "1px solid rgba(212,175,55,0.35)" : "1px solid rgba(139,94,60,0.35)",
        boxShadow: isDark 
          ? "0 25px 70px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,215,0,0.2)" 
          : "0 20px 60px rgba(100,60,20,0.18), inset 0 1px 2px rgba(255,255,255,0.8)",
        backdropFilter: "blur(14px)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Círculo Místico Quad-Elemental no Fundo */}
      <Box
        sx={{
          position: "absolute",
          top: "-15%",
          right: "-15%",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(255,61,0,0.15) 0%, rgba(0,176,255,0.1) 40%, rgba(0,230,118,0.08) 70%, transparent 80%)"
            : "radial-gradient(circle, rgba(255,100,0,0.12) 0%, rgba(0,176,255,0.1) 40%, rgba(0,230,118,0.08) 70%, transparent 80%)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      {/* Header Visual com Brasão Elemental do Dragão */}
      <Box sx={{ position: "relative", zIndex: 1, textAlign: "center", mb: 2 }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            width: 105,
            height: 105,
            mb: 1.2,
            animation: `${pulseDragon} 4s ease-in-out infinite`
          }}
        >
          {/* Anel Externo Quad-Color de Runas */}
          <Box
            sx={{
              position: "absolute",
              inset: -8,
              borderRadius: "50%",
              border: "2px dashed transparent",
              backgroundImage: "conic-gradient(from 0deg, #ff3d00, #00e676, #00b0ff, #b388ff, #ff3d00)",
              WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 0)",
              animation: `${rotateRune} 20s linear infinite`
            }}
          />

          {/* Anel Interno Contrário */}
          <Box
            sx={{
              position: "absolute",
              inset: -2,
              borderRadius: "50%",
              border: isDark ? "1px solid rgba(255,215,0,0.4)" : "1px solid rgba(139,94,60,0.4)",
              animation: `${counterRotate} 15s linear infinite`
            }}
          />

          {/* SVG do Dragão & D20 Épico */}
          <svg width="78" height="78" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="dragonMulti" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff5722" />
                <stop offset="35%" stopColor="#ffd700" />
                <stop offset="70%" stopColor="#00e676" />
                <stop offset="100%" stopColor="#00b0ff" />
              </linearGradient>
            </defs>
            <polygon 
              points="50,6 90,28 90,72 50,94 10,72 10,28" 
              stroke="url(#dragonMulti)" 
              strokeWidth="3.5" 
              fill={isDark ? "rgba(10,5,3,0.8)" : "rgba(255,255,255,0.85)"} 
            />
            <polygon points="50,6 30,35 50,94 70,35" stroke="url(#dragonMulti)" strokeWidth="2.5" fill="none" />
            <line x1="10" y1="28" x2="90" y2="28" stroke="url(#dragonMulti)" strokeWidth="2" opacity="0.8" />
            <line x1="30" y1="35" x2="10" y2="72" stroke="url(#dragonMulti)" strokeWidth="2" opacity="0.8" />
            <line x1="70" y1="35" x2="90" y2="72" stroke="url(#dragonMulti)" strokeWidth="2" opacity="0.8" />
            
            {/* Cabeça do Dragão Místico */}
            <path
              d="M50 24 C44 32, 40 40, 36 48 C42 46, 46 48, 50 56 C54 48, 58 46, 64 48 C60 40, 56 32, 50 24 Z"
              fill="url(#dragonMulti)"
            />
            <circle cx="45" cy="38" r="2.2" fill="#ff1744" />
            <circle cx="55" cy="38" r="2.2" fill="#00e676" />
            <path d="M48 64 L52 64 L50 74 Z" fill="url(#dragonMulti)" />
          </svg>
        </Box>

        <Typography
          variant="h5"
          sx={{
            fontFamily: "Cinzel, serif",
            fontWeight: 900,
            color: isDark ? "#ffd700" : "#6d3008",
            letterSpacing: 1.2,
            textShadow: isDark ? "0 2px 10px rgba(0,0,0,0.9)" : "none"
          }}
        >
          O Grimório Definitivo
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: isDark ? "#dcd3c2" : "#6e4b31",
            fontFamily: "Roboto, sans-serif",
            maxWidth: 380,
            mx: "auto",
            mt: 0.3,
            lineHeight: 1.4,
            fontSize: "0.85rem"
          }}
        >
          Seu hub completo de RPG de mesa: forje heróis, comande tabuleiros táticos e narre campanhas inesquecíveis.
        </Typography>
      </Box>

      {/* Os 4 Pilares com Cores Vivas e Efeito 3D de Profundidade */}
      <Stack spacing={1.5} sx={{ position: "relative", zIndex: 1, my: 1.5 }}>
        {dragonPillars.map((item, idx) => (
          <Paper
            key={idx}
            elevation={0}
            sx={{
              p: 1.8,
              display: "flex",
              alignItems: "flex-start",
              gap: 1.8,
              background: item.bgGrad,
              border: `1.5px solid ${alpha(item.color, isDark ? 0.35 : 0.3)}`,
              borderRadius: 2.5,
              boxShadow: isDark 
                ? `0 6px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)` 
                : `0 6px 18px ${alpha(item.color, 0.12)}, inset 0 1px 0 rgba(255,255,255,0.8)`,
              transition: "all 0.25s cubic-bezier(0.2, 0, 0, 1)",
              "&:hover": {
                borderColor: item.color,
                boxShadow: `0 10px 28px ${item.glowColor}`,
                transform: "translateY(-3px)",
                background: isDark 
                  ? `linear-gradient(135deg, ${alpha(item.color, 0.22)} 0%, rgba(20,10,8,0.9) 100%)` 
                  : `linear-gradient(135deg, ${alpha(item.color, 0.15)} 0%, rgba(255,255,255,0.98) 100%)`
              }
            }}
          >
            {/* Ícone com Aura Colorida */}
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                bgcolor: alpha(item.color, isDark ? 0.25 : 0.15),
                color: item.color,
                display: "grid",
                placeItems: "center",
                boxShadow: `0 0 12px ${alpha(item.color, 0.3)}`,
                border: `1px solid ${alpha(item.color, 0.4)}`
              }}
            >
              {item.icon}
            </Box>

            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontFamily: "Cinzel, serif",
                    fontWeight: 800,
                    color: isDark ? "#fff" : "#24140b",
                    fontSize: "0.9rem",
                    lineHeight: 1.2
                  }}
                >
                  {item.title}
                </Typography>
              </Box>

              <Typography
                variant="caption"
                sx={{
                  color: isDark ? "#dcd3c2" : "#553a26",
                  fontFamily: "Roboto, sans-serif",
                  display: "block",
                  lineHeight: 1.45,
                  fontSize: "0.78rem"
                }}
              >
                {item.desc}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Stack>

      {/* Citação Épica de RPG */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          p: 1.8,
          borderRadius: 2,
          bgcolor: isDark ? "rgba(255,215,0,0.06)" : "rgba(131,60,11,0.05)",
          border: isDark ? "1px solid rgba(212,175,55,0.25)" : "1px solid rgba(139,94,60,0.2)",
          textAlign: "center"
        }}
      >
        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mb: 0.3 }}>
          <AutoAwesomeIcon sx={{ color: isDark ? "#ffd700" : "#833c0b", fontSize: 15 }} />
          <Typography
            variant="caption"
            sx={{
              fontFamily: "Cinzel",
              fontWeight: 800,
              color: isDark ? "#ffd700" : "#833c0b",
              letterSpacing: 1,
              fontSize: "0.75rem"
            }}
          >
            A AVENTURA AGUARDA
          </Typography>
          <AutoAwesomeIcon sx={{ color: isDark ? "#ffd700" : "#833c0b", fontSize: 15 }} />
        </Stack>
        <Typography
          variant="caption"
          sx={{
            fontStyle: "italic",
            color: isDark ? "#b8ab99" : "#6e4b31",
            display: "block",
            fontSize: "0.76rem",
            lineHeight: 1.4
          }}
        >
          "Grandes lendas são forjadas a cada rolagem de dados e decisão tomada."
        </Typography>
      </Box>
    </Box>
  );
}
