//// filepath: src/components/FichaDetalhes/FichaCoinsPanel.jsx
import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography, Divider, Button, TextField } from "@mui/material";

const EMPTY = { pc: 0, pp: 0, pe: 0, po: 0, pl: 0 };

export default function FichaCoinsPanel({ value, onSave }) {
  const original = value || EMPTY;
  const [coins, setCoins] = useState(original);

  useEffect(() => {
    setCoins(value || EMPTY);
  }, [value]);

  const handleField = (key) => (e) => {
    const onlyDigits = e.target.value.replace(/[^\d]/g, "");
    setCoins((prev) => ({
      ...(prev || EMPTY),
      [key]: onlyDigits === "" ? 0 : Number(onlyDigits),
    }));
  };

  const changed = ["pc", "pp", "pe", "po", "pl"].some(
    (k) => Number(coins[k] || 0) !== Number(original[k] || 0)
  );

  // câmbio padrão em peças de ouro (PO)
  const totalEmPO =
    coins.pc / 100 + coins.pp / 10 + coins.pe / 2 + coins.po + coins.pl * 10;

  const handleSaveClick = () => {
    const safe = {
      pc: Number(coins.pc || 0),
      pp: Number(coins.pp || 0),
      pe: Number(coins.pe || 0),
      po: Number(coins.po || 0),
      pl: Number(coins.pl || 0),
    };
    onSave?.(safe);
  };

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="subtitle2">Riqueza</Typography>

      <Grid container spacing={1} sx={{ mt: 1 }}>
        <Grid item xs={4}>
          <TextField
            label="PC"
            size="small"
            type="number"
            value={coins.pc}
            onChange={handleField("pc")}
            fullWidth
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="PP"
            size="small"
            type="number"
            value={coins.pp}
            onChange={handleField("pp")}
            fullWidth
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="PE"
            size="small"
            type="number"
            value={coins.pe}
            onChange={handleField("pe")}
            fullWidth
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="PO"
            size="small"
            type="number"
            value={coins.po}
            onChange={handleField("po")}
            fullWidth
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="PL"
            size="small"
            type="number"
            value={coins.pl}
            onChange={handleField("pl")}
            fullWidth
            inputProps={{ min: 0 }}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 1 }} />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Total aproximado: <strong>{totalEmPO.toFixed(2)} PO</strong>
        </Typography>

        <Button
          size="small"
          variant="contained"
          onClick={handleSaveClick}
          disabled={!changed}
        >
          Salvar
        </Button>
      </Box>
    </Paper>
  );
}