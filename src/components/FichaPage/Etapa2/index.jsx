// Etapa2.js

import React from "react";
import styles from "pages/FichaPage/fichaPage.module.css";

const Etapa2 = ({ raca, setRaca, racasOptions, itensDaRaca }) => {
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
    </>
  );
};

export default Etapa2;
