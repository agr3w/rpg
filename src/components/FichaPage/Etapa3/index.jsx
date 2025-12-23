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

const Etapa3 = ({
  racaSelecionada,
  SubRacasOptions,
  SubRaca,
  raca,
  detalhesSubRaca,
  idiomaOption,
  setIdiomaAltoElfoSelecioando,
  IdiomaAltoElfo,
  handleSubRacaChange,
  Engenhocas,
  setEngenhocas,
}) => {
  const showSubRacaSelector =
    [
      "Anão",
      "Elfo",
      "Halfling",
      "Draconato",
      "Gnomo",
      "Meio-Elfo",
      "Meio-Orc",
      "Tiefling",
      "Humano",
    ].includes(raca);

  return (
    <LayoutFicha title="Selecione uma Sub-Raça">
      <Stack spacing={2}>
        {showSubRacaSelector && (
          <>
            <FormControl fullWidth>
              <InputLabel>Sub-Raça</InputLabel>
              <Select
                value={SubRaca}
                onChange={handleSubRacaChange}
                label="Sub-Raça"
                aria-label="Selecione a sub-raça"
              >
                <MenuItem value="">
                  <em>Selecione uma Sub-Raça</em>
                </MenuItem>
                {SubRacasOptions.map((opcao) => (
                  <MenuItem key={opcao} value={opcao}>
                    {opcao}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {detalhesSubRaca && (
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  maxHeight: 260,
                  overflow: "auto",
                  bgcolor: "background.paper",
                  boxShadow: "0 6px 18px rgba(15,23,42,0.04)",
                }}
              >
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Detalhes da Sub-Raça:
                </Typography>

                <List sx={{ pl: 0 }}>
                  {Array.isArray(detalhesSubRaca.habilidadesSubRaca) &&
                    detalhesSubRaca.habilidadesSubRaca.map((habilidade, i) => (
                      <ListItem key={i} sx={{ display: "list-item", pl: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.5 }}
                        >
                          {habilidade}
                        </Typography>
                      </ListItem>
                    ))}
                </List>
              </Paper>
            )}

            {SubRaca === "Alto Elfo" && (
              <FormControl fullWidth>
                <InputLabel>Idioma do Alto Elfo</InputLabel>
                <Select
                  value={IdiomaAltoElfo}
                  onChange={(e) => setIdiomaAltoElfoSelecioando(e.target.value)}
                  label="Idioma do Alto Elfo"
                  aria-label="Idioma do Alto Elfo"
                >
                  <MenuItem value="">
                    <em>Selecione um Idioma</em>
                  </MenuItem>
                  {idiomaOption.map((idioma) => (
                    <MenuItem key={idioma} value={idioma}>
                      {idioma}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </>
        )}

        {SubRaca === "Gnomo das Rochas" && detalhesSubRaca?.Engenhoca && (
          <FormControl fullWidth>
            <InputLabel>Engenhocas</InputLabel>
            <Select
              value={Engenhocas}
              onChange={(e) => setEngenhocas(e.target.value)}
              label="Engenhocas"
              aria-label="Selecione engenhocas"
            >
              <MenuItem value="">
                <em>Engenhocas</em>
              </MenuItem>
              {detalhesSubRaca.Engenhoca.map((eng, idx) => (
                <MenuItem key={idx} value={eng}>
                  {eng}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Stack>
    </LayoutFicha>
  );
};

export default Etapa3;
