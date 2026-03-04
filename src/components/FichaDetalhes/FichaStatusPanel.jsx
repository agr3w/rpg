//// filepath: src/components/FichaDetalhes/FichaStatusPanel.jsx
import React from "react";
import {
  Paper,
  Box,
  Typography,
  Grid,
  IconButton,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const clamp3 = (n) => Math.min(3, Math.max(0, n || 0));

export default function FichaStatusPanel({
  dexMod = 0,
  deslocamento = "—",
  tamanho = "—",
  passivePerception = 10,
  deathSaves = { successes: 0, failures: 0 },
  onChangeDeathSaves,
}) {
  const handleChange = (field, delta) => {
    if (!onChangeDeathSaves) return;
    const next = {
      successes:
        field === "successes"
          ? clamp3((deathSaves.successes || 0) + delta)
          : clamp3(deathSaves.successes),
      failures:
        field === "failures"
          ? clamp3((deathSaves.failures || 0) + delta)
          : clamp3(deathSaves.failures),
    };
    onChangeDeathSaves(next);
  };

  const handleClear = () => {
    if (!onChangeDeathSaves) return;
    onChangeDeathSaves({ successes: 0, failures: 0 });
  };

  const renderBoxes = (filled) => (
    <Box sx={{ display: "flex", gap: 0.5 }}>
      {Array.from({ length: 3 }).map((_, i) => (
        <Box
          key={i}
          sx={{
            width: 16,
            height: 16,
            borderRadius: 0.5,
            border: "1px solid var(--ficha-line, rgba(47,35,24,0.22))",
            bgcolor: i < filled ? "var(--ficha-accent, #bf8f00)" : "transparent",
          }}
        />
      ))}
    </Box>
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={7}>
        <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2.5, border: "1px solid var(--ficha-accent-soft, rgba(191,143,0,0.25))", bgcolor: "var(--ficha-surface, rgba(236,225,207,0.9))", color: "var(--ficha-text, #2f2318)" }}>
          <Grid container spacing={1}>
            {[
              {
                label: "Iniciativa",
                value: dexMod >= 0 ? `+${dexMod}` : dexMod,
              },
              { label: "Deslocamento", value: deslocamento },
              { label: "Tamanho", value: tamanho },
              { label: "Percepção Passiva", value: passivePerception },
            ].map((item) => (
              <Grid item xs={6} sm={3} key={item.label}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "var(--ficha-text-muted, rgba(47,35,24,0.74))" }}>
                    {item.label}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: "var(--ficha-text, #2f2318)", fontWeight: 700 }}>
                    {item.value}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>

      <Grid item xs={12} md={5}>
        <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2.5, border: "1px solid var(--ficha-accent-soft, rgba(191,143,0,0.25))", bgcolor: "var(--ficha-surface, rgba(236,225,207,0.9))", color: "var(--ficha-text, #2f2318)" }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, display: "block", mb: 0.5, color: "var(--ficha-text-muted, rgba(47,35,24,0.74))" }}
          >
            Salvaguarda contra morte
          </Typography>

          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="caption" sx={{ color: "var(--ficha-text-muted, rgba(47,35,24,0.74))" }}>Sucessos</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {renderBoxes(deathSaves.successes || 0)}
                <IconButton
                  size="small"
                  onClick={() => handleChange("successes", 1)}
                  sx={{ color: "var(--ficha-accent, #bf8f00)" }}
                >
                  <AddIcon fontSize="inherit" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleChange("successes", -1)}
                  sx={{ color: "var(--ficha-accent, #bf8f00)" }}
                >
                  <RemoveIcon fontSize="inherit" />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" sx={{ color: "var(--ficha-text-muted, rgba(47,35,24,0.74))" }}>Falhas</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {renderBoxes(deathSaves.failures || 0)}
                <IconButton
                  size="small"
                  onClick={() => handleChange("failures", 1)}
                  sx={{ color: "var(--ficha-accent-deep, rgba(131,60,11,0.34))" }}
                >
                  <AddIcon fontSize="inherit" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleChange("failures", -1)}
                  sx={{ color: "var(--ficha-accent-deep, rgba(131,60,11,0.34))" }}
                >
                  <RemoveIcon fontSize="inherit" />
                </IconButton>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 1, textAlign: "right" }}>
            <Button
              size="small"
              variant="text"
              onClick={handleClear}
              disabled={
                (deathSaves.successes || 0) === 0 &&
                (deathSaves.failures || 0) === 0
              }
              sx={{ color: "var(--ficha-text-muted, rgba(47,35,24,0.74))", fontWeight: 700 }}
            >
              Limpar seleção
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}