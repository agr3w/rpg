import React from "react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Paper,
  Stack,
  Divider,
  Checkbox,
  FormControlLabel,
  Collapse,
} from "@mui/material";
import LayoutFicha from "components/FichaLayout/LayoutFicha";

const Etapa4 = ({
  classe,
  setClasse,
  classesOptions,
  itensDaClasse,

  equipamentosClasseSelecionada1,
  setEquipamentoClasseSelecionado1,

  equipamentosClasseSelecionada2,
  setEquipamentoClasseSelecionado2,

  equipamentosClasseSelecionada3,
  setEquipamentoClasseSelecionado3,

  equipamentosClasseSelecionada4,
  setEquipamentoClasseSelecionado4,

  periciasClasseSelecionadas,
  setPericiasSelecionadas,

  setExibirPainelHabilidades,
  exibirPainelHabilidades,

  classeSelecioanda,
}) => {
  const handleTogglePainelHabilidades = () => {
    setExibirPainelHabilidades(!exibirPainelHabilidades);
  };

  const handleCheckboxChange = (e) => {
    const periciaSelecionada = e.target.value;
    if (periciasClasseSelecionadas.includes(periciaSelecionada)) {
      setPericiasSelecionadas((prevPericias) =>
        prevPericias.filter((pericia) => pericia !== periciaSelecionada)
      );
    } else if (
      periciasClasseSelecionadas.length <
      classeSelecioanda?.proficiencias?.perficiasMinimo
    ) {
      setPericiasSelecionadas((prevPericias) => [
        ...prevPericias,
        periciaSelecionada,
      ]);
    }
  };

  return (
    <LayoutFicha title="Selecione uma Classe">
      <Stack spacing={2}>
        <FormControl fullWidth>
          <InputLabel>Classe</InputLabel>
          <Select
            value={classe}
            onChange={(e) => setClasse(e.target.value)}
            label="Classe"
            aria-label="Selecione a classe"
          >
            <MenuItem value="">
              <em>Selecione uma classe</em>
            </MenuItem>
            {classesOptions.map((opcao) => (
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
            maxHeight: 220,
            overflow: "auto",
          }}
        >
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Itens da Classe:
          </Typography>
          <Box component="ul" sx={{ pl: 2, m: 0 }}>
            {itensDaClasse?.map((item, i) => (
              <Typography
                component="li"
                key={i}
                variant="body2"
                sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", mb: 1 }}
              >
                {item}
              </Typography>
            ))}
          </Box>
        </Paper>

        {/* Habilidades / Proficiências */}
        <Box>
          <Button variant="contained" onClick={handleTogglePainelHabilidades}>
            {exibirPainelHabilidades ? "Fechar Habilidades" : "Ver Habilidades"}
          </Button>

          <Collapse in={exibirPainelHabilidades} sx={{ mt: 2 }}>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6">Habilidades da Classe</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                {classeSelecioanda?.habilidadesClasse?.habilidadeNv1}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
                {classeSelecioanda?.habilidadesClasse?.habilidadeNv2}
              </Typography>
            </Paper>
          </Collapse>
        </Box>

        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1">Proficiencias</Typography>
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2">Armaduras: {classeSelecioanda?.proficiencias?.armaduras}</Typography>
            <Typography variant="body2">Armas: {classeSelecioanda?.proficiencias?.armas}</Typography>
            <Typography variant="body2">Ferramentas: {classeSelecioanda?.proficiencias?.ferramentas}</Typography>
            <Typography variant="body2">Testes de resistência: {classeSelecioanda?.proficiencias?.testesDeResistecia}</Typography>
          </Box>

          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            Perícias — escolha {classeSelecioanda?.proficiencias?.perficiasMinimo}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mt: 1 }}>
            {classeSelecioanda?.proficiencias?.periciasSelecao?.map((pericia) => (
              <FormControlLabel
                key={pericia}
                control={
                  <Checkbox
                    size="small"
                    value={pericia}
                    checked={periciasClasseSelecionadas.includes(pericia)}
                    onChange={handleCheckboxChange}
                    disabled={
                      periciasClasseSelecionadas.length ===
                        classeSelecioanda?.proficiencias?.perficiasMinimo &&
                      !periciasClasseSelecionadas.includes(pericia)
                    }
                  />
                }
                label={pericia}
              />
            ))}
          </Box>
        </Paper>

        {/* Equipamentos */}
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1">Equipamentos da Classe</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Item obrigatório: {classeSelecioanda?.equipamentos?.equipamentoObgt}
          </Typography>

          <Stack spacing={2} sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Equipamento 1</InputLabel>
              <Select
                value={equipamentosClasseSelecionada1}
                onChange={(e) => setEquipamentoClasseSelecionado1(e.target.value)}
                label="Equipamento 1"
              >
                <MenuItem value="">
                  <em>Selecione</em>
                </MenuItem>
                {classeSelecioanda?.equipamentos?.equipamentoAlpha1?.map((opcao) => (
                  <MenuItem key={opcao} value={opcao}>
                    {opcao}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Equipamento 2</InputLabel>
              <Select
                value={equipamentosClasseSelecionada2}
                onChange={(e) => setEquipamentoClasseSelecionado2(e.target.value)}
                label="Equipamento 2"
              >
                <MenuItem value="">
                  <em>Selecione</em>
                </MenuItem>
                {classeSelecioanda?.equipamentos?.equipamentoAlpha2?.map((opcao) => (
                  <MenuItem key={opcao} value={opcao}>
                    {opcao}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {classeSelecioanda?.equipamentos?.equipamentoAlpha3 && (
              <FormControl fullWidth>
                <InputLabel>Equipamento 3</InputLabel>
                <Select
                  value={equipamentosClasseSelecionada3}
                  onChange={(e) => setEquipamentoClasseSelecionado3(e.target.value)}
                  label="Equipamento 3"
                >
                  <MenuItem value="">
                    <em>Selecione</em>
                  </MenuItem>
                  {classeSelecioanda?.equipamentos?.equipamentoAlpha3?.map((opcao) => (
                    <MenuItem key={opcao} value={opcao}>
                      {opcao}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {classeSelecioanda?.equipamentos?.equipamentoAlpha4 && (
              <FormControl fullWidth>
                <InputLabel>Equipamento 4</InputLabel>
                <Select
                  value={equipamentosClasseSelecionada4}
                  onChange={(e) => setEquipamentoClasseSelecionado4(e.target.value)}
                  label="Equipamento 4"
                >
                  <MenuItem value="">
                    <em>Selecione</em>
                  </MenuItem>
                  {classeSelecioanda?.equipamentos?.equipamentoAlpha4?.map((opcao) => (
                    <MenuItem key={opcao} value={opcao}>
                      {opcao}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Stack>
        </Paper>
      </Stack>
    </LayoutFicha>
  );
};

export default Etapa4;
