// Etapa4.js
import React from "react";
import styles from "pages/FichaPage/fichaPage.module.css";
import { FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";

const Etapa5 = ({ tendencia, setTendencia, TendenciasOptions, itensDaTendencia }) => {
  return (
    <>
    <h1 className={styles.h1}>Tendência do personagem</h1>
      <FormControl fullWidth>
        <InputLabel>Tendência</InputLabel>
        <Select
          value={tendencia}
          onChange={(e) => setTendencia(e.target.value)}
          label="Tendência"
        >
          <MenuItem value="">
            <em>Selecione uma tendência</em>
          </MenuItem>
          {TendenciasOptions.map((opcao) => (
            <MenuItem key={opcao} value={opcao}>
              {opcao}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div>
        {itensDaTendencia.map((item, index) => (
          <Typography key={index}>{item}</Typography>
        ))}
      </div>
    </>
  );
};

export default Etapa5;
