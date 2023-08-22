import React from 'react';
import { FaTrash } from 'react-icons/fa';
import styles from './livroCard.module.css'; // Certifique-se de ter o arquivo de estilos correspondente
import { deletarLivro, deleteArrayLivro } from './Deletarlivro';

const LivroCard = ({ livro }) => {

  const handleDeletarLivro = () => {
    deleteArrayLivro(livro.id)
    deletarLivro(livro); // Chama a função para deletar o livro
    window.location.reload(); // Recarrega a página
  };

  return (
    <div className={styles.livroCard}>
      <p>Título: {livro.titulo}</p>
      <button onClick={handleDeletarLivro}>
        <FaTrash size={16} /> Deletar Livro
      </button>
    </div>
  );
};

export default LivroCard;
