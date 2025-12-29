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
            border: "1px solid rgba(0,0,0,0.7)",
            bgcolor: i < filled ? "text.primary" : "transparent",
          }}
        />
      ))}
    </Box>
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={7}>
        <Paper elevation={3} sx={{ p: 1.5 }}>
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
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {item.label}
                  </Typography>
                  <Typography variant="subtitle1">
                    {item.value}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>

      <Grid item xs={12} md={5}>
        <Paper elevation={3} sx={{ p: 1.5 }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, display: "block", mb: 0.5 }}
          >
            Salvaguarda contra morte
          </Typography>

          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="caption">Sucessos</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {renderBoxes(deathSaves.successes || 0)}
                <IconButton
                  size="small"
                  onClick={() => handleChange("successes", 1)}
                >
                  <AddIcon fontSize="inherit" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleChange("successes", -1)}
                >
                  <RemoveIcon fontSize="inherit" />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption">Falhas</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {renderBoxes(deathSaves.failures || 0)}
                <IconButton
                  size="small"
                  onClick={() => handleChange("failures", 1)}
                >
                  <AddIcon fontSize="inherit" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleChange("failures", -1)}
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
            >
              Limpar seleção
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}