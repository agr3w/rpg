// Etapa2.js

import React from "react";
import styles from "pages/FichaPage/fichaPage.module.css";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

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
    <>
    <h1 className={styles.h1}>Selecione uma Raça</h1>
      <FormControl fullWidth>
        <InputLabel>Raça</InputLabel>
        <Select
          value={raca}
          onChange={(e) => setRaca(e.target.value)}
          label="Raça"
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
      <div className={styles.espacamentoTextoItem}>
        {/* Exiba os itens da raça selecionada */}
        {itensDaRaca.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </div>
      {raca === "Humano" && (
        <>
          <div className={styles.espacamentoSelects}>
            <FormControl fullWidth>
              <InputLabel>Idiomas da Raça</InputLabel>
              <Select
                value={idiomaRacaSelecionado}
                onChange={(e) => setIdiomaRacaSelecionado(e.target.value)}
                label="Idiomas da Raça"
              >
                <MenuItem value="">
                  <em>Idiomas da Raça</em>
                </MenuItem>
                {racaSelecionada.idiomaRaca.map((opcao) => (
                  <MenuItem key={opcao} value={opcao}>
                    {opcao}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <FormControl fullWidth>
            <InputLabel>Selecione o segundo Idioma</InputLabel>
            <Select
              value={idiomaRacaSelecionado2}
              onChange={(e) => setIdiomaRacaSelecionado2(e.target.value)}
              label="Selecione o segundo Idioma"
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
        </>
      )}
    </>
  );
};

export default Etapa2;
