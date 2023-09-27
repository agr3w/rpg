import React from "react";
import styles from "../cards.module.css"; // Estilos do card
import img from "./notanova.png"
import { FiMusic } from "react-icons/fi"
import { Link } from "react-router-dom";

const MusicasCard = () => {
  return (
    <div className={styles.cardMusic}>
      <div className={styles.card_header}>
        <FiMusic size={24} />
        <h2>Musicas</h2>
      </div>
      <Link to="/musicas">
        <img src={img} alt="Música" />
      </Link>
    </div>
  );
};

export default MusicasCard;
