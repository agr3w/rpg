// Etapa1.js

import React from "react";
import styles from "pages/FichaPage/fichaPage.module.css";

const Etapa1 = ({ nome, setNome }) => {
  return (
    <div className={styles.etapaContainer}>
      <label className={styles.label}>Nome:</label>
      <input
        type="text"
        className={styles.input}
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
    </div>
  );
};

export default Etapa1;