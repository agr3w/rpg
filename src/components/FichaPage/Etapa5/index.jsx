// EtapaAnterior.js
import React from "react";
import styles from "pages/FichaPage/fichaPage.module.css";

const Etapa5 = ({ antecedente, setAntecedente, antecedentesOptions }) => {
  return (
    <>
      <label className={styles.label}>Antecedente:</label>
      <select
        className={styles.input}
        value={antecedente}
        onChange={(e) => setAntecedente(e.target.value)}
      >
        <option value="">Selecione um antecedente</option>
        {antecedentesOptions.map((opcao) => (
          <option key={opcao} value={opcao}>
            {opcao}
          </option>
        ))}
      </select>
    </>
  );
};

export default Etapa5;
