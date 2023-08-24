import React from "react";
import styles from "./MusicasPage.module.css";
import BotaoAdicionarMusica from "components/MusicaPage/botaoAddMusica";
import MusicaCard from "components/MusicaPage/musicaCard";
import { useMusicContext } from "APIs/MusicContext";

const MusicasPage = () => {
  const { musicas, adicionarMusica } = useMusicContext();

  return (
    <div className={styles.musicasPage}>
      <BotaoAdicionarMusica onMusicaAdded={adicionarMusica} />
      <div className={styles.musicasList}>
        {musicas.map((musica) => (
          <MusicaCard key={musica.id} musica={musica} />
        ))}
      </div>
    </div>
  );
};

export default MusicasPage;
