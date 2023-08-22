import React from "react";
import styles from "./musicas.module.css";
import { Link } from "react-router-dom";

const MusicasCard = ({ imageUrl }) => {
  return (
    <div className={styles.card}>
      <Link to="/musicas">
        <img src={imageUrl} alt="Música" />
      </Link>
    </div>
  );
};

export default MusicasCard;
