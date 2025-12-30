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

// Estilo reutilizável
const dndBoxStyle = {
  p: 2.5,
  borderRadius: 2,
  bgcolor: "rgba(243, 235, 214, 0.5)",
  border: "1px solid rgba(92, 64, 51, 0.2)",
  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.03)",
};

const SingleTextSection = ({ antecedenteSelecionado }) => {
  const label =
    antecedenteSelecionado?.CaracteristicaDoAntecedente?.LabelCaracteristicaTexto1;
  const texto =
    antecedenteSelecionado?.CaracteristicaDoAntecedente?.CaracteristicaTexto1;

  return (
    <Paper elevation={0} sx={dndBoxStyle}>
      <Typography variant="h6" sx={{ mb: 1, fontFamily: "Cinzel", color: "#58180D", fontWeight: 700 }}>
        Características: {label}
      </Typography>
      <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6, color: "#2c1a10" }}>
        {texto || "—"}
      </Typography>
    </Paper>
  );
};

const SelectsSection = ({
  antecedenteSelecionado,
  CarcDosAntecedentes1,
  setCarcDosAntecedents1,
  CarcDosAntecedentes2,
  setCarcDosAntecedentes2,
}) => {
  const select1Label =
    antecedenteSelecionado?.CaracteristicaDoAntecedente?.LabelCaracteristicaSelect1;
  const select2Label =
    antecedenteSelecionado?.CaracteristicaDoAntecedente?.LabelCaracteristicaSelect2;
  const options1 =
    antecedenteSelecionado?.CaracteristicaDoAntecedente?.CaracteristicaSelect1 || [];
  const options2 =
    antecedenteSelecionado?.CaracteristicaDoAntecedente?.CaracteristicaSelect2 || [];

  return (
    <Stack spacing={2}>
      <FormControl fullWidth>
        <InputLabel>{select1Label}</InputLabel>
        <Select
          label={select1Label}
          value={CarcDosAntecedentes1}
          onChange={(e) => setCarcDosAntecedents1(e.target.value)}
        >
          <MenuItem value=""><em>{select1Label}</em></MenuItem>
          {options1.map((opcao) => (
            <MenuItem key={opcao} value={opcao} sx={{ whiteSpace: "normal" }}>{opcao}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>{select2Label}</InputLabel>
        <Select
          label={select2Label}
          value={CarcDosAntecedentes2}
          onChange={(e) => setCarcDosAntecedentes2(e.target.value)}
        >
          <MenuItem value=""><em>{select2Label}</em></MenuItem>
          {options2.map((opcao) => (
            <MenuItem key={opcao} value={opcao} sx={{ whiteSpace: "normal" }}>{opcao}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
};

const TextAndSelectSection = ({
  antecedenteSelecionado,
  CarcDosAntecedentes3,
  setCarcDosAntecedents3,
}) => {
  const selectLabel =
    antecedenteSelecionado?.CaracteristicaDoAntecedente?.LabelCaracteristicaSelect1;
  const options =
    antecedenteSelecionado?.CaracteristicaDoAntecedente?.CaracteristicaSelect1 || [];
  const texto =
    antecedenteSelecionado?.CaracteristicaDoAntecedente?.CaracteristicaTexto1;

  return (
    <Stack spacing={2}>
      <FormControl fullWidth>
        <InputLabel>{selectLabel}</InputLabel>
        <Select
          label={selectLabel}
          value={CarcDosAntecedentes3}
          onChange={(e) => setCarcDosAntecedents3(e.target.value)}
        >
          <MenuItem value=""><em>{selectLabel}</em></MenuItem>
          {options.map((opcao) => (
            <MenuItem key={opcao} value={opcao} sx={{ whiteSpace: "normal" }}>{opcao}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Paper elevation={0} sx={dndBoxStyle}>
        <Typography variant="h6" sx={{ mb: 1, fontFamily: "Cinzel", color: "#58180D", fontWeight: 700 }}>
          Características: {antecedenteSelecionado?.CaracteristicaDoAntecedente?.LabelCaracteristicaTexto1}
        </Typography>
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6, color: "#2c1a10" }}>
          {texto || "—"}
        </Typography>
      </Paper>
    </Stack>
  );
};

const Etapa7 = ({
  antecedenteSelecionado,
  antecedente,
  CarcDosAntecedentes1,
  setCarcDosAntecedents1,
  CarcDosAntecedentes2,
  setCarcDosAntecedentes2,
  CarcDosAntecedentes3,
  setCarcDosAntecedents3,
}) => {
  const showSingleText =
    ["Acólito", "Marinheiro", "Nobre", "Órfão"].includes(antecedente);
  const showSelects = antecedente === "Artesão de Guilda";
  const showTextAndSelect = [
    "Charlatão",
    "Artista",
    "Criminoso",
    "Eremita",
    "Forasteiro",
    "Sábio",
    "Soldado",
    "Herói do Povo",
  ].includes(antecedente);

  const sugestoes =
    antecedenteSelecionado?.CaracteristicaDoAntecedente?.caracteristicasSugeridas;

  return (
    <LayoutFicha title="Detalhes do Antecedente">
      <Stack spacing={3}>
        {showSingleText && <SingleTextSection antecedenteSelecionado={antecedenteSelecionado} />}

        {showSelects && (
          <SelectsSection
            antecedenteSelecionado={antecedenteSelecionado}
            CarcDosAntecedentes1={CarcDosAntecedentes1}
            setCarcDosAntecedents1={setCarcDosAntecedents1}
            CarcDosAntecedentes2={CarcDosAntecedentes2}
            setCarcDosAntecedentes2={setCarcDosAntecedentes2}
          />
        )}

        {showTextAndSelect && (
          <TextAndSelectSection
            antecedenteSelecionado={antecedenteSelecionado}
            CarcDosAntecedentes3={CarcDosAntecedentes3}
            setCarcDosAntecedents3={setCarcDosAntecedents3}
          />
        )}

        <Paper elevation={0} sx={{ ...dndBoxStyle, bgcolor: "rgba(255,255,255,0.4)" }}>
          <Typography variant="h6" sx={{ mb: 1, fontFamily: "Cinzel", color: "#2c1a10", fontWeight: 700 }}>
            Sugestões de Interpretação
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6, color: "#3d2b1f", fontStyle: "italic" }}>
            {sugestoes || "Nenhuma sugestão disponível."}
          </Typography>
        </Paper>
      </Stack>
    </LayoutFicha>
  );
};

export default Etapa7;
