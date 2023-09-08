// Etapa5.js
import React from "react";
import styles from "pages/FichaPage/fichaPage.module.css";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const Etapa6 = ({
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
    <div>
      <FormControl fullWidth>
        <InputLabel>Traço de Personalidade:</InputLabel>
        <Select
          value={tracoPersonalidadeSelecionado}
          onChange={onSelecionarTracoPersonalidade}
          label="Traço de Personalidade"
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
        <InputLabel>Ideal:</InputLabel>
        <Select
          value={idealSelecionado}
          onChange={onSelecionarIdeal}
          label="Ideal"
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
        <InputLabel>Defeito:</InputLabel>
        <Select
          value={defeitoSelecionado}
          onChange={onSelecionarDefeito}
          label="Defeito"
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
        <InputLabel>Vínculo:</InputLabel>
        <Select
          value={vinculoSelecionado}
          onChange={onSelecionarVinculo}
          label="Vínculo"
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
    </div>
  );
};

export default Etapa6;