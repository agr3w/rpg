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
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "APIs/firebaseConfig";
import { Link } from "react-router-dom";
import Loading from "components/Loading";
import MapsCard from "components/Cards/maps/indsx";

export default function Inicio() {
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);

    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuarioAutenticado(user);
      } else {
        setUsuarioAutenticado(null);
      }
      setIsLoaded(true); // Set isLoaded to true when finished loading
    });
  }, []);

  return (
    <>
      <Nav />

      {isLoaded ? (
        usuarioAutenticado ? (
          <div className={styles.fundo}>
            <div className={styles.homePage}>
              <div className={styles.leftColumn}>
                <div className={`card ${styles.card}`}>
                  <AnotacoesCard />
                </div>
                <div className={`card ${styles.card}`}>
                  <MusicasCard />
                </div>
              </div>
              <div className={`card ${styles.card} ${styles.rightColumn}`}>
                <MapsCard />
              </div>
              <div className={styles.grid}>
                <div className={`card ${styles.card} ${styles.rightColumn}`}>
                  <LivrosCard />
                </div>
                <div className={`card ${styles.card} ${styles.rightColumn}`}>
                  <FichaCard />
                </div>
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
          </div>
        ) : (
          <div className={styles.responsiveContainer}>
            <div>
              <div className={styles.fundoEscuro}></div>

              <div className={styles.painel}>
                <Typography
                  variant="h4"
                  style={{ textAlign: "center", paddingBottom: "20px" }}
                >
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
                    Bem-vindo ao RPG Organizer! Esta plataforma foi criada para
                    tornar sua vida como mestre de RPG mais fácil.
                  </p>
                  <p>
                    Assista ao vídeo acima para uma introdução rápida e comece a
                    explorar o RPG Organizer para uma experiência de RPG mais
                    organizada e envolvente!
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
          </div>
        )
      ) : (
        <Loading />
      )}
    </>
  );
}
