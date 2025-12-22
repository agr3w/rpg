// Etapa5.js
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

const Etapa8 = ({
  tracoPersonalidade,
  ideal,
  defeito,
  vinculo,
  tracoPersonalidadeSelecionado,
  idealSelecionado,
  defeitoSelecionado,
  vinculoSelecionado,
  onSelecionarTracoPersonalidade,
  onSelecionarIdeal,
  onSelecionarDefeito,
  onSelecionarVinculo,
}) => {
  return (
    <LayoutFicha title="Traços do personagem">
      <Stack spacing={2}>
        <Typography variant="subtitle1" color="text.secondary" align="center">
          Escolha traços, ideais, defeitos e vínculos. O texto completo aparece
          abaixo.
        </Typography>

        <Stack spacing={1}>
          <FormControl fullWidth>
            <InputLabel>Traço de Personalidade</InputLabel>
            <Select
              value={tracoPersonalidadeSelecionado}
              onChange={onSelecionarTracoPersonalidade}
              label="Traço de Personalidade"
              aria-label="Traço de Personalidade"
            >
              <MenuItem value="">
                <em>Selecione um traço de personalidade</em>
              </MenuItem>
              {tracoPersonalidade.map((traco, index) => (
                <MenuItem key={index} value={traco}>
                  {traco}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Ideal</InputLabel>
            <Select
              value={idealSelecionado}
              onChange={onSelecionarIdeal}
              label="Ideal"
              aria-label="Ideal"
            >
              <MenuItem value="">
                <em>Selecione um ideal</em>
              </MenuItem>
              {ideal.map((item, index) => (
                <MenuItem key={index} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Defeito</InputLabel>
            <Select
              value={defeitoSelecionado}
              onChange={onSelecionarDefeito}
              label="Defeito"
              aria-label="Defeito"
            >
              <MenuItem value="">
                <em>Selecione um defeito</em>
              </MenuItem>
              {defeito.map((item, index) => (
                <MenuItem key={index} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Vínculo</InputLabel>
            <Select
              value={vinculoSelecionado}
              onChange={onSelecionarVinculo}
              label="Vínculo"
              aria-label="Vínculo"
            >
              <MenuItem value="">
                <em>Selecione um vínculo</em>
              </MenuItem>
              {vinculo.map((item, index) => (
                <MenuItem key={index} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Visualização completa
          </Typography>

          <Box sx={{ display: "grid", gap: 1 }}>
            <Box>
              <Typography variant="overline">Traço de Personalidade</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}
              >
                {tracoPersonalidadeSelecionado || "—"}
              </Typography>
            </Box>

            <Box>
              <Typography variant="overline">Ideal</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}
              >
                {idealSelecionado || "—"}
              </Typography>
            </Box>

            <Box>
              <Typography variant="overline">Defeito</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}
              >
                {defeitoSelecionado || "—"}
              </Typography>
            </Box>

            <Box>
              <Typography variant="overline">Vínculo</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}
              >
                {vinculoSelecionado || "—"}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Stack>
    </LayoutFicha>
  );
};

export default Etapa8;
