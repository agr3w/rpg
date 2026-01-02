import React, { useState, useEffect } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Box, Typography, Grid, Slider, 
  FormControlLabel, Switch, Stack 
} from "@mui/material";
import ImageIcon from '@mui/icons-material/Image';

const MapSettingsDialog = ({ open, onClose, currentConfig, onSave }) => {
  const [tempConfig, setTempConfig] = useState({});
  const [newBgFile, setNewBgFile] = useState(null);

  // Atualiza o estado local quando o modal abre
  useEffect(() => {
    if (open && currentConfig) {
      setTempConfig({
        name: currentConfig.name,
        width: currentConfig.gridConfig?.width || 20,
        height: currentConfig.gridConfig?.height || 15,
        cellSize: currentConfig.gridConfig?.cellSize || 50,
        showGrid: currentConfig.gridConfig?.showGrid !== false,
        theme: currentConfig.theme || "paper"
      });
      setNewBgFile(null);
    }
  }, [open, currentConfig]);

  const handleSave = () => {
    onSave(tempConfig, newBgFile);
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { bgcolor: "#fdfbf7", border: "4px solid #833c0b" } }}>
      <DialogTitle sx={{ fontFamily: "Cinzel", color: "#833c0b" }}>Configurações do Território</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1, minWidth: 300 }}>
          <TextField 
            label="Nome" fullWidth 
            value={tempConfig.name || ""} 
            onChange={(e) => setTempConfig({...tempConfig, name: e.target.value})} 
          />
          
          <Box>
            <Typography variant="caption">Tamanho do Grid (Células)</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField 
                  label="Largura" type="number" 
                  value={tempConfig.width || 20} 
                  onChange={(e) => setTempConfig({...tempConfig, width: Number(e.target.value)})} 
                />
              </Grid>
              <Grid item xs={6}>
                <TextField 
                  label="Altura" type="number" 
                  value={tempConfig.height || 15} 
                  onChange={(e) => setTempConfig({...tempConfig, height: Number(e.target.value)})} 
                />
              </Grid>
            </Grid>
          </Box>

          <Box>
            <Typography variant="caption">Zoom Base (Tamanho da Célula)</Typography>
            <Slider 
              value={tempConfig.cellSize || 50} min={30} max={100} 
              onChange={(e, v) => setTempConfig({...tempConfig, cellSize: v})} 
              sx={{ color: "#833c0b" }} 
            />
          </Box>

          <FormControlLabel
            control={
              <Switch 
                checked={tempConfig.showGrid || false} 
                onChange={(e) => setTempConfig({...tempConfig, showGrid: e.target.checked})} 
                color="warning"
              />
            }
            label={<Typography sx={{ fontFamily: "Cinzel" }}>Mostrar Linhas do Grid</Typography>}
          />

          <Box>
            <Typography variant="caption">Imagem de Fundo</Typography>
            <Button 
              variant="outlined" component="label" fullWidth 
              startIcon={<ImageIcon />} 
              sx={{ mt: 1, borderColor: "#833c0b", color: "#5d4037" }}
            >
              {newBgFile ? "Nova Imagem Selecionada" : "Trocar Imagem"}
              <input type="file" hidden accept="image/*" onChange={(e) => setNewBgFile(e.target.files[0])} />
            </Button>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" sx={{ bgcolor: "#833c0b" }}>Salvar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MapSettingsDialog;