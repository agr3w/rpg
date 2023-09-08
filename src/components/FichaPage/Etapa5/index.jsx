import React from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material"; // Importe os componentes do Material-UI que você precisa
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
    <h1 className={styles.h1}>Selecione o Antecedente</h1>
      <FormControl fullWidth>
        <InputLabel>Antecedente</InputLabel>
        <Select
          label="Antecendente"
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
      </FormControl>
      <div className={styles.espacamentoTextoItem}>
        <label className={styles.label}>Proficiências adicionais:</label>
        {itensDaAntecedencia.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </div>
      {antecedente === "Acólito" && (
        <>
          <div className={styles.espacamentoSelects}>
            <label className={styles.label}>Idiomas adicionais:</label>
            <FormControl fullWidth>
              <InputLabel>Idioma</InputLabel>
              <Select
                label="Idioma"
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
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Idioma</InputLabel>
              <Select
                label="Idioma"
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
            </FormControl>
          </div>
        </>
      )}
      {antecedente === "Artesão de Guilda" && (
        <>
          <div className={styles.espacamentoSelects}>
            <label className={styles.label}>Idiomas adicionais:</label>
            <FormControl fullWidth>
              <InputLabel>Idioma</InputLabel>
              <Select
                label="Idioma"
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
            </FormControl>
          </div>
        </>
      )}
    </>
  );
};

export default Etapa5;
