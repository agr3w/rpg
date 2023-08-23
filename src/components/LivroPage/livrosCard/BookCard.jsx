import React from "react";
import { FaTrash, FaFileImage } from "react-icons/fa"; // Importe o ícone desejado
import styles from "./livroCard.module.css";
import { deletarLivro, deleteArrayLivro } from "../livroDelete/Deletarlivro";
import { Link } from "react-router-dom";

const LivroCard = ({ livro }) => {

  const handleDeletarLivro = () => {
    deleteArrayLivro(livro.id);
    deletarLivro(livro);
    window.location.reload();
  };

  return (
    <div className={`${styles.livroCard} ${styles.cardWithLink}`}>
      <p>Título: {livro.titulo}</p>
      <Link to={livro.urlDoArquivo} target="_blank" rel="noopener noreferrer">
        {livro.id}
      </Link>
      <label htmlFor={`fileInput-${livro.id}`} className={styles.uploadLabel}>
        <FaFileImage size={104} />
      </label>

      <button onClick={handleDeletarLivro}>
        <FaTrash size={16} /> Deletar Livro
      </button>
    </div>
  );
};

export default LivroCard;
