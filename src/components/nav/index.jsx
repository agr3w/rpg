import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FiUser } from "react-icons/fi"; // Importe o ícone de pessoa
import styles from "./nav.module.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Nav = () => {
  const handleSupportClick = () => {
    window.location.href = "mailto:suzanakampa12@gmail.com";
  };

  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    // Verificar o estado de autenticação do usuário
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // O usuário está autenticado
        setUsuarioAutenticado(user);
      } else {
        // O usuário não está autenticado
        setUsuarioAutenticado(null);
      }
    });
  }, []);
  return (
    <>
      {usuarioAutenticado ? (
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
            <li className={styles.navLink} onClick={handleSupportClick}>
              Suporte
            </li>
            <li className={styles.navLink}>
              <NavLink to={"/logOut"} className={styles.userIcon}>
                <FiUser size={22} />
              </NavLink>
            </li>
          </ul>
        </nav>
      ) : null}
    </>
  );
};

export default Nav;
