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
  Chip,
} from "@mui/material";
import LayoutFicha from "components/FichaLayout/LayoutFicha";

const Etapa2 = ({
  raca,
  setRaca,
  racasOptions,
  itensDaRaca,

  idiomaRacaSelecionado,
  setIdiomaRacaSelecionado,
  racaSelecionada,

  idiomaRacaSelecionado2,
  setIdiomaRacaSelecionado2,
  idiomaOption,
}) => {
  return (
    <LayoutFicha title="Selecione uma Raça">
      <Stack spacing={2}>
        <Typography variant="subtitle1" color="text.secondary" align="center">
          Escolha a raça do seu personagem e os idiomas opcionais.
        </Typography>

        <FormControl fullWidth sx={{ mb: 1 }}>
          <InputLabel>Raça</InputLabel>
          <Select
            value={raca}
            onChange={(e) => setRaca(e.target.value)}
            label="Raça"
            aria-label="Selecione a raça"
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

        <Paper
          variant="outlined"
          sx={{
            p: 2,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
            maxHeight: 260, // limita altura e permite rolagem para textos muito longos
            overflow: "auto",
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Descrições / Traits da raça selecionada:
          </Typography>

          <List dense sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {itensDaRaca.length > 0 ? (
              itensDaRaca.map((item, index) => (
                <ListItem key={index} sx={{ pl: 0 }}>
                  <Box
                    sx={{
                      bgcolor: (theme) => theme.palette.action.hover,
                      p: 1,
                      borderRadius: 1,
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: "pre-wrap", // preserva quebras de linha
                        wordBreak: "break-word", // quebra palavras longas
                        lineHeight: 1.4,
                      }}
                    >
                      {item}
                    </Typography>
                  </Box>
                </ListItem>
              ))
            ) : (
              <Typography variant="caption" color="text.secondary" sx={{ pl: 0.5 }}>
                Nenhuma informação disponível.
              </Typography>
            )}
          </List>
        </Paper>

        {(raca === "Anão" ||
          raca === "Elfo" ||
          raca === "Halfling" ||
          raca === "Draconato" ||
          raca === "Gnomo" ||
          raca === "Meio-Elfo" ||
          raca === "Meio-Orc" ||
          raca === "Tiefling") && (
          <Box>
            <FormControl fullWidth sx={{ mb: 1 }}>
              <InputLabel>Idiomas da Raça</InputLabel>
              <Select
                value={idiomaRacaSelecionado}
                onChange={(e) => setIdiomaRacaSelecionado(e.target.value)}
                label="Idiomas da Raça"
                aria-label="Idiomas da raça"
              >
                <MenuItem value="">
                  <em>Idiomas da Raça</em>
                </MenuItem>
                {racaSelecionada?.idiomaRaca?.map((opcao) => (
                  <MenuItem key={opcao} value={opcao}>
                    {opcao}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {raca === "Humano" && (
          <Stack spacing={1}>
            <FormControl fullWidth>
              <InputLabel>Idiomas da Raça</InputLabel>
              <Select
                value={idiomaRacaSelecionado}
                onChange={(e) => setIdiomaRacaSelecionado(e.target.value)}
                label="Idiomas da Raça"
                aria-label="Idiomas da raça humano"
              >
                <MenuItem value="">
                  <em>Idiomas da Raça</em>
                </MenuItem>
                {racaSelecionada?.idiomaRaca?.map((opcao) => (
                  <MenuItem key={opcao} value={opcao}>
                    {opcao}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Selecione o segundo Idioma</InputLabel>
              <Select
                value={idiomaRacaSelecionado2}
                onChange={(e) => setIdiomaRacaSelecionado2(e.target.value)}
                label="Selecione o segundo Idioma"
                aria-label="Segundo idioma humano"
              >
                <MenuItem value="">
                  <em>Selecione o segundo Idioma</em>
                </MenuItem>
                {idiomaOption.map((opcao) => (
                  <MenuItem key={opcao} value={opcao}>
                    {opcao}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        )}
      </Stack>
    </LayoutFicha>
  );
};

export default Etapa2;
