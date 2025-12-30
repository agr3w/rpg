import React from "react";
import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
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
    <RpgSection
      title={session?.title || "Sessão"}
      subtitle="Título, resumo e ficha vinculada (para aplicar XP/loot)."
    >
      <Stack spacing={1}>
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
    </RpgSection>
  );
}