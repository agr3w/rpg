// MapasPage.js
import mapas from "Array/MapasArray";
import MapaCard from "components/MapasPage/CardsMapas";
import React from "react";
import styles from "./mapaPage.module.css";
import styleFundo from "pages/FichaDetalhes/fichaDetalhe.module.css"
import { Typography } from "@mui/material";
import Nav from "components/nav";
import { Link } from "react-router-dom";

const MapasPage = () => {
  return (
    <div className={styles.mapasPage}>
      <Nav />
      <Typography
        variant="h2"
        color={"white"}
        textAlign={"center"}
        padding={"20px 0"}
      >
        Mapas
      </Typography>
      {mapas.map((mapa) => (
        <MapaCard
          key={mapa}
          imagem={mapa.imagem}
          link={mapa.link}
          titulo={mapa.titulo}
          icone={mapa.icone}
        />
      ))}
      <Typography className={styleFundo.support} style={{ color: "white" }}>
        BackGround Art By:{" "}
        <Link
          to="https://imgur.com/ThoaYYN"
          className={styleFundo.supportLink}
          style={{ color: "white" }}
        >
          ThoaYYN
        </Link>
      </Typography>
    </div>
  );
};

export default MapasPage;
