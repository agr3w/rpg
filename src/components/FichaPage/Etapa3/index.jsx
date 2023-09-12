// Etapa2.js

import React from "react";
import styles from "pages/FichaPage/fichaPage.module.css";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const Etapa3 = ({ racaSelecionada, SubRacasOptions, SubRaca, setSubRaca,raca }) => {
  return (
    <>
      <h1 className={styles.h1}>Selecione uma Sub-Raça</h1>
      {(raca === "Anão" ||
        raca === "Elfo" ||
        racaSelecionada === "Halfling" ||
        racaSelecionada === "Draconato" ||
        racaSelecionada === "Gnomo") && (
        <FormControl fullWidth>
          <InputLabel>Sub-Raça</InputLabel>
          <Select
            value={SubRaca}
            onChange={(e) => setSubRaca(e.target.value)}
            label="Sub-Raças"
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
      )}
      {/* {(racaSelecionada === "Anão" ||
        racaSelecionada === "Elfo" ||
        racaSelecionada === "Halfling" ||
        racaSelecionada === "Draconato" ||
        racaSelecionada === "Gnomo") && (
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
        </>
      )} */}
    </>
  );
};

export default Etapa3;
