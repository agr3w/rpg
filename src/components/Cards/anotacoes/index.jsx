import React from "react";
import { Link } from "react-router-dom";
import { TfiMarkerAlt } from "react-icons/tfi"; // Ícone de livros
import styles from "../cards.module.css"; // Estilos do card
import img from "./Caderno.png"

const AnotacoesCard = () => {
  return (
    <div className={styles.card}>
      <div className={styles.card_header}>
        <TfiMarkerAlt size={24} />
        <h2>Anotações</h2>
      </div>
      <Link to="/Anotacoes">
        <img src={img} alt="Anotação" />
      </Link>
    </div>
  );
};

export default AnotacoesCard;
