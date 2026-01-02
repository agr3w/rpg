import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Stage, Layer, Line, Rect, Circle, Image as KonvaImage } from "react-konva";
import { 
  Box, Paper, IconButton, Tooltip, Typography, CircularProgress, 
  Button, Slider, Popover, Stack, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, Grid 
} from "@mui/material";
import { useMapContext } from "APIs/MapContext";

// Ícones
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PanToolIcon from '@mui/icons-material/PanTool';
import BrushIcon from '@mui/icons-material/Brush';
import RemoveIcon from '@mui/icons-material/Remove';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import UndoIcon from '@mui/icons-material/Undo';
import PaletteIcon from '@mui/icons-material/Palette';
import SettingsIcon from '@mui/icons-material/Settings';
import ImageIcon from '@mui/icons-material/Image';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';

const MapEditor = () => {
  const { mapId } = useParams();
  const navigate = useNavigate();
  const { userMaps, saveMapState, updateMapSettings, loading } = useMapContext();
  const currentMap = userMaps.find(m => m.id === mapId);
  const stageRef = useRef(null);

  // --- ESTADOS ---
  const [tool, setTool] = useState("pan");
  const [elements, setElements] = useState([]);
  const [currentElement, setCurrentElement] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Zoom e Pan
  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

  // Imagem de Fundo
  const [bgImageObj, setBgImageObj] = useState(null);

  // Modal de Configurações
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tempConfig, setTempConfig] = useState({});
  const [newBgFile, setNewBgFile] = useState(null);

  useEffect(() => {
    if (currentMap) {
      if (currentMap.elements) setElements(currentMap.elements);
      
      // Carregar imagem
      if (currentMap.backgroundImage) {
        const img = new window.Image();
        img.src = currentMap.backgroundImage;
        img.onload = () => setBgImageObj(img);
      } else {
        setBgImageObj(null);
      }
    }
  }, [currentMap]);

  // --- CONFIGURAÇÕES DO MAPA ---
  const mapWidth = currentMap?.gridConfig?.width || 20;
  const mapHeight = currentMap?.gridConfig?.height || 15;
  const cellSize = currentMap?.gridConfig?.cellSize || 50;
  
  const getThemeColors = (theme) => {
    switch(theme) {
      case "stone": return { bg: "#2b2b2b", grid: "#424242" };
      case "grass": return { bg: "#2e7d32", grid: "#1b5e20" };
      case "water": return { bg: "#0288d1", grid: "#01579b" };
      case "void": return { bg: "#121212", grid: "#333" };
      default: return { bg: "#e3e3e3", grid: "#a5c9ea" };
    }
  };
  const themeColors = getThemeColors(currentMap?.theme);

  // --- LÓGICA DE ZOOM (WHEEL) ---
  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    let newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    
    // Limites de Zoom
    if (newScale < 0.1) newScale = 0.1;
    if (newScale > 5) newScale = 5;

    setStageScale(newScale);
    setStagePos({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  // --- LÓGICA DE COORDENADAS (CORRIGIDA PARA ZOOM) ---
  const getPointerPos = (stage) => {
    // Transforma a posição do mouse na tela para a posição no "mundo" do canvas (considerando zoom e pan)
    const transform = stage.getAbsoluteTransform().copy();
    transform.invert();
    const pos = transform.point(stage.getPointerPosition());

    // Snap to grid
    const x = Math.round(pos.x / (cellSize / 2)) * (cellSize / 2);
    const y = Math.round(pos.y / (cellSize / 2)) * (cellSize / 2);
    
    return { x, y, rawX: pos.x, rawY: pos.y };
  };

  // --- HANDLERS DE DESENHO ---
  const handleMouseDown = (e) => {
    if (tool === "pan") return; // Deixa o Konva lidar com o drag
    
    // Se clicar com botão do meio ou direito, não desenha
    if (e.evt.button !== 0) return;

    setIsDrawing(true);
    const { x, y, rawX, rawY } = getPointerPos(e.target.getStage());
    const startX = tool === "brush" ? rawX : x;
    const startY = tool === "brush" ? rawY : y;

    const newEl = {
      tool, points: [startX, startY], x: startX, y: startY, width: 0, height: 0, radius: 0,
      stroke: strokeColor, strokeWidth: strokeWidth
    };
    setCurrentElement(newEl);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || tool === "pan") return;
    const { x, y, rawX, rawY } = getPointerPos(e.target.getStage());
    const currX = tool === "brush" ? rawX : x;
    const currY = tool === "brush" ? rawY : y;

    if (tool === "brush") {
      const newPoints = currentElement.points.concat([currX, currY]);
      setCurrentElement({ ...currentElement, points: newPoints });
    } else if (tool === "line") {
      const newPoints = [currentElement.points[0], currentElement.points[1], currX, currY];
      setCurrentElement({ ...currentElement, points: newPoints });
    } else if (tool === "rect") {
      setCurrentElement({ ...currentElement, width: currX - currentElement.x, height: currY - currentElement.y });
    } else if (tool === "circle") {
      const dx = currX - currentElement.x;
      const dy = currY - currentElement.y;
      const radius = Math.sqrt(dx * dx + dy * dy);
      setCurrentElement({ ...currentElement, radius });
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && currentElement) {
      setIsDrawing(false);
      const newElements = [...elements, currentElement];
      setElements(newElements);
      setCurrentElement(null);
      saveMapState(mapId, newElements);
    }
  };

  const handleUndo = () => {
    const newElements = elements.slice(0, -1);
    setElements(newElements);
    saveMapState(mapId, newElements);
  };

  // --- SETTINGS HANDLERS ---
  const handleOpenSettings = () => {
    setTempConfig({
      name: currentMap.name,
      width: currentMap.gridConfig.width,
      height: currentMap.gridConfig.height,
      cellSize: currentMap.gridConfig.cellSize,
      theme: currentMap.theme
    });
    setNewBgFile(null);
    setSettingsOpen(true);
  };

  const handleSaveSettings = async () => {
    const configToUpdate = {
      name: tempConfig.name,
      gridConfig: {
        width: tempConfig.width,
        height: tempConfig.height,
        cellSize: tempConfig.cellSize
      },
      theme: tempConfig.theme
    };
    await updateMapSettings(mapId, configToUpdate, newBgFile);
    setSettingsOpen(false);
  };

  // --- RENDERIZAÇÃO ---
  const renderGrid = () => {
    const linesGrid = [];
    const widthPx = mapWidth * cellSize;
    const heightPx = mapHeight * cellSize;
    
    for (let i = 0; i <= mapWidth; i++) {
      linesGrid.push(<Line key={`v-${i}`} points={[i * cellSize, 0, i * cellSize, heightPx]} stroke={themeColors.grid} strokeWidth={1 / stageScale} opacity={0.6} />);
    }
    for (let j = 0; j <= mapHeight; j++) {
      linesGrid.push(<Line key={`h-${j}`} points={[0, j * cellSize, widthPx, j * cellSize]} stroke={themeColors.grid} strokeWidth={1 / stageScale} opacity={0.6} />);
    }
    return linesGrid;
  };

  const renderElement = (el, i) => {
    if (el.tool === "brush" || el.tool === "line") {
      return <Line key={i} points={el.points} stroke={el.stroke} strokeWidth={el.strokeWidth} tension={el.tool === "brush" ? 0.5 : 0} lineCap="round" lineJoin="round" />;
    } else if (el.tool === "rect") {
      return <Rect key={i} x={el.x} y={el.y} width={el.width} height={el.height} stroke={el.stroke} strokeWidth={el.strokeWidth} />;
    } else if (el.tool === "circle") {
      return <Circle key={i} x={el.x} y={el.y} radius={el.radius} stroke={el.stroke} strokeWidth={el.strokeWidth} />;
    }
    return null;
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}><CircularProgress /></Box>;
  if (!currentMap) return <Box sx={{ p: 5, color: "#fff" }}>Mapa não encontrado</Box>;

  return (
    <Box sx={{ width: "100vw", height: "100vh", overflow: "hidden", bgcolor: "#111" }}>
      
      {/* --- BARRA DE FERRAMENTAS --- */}
      <Paper elevation={6} sx={{ position: "absolute", top: 20, left: 20, zIndex: 10, p: 1.5, display: "flex", flexDirection: "column", gap: 1.5, bgcolor: "#2e1e14", border: "2px solid #833c0b", borderRadius: 2 }}>
        <Tooltip title="Voltar"><IconButton onClick={() => navigate("/mapas")} sx={{ color: "#fff" }}><ArrowBackIcon /></IconButton></Tooltip>
        <Box sx={{ height: 1, bgcolor: "rgba(255,255,255,0.2)" }} />
        <Tooltip title="Mover (Pan)"><IconButton onClick={() => setTool("pan")} sx={{ color: tool === "pan" ? "#bf8f00" : "#aaa" }}><PanToolIcon /></IconButton></Tooltip>
        <Tooltip title="Pincel Livre"><IconButton onClick={() => setTool("brush")} sx={{ color: tool === "brush" ? "#bf8f00" : "#aaa" }}><BrushIcon /></IconButton></Tooltip>
        <Tooltip title="Linha Reta"><IconButton onClick={() => setTool("line")} sx={{ color: tool === "line" ? "#bf8f00" : "#aaa" }}><RemoveIcon /></IconButton></Tooltip>
        <Tooltip title="Retângulo (Sala)"><IconButton onClick={() => setTool("rect")} sx={{ color: tool === "rect" ? "#bf8f00" : "#aaa" }}><CropSquareIcon /></IconButton></Tooltip>
        <Tooltip title="Círculo (Área)"><IconButton onClick={() => setTool("circle")} sx={{ color: tool === "circle" ? "#bf8f00" : "#aaa" }}><RadioButtonUncheckedIcon /></IconButton></Tooltip>
        <Box sx={{ height: 1, bgcolor: "rgba(255,255,255,0.2)" }} />
        <Tooltip title="Cor da Tinta"><IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ color: strokeColor }}><PaletteIcon /></IconButton></Tooltip>
        <Tooltip title="Desfazer"><IconButton onClick={handleUndo} sx={{ color: "#fff" }}><UndoIcon /></IconButton></Tooltip>
        <Box sx={{ height: 1, bgcolor: "rgba(255,255,255,0.2)" }} />
        <Tooltip title="Configurações do Mapa"><IconButton onClick={handleOpenSettings} sx={{ color: "#fff" }}><SettingsIcon /></IconButton></Tooltip>
      </Paper>

      {/* --- POPOVER DE CORES --- */}
      <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(null)} anchorOrigin={{ vertical: 'center', horizontal: 'right' }}>
        <Box sx={{ p: 2, bgcolor: "#fdfbf7", border: "1px solid #5d4037" }}>
          <Typography variant="caption" sx={{ fontFamily: "Cinzel", fontWeight: "bold" }}>Cor</Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2, mt: 1 }}>
            {["#000000", "#d32f2f", "#1976d2", "#388e3c", "#fbc02d", "#795548", "#ffffff"].map(color => (
              <Box key={color} onClick={() => { setStrokeColor(color); setAnchorEl(null); }} sx={{ width: 24, height: 24, bgcolor: color, borderRadius: "50%", cursor: "pointer", border: strokeColor === color ? "2px solid #000" : "1px solid #ccc" }} />
            ))}
          </Stack>
          <Typography variant="caption" sx={{ fontFamily: "Cinzel", fontWeight: "bold" }}>Espessura: {strokeWidth}px</Typography>
          <Slider value={strokeWidth} min={1} max={20} onChange={(e, v) => setStrokeWidth(v)} sx={{ color: "#833c0b", width: 150 }} />
        </Box>
      </Popover>

      {/* --- MODAL DE CONFIGURAÇÕES --- */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} PaperProps={{ sx: { bgcolor: "#fdfbf7", border: "4px solid #833c0b" } }}>
        <DialogTitle sx={{ fontFamily: "Cinzel", color: "#833c0b" }}>Configurações do Território</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1, minWidth: 300 }}>
            <TextField label="Nome" fullWidth value={tempConfig.name || ""} onChange={(e) => setTempConfig({...tempConfig, name: e.target.value})} />
            
            <Box>
              <Typography variant="caption">Tamanho do Grid (Células)</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}><TextField label="Largura" type="number" value={tempConfig.width || 20} onChange={(e) => setTempConfig({...tempConfig, width: Number(e.target.value)})} /></Grid>
                <Grid item xs={6}><TextField label="Altura" type="number" value={tempConfig.height || 15} onChange={(e) => setTempConfig({...tempConfig, height: Number(e.target.value)})} /></Grid>
              </Grid>
            </Box>

            <Box>
              <Typography variant="caption">Zoom Base (Tamanho da Célula)</Typography>
              <Slider value={tempConfig.cellSize || 50} min={30} max={100} onChange={(e, v) => setTempConfig({...tempConfig, cellSize: v})} sx={{ color: "#833c0b" }} />
            </Box>

            <Box>
              <Typography variant="caption">Imagem de Fundo</Typography>
              <Button variant="outlined" component="label" fullWidth startIcon={<ImageIcon />} sx={{ mt: 1, borderColor: "#833c0b", color: "#5d4037" }}>
                {newBgFile ? "Nova Imagem Selecionada" : "Trocar Imagem"}
                <input type="file" hidden accept="image/*" onChange={(e) => setNewBgFile(e.target.files[0])} />
              </Button>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Cancelar</Button>
          <Button onClick={handleSaveSettings} variant="contained" sx={{ bgcolor: "#833c0b" }}>Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* --- CANVAS --- */}
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onWheel={handleWheel}
        draggable={tool === "pan"}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stagePos.x}
        y={stagePos.y}
        onDragEnd={(e) => setStagePos({ x: e.target.x(), y: e.target.y() })} // Salva posição do pan
        style={{ cursor: tool === "pan" ? "grab" : "crosshair" }}
      >
        <Layer>
          {/* Fundo Infinito */}
          <Rect width={window.innerWidth * 10} height={window.innerHeight * 10} x={-window.innerWidth * 5} y={-window.innerHeight * 5} fill="#111" />
          
          {/* Fundo do Mapa (Cor Sólida) */}
          <Rect 
            x={0} y={0} 
            width={mapWidth * cellSize} 
            height={mapHeight * cellSize} 
            fill={themeColors.bg} 
            shadowBlur={20} shadowColor="black" shadowOpacity={0.5}
          />

          {/* Imagem de Fundo (Se houver) */}
          {bgImageObj && (
            <KonvaImage
              image={bgImageObj}
              x={0} y={0}
              width={mapWidth * cellSize}
              height={mapHeight * cellSize}
              opacity={1}
            />
          )}
          
          {/* Grid (Desenhado por cima da imagem) */}
          {renderGrid()}

          {/* Elementos */}
          {elements.map((el, i) => renderElement(el, i))}
          {currentElement && renderElement(currentElement, "preview")}
        </Layer>
      </Stage>
    </Box>
  );
};

export default MapEditor;