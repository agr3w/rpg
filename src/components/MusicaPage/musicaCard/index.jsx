import React from 'react';
import { FaTrash } from 'react-icons/fa';
import styles from './MusicaCard.module.css';
import { deletarMusica, deletarArray }  from '../deletarBotao';

const MusicaCard = ({ musica }) => {

    const handleDeletarArray = () => {
        deletarArray(musica.id); // Chama a função para deletar a array
        deletarMusica(musica)
        window.location.reload(); // Recarrega a página
      };
    

  return (
    <div className={styles.musicaCard}>
      <p>Título: {musica.titulo}</p>
      <p>Artista: {musica.artista}</p>
      <audio controls>
        <source src={musica.urlDoArquivo} type='audio/mpeg' />
        Seu navegador não suporta a reprodução de áudio.
      </audio>
      <button onClick={handleDeletarArray}>
        <FaTrash size={16} /> Deletar Música
      </button>
    </div>
  );
};

export default MusicaCard;
