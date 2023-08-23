import React from 'react';
import { FaTrash } from 'react-icons/fa';
import styles from './MusicaCard.module.css';
import { deletarMusica, deletarArray } from '../deletarBotao';

const MusicaCard = ({ musica }) => {
  const handleDeletarArray = () => {
    deletarArray(musica.id);
    deletarMusica(musica);
    window.location.reload();
  };

  return (
    <div className={styles.musicaCard}>
      <p>Título: {musica.titulo}</p>
      <p>Artista: {musica.artista}</p>
      <div className={styles.audioContainer}>
        <audio controls>
          <source src={musica.urlDoArquivo} type='audio/mpeg' />
          Seu navegador não suporta a reprodução de áudio.
        </audio>
      </div>
      <button onClick={handleDeletarArray} className={styles.deleteButton}>
        <FaTrash size={16} /> Deletar Música
      </button>
    </div>
  );
};

export default MusicaCard;
