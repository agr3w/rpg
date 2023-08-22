import React, { useState } from "react";
import { FaPlay } from "react-icons/fa";
import styles from "./musicas.module.css";
import { Link } from "react-router-dom";

const MusicasCard = ({ imageUrl, trackUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={styles.card}>
      <Link to="/musicas">
        <img src={imageUrl} alt="Música" />
      </Link>
      <button onClick={togglePlay}>
        <FaPlay size={24} />
      </button>
      {isPlaying && (
        <audio controls autoPlay>
          <source src={trackUrl} type="audio/mp3" />
          Seu navegador não suporta a reprodução de áudio.
        </audio>
      )}
    </div>
  );
};

export default MusicasCard;
