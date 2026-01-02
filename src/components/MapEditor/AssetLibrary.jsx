import React, { useState } from "react";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Paper, TextField, InputAdornment } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import { useAssetContext } from "APIs/AssetContext";

const AssetLibrary = () => {
  const { publicAssets } = useAssetContext();
  const [search, setSearch] = useState("");

  const handleDragStart = (e, url, type) => {
    e.dataTransfer.setData("imageUrl", url);
    e.dataTransfer.setData("type", "image");
  };

  const filterAssets = (list) => {
    if (!list) return [];
    return list.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
  };

  return (
    <Box sx={{ p: 1, height: "100%", display: "flex", flexDirection: "column" }}>
      <TextField
        variant="outlined" size="small" placeholder="Buscar assets..." fullWidth
        value={search} onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 1, bgcolor: "rgba(0,0,0,0.2)", borderRadius: 1, input: { color: "#fff" } }}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#aaa" }} /></InputAdornment> }}
      />

      <Box sx={{ overflowY: "auto", flexGrow: 1 }}>
        {Object.entries(publicAssets).map(([category, items]) => (
          <Accordion key={category} disableGutters sx={{ bgcolor: "transparent", color: "#fff", boxShadow: "none", '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#bf8f00" }} />} sx={{ minHeight: 40, '&.Mui-expanded': { minHeight: 40 } }}>
              <Typography sx={{ fontFamily: "Cinzel", textTransform: "capitalize" }}>{category}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 1 }}>
              <Grid container spacing={1}>
                {filterAssets(items).map((asset) => (
                  <Grid item xs={4} key={asset.id}>
                    <Paper
                      draggable
                      onDragStart={(e) => handleDragStart(e, asset.url)}
                      sx={{ 
                        width: "100%", paddingTop: "100%", position: "relative", 
                        bgcolor: "rgba(255,255,255,0.05)", cursor: "grab",
                        backgroundImage: `url(${asset.url})`, backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat",
                        "&:hover": { border: "1px solid #bf8f00" }
                      }}
                      title={asset.name}
                    />
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};

export default AssetLibrary;