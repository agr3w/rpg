import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Stage, Layer, Line, Rect, Circle, Text, Image as KonvaImage, Group, Label, Tag, Transformer } from "react-konva";
import { Box, CircularProgress, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { useMapContext } from "APIs/MapContext";

import EditorToolbar from "components/MapEditor/EditorToolbar";
import LayersPanel from "components/MapEditor/LayersPanel";
import MapSettingsDialog from "components/MapEditor/MapSettingsDialog";

const MapEditor = () => {
  const { mapId } = useParams();
  const { userMaps, saveMapState, updateMapSettings, loading } = useMapContext();
  const currentMap = userMaps.find(m => m.id === mapId);
  const stageRef = useRef(null);
  const transformerRef = useRef(null);

  // --- ESTADOS ---
  const [tool, setTool] = useState("select");
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  
  const [currentElement, setCurrentElement] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(5);
  
  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [bgImageObj, setBgImageObj] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [textDialogOpen, setTextDialogOpen] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [textPos, setTextPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (currentMap) {
      if (currentMap.elements) setElements(currentMap.elements);
      if (currentMap.backgroundImage) {
        const img = new window.Image();
        img.src = currentMap.backgroundImage;
        img.onload = () => setBgImageObj(img);
      }
    }
  }, [currentMap]);

  // --- LÓGICA DE SELEÇÃO E TRANSFORMER ---
  useEffect(() => {
    if (selectedId && transformerRef.current && stageRef.current) {
      const node = stageRef.current.findOne('#' + selectedId);
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedId, elements]);

  const handleSelect = (id) => {
    if (tool === "select") {
      setSelectedId(id);
    }
  };

  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty && tool === "select") {
      setSelectedId(null);
      if (transformerRef.current) transformerRef.current.nodes([]);
    }
  };

  const handleTransformEnd = (e) => {
    const node = e.target;
    const id = node.id();
    
    const newElements = elements.map(el => {
      if (el.id.toString() === id) {
        return {
          ...el,
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          scaleX: node.scaleX(),
          scaleY: node.scaleY(),
        };
      }
      return el;
    });
    setElements(newElements);
    saveMapState(mapId, newElements);
  };

  const handleDragEnd = (e) => {
    handleTransformEnd(e);
  };

  const handleToggleVisibility = (id) => {
    const newElements = elements.map(el => {
      if (el.id === id) {
        return { ...el, isVisible: el.isVisible === false ? true : false };
      }
      return el;
    });
    setElements(newElements);
    saveMapState(mapId, newElements);
  };

  const handleDeleteElement = (id) => {
    const newElements = elements.filter(el => el.id !== id);
    setElements(newElements);
    setSelectedId(null);
    if (transformerRef.current) transformerRef.current.nodes([]);
    saveMapState(mapId, newElements);
  };

  // --- HELPERS ---
  const mapWidth = currentMap?.gridConfig?.width || 20;
  const mapHeight = currentMap?.gridConfig?.height || 15;
  const cellSize = currentMap?.gridConfig?.cellSize || 50;
  const showGrid = currentMap?.gridConfig?.showGrid !== false; 
  const themeColors = currentMap ? 
    (currentMap.theme === "stone" ? { bg: "#2b2b2b", grid: "#424242" } : 
     currentMap.theme === "grass" ? { bg: "#2e7d32", grid: "#1b5e20" } : 
     currentMap.theme === "water" ? { bg: "#0288d1", grid: "#01579b" } : 
     currentMap.theme === "void" ? { bg: "#121212", grid: "#333" } : 
     { bg: "#e3e3e3", grid: "#a5c9ea" }) : { bg: "#e3e3e3", grid: "#a5c9ea" };

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    const mousePointTo = { x: (pointer.x - stage.x()) / oldScale, y: (pointer.y - stage.y()) / oldScale };
    let newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    if (newScale < 0.1) newScale = 0.1; if (newScale > 5) newScale = 5;
    setStageScale(newScale);
    setStagePos({ x: pointer.x - mousePointTo.x * newScale, y: pointer.y - mousePointTo.y * newScale });
  };

  const getPointerPos = (stage) => {
    const transform = stage.getAbsoluteTransform().copy();
    transform.invert();
    const pos = transform.point(stage.getPointerPosition());
    const snap = tool !== "text" && tool !== "ruler" && tool !== "select" && tool !== "brush";
    
    // Proteção contra NaN se cellSize for inválido
    const safeCellSize = cellSize || 50;
    
    const x = snap ? Math.round(pos.x / (safeCellSize / 2)) * (safeCellSize / 2) : pos.x;
    const y = snap ? Math.round(pos.y / (safeCellSize / 2)) * (safeCellSize / 2) : pos.y;
    return { x, y, rawX: pos.x, rawY: pos.y };
  };

  // --- HANDLERS DE DESENHO (CORRIGIDOS) ---
  const handleMouseDown = (e) => {
    if (tool === "pan" || tool === "select" || e.evt.button !== 0) {
      checkDeselect(e);
      return;
    }

    const { x, y, rawX, rawY } = getPointerPos(e.target.getStage());

    if (tool === "text") {
      setTextPos({ x, y });
      setTextInput("");
      setTextDialogOpen(true);
      return;
    }

    setIsDrawing(true);
    const startX = tool === "brush" ? rawX : x;
    const startY = tool === "brush" ? rawY : y;

    // CORREÇÃO: Inicializar pontos corretamente para evitar NaN
    // Para Linha e Régua, usamos coordenadas relativas (0,0 é a origem)
    let initialPoints = [];
    if (tool === "line" || tool === "ruler") {
      initialPoints = [0, 0, 0, 0]; 
    } else if (tool === "brush") {
      initialPoints = [0, 0]; // Brush usa pontos relativos também agora
    }

    const newEl = {
      tool, 
      points: initialPoints, 
      x: startX, 
      y: startY, 
      width: 0, 
      height: 0, 
      radius: 0,
      stroke: strokeColor, 
      strokeWidth: strokeWidth,
      id: Date.now(),
      isVisible: true
    };
    setCurrentElement(newEl);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || tool === "pan" || tool === "select") return;
    const { x, y, rawX, rawY } = getPointerPos(e.target.getStage());
    
    // Coordenadas relativas ao ponto inicial (currentElement.x/y)
    const relX = (tool === "brush" ? rawX : x) - currentElement.x;
    const relY = (tool === "brush" ? rawY : y) - currentElement.y;

    if (tool === "brush") {
      const newPoints = currentElement.points.concat([relX, relY]);
      setCurrentElement({ ...currentElement, points: newPoints });
    } else if (tool === "line" || tool === "ruler") {
      // Atualiza apenas o ponto final [x1, y1, x2, y2]
      const newPoints = [0, 0, relX, relY];
      setCurrentElement({ ...currentElement, points: newPoints });
    } else if (tool === "rect") {
      setCurrentElement({ ...currentElement, width: relX, height: relY });
    } else if (tool === "circle") {
      const radius = Math.sqrt(relX * relX + relY * relY);
      setCurrentElement({ ...currentElement, radius });
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && currentElement) {
      setIsDrawing(false);
      // Evita salvar elementos minúsculos ou inválidos
      if (tool === "ruler" || tool === "line") {
         const dx = currentElement.points[2];
         const dy = currentElement.points[3];
         if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
             setCurrentElement(null);
             return;
         }
      }

      const newElements = [...elements, currentElement];
      setElements(newElements);
      setCurrentElement(null);
      saveMapState(mapId, newElements);
    }
  };

  const handleConfirmText = () => {
    if (textInput.trim()) {
      const newEl = {
        tool: "text", text: textInput, x: textPos.x, y: textPos.y, stroke: strokeColor,
        id: Date.now(), isVisible: true
      };
      const newElements = [...elements, newEl];
      setElements(newElements);
      saveMapState(mapId, newElements);
    }
    setTextDialogOpen(false);
  };

  const handleUndo = () => {
    const newElements = elements.slice(0, -1);
    setElements(newElements);
    saveMapState(mapId, newElements);
  };

  const handleSaveSettings = async (newConfig, newBgFile) => {
    const configToUpdate = {
      name: newConfig.name,
      gridConfig: { width: newConfig.width, height: newConfig.height, cellSize: newConfig.cellSize, showGrid: newConfig.showGrid },
      theme: newConfig.theme
    };
    await updateMapSettings(mapId, configToUpdate, newBgFile);
    setSettingsOpen(false);
  };

  // --- DRAG AND DROP DE ASSETS ---
  const handleDrop = (e) => {
    e.preventDefault();
    // Pega a posição do mouse relativa ao Stage
    stageRef.current.setPointersPositions(e);
    const { x, y } = getPointerPos(stageRef.current);

    const imageUrl = e.dataTransfer.getData("imageUrl");
    const type = e.dataTransfer.getData("type");

    if (type === "image" && imageUrl) {
      const img = new window.Image();
      img.src = imageUrl;
      img.onload = () => {
        // Calcula tamanho inicial (max 100px ou 2 células)
        const maxSize = cellSize * 2;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        
        const newEl = {
          tool: "image",
          imageObj: img, // Objeto de imagem para o Konva
          src: imageUrl, // URL para salvar no banco
          x: x,
          y: y,
          width: img.width * scale,
          height: img.height * scale,
          rotation: 0,
          id: Date.now(),
          isVisible: true,
          stroke: "transparent" // Apenas para compatibilidade com a lista
        };
        
        const newElements = [...elements, newEl];
        setElements(newElements);
        saveMapState(mapId, newElements);
        setTool("select"); // Muda para select para poder ajustar a imagem logo em seguida
        setSelectedId(newEl.id);
      };
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessário para permitir o drop
  };

  // --- RENDERIZAÇÃO ---
  const renderGrid = () => {
    if (!showGrid) return null;
    const linesGrid = [];
    const widthPx = mapWidth * cellSize;
    const heightPx = mapHeight * cellSize;
    for (let i = 0; i <= mapWidth; i++) linesGrid.push(<Line key={`v-${i}`} points={[i * cellSize, 0, i * cellSize, heightPx]} stroke={themeColors.grid} strokeWidth={1 / stageScale} opacity={0.6} listening={false} />);
    for (let j = 0; j <= mapHeight; j++) linesGrid.push(<Line key={`h-${j}`} points={[0, j * cellSize, widthPx, j * cellSize]} stroke={themeColors.grid} strokeWidth={1 / stageScale} opacity={0.6} listening={false} />);
    return linesGrid;
  };

  const renderElement = (el, i) => {
    if (el.isVisible === false) return null;

    const commonProps = {
      key: el.id || i,
      id: el.id ? el.id.toString() : i.toString(),
      stroke: el.stroke,
      strokeWidth: el.strokeWidth,
      draggable: tool === "select",
      onClick: () => handleSelect(el.id),
      onTap: () => handleSelect(el.id),
      onDragEnd: handleDragEnd,
      onTransformEnd: handleTransformEnd,
      x: el.x,
      y: el.y,
      rotation: el.rotation || 0,
      scaleX: el.scaleX || 1,
      scaleY: el.scaleY || 1,
    };

    if (el.tool === "brush" || el.tool === "line") {
      return <Line {...commonProps} points={el.points} tension={el.tool === "brush" ? 0.5 : 0} lineCap="round" lineJoin="round" />;
    } else if (el.tool === "rect") {
      return <Rect {...commonProps} width={el.width} height={el.height} />;
    } else if (el.tool === "circle") {
      return <Circle {...commonProps} radius={el.radius} />;
    } else if (el.tool === "text") {
      return <Text {...commonProps} text={el.text} fontSize={24} fill={el.stroke} fontFamily="Cinzel" />;
    } else if (el.tool === "ruler") {
      // CORREÇÃO: Verificação de segurança para evitar NaN
      if (!el.points || el.points.length < 4) return null;

      const x2 = el.points[2];
      const y2 = el.points[3];
      
      // Distância baseada nas coordenadas relativas
      const distancePx = Math.sqrt(x2 * x2 + y2 * y2);
      const cells = distancePx / (cellSize || 50);
      const meters = (cells * 1.5).toFixed(1);
      
      return (
        <Group {...commonProps}>
          <Line points={[0, 0, x2, y2]} stroke={el.stroke} strokeWidth={2} dash={[10, 5]} />
          <Label x={x2/2} y={y2/2}>
            <Tag fill="rgba(0,0,0,0.7)" cornerRadius={5} />
            <Text text={`${meters}m`} fill="white" padding={5} fontSize={14} />
          </Label>
          <Circle x={0} y={0} radius={3} fill={el.stroke} />
          <Circle x={x2} y={y2} radius={3} fill={el.stroke} />
        </Group>
      );
    } else if (el.tool === "image") {
      // Se a imagem não estiver carregada (ex: carregou do banco), carrega agora
      if (!el.imageObj && el.src) {
         const img = new window.Image();
         img.src = el.src;
         img.onload = () => {
             el.imageObj = img;
             // Força re-render (pode precisar de um state update melhor num cenário real, mas o Konva costuma lidar bem)
             stageRef.current.batchDraw(); 
         }
      }

      return (
        <KonvaImage
          {...commonProps}
          image={el.imageObj}
          width={el.width}
          height={el.height}
        />
      );
    }
    return null;
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}><CircularProgress /></Box>;
  if (!currentMap) return <Box sx={{ p: 5, color: "#fff" }}>Mapa não encontrado</Box>;

  return (
    <Box 
      sx={{ width: "100vw", height: "100vh", overflow: "hidden", bgcolor: "#111", position: "relative" }}
      onDrop={handleDrop} 
      onDragOver={handleDragOver}
    >
      
      <EditorToolbar 
        tool={tool} setTool={setTool}
        strokeColor={strokeColor} setStrokeColor={setStrokeColor}
        strokeWidth={strokeWidth} setStrokeWidth={setStrokeWidth}
        onUndo={handleUndo}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <LayersPanel 
        elements={elements} 
        selectedId={selectedId}
        onSelectElement={(id) => { setTool("select"); setSelectedId(id); }}
        onDeleteElement={handleDeleteElement}
        onToggleVisibility={handleToggleVisibility}
      />

      <MapSettingsDialog 
        open={settingsOpen} onClose={() => setSettingsOpen(false)} 
        currentConfig={currentMap} onSave={handleSaveSettings}
      />

      <Dialog open={textDialogOpen} onClose={() => setTextDialogOpen(false)}>
        <DialogTitle>Inserir Texto</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Texto" fullWidth variant="standard" value={textInput} onChange={(e) => setTextInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleConfirmText()} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTextDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleConfirmText}>Inserir</Button>
        </DialogActions>
      </Dialog>

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
        onDragEnd={(e) => setStagePos({ x: e.target.x(), y: e.target.y() })}
        style={{ cursor: tool === "pan" ? "grab" : tool === "select" ? "default" : "crosshair" }}
      >
        <Layer>
          <Rect width={window.innerWidth * 10} height={window.innerHeight * 10} x={-window.innerWidth * 5} y={-window.innerHeight * 5} fill="#111" listening={false} />
          <Rect x={0} y={0} width={mapWidth * cellSize} height={mapHeight * cellSize} fill={themeColors.bg} shadowBlur={20} shadowColor="black" shadowOpacity={0.5} onClick={checkDeselect} />
          {bgImageObj && <KonvaImage image={bgImageObj} x={0} y={0} width={mapWidth * cellSize} height={mapHeight * cellSize} opacity={1} listening={false} />}
          {renderGrid()}

          {elements.map((el, i) => renderElement(el, i))}
          {currentElement && renderElement(currentElement, "preview")}

          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 5 || newBox.height < 5) return oldBox;
              return newBox;
            }}
            anchorSize={8}
            anchorCornerRadius={4}
            borderStroke="#00a8ff"
            anchorStroke="#00a8ff"
            anchorFill="#fff"
          />
        </Layer>
      </Stage>
    </Box>
  );
};

export default MapEditor;