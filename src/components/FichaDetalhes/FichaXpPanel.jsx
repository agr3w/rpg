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
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import firebase from "firebase/compat/app";
import "firebase/database";
import { XP_TABLE, computeLevelFromXp, nextLevelXp } from "Utils/xpTable";
import LevelUpModal from "./LevelUpModal";

export default function FichaXpPanel({ userID, fichaKey, ficha, onFichaChange }) {
  const [xpInput, setXpInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [levelUpModalOpen, setLevelUpModalOpen] = useState(false);
  const [levelUpData, setLevelUpData] = useState({
    fromLevel: 1,
    toLevel: 2,
    targetXp: 0,
  });
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

    if (newLevel > prevLevel) {
      // Abre o modal de Level Up automaticamente com as etapas necessárias!
      setLevelUpData({
        fromLevel: prevLevel,
        toLevel: newLevel,
        targetXp: parsed,
      });
      setLevelUpModalOpen(true);
    } else {
      setSaving(true);
      try {
        await firebase.database().ref(`fichas/${userID}/${fichaKey}`).update({
          xp: parsed,
          level: newLevel,
          nivel: newLevel,
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
        });

        onFichaChange?.((old) => ({ ...(old || {}), xp: parsed, level: newLevel, nivel: newLevel }));

        setSnack({
          open: true,
          severity: "success",
          message: "XP salvo com sucesso.",
        });
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
    }
  };

  const handleConfirmLevelUp = async (payload) => {
    if (!payload) return;
    const { nivel, vidaMax, vidaAtual, atributos, subclasse } = payload;

    const targetXp = XP_TABLE[nivel] ?? (currentXp + 1000);
    const newXp = Math.max(currentXp, targetXp);

    if (userID && fichaKey) {
      try {
        const updates = {
          xp: newXp,
          level: nivel,
          nivel,
          vidaMax,
          vidaAtual,
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
        };
        if (atributos) updates.atributos = atributos;
        if (subclasse) {
          updates.subclasse = subclasse;
          updates["DetalhesDaClasse/SubClasseInfo/SubClasse"] = subclasse;
        }
        await firebase.database().ref(`fichas/${userID}/${fichaKey}`).update(updates);
      } catch (err) {
        console.error("Erro ao salvar level up:", err);
      }
    }

    onFichaChange?.((old) => ({
      ...(old || {}),
      xp: newXp,
      level: nivel,
      nivel,
      vidaMax,
      vidaAtual,
      atributos: atributos || old?.atributos,
      subclasse: subclasse || old?.subclasse,
    }));

    setSnack({
      open: true,
      severity: "success",
      message: `Parabéns! Você alcançou o Nível ${nivel}!`,
    });
  };

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Paper
          elevation={2}
          sx={{
            p: 2,
            border: "1px solid var(--ficha-accent-soft, rgba(191,143,0,0.24))",
            bgcolor: "var(--ficha-surface, rgba(236,225,207,0.9))",
            color: "var(--ficha-text, #2f2318)",
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2">Nível atual</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {ficha?.level ?? ficha?.Level ?? computeLevelFromXp(currentXp)}
              </Typography>
              <Typography variant="caption" sx={{ color: "var(--ficha-text-muted, rgba(47,35,24,0.74))" }}>
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
                sx={{
                  "& .MuiInputBase-root": { color: "var(--ficha-text, #2f2318)" },
                  "& .MuiInputLabel-root": { color: "var(--ficha-text-muted, rgba(47,35,24,0.74))" },
                }}
              />
              <Box sx={{ mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={progressFromLevel * 100}
                  sx={{
                    height: 10,
                    borderRadius: 2,
                    bgcolor: "var(--ficha-surface-alt, rgba(225,211,189,0.86))",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "var(--ficha-accent, #bf8f00)",
                    },
                  }}
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
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: { xs: "flex-start", md: "flex-end" } }}>
                <Button
                  variant="contained"
                  onClick={handleSaveXp}
                  disabled={saving}
                  size="small"
                  sx={{ bgcolor: "var(--ficha-accent, #bf8f00)", color: "var(--ficha-text, #2f2318)", fontWeight: 800, "&:hover": { filter: "brightness(0.94)" } }}
                >
                  {saving ? "Salvando..." : "Salvar XP"}
                </Button>
              </Box>

              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                {xpToNext > 0
                  ? `${xpToNext} XP para o próximo nível`
                  : "Nível máximo"}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <LevelUpModal
        open={levelUpModalOpen}
        onClose={() => setLevelUpModalOpen(false)}
        ficha={{
          ...ficha,
          nivel: levelUpData.fromLevel,
          level: levelUpData.fromLevel,
        }}
        fromLevel={levelUpData.fromLevel}
        toLevel={levelUpData.toLevel}
        targetXp={levelUpData.targetXp}
        onConfirmLevelUp={handleConfirmLevelUp}
      />

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