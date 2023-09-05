// Etapa3.js

import React from "react";
import styles from "pages/FichaPage/fichaPage.module.css";

const Etapa3 = ({ classe, setClasse, classesOptions, itensDaClasse }) => {
  return (
    <>
      <label className={styles.label}>Classe:</label>
      <select
        className={styles.input}
        value={classe}
        onChange={(e) => setClasse(e.target.value)}
      >
        <option value="">Selecione uma classe</option>
        {classesOptions.map((opcao) => (
          <option key={opcao} value={opcao}>
            {opcao}
          </option>
        ))}
      </select>
      <div>
        {/* Exiba os itens da classe selecionada */}
        {itensDaClasse.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </div>
    </>
  );
};

export default Etapa3;
