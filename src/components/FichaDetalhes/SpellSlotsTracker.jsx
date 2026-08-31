import React from "react";
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  Paper,
  Button,
  Grid,
  alpha,
  useTheme,
} from "@mui/material";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

export default function SpellSlotsTracker({
  slots = {},
  defaultSlots = {},
  onToggleSlot,
  onLongRest,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const arcanaColor = isDark ? "#ba68c8" : "#8e24aa";
  const arcanaBorder = isDark ? "rgba(186, 104, 200, 0.3)" : "rgba(142, 36, 170, 0.25)";
  const strokeColor = isDark ? "rgba(229,179,36,0.2)" : "rgba(131,60,11,0.2)";
  const cardBg = isDark ? "rgba(24, 16, 28, 0.88)" : "rgba(255, 252, 246, 0.94)";

  // Círculos ativos (onde o total definido ou padrão da classe seja > 0)
  const activeCircles = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((c) => {
    const total = Number(slots[c]?.total || defaultSlots[c] || 0);
    return total > 0;
  });

  if (activeCircles.length === 0) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: `1px solid ${arcanaBorder}`,
        bgcolor: cardBg,
        backdropFilter: "blur(6px)",
        mb: 2.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
          mb: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AutoStoriesIcon sx={{ color: arcanaColor, fontSize: 20 }} />
          <Typography
            variant="subtitle1"
            sx={{
              fontFamily: "Cinzel",
              fontWeight: 900,
              color: isDark ? "#fff" : "#2c1a10",
            }}
          >
            Espaços de Magia (Spell Slots)
          </Typography>
        </Box>

        <Button
          type="button"
          size="small"
          variant="outlined"
          startIcon={<BedtimeIcon />}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onLongRest?.();
          }}
          sx={{
            fontFamily: "Cinzel",
            fontWeight: 800,
            fontSize: "0.75rem",
            borderColor: arcanaBorder,
            color: arcanaColor,
            "&:hover": {
              borderColor: arcanaColor,
              bgcolor: alpha(arcanaColor, 0.1),
            },
          }}
        >
          Descanso Longo (Restaurar)
        </Button>
      </Box>

      <Grid container spacing={1.5}>
        {activeCircles.map((circulo) => {
          const total = Number(slots[circulo]?.total || defaultSlots[circulo] || 0);
          const gastos = Number(slots[circulo]?.used ?? slots[circulo]?.gastos ?? 0);
          const disponiveis = Math.max(0, total - gastos);

          return (
            <Grid item xs={12} sm={6} md={4} key={`spell-slot-circulo-${circulo}`}>
              <Paper
                elevation={0}
                sx={{
                  p: 1.25,
                  borderRadius: 2,
                  border: `1px solid ${strokeColor}`,
                  bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 0.18s ease",
                  "&:hover": {
                    borderColor: arcanaColor,
                  },
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: "Cinzel",
                      fontWeight: 900,
                      color: isDark ? "#fff" : "#2c1a10",
                      display: "block",
                      lineHeight: 1.2,
                    }}
                  >
                    {circulo}º Círculo
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: disponiveis > 0 ? arcanaColor : "text.secondary",
                      fontWeight: 700,
                      fontSize: "0.7rem",
                    }}
                  >
                    {disponiveis} de {total} disponíveis
                  </Typography>
                </Box>

                {/* Orbes Táteis Interativos */}
                <Stack direction="row" spacing={0.5} alignItems="center">
                  {Array.from({ length: total }).map((_, idx) => {
                    const isAvailable = idx < disponiveis;
                    return (
                      <Tooltip
                        key={`orb-${circulo}-${idx}`}
                        title={
                          isAvailable
                            ? "Espaço disponível (clique para gastar)"
                            : "Espaço gasto (clique para recuperar)"
                        }
                      >
                        <IconButton
                          type="button"
                          size="small"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onToggleSlot?.(
                              circulo,
                              isAvailable ? gastos + 1 : Math.max(0, gastos - 1)
                            );
                          }}
                          sx={{
                            p: 0.25,
                            color: isAvailable ? arcanaColor : "text.secondary",
                            opacity: isAvailable ? 1 : 0.4,
                            transition: "all 0.18s ease",
                            "&:hover": {
                              transform: "scale(1.2)",
                              opacity: 1,
                            },
                          }}
                        >
                          {isAvailable ? (
                            <RadioButtonCheckedIcon sx={{ fontSize: 20 }} />
                          ) : (
                            <RadioButtonUncheckedIcon sx={{ fontSize: 20 }} />
                          )}
                        </IconButton>
                      </Tooltip>
                    );
                  })}
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
}
