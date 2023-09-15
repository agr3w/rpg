import React, { useEffect, useState } from "react";
// import Nav from "components/nav";
import styles from "./inicio.module.css";
import LivrosCard from "components/Cards/livors";
import AnotacoesCard from "components/Cards/anotacoes";
import MusicasCard from "components/Cards/musicas";
import Nav from "components/nav";
import img from "./Nota.png";
import FichaCard from "components/Cards/ficha";
import { Button } from "@mui/material";

export default function Inicio() {
  const [mostrarPainel, setMostrarPainel] = useState(false);

  useEffect(() => {
    // Verifique se o cookie 'visitouSite' está presente
    const visitouSite = document.cookie.includes("visitouSite=true");
    if (!visitouSite) {
      // Se for a primeira visita, mostra o painel
      setMostrarPainel(true);
      // Define um cookie indicando a visita
      document.cookie = "visitouSite=true; max-age=2592000"; // Cookie expira em 30 dias
    }
  }, []);

  const fecharPainel = () => {
    setMostrarPainel(false);
  };

  return (
    <>
      <Nav />
      <div className={styles.fundo}>
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
          {mostrarPainel && (
            <div>
              <div className={styles.fundoEscuro}></div>

              <div className={styles.painel}>
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
                <Button
                  variant="contained"
                  color="primary"
                  className={styles.botaoFechar}
                  onClick={fecharPainel}
                >
                  Fechar Painel
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className={styles.blurred_bg}></div>
      </div>
    </>
  );
}
