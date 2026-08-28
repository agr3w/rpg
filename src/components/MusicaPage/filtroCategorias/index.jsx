import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import { useMusicContext } from "APIs/MusicContext";

const FiltroCategoria = ({ onFiltroCategoriaChange, categoriaAtiva }) => {
  const { categorias } = useMusicContext();

  const handleChange = (event, newValue) => {
    onFiltroCategoriaChange(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={categoriaAtiva || ""}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          "& .MuiTab-root": {
            fontFamily: "Cinzel",
            fontWeight: 700,
            color: "text.secondary",
            minHeight: 44,
            px: 2,
            mx: 0.5,
            borderRadius: 1,
            transition: "all 0.15s ease",
            "&:hover": {
              color: "text.primary",
            },
            "&.Mui-selected": {
              color: "secondary.main",
              fontWeight: 800,
              bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(191,143,0,0.1)"),
              border: (t) => (t.palette.mode === "dark" ? "1px solid rgba(212, 122, 55, 0.25)" : "1px solid rgba(191,143,0,0.2)"),
            },
          },
          "& .MuiTabs-indicator": { backgroundColor: "secondary.main", height: 3 }
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
