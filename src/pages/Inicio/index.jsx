// Inicio.js
import React, { useEffect, useState } from "react";
import styles from "./inicio.module.css";
import styleFundo from "pages/FichaDetalhes/fichaDetalhe.module.css";
import LivrosCard from "components/Cards/livors";
import AnotacoesCard from "components/Cards/anotacoes";
import MusicasCard from "components/Cards/musicas";
import Nav from "components/nav";
import FichaCard from "components/Cards/ficha";
import { Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import MapsCard from "components/Cards/maps/indsx";
import { useAuth } from "contexts/AuthContext";
import { motion } from "framer-motion";

export default function Inicio() {
  const { user: usuarioAutenticado } = useAuth();

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, when: "beforeChildren" } },
  };
  const cardItem = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.36 } } };
  const panel = { hidden: { opacity: 0, scale: 0.98, y: 8 }, show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.36 } } };

  return (
    <>
      <Nav />

      {usuarioAutenticado ? (
        <motion.div className={styles.fundo} initial="hidden" animate="show" variants={container}>
          <div className={styles.homePage}>
            <div className={styles.leftColumn}>
              <motion.div className={`card ${styles.card}`} variants={cardItem}>
                <AnotacoesCard />
              </motion.div>
              <motion.div className={`card ${styles.card}`} variants={cardItem}>
                <MusicasCard />
              </motion.div>
            </div>

            <motion.div className={`card ${styles.card} ${styles.rightColumn}`} variants={cardItem}>
              <MapsCard />
            </motion.div>

            <div className={styles.grid}>
              <motion.div className={`card ${styles.card} ${styles.rightColumn}`} variants={cardItem}>
                <LivrosCard />
              </motion.div>
              <motion.div className={`card ${styles.card} ${styles.rightColumn}`} variants={cardItem}>
                <FichaCard />
              </motion.div>
            </div>

            <div className={styles.blurred_bg}></div>
          </div>

          <Typography className={styleFundo.support}>
            BackGround Art By:{" "}
            <Link
              to="https://waneella.tumblr.com/post/156858332747/preparing-pixel-art-video-backgrounds-for"
              className={styleFundo.supportLink}
            >
              Waneella Pixel Art
            </Link>
          </Typography>
        </motion.div>
      ) : (
        <motion.div initial="hidden" animate="show" variants={panel} className={styles.responsiveContainer}>
          <div>
            <div className={styles.fundoEscuro}></div>

            <div className={styles.painel}>
              <Typography variant="h4" style={{ textAlign: "center", paddingBottom: "20px" }}>
                Seja bem-Vindo
              </Typography>
              <div className={styles.iframeStyle}>
                <iframe
                  src="https://www.youtube.com/embed/lRb5rnWd_Xc?si=7f-b6SULaUMct2yp"
                  title="YouTube video player"
                  allowFullScreen
                ></iframe>
              </div>
              <div className={styles.textoExplicativo}>
                <p>
                  Bem-vindo ao RPG Organizer! Esta plataforma foi criada para tornar sua vida como mestre de RPG mais fácil.
                </p>
                <p>
                  Assista ao vídeo acima para uma introdução rápida e comece a explorar o RPG Organizer para uma experiência de RPG mais organizada e envolvente!
                </p>
              </div>
              <div className={styles.botaoLink}>
                <Link to={"/login"} style={{ marginBottom: "20px" }}>
                  <Button variant="contained" color="primary">
                    Fazer o Login
                  </Button>
                </Link>
                <Link to={"/Registrar-se"} style={{ margin: "0 20px" }}>
                  <Button variant="contained" color="primary">
                    Fazer o Registro
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
