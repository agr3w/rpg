// Etapa4.js
import React from "react";
import styles from "pages/FichaPage/fichaPage.module.css";

const Etapa4 = ({ tendencia, setTendencia, TendenciasOptions, itensDaTendencia }) => {
  return (
    <>
      <label className={styles.label}>Tendência:</label>
      <select
        className={styles.input}
        value={tendencia}
        onChange={(e) => setTendencia(e.target.value)}
      >
        <option value="">Selecione uma tendência</option>
        {TendenciasOptions.map((opcao) => (
          <option key={opcao} value={opcao}>
            {opcao}
          </option>
        ))}
      </select>
      <div>
        {itensDaTendencia.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </div>
    </>
  );
};

export default Etapa4;
