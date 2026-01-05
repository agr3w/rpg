import React from "react";
import {
  Box, Typography, Switch, FormControlLabel, Slider,
  Grid, Paper, Divider, Tooltip
} from "@mui/material";
import { usePreferences } from "contexts/PreferencesContext";
import { DarkMode, LightMode, Speed, Visibility, VolumeUp } from "@mui/icons-material";

export default function PreferencesSection() {
  const { prefs, updatePrefs } = usePreferences();

  const handleToggle = (key) => {
    updatePrefs({ [key]: !prefs[key] });
  };

  const handleChange = (key, value) => {
    updatePrefs({ [key]: value });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontFamily: "Cinzel", color: "#58180D", mb: 2, fontWeight: "bold" }}>
        Visualização & Ambiente
      </Typography>
      
      <Grid container spacing={3}>
        {/* Tema */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, bgcolor: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.1)" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <DarkMode sx={{ color: "#58180D" }} />
              <Typography variant="subtitle1" sx={{ fontFamily: "Cinzel", fontWeight: "bold" }}>Modo Escuro</Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
              Alterna entre o pergaminho claro (Dia) e o couro escuro (Noite).
            </Typography>
            <FormControlLabel
              control={
                <Switch 
                  checked={prefs.themeMode === 'dark'} 
                  onChange={() => handleChange('themeMode', prefs.themeMode === 'dark' ? 'light' : 'dark')} 
                  color="primary" 
                />
              }
              label={prefs.themeMode === 'dark' ? "Ativado (Noite)" : "Desativado (Dia)"}
            />
          </Paper>
        </Grid>

        {/* Redução de Movimento (Performance) */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, bgcolor: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.1)" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Speed sx={{ color: "#58180D" }} />
              <Typography variant="subtitle1" sx={{ fontFamily: "Cinzel", fontWeight: "bold" }}>Desempenho</Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
              Reduz animações e efeitos para melhorar a velocidade em dispositivos antigos.
            </Typography>
            <FormControlLabel
              control={
                <Switch 
                  checked={prefs.reduceMotion} 
                  onChange={() => handleToggle('reduceMotion')} 
                  color="warning" 
                />
              }
              label="Modo Econômico (Reduzir Motion)"
            />
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4, borderColor: "rgba(88, 24, 13, 0.2)" }} />

      <Typography variant="h6" sx={{ fontFamily: "Cinzel", color: "#58180D", mb: 2, fontWeight: "bold" }}>
        Configurações de Sistema
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom sx={{ fontFamily: "Merriweather", fontWeight: "bold" }}>
          Qualidade dos Efeitos Visuais
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Visibility sx={{ color: "#888" }} />
          </Grid>
          <Grid item xs>
            <Slider
              value={prefs.visualQuality || 2}
              min={0}
              max={2}
              step={1}
              marks={[
                { value: 0, label: 'Baixa' },
                { value: 1, label: 'Média' },
                { value: 2, label: 'Alta' },
              ]}
              onChange={(e, v) => handleChange('visualQuality', v)}
              sx={{ color: "#833c0b" }}
            />
          </Grid>
        </Grid>
        <Typography variant="caption" sx={{ color: "#666", fontStyle: "italic" }}>
          Afeta partículas, sombras e resolução de texturas.
        </Typography>
      </Box>

    </Box>
  );
}