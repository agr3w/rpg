import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import styles from './MusicaCard.module.css';
import { deletarMusica, deletarArray } from '../deletarBotao';

const MusicaCard = ({ musica, fila, removerMusicaDaFila }) => {
  const handleDeletarArray = () => {
    deletarArray(musica.id);
    deletarMusica(musica);
    window.location.reload();
  };

  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={styles.musicaCard}>
      <div className={styles.imageContainer}>
        <img src={musica.imagemUrl} alt="Capa da música" />
        <button
          className={styles.playButton}
          onClick={toggleAudio}
        >
          {isPlaying ? 'Pausar' : 'Ouvir'}
        </button>
        {isPlaying && (
          <audio controls className={styles.audioControl}>
            <source src={musica.urlDoArquivo} type="audio/mpeg" />
            Seu navegador não suporta a reprodução de áudio.
          </audio>
        )}
      </div>
      <div className={styles.detailsContainer}>
        <p className={styles.titulo}>Título: {musica.titulo}</p>
        <p className={styles.artista}>Artista: {musica.artista}</p>
        <button onClick={handleDeletarArray} className={styles.deleteButton}>
          <FaTrash size={16} /> Deletar Música
        </button>
      </div>
    </div>
  );
};

export default MusicaCard;
