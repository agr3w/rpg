import React from "react";
// import Nav from "components/nav";
import styles from "./inicio.module.css";
import LivrosCard from "components/Cards/livors";
import AnotacoesCard from "components/Cards/anotacoes";
import MusicasCard from "components/Cards/musicas";
import Nav from "components/nav";

import zap from "./zap.mp3";
import img from "./watssap.png";

export default function Inicio() {
  return (
    <>
      <Nav />
      <div className={styles.homePage}>
        {" "}
        <div className={styles.leftColumn}>
          {" "}
          <AnotacoesCard />
          <MusicasCard imageUrl={img} trackUrl={zap} />
        </div>
        <div className={styles.rightColumn}>
          {" "}
          <LivrosCard />
        </div>
      </div>
    </>
  );
}
