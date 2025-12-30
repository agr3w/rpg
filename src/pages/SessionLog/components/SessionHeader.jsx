import React from "react";
import {
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Paper,
  Box
} from "@mui/material";
import RpgSection from "components/RpgSection";

export default function SessionHeader({
  uid,
  campaignId,
  session,
  fichas,
  linkedFichaId,
  onLinkedFichaChange,
  onUpdateSession,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: "#fffbf0",
        backgroundImage: `linear-gradient(to bottom right, #fffbf0, #f7f1e3)`,
        border: "1px solid rgba(92, 64, 51, 0.2)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Detalhe decorativo de "Selo" no fundo */}
      <Box 
        sx={{ 
          position: "absolute", 
          top: -20, 
          right: -20, 
          width: 100, 
          height: 100, 
          borderRadius: "50%", 
          bgcolor: "rgba(191, 143, 0, 0.05)", 
          zIndex: 0 
        }} 
      />

      <Stack spacing={2} sx={{ position: "relative", zIndex: 1 }}>
        <Typography variant="overline" sx={{ color: "#833c0b", fontWeight: 800, letterSpacing: 1 }}>
          Crônica da Sessão
        </Typography>

        <TextField
          variant="standard"
          placeholder="Título da Sessão"
          value={session?.title || ""}
          onChange={(e) => onUpdateSession({ title: e.target.value })}
          fullWidth
          InputProps={{
            disableUnderline: true,
            sx: {
              fontFamily: "Cinzel",
              fontSize: "1.75rem",
              fontWeight: 900,
              color: "#2c1a10",
              "&::placeholder": { opacity: 0.4 }
            }
          }}
        />

        <Divider sx={{ borderColor: "rgba(92, 64, 51, 0.1)" }} />

        <TextField
          placeholder="Escreva aqui os feitos heroicos, tragédias e descobertas..."
          value={session?.summary || ""}
          onChange={(e) => onUpdateSession({ summary: e.target.value })}
          fullWidth
          multiline
          minRows={6}
          variant="standard"
          InputProps={{
            disableUnderline: true,
            sx: {
              fontFamily: "'Merriweather', serif",
              fontSize: "1rem",
              lineHeight: 1.8,
              color: "#3d2b1f",
              bgcolor: "rgba(255,255,255,0.4)",
              p: 2,
              borderRadius: 1
            }
          }}
        />

        <Box sx={{ mt: 2, pt: 2, borderTop: "1px dashed rgba(92, 64, 51, 0.2)" }}>
          <FormControl fullWidth size="small" variant="filled">
            <InputLabel sx={{ fontFamily: "Cinzel" }}>Vincular Jogador (Para XP/Loot)</InputLabel>
            <Select
              value={linkedFichaId}
              onChange={(e) => onLinkedFichaChange(e.target.value)}
              sx={{ bgcolor: "rgba(0,0,0,0.02)" }}
            >
              <MenuItem value="">
                <em>Nenhum vínculo</em>
              </MenuItem>
              {fichas.map((f) => (
                <MenuItem key={f.id} value={f.id}>
                  {f.nome || f.id} <Typography variant="caption" sx={{ ml: 1, opacity: 0.6 }}>({f.classe})</Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Stack>
    </Paper>
  );
}