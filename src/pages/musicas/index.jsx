import React, { useState } from "react";
import styles from "./MusicasPage.module.css";
import styleFundo from "pages/FichaDetalhes/fichaDetalhe.module.css";
import BotaoAdicionarMusica from "components/MusicaPage/botaoAddMusica";
import MusicaCard from "components/MusicaPage/musicaCard";
import { useMusicContext } from "APIs/MusicContext";
import FiltroCategoria from "components/MusicaPage/filtroCategorias";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

const MusicasPage = () => {
  const { musicas, adicionarMusica } = useMusicContext();

  const categorias = Array.from(
    new Set(musicas.map((musica) => musica.categoria))
  );

  const [filtroCategoria, setFiltroCategoria] = useState("");

  const handleFiltroCategoriaChange = (novaCategoria) => {
    setFiltroCategoria(novaCategoria);
  };

  const musicasFiltradas = filtroCategoria
    ? musicas.filter((musica) => musica.categoria === filtroCategoria)
    : musicas;

  return (
    <>
      <div className={styles.fundo}>
        <div className={styles.musicasPage}>
          <BotaoAdicionarMusica onMusicaAdded={adicionarMusica} />
          <FiltroCategoria
            categorias={categorias}
            onFiltroCategoriaChange={handleFiltroCategoriaChange}
          />
          <div className={styles.musicasList}>
            {musicasFiltradas.map((musica) => (
              <MusicaCard
                key={musica.id}
                musica={musica}
                nomeArquivoAudio={musica.nomeArquivoAudio}
                nomeArquivoImagem={musica.nomeArquivoImagem}
              />
            ))}
          </div>
          <Typography className={styleFundo.support} >
            BackGround Art By:{" "}
            <Link
              to="https://waneella.tumblr.com/post/157664690747/details-here"
              className={styleFundo.supportLink}
            >
              Waneella Pixel Art
            </Link>
          </Typography>
        </div>
      </div>
    </>
  );
};

export default MusicasPage;
