import React from "react";
import styles from "./BotaoAdicionarMusica.module.css";
import { useMusicContext } from "APIs/MusicContext";
import AddMusicButton from "../painelAdd";

const BotaoAdicionarMusica = () => {
  const { adicionarMusica } = useMusicContext();

  return (
    <div className={styles.botaoAdicionarMusica}>
      <AddMusicButton onMusicAdded={adicionarMusica} />
    </div>
  );
};

export default BotaoAdicionarMusica;
