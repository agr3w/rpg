import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import { useMusicContext } from "APIs/MusicContext";
import styles from "./FiltroCategoria.module.css"; // Importe seus estilos CSS

const FiltroCategoria = ({ onFiltroCategoriaChange, categoriaAtiva }) => {
  const { categorias } = useMusicContext();
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");

  const handleCategoriaChange = (event) => {
    const novaCategoria = event.target.value;
    setCategoriaSelecionada(novaCategoria);
    onFiltroCategoriaChange(novaCategoria);
  };

  const handleChange = (event, newValue) => {
    onFiltroCategoriaChange(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={categoriaAtiva || ""} // Se vazio, seleciona "Todos"
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        textColor="secondary"
        indicatorColor="secondary"
        sx={{
          "& .MuiTab-root": {
            fontFamily: "Cinzel",
            fontWeight: "bold",
            color: "rgba(0, 0, 0, 0.5)",
            "&.Mui-selected": { color: "#bf8f00" }
          },
          "& .MuiTabs-indicator": { backgroundColor: "#bf8f00" }
        }}
      >
        <Tab 
          value="" 
          label="Todos os Ritmos" 
          icon={<AllInclusiveIcon fontSize="small" />} 
          iconPosition="start"
        />
        {categorias.map((categoria) => (
          <Tab 
            key={categoria} 
            value={categoria} 
            label={categoria} 
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default FiltroCategoria;
