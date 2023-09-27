import React from "react";
import { Link } from "react-router-dom";
import { FaBook } from "react-icons/fa"; // Ícone de livros
import styles from "../cards.module.css"; // Estilos do card
import img from "./livroDragao.png";

const LivrosCard = () => {
  return (
    <div className={styles.card}>
      <div className={styles.card_header}>
        <FaBook size={24} />
        <h2>Livros</h2>
      </div>
      <Link to="/livros">
        <img src={img} alt="livro" />
      </Link>
    </div>
  );
};

export default LivrosCard;
