import React, { useState } from "react";
import { FaTrash, FaRedo } from "react-icons/fa";
import { Button, Card, CardContent, CardMedia } from "@mui/material"; // Importar os componentes do Material-UI
import styles from "./MusicaCard.module.css";
import { deletarMusica, deletarArray } from "../deletarBotao";

const MusicaCard = ({ musica, nomeArquivoAudio, nomeArquivoImagem }) => {
  const handleDeletarArray = () => {
    deletarMusica(nomeArquivoAudio, nomeArquivoImagem);
    deletarArray(musica.id);
    window.location.reload();
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
  };

  return (
    <Card className={styles.musicaCard} style={{backgroundColor: "rgb(203 205 205)"}}>
      <div className={styles.imageContainer}>
        <CardMedia
          component="img"
          height="160"
          image={musica.imagemUrl}
          alt="Capa da música"
        />
        <Button
          className={styles.playButton}
          variant="contained"
          color={isPlaying ? "secondary" : "primary"}
          onClick={toggleAudio}
        >
          {isPlaying ? "Pausar" : "Ouvir"}
        </Button>
        {isPlaying && (
          <audio controls loop={isLooping} className={styles.audioControl}>
            <source src={musica.urlDoArquivo} type="audio/mpeg" />
            Seu navegador não suporta a reprodução de áudio.
          </audio>
        )}
        <div className={styles.audioControls}>
          <Button
            onClick={toggleLoop}
            variant="outlined"
            className={
              isLooping ? styles.audioButtonLoopOn : styles.audioButtonLoopOff
            }
          >
            <FaRedo
              size={14}
              className={isLooping ? styles.loopIconOn : styles.loopIconOff}
            />
          </Button>
        </div>
      </div>
      <CardContent className={styles.detailsContainer}>
        <p className={styles.titulo}>{musica.titulo}</p>
        <p className={styles.artista}>{musica.categoria}</p>
        <Button
          onClick={handleDeletarArray}
          variant="contained"
          color="secondary"
          className={styles.deleteButton}
          startIcon={<FaTrash size={16} />}
        >
          Deletar Música
        </Button>
      </CardContent>
    </Card>
  );
};

export default MusicaCard;
