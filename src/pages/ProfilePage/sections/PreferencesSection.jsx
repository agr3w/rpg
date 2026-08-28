import React from "react";
import { Box, Typography, Switch, FormControlLabel, Paper, Stack } from "@mui/material";
import { usePreferences } from "contexts/PreferencesContext";
import { DarkMode, LightMode } from "@mui/icons-material";

export default function PreferencesSection() {
  const { prefs, updatePrefs } = usePreferences();
  const isDark = prefs.themeMode === "dark";

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          fontFamily: "Cinzel",
          color: "primary.main",
          fontWeight: "bold",
          mb: 2,
        }}
      >
        Visualização & Ambiente
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: (theme) => `1px solid ${theme.palette.rpg?.stroke || "rgba(0,0,0,0.1)"}`,
          bgcolor: (theme) => (theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"),
          maxWidth: 480,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
          {isDark ? (
            <DarkMode sx={{ color: "primary.main" }} />
          ) : (
            <LightMode sx={{ color: "primary.main" }} />
          )}
          <Typography variant="subtitle1" sx={{ fontFamily: "Cinzel", fontWeight: "bold" }}>
            Modo Escuro
          </Typography>
        </Stack>

        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2.5 }}>
          Alterna entre o pergaminho claro (Dia) e o tomo em couro escuro (Noite).
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={isDark}
              onChange={() => updatePrefs({ themeMode: isDark ? "light" : "dark" })}
              color="primary"
            />
          }
          label={
            <Typography variant="body2" sx={{ fontFamily: "Cinzel", fontWeight: 700 }}>
              {isDark ? "Ativado (Noite)" : "Desativado (Dia)"}
            </Typography>
          }
        />
      </Paper>
    </Box>
  );
}