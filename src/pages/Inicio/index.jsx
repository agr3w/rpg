import React, { useEffect, useState } from "react";
// import Nav from "components/nav";
import styles from "./inicio.module.css";
import LivrosCard from "components/Cards/livors";
import AnotacoesCard from "components/Cards/anotacoes";
import MusicasCard from "components/Cards/musicas";
import Nav from "components/nav";
import img from "./Nota.png";
import FichaCard from "components/Cards/ficha";
import { Button, Typography } from "@mui/material";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "APIs/firebaseConfig";
import { Link } from "react-router-dom";

export default function Inicio() {
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null);

  useEffect(() => {
    const auth = getAuth(app);

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
      <Nav />
      <div className={styles.fundo}>
        {usuarioAutenticado ? (
          <div className={styles.homePage}>
            <div className={styles.leftColumn}>
              <div className={`card ${styles.card}`}>
                <AnotacoesCard />
              </div>
              <div className={`card ${styles.card}`}>
                <MusicasCard imageUrl={img} />
              </div>
            </div>
            <div className={`card ${styles.card} ${styles.rightColumn}`}>
              <LivrosCard />
            </div>
            <div className={`card ${styles.card} ${styles.rightColumn}`}>
              <FichaCard />
            </div>
            <div className={styles.blurred_bg}></div>
          </div>
        ) : (
          <div className={styles.naoAutenticado}>
            <div>
              <div className={styles.fundoEscuro}></div>

              <div className={styles.painel}>
                <Typography variant="h4" style={{ textAlign: "center", paddingBottom: "20px" }}>Seja bem-Vindo</Typography>
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/yjy1dBc2lbc?si=7Pd4-EdQGeugnfuJ"
                  title="YouTube video player"
                ></iframe>
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
                <Link to={"/login"}>
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
        )}
      </div>
    </>
  );
}
