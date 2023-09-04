import React from "react";
// import Nav from "components/nav";
import styles from "./inicio.module.css";
import LivrosCard from "components/Cards/livors";
import AnotacoesCard from "components/Cards/anotacoes";
import MusicasCard from "components/Cards/musicas";
import Nav from "components/nav";
import img from "./Nota.png";
import FichaCard from "components/Cards/ficha";

export default function Inicio() {
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
          {/* <div className={`card ${styles.card} ${styles.rightColumn}`}>
            <FichaCard />
          </div> */}
        </div>
        <div className={styles.blurred_bg}></div>
      </div>
    </>
  );
}
