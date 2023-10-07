import React from "react";
import styles from "../cards.module.css"; // Estilos do card
import img from "./MapsIcon.png"
import { FaMapSigns } from "react-icons/fa"
import { Link } from "react-router-dom";

const MapsCard = () => {
  return (
    <div className={styles.cardMusic}>
      <div className={styles.card_header}>
        <FaMapSigns size={24} />
        <h2>Mapas</h2>
      </div>
      <Link to="/mapas">
        <img src={img} alt="Mapas" />
      </Link>
    </div>
  );
};

export default MapsCard;
