// Etapa2.js

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
  List,
  ListItem,
} from "@mui/material";
import LayoutFicha from "components/FichaLayout/LayoutFicha";

// Estilo reutilizável para "Caixas de Texto D&D"
const dndBoxStyle = {
  p: 2,
  borderRadius: 2,
  bgcolor: "rgba(243, 235, 214, 0.5)", // Fundo amarelado translúcido
  border: "1px solid rgba(92, 64, 51, 0.2)", // Borda sutil marrom
  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.03)",
};

const Etapa2 = ({
  raca,
  setRaca,
  racasOptions,
  itensDaRaca,
  racaSelecionada,
  idiomaRacaSelecionado,
  setIdiomaRacaSelecionado,
  idiomaRacaSelecionado2,
  setIdiomaRacaSelecionado2,
  idiomaOption,
}) => {
  return (
    <LayoutFicha title="Escolha sua Raça">
      <Stack spacing={3}>
        <FormControl fullWidth>
          <InputLabel sx={{ fontFamily: "Cinzel" }}>Raça</InputLabel>
          <Select
            value={raca}
            onChange={(e) => setRaca(e.target.value)}
            label="Raça"
            sx={{
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(92, 64, 51, 0.3)" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#833c0b" },
              fontWeight: 600,
              color: "#2c1a10",
            }}
          >
            <MenuItem value="">
              <em>Selecione uma raça</em>
            </MenuItem>
            {racasOptions.map((opcao) => (
              <MenuItem key={opcao} value={opcao}>
                {opcao}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Caixa de Descrição Estilizada */}
        <Paper elevation={0} sx={{ ...dndBoxStyle, maxHeight: 300, overflow: "auto" }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 800, color: "#58180D", fontFamily: "Cinzel" }}>
            Características da Raça:
          </Typography>

          <List dense sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {itensDaRaca.length > 0 ? (
              itensDaRaca.map((item, index) => (
                <ListItem key={index} sx={{ pl: 0, alignItems: "flex-start" }}>
                  <Box
                    component="span"
                    sx={{
                      mr: 1,
                      mt: 0.5,
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "#833c0b",
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.6,
                      color: "#3d2b1f",
                    }}
                  >
                    {item}
                  </Typography>
                </ListItem>
              ))
            ) : (
              <Typography variant="caption" sx={{ fontStyle: "italic", opacity: 0.7 }}>
                Selecione uma raça para ver seus traços raciais.
              </Typography>
            )}
          </List>
        </Paper>

        {/* Seletores Condicionais */}
        {(raca === "Humano" || raca === "Meio-Elfo") && (
          <Paper elevation={0} sx={{ ...dndBoxStyle, bgcolor: "rgba(255,255,255,0.4)" }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
              Idiomas Adicionais
            </Typography>
            <Stack spacing={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Idioma Extra 1</InputLabel>
                <Select
                  value={idiomaRacaSelecionado}
                  onChange={(e) => setIdiomaRacaSelecionado(e.target.value)}
                  label="Idioma Extra 1"
                >
                  {idiomaOption.map((idioma) => (
                    <MenuItem key={idioma} value={idioma}>
                      {idioma}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {raca === "Meio-Elfo" && (
                <FormControl fullWidth size="small">
                  <InputLabel>Idioma Extra 2</InputLabel>
                  <Select
                    value={idiomaRacaSelecionado2}
                    onChange={(e) => setIdiomaRacaSelecionado2(e.target.value)}
                    label="Idioma Extra 2"
                  >
                    {idiomaOption.map((idioma) => (
                      <MenuItem key={idioma} value={idioma}>
                        {idioma}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Stack>
          </Paper>
        )}
      </Stack>
    </LayoutFicha>
  );
};

export default Etapa2;
