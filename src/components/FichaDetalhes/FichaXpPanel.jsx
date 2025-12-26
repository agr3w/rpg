import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Grid,
  LinearProgress,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import firebase from "firebase/compat/app";
import "firebase/database";
import { XP_TABLE, computeLevelFromXp, nextLevelXp } from "Utils/xpTable";

export default function FichaXpPanel({ userID, fichaKey, ficha, onFichaChange }) {
  const [xpInput, setXpInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  useEffect(() => {
    setXpInput(String(ficha?.xp ?? ficha?.XP ?? 0));
  }, [ficha]);

  const currentXp = useMemo(
    () => Number(ficha?.xp ?? ficha?.XP ?? 0),
    [ficha]
  );

  const displayedLevel = useMemo(
    () => computeLevelFromXp(Number(xpInput || currentXp)),
    [xpInput, currentXp]
  );

  const xpToNext = useMemo(
    () => Math.max(0, nextLevelXp(displayedLevel) - Number(xpInput || currentXp)),
    [displayedLevel, xpInput, currentXp]
  );

  const progressFromLevel = useMemo(() => {
    const lvl = displayedLevel;
    const base = XP_TABLE[lvl] ?? 0;
    const next = nextLevelXp(lvl);
    const denom = next - base || 1;
    const value = (Number(xpInput || currentXp) - base) / denom;
    return Math.max(0, Math.min(1, value));
  }, [displayedLevel, xpInput, currentXp]);

  const handleSaveXp = async () => {
    if (!userID || !fichaKey) {
      setSnack({
        open: true,
        severity: "error",
        message: "Usuário não autenticado.",
      });
      return;
    }
    const parsed = parseInt(xpInput || "0", 10);
    if (Number.isNaN(parsed) || parsed < 0) {
      setSnack({
        open: true,
        severity: "error",
        message: "XP inválido.",
      });
      return;
    }

    const newLevel = computeLevelFromXp(parsed);
    const prevLevel = Number(
      ficha?.level ?? ficha?.Level ?? computeLevelFromXp(currentXp)
    );

    setSaving(true);
    try {
      await firebase.database().ref(`fichas/${userID}/${fichaKey}`).update({
        xp: parsed,
        level: newLevel,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });

      onFichaChange?.((old) => ({ ...(old || {}), xp: parsed, level: newLevel }));

      setSnack({
        open: true,
        severity: "success",
        message: "XP salvo com sucesso.",
      });

      if (newLevel > prevLevel) {
        // aqui depois podemos abrir um diálogo de "Level up!"
      }
    } catch (err) {
      console.error("Erro ao salvar XP:", err);
      setSnack({
        open: true,
        severity: "error",
        message: "Erro ao salvar XP.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2">Nível atual</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {ficha?.level ?? ficha?.Level ?? computeLevelFromXp(currentXp)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                XP total: {Number(ficha?.xp ?? ficha?.XP ?? currentXp)}
              </Typography>
            </Grid>

            <Grid item xs={12} md={5}>
              <Typography variant="subtitle2">XP (editar)</Typography>
              <TextField
                value={xpInput}
                onChange={(e) =>
                  setXpInput(e.target.value.replace(/[^\d]/g, ""))
                }
                fullWidth
                size="small"
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              />
              <Box sx={{ mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={progressFromLevel * 100}
                  sx={{ height: 10, borderRadius: 2 }}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 0.5,
                  }}
                >
                  <Typography variant="caption">
                    Nível {displayedLevel}
                  </Typography>
                  <Typography variant="caption">
                    Próx: {nextLevelXp(displayedLevel)} XP
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              md={3}
              sx={{ textAlign: { xs: "left", md: "right" } }}
            >
              <Button
                variant="contained"
                onClick={handleSaveXp}
                disabled={saving}
                size="medium"
              >
                {saving ? "Salvando..." : "Salvar XP"}
              </Button>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                {xpToNext > 0
                  ? `${xpToNext} XP para o próximo nível`
                  : "Nível máximo"}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
      >
        <Alert
          severity={snack.severity}
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
}