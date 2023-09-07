// Etapa2.js

import React from "react";
import styles from "pages/FichaPage/fichaPage.module.css";

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
      <label className={styles.label}>Raça:</label>
      <select
        className={styles.input}
        value={raca}
        onChange={(e) => setRaca(e.target.value)}
      >
        <option value="">Selecione uma raça</option>
        {racasOptions.map((opcao) => (
          <option key={opcao} value={opcao}>
            {opcao}
          </option>
        ))}
      </select>
      <div>
        {/* Exiba os itens da raça selecionada */}
        {itensDaRaca.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </div>
      {raca === "Humano" && (
        <>
          <select
            value={idiomaRacaSelecionado}
            onChange={(e) => setIdiomaRacaSelecionado(e.target.value)}
          >
            <option value="">Idiomas da Raça</option>
            {racaSelecionada.idiomaRaca.map((opcao) => (
              <option key={opcao} value={opcao}>
                {opcao}
              </option>
            ))}
          </select>
          <label value={idiomaRacaSelecionado2}>test</label>
          <select
            value={idiomaRacaSelecionado2}
            onChange={(e) => setIdiomaRacaSelecionado2(e.target.value)}
          >
            <option value="">Selecione o segundo Idioma</option>
            {idiomaOption.map((opcao) => (
              <option key={opcao} value={opcao}>
                {opcao}
              </option>
            ))}
          </select>
        </>
      )}
    </>
  );
};

export default Etapa2;
