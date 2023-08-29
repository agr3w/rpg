import React, { useState } from "react";
import styles from "./FiltroCategoria.module.css"; // Importe seus estilos CSS
import { useMusicContext } from "APIs/MusicContext";

const FiltroCategoria = ({ onFiltroCategoriaChange }) => {
    const { categorias } = useMusicContext();
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");

  const handleCategoriaChange = (event) => {
    const novaCategoria = event.target.value;
    setCategoriaSelecionada(novaCategoria);
    onFiltroCategoriaChange(novaCategoria);
  };

  return (
    <div className={styles.filtroCategoria}>
      <select
        value={categoriaSelecionada}
        onChange={handleCategoriaChange}
        className={styles.select}
      >
        <option value="">Todas as Categorias</option>
        {categorias.map((categoria, index) => (
          <option key={index} value={categoria}>
            {categoria}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FiltroCategoria;
