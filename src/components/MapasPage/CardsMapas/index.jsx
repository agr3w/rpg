// MapaCard.js
import React from "react";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import RedditIcon from "@mui/icons-material/Reddit";
import { AiOutlineGlobal } from "react-icons/ai";
import styles from "./mapasCards.module.css";

const getIconByNome = (nome) => {
  switch (nome) {
    case "Reddit":
      return <RedditIcon />;
    default:
      return <AiOutlineGlobal size={18} />;
  }
};

const MapaCard = ({ titulo, imagem, link, icone }) => {
  const Icone = getIconByNome(icone);

  return (
      <Card
        className={styles.card}
        style={{ backgroundColor: "rgb(128 148 152)", borderRadius: "8px" }}
      >
        <CardMedia component="img" alt={titulo} height="140" image={imagem} />
        <CardContent>
          <div className={styles.cardContent}>
            {Icone && <div className={styles.icon}>{Icone}</div>}
            <Typography variant="h5" component="div">
              {titulo}
            </Typography>
          </div>
          <Button
            variant="contained"
            color="primary"
            href={link}
            target="_blank"
            style={{ marginTop: "10px" }}
          >
            Ver Mapas
          </Button>
        </CardContent>
      </Card>
  );
};

export default MapaCard;
