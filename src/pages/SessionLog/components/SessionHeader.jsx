import React from "react";
import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

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
        p: 2.25,
        borderRadius: 3,
        border: "1px solid rgba(0,0,0,0.10)",
        bgcolor: "rgba(223, 214, 205, 0.92)",
      }}
    >
      <Stack spacing={1}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ gap: 1, flexWrap: "wrap" }}
        >
          <Typography variant="h5" sx={{ fontWeight: 1000, color: "#2c1a10" }}>
            {session?.title || "Sessão"}
          </Typography>

          <Button component={Link} to={`/diario?c=${encodeURIComponent(campaignId)}`}>
            Voltar
          </Button>
        </Stack>

        <TextField
          label="Título da sessão"
          value={session?.title || ""}
          onChange={(e) => onUpdateSession({ title: e.target.value })}
          fullWidth
        />

        <TextField
          label="Resumo"
          value={session?.summary || ""}
          onChange={(e) => onUpdateSession({ summary: e.target.value })}
          fullWidth
          multiline
          minRows={4}
        />

        <Divider />

        <FormControl fullWidth>
          <InputLabel>Ficha vinculada à campanha (jogador)</InputLabel>
          <Select
            label="Ficha vinculada à campanha (jogador)"
            value={linkedFichaId}
            onChange={(e) => onLinkedFichaChange(e.target.value)}
          >
            <MenuItem value="">
              <em>Nenhuma</em>
            </MenuItem>

            {fichas.map((f) => (
              <MenuItem key={f.id} value={f.id}>
                {f.nome || f.id} — {f.classe || "—"} / {f.raca || "—"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {linkedFichaId ? (
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Essa ficha será usada para aplicar XP direto em{" "}
            <code>fichas/{uid}/{linkedFichaId}</code>.
          </Typography>
        ) : null}
      </Stack>
    </Paper>
  );
}