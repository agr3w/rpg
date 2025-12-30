import React, { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Stack, Typography, Chip } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

function AppCard({
  title,
  description,
  to,
  image,
  accent = "primary",
  badge,
  disabled = false,
  icon: Icon,
}) {
  const theme = useTheme();
  const navigate = useNavigate();

  // Garante que pegamos a cor certa do tema ou um fallback
  const accentColor = theme.palette?.[accent]?.main || theme.palette.primary.main;
  const inkColor = "#2c1a10"; // Cor de tinta escura padrão

  const onClick = useCallback(() => {
    if (disabled) return;
    if (!to) return;
    navigate(to);
  }, [disabled, navigate, to]);

  const isClickable = Boolean(to) && !disabled;

  return (
    <Paper
      elevation={0}
      onClick={onClick}
      role={isClickable ? "link" : undefined}
      tabIndex={isClickable ? 0 : -1}
      onKeyDown={(e) => {
        if (!isClickable) return;
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      sx={{
        borderRadius: 3, // Bordas um pouco mais suaves
        overflow: "hidden",
        position: "relative",
        cursor: isClickable ? "pointer" : "default",
        userSelect: "none",
        height: "100%", // Garante altura igual em grids
        display: "flex",
        flexDirection: "column",

        // ✅ Estética de Pergaminho Iluminado
        background: `linear-gradient(135deg, #fffbf0 0%, #f3eacb 100%)`,
        border: `1px solid ${alpha(accentColor, 0.2)}`,
        
        // Sombra inicial suave
        boxShadow: "0 4px 12px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.4)",

        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",

        "&:hover": isClickable
          ? {
              transform: "translateY(-6px)", // Levita mais
              // Brilho mágico na borda e sombra profunda
              boxShadow: `0 12px 28px -4px rgba(0,0,0,0.25), 0 0 0 1px ${alpha(accentColor, 0.6)}`,
              borderColor: "transparent",
              "& .card-arrow": {
                transform: "translateX(4px)", // Anima a seta
                opacity: 1,
                color: accentColor,
              },
              "& .card-icon-bg": {
                bgcolor: alpha(accentColor, 0.2), // Intensifica o fundo do ícone
                transform: "scale(1.1) rotate(-5deg)", // Movimento lúdico no ícone
              }
            }
          : undefined,

        "&:active": isClickable ? { transform: "translateY(-2px)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" } : undefined,

        opacity: disabled ? 0.6 : 1,
        filter: disabled ? "grayscale(0.8)" : "none",
      }}
    >
      <Box
        sx={{
          p: 2.5,
          display: "flex",
          flexDirection: "row",
          gap: 2,
          alignItems: "flex-start",
          flexGrow: 1,
        }}
      >
        {/* ✅ Ícone como "Selo Mágico" */}
        {Icon && (
          <Box
            className="card-icon-bg"
            sx={{
              width: 48,
              height: 48,
              borderRadius: "12px",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              bgcolor: alpha(accentColor, 0.1),
              color: accentColor,
              border: `1px solid ${alpha(accentColor, 0.2)}`,
              transition: "all 0.3s ease",
            }}
          >
            <Icon sx={{ fontSize: 26 }} />
          </Box>
        )}

        <Stack spacing={1} sx={{ flexGrow: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: "Cinzel", 
                fontWeight: 800, 
                color: inkColor,
                lineHeight: 1.2,
                fontSize: "1.1rem"
              }}
            >
              {title}
            </Typography>
            
            {badge && (
              <Chip
                size="small"
                label={badge}
                sx={{
                  height: 20,
                  fontSize: "0.65rem",
                  fontWeight: 900,
                  bgcolor: accentColor,
                  color: "#fff",
                  fontFamily: "Cinzel",
                }}
              />
            )}
          </Box>

          {description && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: alpha(inkColor, 0.75), 
                fontSize: "0.85rem",
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
              }}
            >
              {description}
            </Typography>
          )}
        </Stack>
      </Box>

      {/* Imagem (se houver) - Estilo "Janela" */}
      {image && (
        <Box
          sx={{
            height: 100,
            width: "100%",
            overflow: "hidden",
            position: "relative",
            borderTop: `1px solid ${alpha(inkColor, 0.1)}`,
          }}
        >
          <Box
            component="img"
            src={image}
            alt=""
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "sepia(0.2) contrast(1.1)", // Filtro vintage
              transition: "transform 0.5s ease",
              ".MuiPaper-root:hover &": {
                transform: "scale(1.05)",
              }
            }}
          />
          {/* Gradiente para suavizar a transição da imagem para o texto */}
          <Box 
            sx={{ 
              position: "absolute", 
              top: 0, 
              left: 0, 
              right: 0, 
              height: "20px", 
              background: "linear-gradient(to bottom, rgba(243, 234, 203, 1), transparent)" 
            }} 
          />
        </Box>
      )}

      {/* Rodapé do Card com CTA */}
      {!image && isClickable && (
        <Box 
          sx={{ 
            px: 2.5, 
            pb: 2, 
            pt: 0,
            mt: "auto",
            display: "flex", 
            alignItems: "center",
            justifyContent: "flex-end"
          }}
        >
          <Typography 
            variant="caption" 
            sx={{ 
              fontWeight: 800, 
              color: alpha(inkColor, 0.5), 
              textTransform: "uppercase", 
              letterSpacing: 1,
              mr: 1,
              fontSize: "0.7rem",
              transition: "color 0.3s"
            }}
            className="card-cta-text"
          >
            {disabled ? "Em Breve" : "Acessar"}
          </Typography>
          <ArrowForwardRoundedIcon 
            className="card-arrow"
            sx={{ 
              fontSize: 18, 
              color: alpha(inkColor, 0.4), 
              transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              opacity: 0.7
            }} 
          />
        </Box>
      )}
      
      {/* Barra de Acento Inferior */}
      <Box
        sx={{
          height: 3,
          background: `linear-gradient(90deg, ${alpha(accentColor, 0.0)}, ${alpha(
            accentColor,
            0.65
          )}, ${alpha(accentColor, 0.0)})`,
        }}
      />
    </Paper>
  );
}

export default memo(AppCard);