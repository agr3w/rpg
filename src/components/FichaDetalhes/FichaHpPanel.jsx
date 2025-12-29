//// filepath: src/components/FichaDetalhes/FichaHpPanel.jsx
import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Grid,
  TextField,
  Box,
  Button,
  Divider,
} from "@mui/material";

const EMPTY = { max: 0, atual: 0, temp: 0 };

export default function FichaHpPanel({
  value,
  onSave,
  hitDie = 8, // faces do dado de vida da classe (ex: 12, 10, 8, 6)
  conMod = 0, // modificador de Constituição
  pendingLevels = 0, // quantos níveis ainda não tiveram HP rolado
  canRollLevelHp = true, // só deixa rolar se true
}) {
  const original = value || EMPTY;
  const [hp, setHp] = useState(original);

  useEffect(() => {
    setHp(value || EMPTY);
  }, [value]);

  const handleField = (key) => (e) => {
    const onlyDigits = e.target.value.replace(/[^\d]/g, "");
    setHp((prev) => ({
      ...(prev || EMPTY),
      [key]: onlyDigits === "" ? 0 : Number(onlyDigits),
    }));
  };

  const changed = ["max", "atual", "temp"].some(
    (k) => Number(hp[k] || 0) !== Number(original[k] || 0)
  );

  const handleSave = () => {
    const safe = {
      max: Number(hp.max || 0),
      atual: Number(hp.atual || 0),
      temp: Number(hp.temp || 0),
    };
    // edição manual -> não consome nível
    onSave?.(safe, 0);
  };

  const handleRollLevelHp = () => {
    if (!pendingLevels || hitDie <= 0 || !canRollLevelHp) return; // trava extra

    const roll = Math.floor(Math.random() * hitDie) + 1; // 1dX
    const base = roll + conMod;
    const ganho = Math.max(base, 1); // no mínimo 1 PV por nível

    const updated = {
      max: Number(hp.max || 0) + ganho,
      atual: Number(hp.atual || 0) + ganho,
      temp: Number(hp.temp || 0),
    };

    setHp(updated);
    onSave?.(updated, 1);
  };

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="subtitle2">Pontos de Vida</Typography>

      <Grid container spacing={1} sx={{ mt: 1 }}>
        <Grid item xs={4}>
          <TextField
            label="Máx."
            size="small"
            type="number"
            value={hp.max}
            onChange={handleField("max")}
            fullWidth
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Atual"
            size="small"
            type="number"
            value={hp.atual}
            onChange={handleField("atual")}
            fullWidth
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Temp."
            size="small"
            type="number"
            value={hp.temp}
            onChange={handleField("temp")}
            fullWidth
            inputProps={{ min: 0 }}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 1 }} />

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Dado de vida: <strong>1d{hitDie}</strong> &nbsp; | &nbsp; Mod. CON:{" "}
          <strong>{conMod >= 0 ? `+${conMod}` : conMod}</strong>
        </Typography>

        <Button
          size="small"
          variant="contained"
          onClick={handleSave}
          disabled={!changed}
        >
          Salvar
        </Button>
      </Box>

      {pendingLevels > 0 && canRollLevelHp && (
        <Box
          sx={{
            mt: 1,
            p: 1,
            borderRadius: 1,
            bgcolor: "rgba(0,0,0,0.04)",
          }}
        >
          <Typography variant="caption" sx={{ display: "block", mb: 0.5 }}>
            Você subiu de nível e ainda tem{" "}
            <strong>{pendingLevels}</strong> rolagem(ns) de vida pendente.
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={handleRollLevelHp}
          >
            Rolar 1d{hitDie} + CON
          </Button>
        </Box>
      )}
    </Paper>
  );
}