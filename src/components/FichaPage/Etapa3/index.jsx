// Etapa2.js

import React from "react";
import styles from "pages/FichaPage/fichaPage.module.css";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

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
  setEngenhocas
}) => {
  // Função para atualizar os detalhes da sub-raça quando uma nova sub-raça for selecionada

  return (
    <>
      {(raca === "Anão" ||
        raca === "Elfo" ||
        raca === "Halfling" ||
        raca === "Draconato" ||
        raca === "Gnomo") && (
        <>
          <h1 className={styles.h1}>Selecione uma Sub-Raça</h1>
          <FormControl fullWidth>
            <InputLabel>Sub-Raça</InputLabel>
            <Select
              value={SubRaca}
              onChange={handleSubRacaChange}
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
          {detalhesSubRaca && (
            <div className={styles.espacamentoTextoItem}>
              {detalhesSubRaca.habilidadesSubRaca.map((habilidade, index) => (
                <li key={index}>{habilidade}</li>
              ))}
            </div>
          )}
          {SubRaca === "Alto Elfo" && (
            <FormControl fullWidth>
              <InputLabel>Idioma do Alto Elfo</InputLabel>
              <Select
                value={IdiomaAltoElfo}
                onChange={(e) => setIdiomaAltoElfoSelecioando(e.target.value)}
                label="Idioma do Alto Elfo"
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
      {SubRaca === "Gnomo das Rochas" && (
        <>
          <FormControl fullWidth>
              <InputLabel>Engenhocas</InputLabel>
              <Select
                value={Engenhocas}
                onChange={(e) => setEngenhocas(e.target.value)}
                label="Engenhocas"
              >
                <MenuItem value="">
                  <em>Engenhocas</em>
                </MenuItem>
                {detalhesSubRaca.Engenhoca.map((Engenhocas) => (
                  <MenuItem key={Engenhocas} value={Engenhocas}>
                    {Engenhocas}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
        </>
      )}
      {(raca === "Meio-Elfo" || raca === "Meio-Orc" || raca === "Tiefling") && (
        <>
          <h1 className={styles.h1}>Sua classe não possue uma Sub-Classe</h1>
        </>
      )}
    </>
  );
};

export default Etapa3;
