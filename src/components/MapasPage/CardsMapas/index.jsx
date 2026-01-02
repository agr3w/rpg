// MapaCard.js
import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Tooltip
} from "@mui/material";
import RedditIcon from "@mui/icons-material/Reddit";
import PublicIcon from '@mui/icons-material/Public';
import MapIcon from '@mui/icons-material/Map';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const getIconByNome = (nome) => {
  switch (nome) {
    case "Reddit":
      return <RedditIcon sx={{ color: "#ff4500" }} />;
    default:
      return <PublicIcon sx={{ color: "#5d4037" }} />;
  }
};

const MapaCard = ({ titulo, imagem, link, icone }) => {
  const Icone = getIconByNome(icone);

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#fdfbf7", // Cor de papel
        backgroundImage: `url("https://www.transparenttextures.com/patterns/paper.png")`,
        border: "8px solid #5d4037", // Borda grossa de madeira/moldura
        borderRadius: 1,
        position: "relative",
        overflow: "visible",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        boxShadow: "0 10px 20px rgba(0,0,0,0.5)",
        "&:hover": {
          transform: "translateY(-8px) rotate(1deg)",
          boxShadow: "0 15px 30px rgba(0,0,0,0.7)",
          borderColor: "#833c0b",
          "& .map-overlay": { opacity: 0 } // Revela a imagem limpa
        },
        "&::before": { // Efeito de "enrolado" no topo (opcional, visual)
           content: '""',
           position: "absolute",
           top: -10, left: 10, right: 10, height: 4,
           bgcolor: "#3e2723",
           borderRadius: 2,
           opacity: 0.5
        }
      }}
    >
      {/* Imagem do Mapa */}
      <Box sx={{ position: "relative", height: 200, overflow: "hidden", borderBottom: "2px solid #5d4037" }}>
        <CardMedia
          component="img"
          alt={titulo}
          image={imagem}
          sx={{ 
            height: "100%", 
            objectFit: "cover",
            filter: "sepia(30%) contrast(110%)", // Estilo envelhecido
            transition: "filter 0.3s"
          }}
        />
        {/* Overlay para parecer mapa antigo até passar o mouse */}
        <Box 
          className="map-overlay"
          sx={{
            position: "absolute",
            top: 0, left: 0, width: "100%", height: "100%",
            bgcolor: "rgba(93, 64, 55, 0.2)",
            transition: "opacity 0.3s",
            pointerEvents: "none"
          }}
        />
        
        {/* Ícone de Origem (Selo) */}
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            bgcolor: "#fdfbf7",
            p: 0.5,
            borderRadius: "50%",
            boxShadow: 2,
            display: "flex"
          }}
        >
          <Tooltip title={`Fonte: ${icone || "Web"}`}>
             {Icone}
          </Tooltip>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", p: 2 }}>
        <Box>
          <Typography 
            variant="h6" 
            component="div" 
            align="center"
            sx={{ 
              fontFamily: "Cinzel", 
              fontWeight: "bold", 
              color: "#2e1e14",
              mb: 1,
              lineHeight: 1.2
            }}
          >
            {titulo}
          </Typography>
          <Typography variant="caption" display="block" align="center" color="text.secondary" sx={{ fontStyle: "italic", mb: 2 }}>
            Região desconhecida
          </Typography>
        </Box>

        <Button
          variant="outlined"
          href={link}
          target="_blank"
          endIcon={<ArrowForwardIcon />}
          sx={{
            mt: "auto",
            width: "100%",
            color: "#833c0b",
            borderColor: "#833c0b",
            fontFamily: "Cinzel",
            fontWeight: "bold",
            borderWidth: 2,
            "&:hover": {
              borderWidth: 2,
              bgcolor: "rgba(131, 60, 11, 0.1)",
              borderColor: "#bf8f00",
              color: "#bf8f00"
            }
          }}
        >
          Viajar
        </Button>
      </CardContent>
    </Card>
  );
};

export default MapaCard;
