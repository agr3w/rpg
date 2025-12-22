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

const Etapa6 = ({
  antecedente,
  setAntecedente,
  antecedentesOptions,
  itensDaAntecedencia = [],
  idiomaDoAntecedente,
  setIdiomaAntecedente,
  idiomaDoAntecendente2,
  setIdiomaAntecendente2,
  idiomaOption = [],
}) => {
  return (
    <LayoutFicha title="Selecione o Antecedente">
      <Stack spacing={2}>
        <Typography variant="subtitle1" color="text.secondary" align="center">
          Escolha o antecedente do seu personagem e selecione idiomas se aplicável.
        </Typography>

        <FormControl fullWidth>
          <InputLabel>Antecedente</InputLabel>
          <Select
            label="Antecedente"
            value={antecedente}
            onChange={(e) => setAntecedente(e.target.value)}
            aria-label="Selecione um antecedente"
          >
            <MenuItem value="">
              <em>Selecione um antecedente</em>
            </MenuItem>
            {antecedentesOptions.map((opcao) => (
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
            maxHeight: 300,
            overflow: "auto",
          }}
        >
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Proficiências / Detalhes do antecedente:
          </Typography>

          {itensDaAntecedencia.length > 0 ? (
            <List sx={{ pl: 0 }}>
              {itensDaAntecedencia.map((item, idx) => (
                <ListItem key={idx} sx={{ display: "list-item", pl: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.5 }}
                  >
                    {item}
                  </Typography>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="caption" color="text.secondary">
              Nenhuma informação disponível para o antecedente selecionado.
            </Typography>
          )}
        </Paper>

        {/* Idiomas adicionais — dois */}
        {(antecedente === "Acólito" || antecedente === "Sábio") && (
          <Stack spacing={1}>
            <FormControl fullWidth>
              <InputLabel>Idioma adicional 1</InputLabel>
              <Select
                label="Idioma adicional 1"
                value={idiomaDoAntecedente}
                onChange={(e) => setIdiomaAntecedente(e.target.value)}
              >
                <MenuItem value="">
                  <em>Selecione Idioma</em>
                </MenuItem>
                {idiomaOption.map((opcao) => (
                  <MenuItem key={opcao} value={opcao}>
                    {opcao}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Idioma adicional 2</InputLabel>
              <Select
                label="Idioma adicional 2"
                value={idiomaDoAntecendente2}
                onChange={(e) => setIdiomaAntecendente2(e.target.value)}
              >
                <MenuItem value="">
                  <em>Selecione Idioma</em>
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

        {/* Idioma adicional — um */}
        {["Artesão de Guilda", "Eremita", "Forasteiro", "Nobre"].includes(antecedente) && (
          <FormControl fullWidth>
            <InputLabel>Idioma adicional</InputLabel>
            <Select
              label="Idioma adicional"
              value={idiomaDoAntecedente}
              onChange={(e) => setIdiomaAntecedente(e.target.value)}
            >
              <MenuItem value="">
                <em>Selecione Idioma</em>
              </MenuItem>
              {idiomaOption.map((opcao) => (
                <MenuItem key={opcao} value={opcao}>
                  {opcao}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Stack>
    </LayoutFicha>
  );
};

export default Etapa6;
