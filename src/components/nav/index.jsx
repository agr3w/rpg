import React from "react";
import { NavLink } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import styles from "./nav.module.css";

const Nav = () => {
  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <NavLink to="/" className={styles.navLink}>
            Início
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink to="/anotacoes" className={styles.navLink}>
            Anotações
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink to="/livros" className={styles.navLink}>
            Livros
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink to="/musicas" className={styles.navLink}>
            Músicas
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink to="/rpg" className={styles.navLink}>
            Sessões de RPG
          </NavLink>
        </li>
      </ul>
      <div className={styles.profileIcon}>
        <FaUser size={24} />
      </div>
    </nav>
  );
};

export default Nav;
