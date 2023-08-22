import React from "react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import styles from "./nav.module.css";

const Nav = () => {
  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link to="/" className={styles.navLink}>
            Início
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/anotacoes" className={styles.navLink}>
            Anotações
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/livros" className={styles.navLink}>
            Livros
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/musicas" className={styles.navLink}>
            Músicas
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/rpg" className={styles.navLink}>
            Sessões de RPG
          </Link>
        </li>
      </ul>
      <div className={styles.profileIcon}>
        <FaUser size={24} />
      </div>
    </nav>
  );
};

export default Nav;
