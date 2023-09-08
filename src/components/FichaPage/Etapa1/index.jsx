// Etapa1.js

import React from "react";
import styles from "pages/FichaPage/fichaPage.module.css";
import { TextField } from "@mui/material";

const Etapa1 = ({ nome, setNome }) => {
  return (
    <div className={styles.etapaContainer}>
      <h1 className={styles.h1}>Nome do personagem</h1>
     <TextField
        label="Nome do personagem"
        variant="outlined"
        fullWidth
        className={styles.input}
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
    </div>
  );
};

export default Etapa1;