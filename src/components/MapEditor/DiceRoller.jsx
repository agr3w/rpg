import React, { useState } from "react";
import { 
  Box, Typography, Button, Grid, Paper, Divider, IconButton, Stack 
} from "@mui/material";
import CasinoIcon from '@mui/icons-material/Casino';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

const DIES = [
  { sides: 4, label: "d4", color: "#ef5350" },
  { sides: 6, label: "d6", color: "#42a5f5" },
  { sides: 8, label: "d8", color: "#66bb6a" },
  { sides: 10, label: "d10", color: "#ab47bc" },
  { sides: 12, label: "d12", color: "#ffa726" },
  { sides: 20, label: "d20", color: "#bf8f00" }, // Destaque para o d20
  { sides: 100, label: "d100", color: "#78909c" },
];

const DiceRoller = () => {
  const [history, setHistory] = useState([]);

  const rollDice = (sides, label, color) => {
    const result = Math.floor(Math.random() * sides) + 1;
    const newRoll = {
      id: Date.now(),
      label,
      result,
      color,
      timestamp: new Date().toLocaleTimeString()
    };
    setHistory([newRoll, ...history].slice(0, 10)); // Mantém os últimos 10
  };

  return (
    <Box sx={{ p: 2, width: 300, bgcolor: "#1e2a38", border: "1px solid #455a64" }}>
      <Typography variant="subtitle2" sx={{ fontFamily: "Cinzel", color: "#eceff1", mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <CasinoIcon sx={{ color: "#bf8f00" }} /> Torre de Dados
      </Typography>

      <Grid container spacing={1} sx={{ mb: 2 }}>
        {DIES.map((die) => (
          <Grid item xs={3} key={die.sides}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => rollDice(die.sides, die.label, die.color)}
              sx={{ 
                minWidth: 0, width: "100%", 
                color: die.color, borderColor: die.color,
                fontWeight: "bold",
                "&:hover": { bgcolor: `${die.color}22`, borderColor: die.color }
              }}
            >
              {die.label}
            </Button>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", mb: 1 }} />

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Typography variant="caption" sx={{ color: "#90a4ae" }}>Histórico</Typography>
        <IconButton size="small" onClick={() => setHistory([])} sx={{ color: "#ef5350" }}>
          <DeleteSweepIcon fontSize="small" />
        </IconButton>
      </Box>

      <Stack spacing={1} sx={{ maxHeight: 150, overflowY: "auto" }}>
        {history.map((roll) => (
          <Paper 
            key={roll.id} 
            sx={{ 
              p: 1, bgcolor: "rgba(0,0,0,0.3)", display: "flex", justifyContent: "space-between", alignItems: "center",
              borderLeft: `4px solid ${roll.color}`
            }}
          >
            <Typography variant="caption" sx={{ color: "#cfd8dc" }}>{roll.label}</Typography>
            <Typography variant="h6" sx={{ color: "#fff", fontWeight: "bold", lineHeight: 1 }}>{roll.result}</Typography>
          </Paper>
        ))}
        {history.length === 0 && (
          <Typography variant="caption" sx={{ color: "#546e7a", textAlign: "center", py: 2 }}>
            O destino aguarda...
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default DiceRoller;