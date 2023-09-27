import React from "react";
import { Link } from "react-router-dom";
import { TfiMarkerAlt } from "react-icons/tfi"; // Ícone de livros
import styles from "../cards.module.css"; // Estilos do card
import img from "./fichanova.png";

const FichaCard = () => {
  return (
    <div className={styles.card}>
      <div className={styles.card_header}>
        <TfiMarkerAlt size={24} />
        <h2>Ficha</h2>
      </div>
      <Link to="/fichas">
        <img src={img} alt="Ficha" />
      </Link>
    </div>
  );
};

export default FichaCard;
