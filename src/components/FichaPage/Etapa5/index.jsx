import React from "react";
import { Select, MenuItem } from "@mui/material"; // Importe os componentes do Material-UI que você precisa
import styles from "pages/FichaPage/fichaPage.module.css";

const Etapa5 = ({
  antecedente,
  setAntecedente,
  antecedentesOptions,
  itensDaAntecedencia,
  idiomaDoAntecedente,
  setIdiomaAntecedente,
  idiomaDoAntecendente2,
  setIdiomaAntecendente2,
  idiomaOption,
}) => {
  return (
    <>
      <label className={styles.label}>Antecedente:</label>
      <Select
        className={styles.input}
        value={antecedente}
        onChange={(e) => setAntecedente(e.target.value)}
      >
        <MenuItem value="">Selecione um antecedente</MenuItem>
        {antecedentesOptions.map((opcao) => (
          <MenuItem key={opcao} value={opcao}>
            {opcao}
          </MenuItem>
        ))}
      </Select>
      <div>
        {itensDaAntecedencia.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </div>
      {antecedente === "Acólito" && (
        <>
          <Select
            value={idiomaDoAntecedente}
            onChange={(e) => setIdiomaAntecedente(e.target.value)}
          >
            <MenuItem value="">Selecione Idioma</MenuItem>
            {idiomaOption.map((opcao) => (
              <MenuItem key={opcao} value={opcao}>
                {opcao}
              </MenuItem>
            ))}
          </Select>
          <Select
            value={idiomaDoAntecendente2}
            onChange={(eb) => setIdiomaAntecendente2(eb.target.value)}
          >
            <MenuItem value="">Selecione Idioma</MenuItem>
            {idiomaOption.map((opcao) => (
              <MenuItem key={opcao} value={opcao}>
                {opcao}
              </MenuItem>
            ))}
          </Select>
        </>
      )}
      {antecedente === "Artesão de Guilda" && (
        <>
          <Select
            value={idiomaDoAntecedente}
            onChange={(e) => setIdiomaAntecedente(e.target.value)}
          >
            <MenuItem value="">Selecione Idioma</MenuItem>
            {idiomaOption.map((opcao) => (
              <MenuItem key={opcao} value={opcao}>
                {opcao}
              </MenuItem>
            ))}
          </Select>
        </>
      )}
    </>
  );
};

export default Etapa5;
