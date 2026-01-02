import React, { useState } from "react";
import { 
  Paper, IconButton, Tooltip, Box, Popover, Typography, Stack, Slider 
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Ícones
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NearMeIcon from '@mui/icons-material/NearMe'; // Ícone de Seleção (Ponteiro)
import PanToolIcon from '@mui/icons-material/PanTool';
import BrushIcon from '@mui/icons-material/Brush';
import RemoveIcon from '@mui/icons-material/Remove';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import UndoIcon from '@mui/icons-material/Undo';
import PaletteIcon from '@mui/icons-material/Palette';
import SettingsIcon from '@mui/icons-material/Settings';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import StraightenIcon from '@mui/icons-material/Straighten';
import CasinoIcon from '@mui/icons-material/Casino';

import DiceRoller from "./DiceRoller";

const EditorToolbar = ({ 
  tool, setTool, 
  strokeColor, setStrokeColor, 
  strokeWidth, setStrokeWidth, 
  onUndo, onOpenSettings 
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [diceAnchorEl, setDiceAnchorEl] = useState(null);

  const tools = [
    { id: "select", icon: <NearMeIcon sx={{ transform: "rotate(-90deg)" }} />, title: "Selecionar e Editar" }, // Novo
    { id: "pan", icon: <PanToolIcon />, title: "Mover Tela (Pan)" },
    { id: "text", icon: <TextFieldsIcon />, title: "Texto" },
    { id: "brush", icon: <BrushIcon />, title: "Pincel" },
    { id: "line", icon: <RemoveIcon />, title: "Linha" },
    { id: "rect", icon: <CropSquareIcon />, title: "Retângulo" },
    { id: "circle", icon: <RadioButtonUncheckedIcon />, title: "Círculo" },
    { id: "ruler", icon: <StraightenIcon />, title: "Régua" },
  ];

  return (
    <Box sx={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}>
      <Paper 
        elevation={6} 
        sx={{ 
          p: 0.5, 
          display: "flex", 
          flexDirection: "column", 
          gap: 0.5, 
          bgcolor: "#1a1a1a", // Fundo mais escuro estilo Photoshop
          border: "1px solid #333", 
          borderRadius: 1,
          width: 48 // Largura fixa compacta
        }}
      >
        <Tooltip title="Voltar" placement="right">
          <IconButton size="small" onClick={() => navigate("/mapas")} sx={{ color: "#aaa", mb: 1 }}>
            <ArrowBackIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        
        {tools.map((t) => (
          <Tooltip key={t.id} title={t.title} placement="right">
            <IconButton 
              size="small"
              onClick={() => setTool(t.id)} 
              sx={{ 
                color: tool === t.id ? "#fff" : "#666",
                bgcolor: tool === t.id ? "#bf8f00" : "transparent",
                borderRadius: 1,
                "&:hover": { bgcolor: tool === t.id ? "#a67c00" : "rgba(255,255,255,0.1)" }
              }}
            >
              {t.icon}
            </IconButton>
          </Tooltip>
        ))}

        <Box sx={{ height: 1, bgcolor: "#333", my: 0.5 }} />
        
        <Tooltip title="Cor" placement="right">
          <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ color: strokeColor }}>
            <PaletteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Dados" placement="right">
          <IconButton size="small" onClick={(e) => setDiceAnchorEl(e.currentTarget)} sx={{ color: "#aaa" }}>
            <CasinoIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Desfazer" placement="right">
          <IconButton size="small" onClick={onUndo} sx={{ color: "#aaa" }}>
            <UndoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Configurações" placement="right">
          <IconButton size="small" onClick={onOpenSettings} sx={{ color: "#aaa" }}>
            <SettingsIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Paper>

      {/* Popover de Cores */}
      <Popover 
        open={Boolean(anchorEl)} 
        anchorEl={anchorEl} 
        onClose={() => setAnchorEl(null)} 
        anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
      >
        <Box sx={{ p: 2, bgcolor: "#fdfbf7", border: "1px solid #5d4037" }}>
          <Typography variant="caption" sx={{ fontFamily: "Cinzel", fontWeight: "bold" }}>Cor</Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2, mt: 1 }}>
            {["#000000", "#d32f2f", "#1976d2", "#388e3c", "#fbc02d", "#795548", "#ffffff"].map(color => (
              <Box 
                key={color} 
                onClick={() => { setStrokeColor(color); setAnchorEl(null); }} 
                sx={{ 
                  width: 24, height: 24, bgcolor: color, borderRadius: "50%", cursor: "pointer", 
                  border: strokeColor === color ? "2px solid #000" : "1px solid #ccc" 
                }} 
              />
            ))}
          </Stack>
          <Typography variant="caption" sx={{ fontFamily: "Cinzel", fontWeight: "bold" }}>Espessura: {strokeWidth}px</Typography>
          <Slider 
            value={strokeWidth} min={1} max={20} 
            onChange={(e, v) => setStrokeWidth(v)} 
            sx={{ color: "#833c0b", width: 150 }} 
          />
        </Box>
      </Popover>

      {/* Popover de Dados */}
      <Popover
        open={Boolean(diceAnchorEl)}
        anchorEl={diceAnchorEl}
        onClose={() => setDiceAnchorEl(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <DiceRoller />
      </Popover>
    </Box>
  );
};

export default EditorToolbar;