// MapasPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import mapas from "Array/MapasArray";
import MapaCard from "components/MapasPage/CardsMapas";
import { 
  Box, Container, Typography, Grid, Button, Divider, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, 
  Slider, Stack, Paper, IconButton, Tooltip
} from "@mui/material";
import { motion } from "framer-motion";
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import ExploreIcon from '@mui/icons-material/Explore';
import GridOnIcon from '@mui/icons-material/GridOn';
import LandscapeIcon from '@mui/icons-material/Landscape';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ImageIcon from '@mui/icons-material/Image';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SquareFootIcon from '@mui/icons-material/SquareFoot';

import { useMapContext } from "APIs/MapContext";

// Presets de Temas (Mantido)
const THEMES = [
  { id: "paper", name: "Pergaminho", color: "#e3e3e3" },
  { id: "stone", name: "Masmorra", color: "#2b2b2b" },
  { id: "grass", name: "Floresta", color: "#2e7d32" },
  { id: "water", name: "Oceano", color: "#0288d1" },
  { id: "void", name: "Vazio Astral", color: "#000000" },
];

const MapasPage = () => {
  const navigate = useNavigate();
  const { createNewMap, userMaps, deleteMap } = useMapContext();

  // Estados do Modal de Criação
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    width: 20,
    height: 15,
    cellSize: 50,
    theme: "paper"
  });
  const [bgFile, setBgFile] = useState(null);

  // Estados do Modal de Delete
  const [deleteId, setDeleteId] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setBgFile(null);
    setFormData({ name: "", width: 20, height: 15, cellSize: 50, theme: "paper" });
  };

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const mapId = await createNewMap(formData, bgFile);
      handleClose();
      navigate(`/mapas/editor/${mapId}`);
    } catch (error) {
      console.error("Erro ao criar mapa:", error);
      alert("O cartógrafo derrubou a tinta.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      await deleteMap(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#1a1008",
        backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("https://www.transparenttextures.com/patterns/wood-pattern.png")`,
        pb: 8, pt: 4, position: "relative", overflow: "hidden"
      }}
    >
      {/* Efeito de Vinheta (Bordas escurecidas) */}
      <Box
        sx={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "radial-gradient(circle, transparent 60%, #000 100%)",
          pointerEvents: "none",
          zIndex: 1
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
        
        {/* Cabeçalho */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
           <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <ExploreIcon sx={{ fontSize: 60, color: "#bf8f00", mb: 1, filter: "drop-shadow(0 0 10px rgba(191, 143, 0, 0.5))" }} />
            <Typography
              variant="h2"
              sx={{
                fontFamily: "Cinzel",
                fontWeight: "bold",
                color: "#e0cda8",
                textShadow: "2px 4px 6px rgba(0,0,0,0.8)",
                letterSpacing: 2
              }}
            >
              Sala do Cartógrafo
            </Typography>
            <Typography variant="subtitle1" sx={{ fontFamily: "Cinzel", color: "#8d6e63", mt: 1 }}>
              "O mundo é vasto, e cada canto esconde um perigo ou um tesouro."
            </Typography>
          </motion.div>
        </Box>

        {/* Botão Principal */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 6 }}>
          <Button
            variant="contained"
            startIcon={<AddLocationAltIcon />}
            onClick={handleOpen}
            sx={{
              bgcolor: "#bf8f00", color: "#2e1e14", fontFamily: "Cinzel", fontWeight: "bold",
              px: 4, py: 1.5, fontSize: "1.1rem", boxShadow: "0 0 15px rgba(191, 143, 0, 0.3)",
              "&:hover": { bgcolor: "#ffb300" }
            }}
          >
            Novo Grid de Batalha
          </Button>
        </Box>

        {/* Lista de Mapas do Usuário */}
        {userMaps.length > 0 && (
          <>
            <Divider sx={{ borderColor: "rgba(141, 110, 99, 0.3)", mb: 4 }}>
              <Typography variant="caption" sx={{ color: "#bf8f00", fontFamily: "Cinzel" }}>MEUS RASCUNHOS</Typography>
            </Divider>
            <Grid container spacing={4} sx={{ mb: 6 }}>
              {userMaps.map((mapa) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={mapa.id}>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Box sx={{ position: "relative", height: "100%" }}>
                      {/* Área clicável para navegar */}
                      <Box onClick={() => navigate(`/mapas/editor/${mapa.id}`)} sx={{ cursor: "pointer", height: "100%" }}>
                        <MapaCard
                          titulo={mapa.name}
                          imagem={mapa.backgroundImage || "https://www.transparenttextures.com/patterns/graphy.png"} // Mostra o BG se tiver
                          icone="Editor"
                          link="#"
                        />
                      </Box>
                      
                      {/* Botão de Deletar (Flutuante) */}
                      <Tooltip title="Queimar Mapa">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation(); // Evita entrar no mapa ao clicar no delete
                            setDeleteId(mapa.id);
                          }}
                          sx={{
                            position: "absolute",
                            top: -10, right: -10,
                            bgcolor: "#2e1e14", color: "#d32f2f",
                            border: "2px solid #5d4037",
                            "&:hover": { bgcolor: "#d32f2f", color: "#fff" }
                          }}
                        >
                          <DeleteForeverIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* ... (Mapas Estáticos) ... */}
        <Divider sx={{ borderColor: "rgba(141, 110, 99, 0.3)", mb: 6 }}>
          <Typography variant="caption" sx={{ color: "#8d6e63", fontFamily: "Cinzel" }}>ATLAS CONHECIDO</Typography>
        </Divider>
        <Grid container spacing={4}>
          {mapas.map((mapa, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <MapaCard titulo={mapa.titulo} imagem={mapa.imagem} link={mapa.link} icone={mapa.icone} />
            </Grid>
          ))}
        </Grid>

      </Container>

      {/* --- MODAL DE CRIAÇÃO --- */}
      <Dialog 
        open={open} 
        onClose={handleClose}
        PaperProps={{
          sx: {
            bgcolor: "#fdfbf7", backgroundImage: `url("https://www.transparenttextures.com/patterns/paper.png")`,
            border: "4px solid #833c0b", borderRadius: 2, minWidth: "400px", maxWidth: "600px"
          }
        }}
      >
        <DialogTitle sx={{ fontFamily: "Cinzel", fontWeight: "bold", color: "#833c0b", textAlign: "center", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
          Planejar Novo Território
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <TextField
              autoFocus label="Nome do Local" fullWidth variant="outlined"
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
              InputLabelProps={{ sx: { fontFamily: "Cinzel" } }}
            />

            {/* Upload de Imagem */}
            <Box>
              <Typography gutterBottom sx={{ fontFamily: "Cinzel", display: "flex", alignItems: "center", gap: 1 }}>
                <ImageIcon fontSize="small" /> Mapa de Fundo (Opcional)
              </Typography>
              <Button
                variant="outlined" component="label" fullWidth
                startIcon={bgFile ? <CheckCircleIcon color="success" /> : <ImageIcon />}
                sx={{ 
                  borderColor: bgFile ? "#2e7d32" : "#833c0b", color: bgFile ? "#2e7d32" : "#5d4037",
                  borderStyle: "dashed", fontFamily: "Cinzel", py: 2
                }}
              >
                {bgFile ? bgFile.name : "Carregar Imagem do PC"}
                <input type="file" hidden accept="image/*" onChange={(e) => setBgFile(e.target.files[0])} />
              </Button>
              <Typography variant="caption" color="text.secondary">
                Use isso para carregar mapas prontos e colocar o grid por cima.
              </Typography>
            </Box>

            {/* Configurações do Grid */}
            <Box>
              <Typography gutterBottom sx={{ fontFamily: "Cinzel", display: "flex", alignItems: "center", gap: 1 }}>
                <GridOnIcon fontSize="small" /> Dimensões do Grid
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <Typography variant="caption">Largura (Células): {formData.width}</Typography>
                  <Slider
                    value={formData.width} min={5} max={50}
                    onChange={(e, v) => setFormData({...formData, width: v})}
                    sx={{ color: "#833c0b" }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption">Altura (Células): {formData.height}</Typography>
                  <Slider
                    value={formData.height} min={5} max={50}
                    onChange={(e, v) => setFormData({...formData, height: v})}
                    sx={{ color: "#833c0b" }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <SquareFootIcon fontSize="inherit"/> Zoom/Tamanho: {formData.cellSize}px
                  </Typography>
                  <Slider
                    value={formData.cellSize} min={30} max={100} step={5}
                    onChange={(e, v) => setFormData({...formData, cellSize: v})}
                    sx={{ color: "#bf8f00" }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Temas */}
            <Box>
              <Typography gutterBottom sx={{ fontFamily: "Cinzel", display: "flex", alignItems: "center", gap: 1 }}>
                <LandscapeIcon fontSize="small" /> Bioma (Fundo)
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="center">
                {THEMES.map((theme) => (
                  <Paper
                    key={theme.id} elevation={formData.theme === theme.id ? 6 : 1}
                    onClick={() => setFormData({...formData, theme: theme.id})}
                    sx={{
                      width: 50, height: 50, bgcolor: theme.color, cursor: "pointer",
                      border: formData.theme === theme.id ? "3px solid #bf8f00" : "1px solid #ccc",
                      borderRadius: 1, transition: "transform 0.2s", "&:hover": { transform: "scale(1.1)" }
                    }}
                    title={theme.name}
                  />
                ))}
              </Stack>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: "1px solid rgba(0,0,0,0.1)" }}>
          <Button onClick={handleClose} sx={{ color: "#5d4037", fontFamily: "Cinzel" }}>Cancelar</Button>
          <Button 
            onClick={handleCreate} variant="contained" disabled={isCreating}
            sx={{ bgcolor: "#833c0b", color: "#fff", fontFamily: "Cinzel", fontWeight: "bold", "&:hover": { bgcolor: "#a04d14" } }}
          >
            {isCreating ? "Desenhando..." : "Criar Mapa"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- DIALOG DE DELETE --- */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogTitle sx={{ fontFamily: "Cinzel", color: "#d32f2f" }}>Queimar este Mapa?</DialogTitle>
        <DialogContent>
          <Typography>Esta ação não pode ser desfeita. O território será perdido para sempre.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Confirmar</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default MapasPage;
