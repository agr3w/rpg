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
  Divider,
} from "@mui/material";
import LayoutFicha from "components/FichaLayout/LayoutFicha";

function truncateText(s, max = 64) {
  const str = String(s || "");
  if (str.length <= max) return str;
  return `${str.slice(0, max - 1)}…`;
}

const dndBoxStyle = {
  p: 2.5,
  borderRadius: 2,
  bgcolor: "rgba(243, 235, 214, 0.5)",
  border: "1px solid rgba(92, 64, 51, 0.2)",
  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.03)",
};

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
      sx: { maxWidth: "92vw" },
    },
  };

  return (
    <LayoutFicha title="Traços de Personalidade">
      <Stack spacing={3}>
        <Typography
          variant="body1"
          sx={{
            color: "#3d2b1f",
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          "O que define o caráter do seu herói? Suas falhas e virtudes."
        </Typography>

        <Stack spacing={2}>
          <FormControl fullWidth>
            <InputLabel>Traço de Personalidade</InputLabel>
            <Select
              value={tracoPersonalidadeSelecionado}
              onChange={onSelecionarTracoPersonalidade}
              label="Traço de Personalidade"
              sx={commonSelectSx}
              MenuProps={commonMenuProps}
              renderValue={(selected) =>
                selected ? truncateText(selected, 70) : ""
              }
            >
              <MenuItem value="">
                <em>Selecione</em>
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
              sx={commonSelectSx}
              MenuProps={commonMenuProps}
              renderValue={(selected) =>
                selected ? truncateText(selected, 70) : ""
              }
            >
              <MenuItem value="">
                <em>Selecione</em>
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
              sx={commonSelectSx}
              MenuProps={commonMenuProps}
              renderValue={(selected) =>
                selected ? truncateText(selected, 70) : ""
              }
            >
              <MenuItem value="">
                <em>Selecione</em>
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
              sx={commonSelectSx}
              MenuProps={commonMenuProps}
              renderValue={(selected) =>
                selected ? truncateText(selected, 70) : ""
              }
            >
              <MenuItem value="">
                <em>Selecione</em>
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

        <Paper elevation={0} sx={dndBoxStyle}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontFamily: "Cinzel",
              color: "#58180D",
              textAlign: "center",
            }}
          >
            Resumo da Personalidade
          </Typography>

          <Stack
            spacing={2}
            divider={
              <Divider sx={{ borderColor: "rgba(92, 64, 51, 0.1)" }} />
            }
          >
            {[
              { label: "Traço", val: tracoPersonalidadeSelecionado },
              { label: "Ideal", val: idealSelecionado },
              { label: "Defeito", val: defeitoSelecionado },
              { label: "Vínculo", val: vinculoSelecionado },
            ].map((item, idx) => (
              <Box key={idx}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: "#833c0b",
                    textTransform: "uppercase",
                  }}
                >
                  {item.label}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#2c1a10",
                    fontStyle: item.val ? "normal" : "italic",
                    opacity: item.val ? 1 : 0.6,
                  }}
                >
                  {item.val || "Não selecionado"}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Stack>
    </LayoutFicha>
  );
};

export default Etapa8;
