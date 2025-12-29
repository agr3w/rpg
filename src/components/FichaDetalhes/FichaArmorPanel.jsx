//// filepath: src/components/FichaDetalhes/FichaArmorPanel.jsx
import React, { useEffect, useState } from "react";
import { Paper, Typography, TextField, Box, Button } from "@mui/material";

export default function FichaArmorPanel({ value, onSave }) {
  const original = Number(value ?? 10);
  const [ca, setCa] = useState(original);

  useEffect(() => {
    setCa(Number(value ?? 10));
  }, [value]);

  const handleChange = (e) => {
    const onlyDigits = e.target.value.replace(/[^\d]/g, "");
    setCa(onlyDigits === "" ? "" : Number(onlyDigits));
  };

  const current = ca === "" ? 0 : Number(ca || 0);
  const changed = current !== (Number.isNaN(original) ? 0 : original);

  const handleSave = () => {
    const safe = Number(ca || 0);
    onSave?.(safe);
  };

  return (
    <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
      <Typography variant="subtitle2">Classe de Armadura</Typography>

      <Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
        <TextField
          label="CA"
          size="small"
          type="number"
          value={ca}
          onChange={handleChange}
          inputProps={{ min: 0 }}
        />
      </Box>

      <Box sx={{ mt: 1 }}>
        <Button
          size="small"
          variant="contained"
          onClick={handleSave}
          disabled={!changed}
        >
          Salvar
        </Button>
      </Box>
    </Paper>
  );
}