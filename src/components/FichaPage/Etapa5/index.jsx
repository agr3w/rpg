// Etapa4.js
import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Stack,
  Paper,
} from "@mui/material";
import LayoutFicha from "components/FichaLayout/LayoutFicha";

const Etapa5 = ({ tendencia, setTendencia, TendenciasOptions, itensDaTendencia }) => {
  return (
    <LayoutFicha title="Tendência do personagem">
      <Stack spacing={2}>
        <Typography variant="subtitle1" color="text.secondary" align="center">
          Escolha a tendência que melhor descreve seu personagem.
        </Typography>

        <FormControl fullWidth>
          <InputLabel>Tendência</InputLabel>
          <Select
            value={tendencia}
            onChange={(e) => setTendencia(e.target.value)}
            label="Tendência"
            aria-label="Selecione a tendência"
          >
            <MenuItem value="">
              <em>Selecione uma tendência</em>
            </MenuItem>
            {TendenciasOptions.map((opcao) => (
              <MenuItem key={opcao} value={opcao}>
                {opcao}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: "background.paper",
            boxShadow: "0 6px 18px rgba(15,23,42,0.04)",
            maxHeight: 340,
            overflow: "auto",
          }}
        >
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Descrição da tendência:
          </Typography>

          {itensDaTendencia && itensDaTendencia.length > 0 ? (
            <Box component="div" sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {itensDaTendencia.map((item, idx) => (
                <Typography
                  key={idx}
                  variant="body2"
                  sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.5 }}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          ) : (
            <Typography variant="caption" color="text.secondary">
              Nenhuma descrição disponível para a tendência selecionada.
            </Typography>
          )}
        </Paper>
      </Stack>
    </LayoutFicha>
  );
};

export default Etapa5;
