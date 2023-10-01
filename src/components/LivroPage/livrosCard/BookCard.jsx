import React from "react";
import { FaTrash } from "react-icons/fa"; // Importe o ícone desejado
import imgNote from "./IconeLivro.png";
import styles from "./livroCard.module.css";
import { deletarLivro, deleteArrayLivro } from "../livroDelete/Deletarlivro";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

const LivroCard = ({ livro }) => {
  const handleDeletarLivro = () => {
    deleteArrayLivro(livro.id);
    deletarLivro(livro);
    window.location.reload();
  };

  return (
    <div className={`${styles.livroCard} ${styles.cardWithLink}`}>
      <p>Título: {livro.titulo}</p>
      <div className={styles.imgLink}>
        <Link
          to={livro.urlDoArquivo}
          className={styles.Link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={imgNote} alt="" width={100} />
        </Link>
      </div>
      <Button
        onClick={handleDeletarLivro}
        color="secondary"
        variant="contained"
      >
        <FaTrash size={16} /> Deletar Livro
      </Button>
    </div>
  );
};

export default LivroCard;
