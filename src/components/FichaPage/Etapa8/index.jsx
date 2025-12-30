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

function truncateText(s, max = 64) {
  const str = String(s || "");
  if (str.length <= max) return str;
  return `${str.slice(0, max - 1)}…`;
}

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
  const commonSelectSx = {
    "& .MuiSelect-select": {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  };

  const commonMenuProps = {
    PaperProps: {
      sx: {
        maxWidth: "92vw",
      },
    },
  };

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
              sx={commonSelectSx}
              MenuProps={commonMenuProps}
              renderValue={(selected) =>
                selected ? truncateText(selected, 70) : ""
              }
            >
              <MenuItem value="">
                <em>Selecione um traço de personalidade</em>
              </MenuItem>
              {tracoPersonalidade.map((traco, index) => (
                <MenuItem
                  key={index}
                  value={traco}
                  sx={{ whiteSpace: "normal", lineHeight: 1.35 }}
                >
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
              sx={commonSelectSx}
              MenuProps={commonMenuProps}
              renderValue={(selected) =>
                selected ? truncateText(selected, 70) : ""
              }
            >
              <MenuItem value="">
                <em>Selecione um ideal</em>
              </MenuItem>
              {ideal.map((item, index) => (
                <MenuItem
                  key={index}
                  value={item}
                  sx={{ whiteSpace: "normal", lineHeight: 1.35 }}
                >
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
              sx={commonSelectSx}
              MenuProps={commonMenuProps}
              renderValue={(selected) =>
                selected ? truncateText(selected, 70) : ""
              }
            >
              <MenuItem value="">
                <em>Selecione um defeito</em>
              </MenuItem>
              {defeito.map((item, index) => (
                <MenuItem
                  key={index}
                  value={item}
                  sx={{ whiteSpace: "normal", lineHeight: 1.35 }}
                >
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
              sx={commonSelectSx}
              MenuProps={commonMenuProps}
              renderValue={(selected) =>
                selected ? truncateText(selected, 70) : ""
              }
            >
              <MenuItem value="">
                <em>Selecione um vínculo</em>
              </MenuItem>
              {vinculo.map((item, index) => (
                <MenuItem
                  key={index}
                  value={item}
                  sx={{ whiteSpace: "normal", lineHeight: 1.35 }}
                >
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
