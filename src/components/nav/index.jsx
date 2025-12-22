import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import styles from "./nav.module.css";
import { Box, Button, Modal, Typography } from "@mui/material";
import { auth } from "APIs/firebaseConfig";

const Nav = () => {
  const handleSupportClick = () => {
    window.location.href = "mailto:suzanakampa12@gmail.com";
  };

  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setUsuarioAutenticado(user ?? null);
    });
    return () => unsub();
  }, []);

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        console.log("Usuário desconectado");
      })
      .catch((error) => {
        console.error("Erro durante o logout:", error);
      })
      .finally(() => setShowLogoutModal(false));
  };
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
            <li className={styles.navLink} onClick={handleSupportClick}>
              Suporte
            </li>
            <li
              className={styles.navLink}
              onClick={() => setShowLogoutModal(true)}
            >
              <FiUser size={22} />
            </li>
          </ul>
        </nav>
      ) : null}
      {/* Modal de logout */}
      {showLogoutModal && (
        <Modal
          open={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box className={styles.logoutModal}>
            <Typography
              variant="h6"
              id="modal-modal-title"
              color={"white"}
              style={{
                margin: "10px",
                textAlign: "center",
              }}
            >
              Deseja sair?
            </Typography>
            <Button
              onClick={handleLogout}
              variant="contained"
              color="primary"
              style={{
                margin: "0 0 0 20px",
              }}
            >
              Sair
            </Button>
            <Button
              onClick={() => setShowLogoutModal(false)}
              variant="contained"
              color="secondary"
              style={{
                margin: "20px",
              }}
            >
              Cancelar
            </Button>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default Nav;
