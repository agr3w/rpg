import React, { useState } from "react";
import { 
  Paper, IconButton, Tooltip, Box, Popover, Typography, Stack, Slider, Button, Divider, ToggleButtonGroup, ToggleButton
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Ícones Material UI
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NearMeIcon from '@mui/icons-material/NearMe';
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
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GridOnIcon from '@mui/icons-material/GridOn';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import LayersClearIcon from '@mui/icons-material/LayersClear';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import TuneIcon from '@mui/icons-material/Tune';

import DiceRoller from "./DiceRoller";

const EditorToolbar = ({ 
  tool, setTool, 
  strokeColor, setStrokeColor, 
  strokeWidth, setStrokeWidth, 
  onUndo, onOpenSettings,
  snapMode = "center", setSnapMode,
  rulerVariant = "5e-standard", setRulerVariant,
  rulerUnit = "all", setRulerUnit,
  fogMode = "reveal-brush", setFogMode,
  fogBrushRadius = 60, setFogBrushRadius,
  onFogFillAll, onFogClearAll,
  onExportImage, onExportUniversalVTT
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [diceAnchorEl, setDiceAnchorEl] = useState(null);
  const [fogAnchorEl, setFogAnchorEl] = useState(null);
  const [rulerAnchorEl, setRulerAnchorEl] = useState(null);
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [snapAnchorEl, setSnapAnchorEl] = useState(null);

  const tools = [
    { id: "select", icon: <NearMeIcon sx={{ transform: "rotate(-90deg)" }} />, title: "Selecionar e Mover" },
    { id: "pan", icon: <PanToolIcon />, title: "Mover Tela (Pan)" },
    { id: "text", icon: <TextFieldsIcon />, title: "Texto" },
    { id: "brush", icon: <BrushIcon />, title: "Pincel Livre" },
    { id: "line", icon: <RemoveIcon />, title: "Linha Reta" },
    { id: "rect", icon: <CropSquareIcon />, title: "Retângulo" },
    { id: "circle", icon: <RadioButtonUncheckedIcon />, title: "Círculo" },
    { id: "ruler", icon: <StraightenIcon />, title: "Régua Tática 5e" },
    { id: "fog", icon: <VisibilityOffIcon />, title: "Névoa de Guerra (Fog of War)" },
  ];

  const isFogActive = tool === "fog";
  const isRulerActive = tool === "ruler";

  return (
    <Box sx={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}>
      <Paper 
        elevation={6} 
        sx={{ 
          p: 0.5, 
          display: "flex", 
          flexDirection: "column", 
          gap: 0.5, 
          bgcolor: "#181412",
          border: "1px solid rgba(212,175,55,0.25)", 
          borderRadius: 2,
          width: 48,
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
        }}
      >
        <Tooltip title="Voltar para Mapas" placement="right">
          <IconButton size="small" onClick={() => navigate("/mapas")} sx={{ color: "#aaa", mb: 0.5 }}>
            <ArrowBackIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        
        {tools.map((t) => (
          <Tooltip key={t.id} title={t.title} placement="right">
            <IconButton 
              size="small"
              onClick={() => {
                setTool(t.id);
                if (t.id === "fog") setFogAnchorEl(null);
              }} 
              sx={{ 
                color: tool === t.id ? "#fff" : "#888",
                bgcolor: tool === t.id ? "#bf8f00" : "transparent",
                borderRadius: 1.5,
                "&:hover": { bgcolor: tool === t.id ? "#a67c00" : "rgba(255,255,255,0.08)" }
              }}
            >
              {t.icon}
            </IconButton>
          </Tooltip>
        ))}

        <Box sx={{ height: 1, bgcolor: "rgba(212,175,55,0.15)", my: 0.5 }} />

        {/* Menu Rápido de Névoa */}
        {isFogActive && (
          <Tooltip title="Opções de Névoa" placement="right">
            <IconButton size="small" onClick={(e) => setFogAnchorEl(e.currentTarget)} sx={{ color: "#e5b324" }}>
              <TuneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        {/* Menu Rápido de Régua */}
        {isRulerActive && (
          <Tooltip title="Opções da Régua 5e" placement="right">
            <IconButton size="small" onClick={(e) => setRulerAnchorEl(e.currentTarget)} sx={{ color: "#e5b324" }}>
              <TuneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        {/* Snap to Grid */}
        <Tooltip title={`Snap ao Grid: ${snapMode === "center" ? "Centro" : snapMode === "vertex" ? "Vértice" : "Desativado"}`} placement="right">
          <IconButton 
            size="small" 
            onClick={(e) => setSnapAnchorEl(e.currentTarget)} 
            sx={{ color: snapMode !== "off" ? "#bf8f00" : "#666" }}
          >
            <GridOnIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        
        {/* Paleta de Cores e Traço */}
        <Tooltip title="Cor e Traço" placement="right">
          <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ color: strokeColor }}>
            <PaletteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        
        {/* Rolador de Dados */}
        <Tooltip title="Rolar Dados" placement="right">
          <IconButton size="small" onClick={(e) => setDiceAnchorEl(e.currentTarget)} sx={{ color: "#aaa" }}>
            <CasinoIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Desfazer */}
        <Tooltip title="Desfazer (Ctrl+Z)" placement="right">
          <IconButton size="small" onClick={onUndo} sx={{ color: "#aaa" }}>
            <UndoIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Exportar Mapa */}
        <Tooltip title="Exportar Mapa (VTT & Imagem)" placement="right">
          <IconButton size="small" onClick={(e) => setExportAnchorEl(e.currentTarget)} sx={{ color: "#aaa" }}>
            <FileDownloadIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        
        {/* Configurações */}
        <Tooltip title="Configurações do Grid" placement="right">
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
        <Box sx={{ p: 2, bgcolor: "#1e1814", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 1.5, color: "#fff" }}>
          <Typography variant="caption" sx={{ fontFamily: "Cinzel", fontWeight: 800, color: "#bf8f00" }}>Cor do Traço</Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2, mt: 1 }}>
            {["#000000", "#d32f2f", "#1976d2", "#388e3c", "#fbc02d", "#795548", "#ffffff"].map(color => (
              <Box 
                key={color} 
                onClick={() => { setStrokeColor(color); setAnchorEl(null); }} 
                sx={{ 
                  width: 24, height: 24, bgcolor: color, borderRadius: "50%", cursor: "pointer", 
                  border: strokeColor === color ? "2px solid #bf8f00" : "1px solid rgba(255,255,255,0.2)" 
                }} 
              />
            ))}
          </Stack>
          <Typography variant="caption" sx={{ fontFamily: "Cinzel", fontWeight: 800, color: "#bf8f00" }}>Espessura: {strokeWidth}px</Typography>
          <Slider 
            value={strokeWidth} min={1} max={30} 
            onChange={(e, v) => setStrokeWidth(v)} 
            sx={{ color: "#bf8f00", width: 160 }} 
          />
        </Box>
      </Popover>

      {/* Popover de Snap to Grid */}
      <Popover
        open={Boolean(snapAnchorEl)}
        anchorEl={snapAnchorEl}
        onClose={() => setSnapAnchorEl(null)}
        anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
      >
        <Box sx={{ p: 2, bgcolor: "#1e1814", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 1.5, color: "#fff", width: 220 }}>
          <Typography variant="subtitle2" sx={{ fontFamily: "Cinzel", fontWeight: 800, color: "#bf8f00", mb: 1 }}>
            Snap ao Grid
          </Typography>
          <ToggleButtonGroup
            orientation="vertical"
            value={snapMode}
            exclusive
            onChange={(e, val) => { if (val) setSnapMode?.(val); }}
            fullWidth
            size="small"
            sx={{
              "& .MuiToggleButton-root": {
                color: "#ccc",
                borderColor: "rgba(212,175,55,0.2)",
                fontFamily: "Cinzel",
                fontSize: "0.75rem",
                justifyContent: "flex-start",
                "&.Mui-selected": {
                  color: "#bf8f00",
                  bgcolor: "rgba(191,143,0,0.15)"
                }
              }
            }}
          >
            <ToggleButton value="center">Centro da Célula</ToggleButton>
            <ToggleButton value="vertex">Vértice / Interseção</ToggleButton>
            <ToggleButton value="off">Desativado (Livre)</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Popover>

      {/* Popover de Névoa de Guerra (Fog of War) */}
      <Popover
        open={Boolean(fogAnchorEl)}
        anchorEl={fogAnchorEl}
        onClose={() => setFogAnchorEl(null)}
        anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
      >
        <Box sx={{ p: 2, bgcolor: "#1e1814", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 1.5, color: "#fff", width: 240 }}>
          <Typography variant="subtitle2" sx={{ fontFamily: "Cinzel", fontWeight: 800, color: "#bf8f00", mb: 1 }}>
            Névoa de Guerra
          </Typography>
          <ToggleButtonGroup
            value={fogMode}
            exclusive
            onChange={(e, val) => { if (val) setFogMode?.(val); }}
            fullWidth
            size="small"
            sx={{
              mb: 2,
              "& .MuiToggleButton-root": {
                color: "#ccc",
                borderColor: "rgba(212,175,55,0.2)",
                fontFamily: "Cinzel",
                fontSize: "0.75rem",
                "&.Mui-selected": {
                  color: "#bf8f00",
                  bgcolor: "rgba(191,143,0,0.15)"
                }
              }
            }}
          >
            <ToggleButton value="reveal-brush">Revelar</ToggleButton>
            <ToggleButton value="hide-brush">Esconder</ToggleButton>
          </ToggleButtonGroup>

          <Typography variant="caption" sx={{ fontFamily: "Cinzel", fontWeight: 800, color: "#bf8f00" }}>
            Raio do Pincel: {fogBrushRadius}px
          </Typography>
          <Slider 
            value={fogBrushRadius} min={20} max={200} step={10}
            onChange={(e, v) => setFogBrushRadius?.(v)} 
            sx={{ color: "#bf8f00", mb: 2 }} 
          />

          <Divider sx={{ borderColor: "rgba(212,175,55,0.2)", mb: 1.5 }} />

          <Stack spacing={1}>
            <Button 
              size="small" 
              variant="outlined" 
              startIcon={<AutoFixHighIcon />}
              onClick={() => { onFogClearAll?.(); setFogAnchorEl(null); }}
              sx={{ borderColor: "rgba(212,175,55,0.3)", color: "#bf8f00", fontSize: "0.75rem" }}
            >
              Revelar Todo o Mapa
            </Button>
            <Button 
              size="small" 
              variant="outlined" 
              startIcon={<LayersClearIcon />}
              onClick={() => { onFogFillAll?.(); setFogAnchorEl(null); }}
              sx={{ borderColor: "rgba(212,175,55,0.3)", color: "#ccc", fontSize: "0.75rem" }}
            >
              Cobrir Todo o Mapa
            </Button>
          </Stack>
        </Box>
      </Popover>

      {/* Popover da Régua 5e */}
      <Popover
        open={Boolean(rulerAnchorEl)}
        anchorEl={rulerAnchorEl}
        onClose={() => setRulerAnchorEl(null)}
        anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
      >
        <Box sx={{ p: 2, bgcolor: "#1e1814", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 1.5, color: "#fff", width: 240 }}>
          <Typography variant="subtitle2" sx={{ fontFamily: "Cinzel", fontWeight: 800, color: "#bf8f00", mb: 1 }}>
            Regra de Medição 5e
          </Typography>
          <ToggleButtonGroup
            orientation="vertical"
            value={rulerVariant}
            exclusive
            onChange={(e, val) => { if (val) setRulerVariant?.(val); }}
            fullWidth
            size="small"
            sx={{
              mb: 2,
              "& .MuiToggleButton-root": {
                color: "#ccc",
                borderColor: "rgba(212,175,55,0.2)",
                fontFamily: "Cinzel",
                fontSize: "0.72rem",
                justifyContent: "flex-start",
                "&.Mui-selected": {
                  color: "#bf8f00",
                  bgcolor: "rgba(191,143,0,0.15)"
                }
              }
            }}
          >
            <ToggleButton value="5e-standard">D&D 5e Padrão (RAW 5ft)</ToggleButton>
            <ToggleButton value="5-10-5">D&D Alternativo (5-10-5)</ToggleButton>
            <ToggleButton value="euclidean">Distância Euclidiana</ToggleButton>
          </ToggleButtonGroup>

          <Typography variant="caption" sx={{ fontFamily: "Cinzel", fontWeight: 800, color: "#bf8f00", mb: 0.5, display: "block" }}>
            Unidade Exibida
          </Typography>
          <ToggleButtonGroup
            value={rulerUnit}
            exclusive
            onChange={(e, val) => { if (val) setRulerUnit?.(val); }}
            fullWidth
            size="small"
            sx={{
              "& .MuiToggleButton-root": {
                color: "#ccc",
                borderColor: "rgba(212,175,55,0.2)",
                fontFamily: "Cinzel",
                fontSize: "0.72rem",
                "&.Mui-selected": {
                  color: "#bf8f00",
                  bgcolor: "rgba(191,143,0,0.15)"
                }
              }
            }}
          >
            <ToggleButton value="all">Pés & Metros</ToggleButton>
            <ToggleButton value="ft">Pés (ft)</ToggleButton>
            <ToggleButton value="m">Metros (m)</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Popover>

      {/* Popover de Exportação (Universal VTT & Imagem HD) */}
      <Popover
        open={Boolean(exportAnchorEl)}
        anchorEl={exportAnchorEl}
        onClose={() => setExportAnchorEl(null)}
        anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
      >
        <Box sx={{ p: 2, bgcolor: "#1e1814", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 1.5, color: "#fff", width: 260 }}>
          <Typography variant="subtitle2" sx={{ fontFamily: "Cinzel", fontWeight: 800, color: "#bf8f00", mb: 1.5 }}>
            Exportar Mapa
          </Typography>
          <Stack spacing={1}>
            <Button 
              size="small" 
              variant="contained" 
              startIcon={<ImageOutlinedIcon />}
              onClick={() => { onExportImage?.("png"); setExportAnchorEl(null); }}
              sx={{ bgcolor: "#bf8f00", color: "#1e1814", fontWeight: 800, fontSize: "0.75rem", "&:hover": { bgcolor: "#a67c00" } }}
            >
              Exportar Imagem PNG (HD)
            </Button>
            <Button 
              size="small" 
              variant="outlined" 
              startIcon={<ImageOutlinedIcon />}
              onClick={() => { onExportImage?.("jpeg"); setExportAnchorEl(null); }}
              sx={{ borderColor: "rgba(212,175,55,0.3)", color: "#e5b324", fontSize: "0.75rem" }}
            >
              Exportar Imagem JPEG (HD)
            </Button>
            <Button 
              size="small" 
              variant="outlined" 
              startIcon={<FileDownloadIcon />}
              onClick={() => { onExportUniversalVTT?.(); setExportAnchorEl(null); }}
              sx={{ borderColor: "rgba(212,175,55,0.4)", color: "#fff", fontSize: "0.75rem" }}
            >
              Universal VTT (.dd2vtt)
            </Button>
          </Stack>
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