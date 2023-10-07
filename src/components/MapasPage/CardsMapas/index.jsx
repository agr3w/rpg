// Importe o ícone do Material-UI correspondente ao nome
import RedditIcon from "@mui/icons-material/Reddit";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

const getIconByNome = (nome) => {
  switch (nome) {
    case "Reddit":
      return <RedditIcon />;
    // Adicione mais casos conforme necessário
    default:
      return null;
  }
};

const MapaCard = ({ titulo, imagem, link, icone }) => {
  const Icone = getIconByNome(icone);

  return (
    <Card style={{ width: "300px", margin: "10px", display: "inline-block" }}>
      <CardMedia component="img" alt={titulo} height="140" image={imagem} />
      <CardContent>
        <div style={{ display: "flex", alignItems: "center" }}>
          {Icone && <div style={{ marginRight: "10px" }}>{Icone}</div>}
          <Typography variant="h5" component="div">
            {titulo}
          </Typography>
        </div>
        <Button variant="contained" color="primary" href={link} target="_blank">
          Abrir Mapa
        </Button>
      </CardContent>
    </Card>
  );
};

export default MapaCard;
