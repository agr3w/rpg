import React, { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Stack, Typography, Chip } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded"; // ✅ add

function AppCard({
  title,
  description,
  to,
  image,
  accent = "primary",
  badge,
  disabled = false,
  icon: Icon, // ✅ add (componente de ícone opcional)
}) {
  const theme = useTheme();
  const navigate = useNavigate();

  const accentColor = theme.palette?.[accent]?.main || theme.palette.primary.main;

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
      aria-label={isClickable ? `Abrir ${title}` : title}
      title={isClickable ? "Clique para abrir" : undefined}
      onKeyDown={(e) => {
        if (!isClickable) return;
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      sx={{
        borderRadius: 2.5,
        overflow: "hidden",
        position: "relative",
        cursor: isClickable ? "pointer" : "default",
        userSelect: "none",

        bgcolor: "rgba(223, 214, 205, 0.92)",
        border: `1px solid ${alpha(accentColor, 0.22)}`,
        boxShadow: "0 10px 26px rgba(0,0,0,0.14)",

        transition:
          "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease, background-color 180ms ease",

        "&:hover": isClickable
          ? {
              transform: "translateY(-3px)",
              boxShadow: `0 18px 40px ${alpha("#000", 0.28)}`,
              borderColor: alpha(accentColor, 0.55),
            }
          : undefined,

        "&:active": isClickable ? { transform: "translateY(-1px)" } : undefined,

        // ✅ ring claro quando navega por teclado
        "&:focus-visible": isClickable
          ? {
              outline: `3px solid ${alpha(accentColor, 0.35)}`,
              outlineOffset: 2,
              borderColor: alpha(accentColor, 0.65),
            }
          : undefined,

        opacity: disabled ? 0.78 : 1,
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "grid",
          gridTemplateColumns: image ? "1fr 120px" : "1fr",
          gap: 1.5,
          alignItems: "center",
        }}
      >
        <Stack spacing={0.9}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ flexWrap: "wrap", gap: 1 }}
          >
            {/* ✅ Ícone da funcionalidade */}
            {Icon ? (
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: alpha(accentColor, 0.12),
                  border: `1px solid ${alpha(accentColor, 0.22)}`,
                }}
              >
                <Icon sx={{ fontSize: 20, color: alpha("#2c1a10", 0.92) }} />
              </Box>
            ) : null}

            <Typography sx={{ fontWeight: 950, color: "#2c1a10", lineHeight: 1.1 }}>
              {title}
            </Typography>

            {badge ? (
              <Chip
                size="small"
                label={badge}
                sx={{
                  fontWeight: 900,
                  bgcolor: alpha(accentColor, 0.14),
                  border: `1px solid ${alpha(accentColor, 0.35)}`,
                  color: alpha("#2c1a10", 0.92),
                }}
              />
            ) : null}
          </Stack>

          {description ? (
            <Typography sx={{ color: "rgba(44,26,16,0.86)", fontSize: 13 }}>
              {description}
            </Typography>
          ) : null}

          {/* ✅ CTA explícito (mostra que clica) */}
          <Box
            sx={{
              mt: 0.25,
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              width: "fit-content",
              fontWeight: 900,
              fontSize: 12,
              letterSpacing: 0.4,
              textTransform: "uppercase",
              color: isClickable ? alpha("#2c1a10", 0.92) : alpha("#2c1a10", 0.55),
              borderRadius: 999,
              px: 1,
              py: 0.5,
              border: `1px solid ${alpha(accentColor, isClickable ? 0.30 : 0.16)}`,
              bgcolor: alpha(accentColor, isClickable ? 0.10 : 0.06),
            }}
          >
            {disabled ? "Em breve" : "Abrir"}
            <ArrowForwardRoundedIcon sx={{ fontSize: 16, opacity: isClickable ? 0.9 : 0.45 }} />
          </Box>
        </Stack>

        {image ? (
          <Box
            sx={{
              width: 120,
              height: 86,
              borderRadius: 2,
              overflow: "hidden",
              border: `1px solid ${alpha("#000", 0.10)}`,
              background: `linear-gradient(180deg, ${alpha(accentColor, 0.18)}, ${alpha("#000", 0.06)})`,
              display: "grid",
              placeItems: "center",
            }}
          >
            <Box
              component="img"
              alt=""
              src={image}
              loading="lazy"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "saturate(1.05) contrast(1.02)",
                opacity: 0.96,
              }}
            />
          </Box>
        ) : null}
      </Box>

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