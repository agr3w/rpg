import React from "react";
import { NavLink } from "react-router-dom";
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
          <NavLink to="/Fichas" className={styles.navLink}>
            Fichas
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
