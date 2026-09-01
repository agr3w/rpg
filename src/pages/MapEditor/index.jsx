import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Stage, Layer, Line, Rect, Circle, Text, Image as KonvaImage, Group, Label, Tag, Transformer } from "react-konva";
import { Box, CircularProgress, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Snackbar, Alert } from "@mui/material";
import { useMapContext } from "APIs/MapContext";

import EditorToolbar from "components/MapEditor/EditorToolbar";
import LayersPanel from "components/MapEditor/LayersPanel";
import MapSettingsDialog from "components/MapEditor/MapSettingsDialog";

import { snapToGrid, pointToCell } from "Utils/gridUtils";
import { calculateDistance, formatDistance } from "Utils/rulerUtils";
import { createFogCanvas, revealFogCircle, hideFogCircle, fillFog, clearFog } from "Utils/fogUtils";
import { exportMapImage, exportUniversalVTT } from "Utils/vttExporter";

const MapEditor = () => {
  const { mapId } = useParams();
  const { userMaps, saveMapState, updateMapSettings, loading } = useMapContext();
  const currentMap = userMaps.find(m => m.id === mapId);
  const stageRef = useRef(null);
  const transformerRef = useRef(null);
  const fogLayerRef = useRef(null);

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

  // --- VTT, GRID & FOG ESTADOS ---
  const [snapMode, setSnapMode] = useState("center"); // "center" | "vertex" | "off"
  const [rulerVariant, setRulerVariant] = useState("5e-standard"); // "5e-standard" | "5-10-5" | "euclidean"
  const [rulerUnit, setRulerUnit] = useState("all"); // "all" | "ft" | "m"
  const [fogMode, setFogMode] = useState("reveal-brush"); // "reveal-brush" | "hide-brush"
  const [fogBrushRadius, setFogBrushRadius] = useState(60);
  const [fogCanvas, setFogCanvas] = useState(null);

  // Feedback visual para atalhos
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

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

  // --- HELPERS DE DIMENSÃO DO GRID ---
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

  // Inicialização e atualização da Névoa de Guerra
  useEffect(() => {
    if (mapWidth && mapHeight && cellSize) {
      const widthPx = mapWidth * cellSize;
      const heightPx = mapHeight * cellSize;
      const canvas = createFogCanvas(widthPx, heightPx);
      setFogCanvas(canvas);
    }
  }, [mapWidth, mapHeight, cellSize]);

  const paintFog = (rawX, rawY) => {
    if (!fogCanvas) return;
    const ctx = fogCanvas.getContext("2d");
    if (fogMode === "reveal-brush") {
      revealFogCircle(ctx, rawX, rawY, fogBrushRadius);
    } else {
      hideFogCircle(ctx, rawX, rawY, fogBrushRadius);
    }
    if (fogLayerRef.current) {
      fogLayerRef.current.batchDraw();
    }
  };

  const handleFogClearAll = () => {
    if (!fogCanvas) return;
    const ctx = fogCanvas.getContext("2d");
    clearFog(ctx, mapWidth * cellSize, mapHeight * cellSize);
    if (fogLayerRef.current) fogLayerRef.current.batchDraw();
    showMsg("Névoa revelada em todo o mapa");
  };

  const handleFogFillAll = () => {
    if (!fogCanvas) return;
    const ctx = fogCanvas.getContext("2d");
    fillFog(ctx, mapWidth * cellSize, mapHeight * cellSize);
    if (fogLayerRef.current) fogLayerRef.current.batchDraw();
    showMsg("Névoa cobriu todo o mapa");
  };

  const handleExportImage = (format = "png") => {
    if (!stageRef.current) return;
    exportMapImage(stageRef.current, currentMap?.name || "mapa", format, 2);
    showMsg(`Mapa exportado em ${format.toUpperCase()} (HD)`);
  };

  const handleExportUniversalVTT = () => {
    if (!stageRef.current) return;
    const backgroundBase64 = currentMap?.backgroundImage || stageRef.current.toDataURL({ pixelRatio: 1 });
    exportUniversalVTT(currentMap || {}, backgroundBase64);
    showMsg("Mapa exportado como Universal VTT (.dd2vtt)");
  };

  // --- ATALHOS DE TECLADO ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key.toLowerCase()) {
        case 'v': setTool("select"); showMsg("Ferramenta: Seleção"); break;
        case 'h': setTool("pan"); showMsg("Ferramenta: Mover Mapa (Pan)"); break;
        case 'b': setTool("brush"); showMsg("Ferramenta: Pincel"); break;
        case 'l': setTool("line"); showMsg("Ferramenta: Linha"); break;
        case 'r': setTool("rect"); showMsg("Ferramenta: Retângulo"); break;
        case 'c': setTool("circle"); showMsg("Ferramenta: Círculo"); break;
        case 't': setTool("text"); showMsg("Ferramenta: Texto"); break;
        case 'f': setTool("fog"); showMsg("Ferramenta: Névoa de Guerra"); break;
        case 'm': setTool("ruler"); showMsg("Ferramenta: Régua Tática 5e"); break;
        case 'z':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handleUndo();
            showMsg("Desfazer");
          }
          break;
        case 'delete':
        case 'backspace':
          if (selectedId) {
            handleDeleteElement(selectedId);
            showMsg("Elemento deletado");
          }
          break;
        default: break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, elements]);

  const showMsg = (msg) => {
    setSnackbarMsg(msg);
    setSnackbarOpen(true);
  };

  // --- LÓGICA DE SELEÇÃO E TRANSFORMER ---
  useEffect(() => {
    if (selectedId && transformerRef.current && stageRef.current) {
      const node = stageRef.current.findOne('#' + selectedId);
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer().batchDraw();
      } else {
        transformerRef.current.nodes([]);
      }
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
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
    }
  };

  // --- MANIPULAÇÃO DE CAMADAS ---
  const handleReorderElements = (newElementsOrder) => {
    setElements(newElementsOrder);
    saveMapState(mapId, newElementsOrder);
  };

  const handleTransformEnd = (e) => {
    const node = e.target;
    const id = node.id();
    const safeCellSize = cellSize || 50;

    let targetX = node.x();
    let targetY = node.y();

    if (snapMode !== "off") {
      const snapped = snapToGrid(targetX, targetY, safeCellSize, snapMode);
      targetX = snapped.x;
      targetY = snapped.y;
      node.position({ x: targetX, y: targetY });
    }

    const newElements = elements.map(el => {
      if (el.id.toString() === id) {
        return {
          ...el,
          x: targetX,
          y: targetY,
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
    saveMapState(mapId, newElements);
  };

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
    const safeCellSize = cellSize || 50;

    const snap = snapMode !== "off" && tool !== "text" && tool !== "brush" && tool !== "fog";
    if (snap) {
      const snapped = snapToGrid(pos.x, pos.y, safeCellSize, snapMode);
      return { x: snapped.x, y: snapped.y, rawX: pos.x, rawY: pos.y, col: snapped.col, row: snapped.row };
    }

    const cell = pointToCell(pos.x, pos.y, safeCellSize);
    return { x: pos.x, y: pos.y, rawX: pos.x, rawY: pos.y, col: cell.col, row: cell.row };
  };

  // --- HANDLERS DE DESENHO ---
  const handleMouseDown = (e) => {
    // Se clicar com botão do meio ou direito, ou ferramenta Pan
    if (tool === "pan" || e.evt.button !== 0) {
      return;
    }

    if (tool === "select") {
      checkDeselect(e);
      return;
    }

    const { x, y, rawX, rawY } = getPointerPos(e.target.getStage());

    if (tool === "fog") {
      setIsDrawing(true);
      paintFog(rawX, rawY);
      return;
    }

    if (tool === "text") {
      setTextPos({ x, y });
      setTextInput("");
      setTextDialogOpen(true);
      return;
    }

    setIsDrawing(true);
    const startX = tool === "brush" ? rawX : x;
    const startY = tool === "brush" ? rawY : y;

    let initialPoints = [];
    if (tool === "line" || tool === "ruler") {
      initialPoints = [0, 0, 0, 0];
    } else if (tool === "brush") {
      initialPoints = [0, 0];
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

    if (tool === "fog") {
      paintFog(rawX, rawY);
      return;
    }

    if (!currentElement) return;

    const relX = (tool === "brush" ? rawX : x) - currentElement.x;
    const relY = (tool === "brush" ? rawY : y) - currentElement.y;

    if (tool === "brush") {
      const newPoints = currentElement.points.concat([relX, relY]);
      setCurrentElement({ ...currentElement, points: newPoints });
    } else if (tool === "line" || tool === "ruler") {
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
    if (tool === "fog") {
      setIsDrawing(false);
      return;
    }

    if (isDrawing && currentElement) {
      setIsDrawing(false);
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

  const handleDrop = (e) => {
    e.preventDefault();
    stageRef.current.setPointersPositions(e);
    const { x, y } = getPointerPos(stageRef.current);
    const imageUrl = e.dataTransfer.getData("imageUrl");
    const type = e.dataTransfer.getData("type");

    if (type === "image" && imageUrl) {
      const img = new window.Image();
      img.src = imageUrl;
      img.onload = () => {
        const maxSize = cellSize * 2;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        const newEl = {
          tool: "image", imageObj: img, src: imageUrl, x: x, y: y,
          width: img.width * scale, height: img.height * scale,
          rotation: 0, id: Date.now(), isVisible: true, stroke: "transparent"
        };
        const newElements = [...elements, newEl];
        setElements(newElements);
        saveMapState(mapId, newElements);
        setTool("select");
        setSelectedId(newEl.id);
      };
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); };

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
      onMouseDown: (e) => {
        e.cancelBubble = true;
        handleSelect(el.id);
      },
      onTap: (e) => {
        e.cancelBubble = true;
        handleSelect(el.id);
      },
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
      if (!el.points || el.points.length < 4) return null;
      const x2 = el.points[2];
      const y2 = el.points[3];
      const safeCellSize = cellSize || 50;

      const startCell = pointToCell(el.x, el.y, safeCellSize);
      const endCell = pointToCell(el.x + x2, el.y + y2, safeCellSize);
      const distanceFeet = calculateDistance(startCell.col, startCell.row, endCell.col, endCell.row, 5, rulerVariant);
      const labelText = formatDistance(distanceFeet, rulerUnit);

      return (
        <Group {...commonProps}>
          <Line points={[0, 0, x2, y2]} stroke={el.stroke || "#e5b324"} strokeWidth={3} dash={[10, 5]} />
          <Label x={x2 / 2} y={y2 / 2}>
            <Tag fill="rgba(24,20,18,0.92)" cornerRadius={6} stroke="rgba(212,175,55,0.4)" strokeWidth={1} />
            <Text text={labelText} fill="#e5b324" padding={6} fontSize={13} fontFamily="Cinzel" fontStyle="bold" />
          </Label>
          <Circle x={0} y={0} radius={4} fill={el.stroke || "#e5b324"} />
          <Circle x={x2} y={y2} radius={4} fill={el.stroke || "#e5b324"} />
        </Group>
      );
    } else if (el.tool === "image") {
      if (!el.imageObj && el.src) {
        const img = new window.Image();
        img.src = el.src;
        img.onload = () => {
          el.imageObj = img;
          stageRef.current.batchDraw();
        }
      }
      return <KonvaImage {...commonProps} image={el.imageObj} width={el.width} height={el.height} />;
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
        snapMode={snapMode} setSnapMode={setSnapMode}
        rulerVariant={rulerVariant} setRulerVariant={setRulerVariant}
        rulerUnit={rulerUnit} setRulerUnit={setRulerUnit}
        fogMode={fogMode} setFogMode={setFogMode}
        fogBrushRadius={fogBrushRadius} setFogBrushRadius={setFogBrushRadius}
        onFogFillAll={handleFogFillAll} onFogClearAll={handleFogClearAll}
        onExportImage={handleExportImage} onExportUniversalVTT={handleExportUniversalVTT}
      />

      <LayersPanel
        elements={elements}
        selectedId={selectedId}
        onSelectElement={(id) => { setTool("select"); setSelectedId(id); }}
        onDeleteElement={handleDeleteElement}
        onToggleVisibility={handleToggleVisibility}
        onReorderElements={handleReorderElements} 
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

      <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="info" sx={{ width: '100%', bgcolor: '#333', color: '#fff' }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>

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
        onDragEnd={(e) => {
          if (e.target === stageRef.current) {
            setStagePos({ x: e.target.x(), y: e.target.y() });
          }
        }}
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

        {/* Camada de Névoa de Guerra (Fog of War) */}
        {fogCanvas && (
          <Layer ref={fogLayerRef} listening={false}>
            <KonvaImage
              image={fogCanvas}
              x={0}
              y={0}
              width={mapWidth * cellSize}
              height={mapHeight * cellSize}
              opacity={0.94}
              listening={false}
            />
          </Layer>
        )}
      </Stage>
    </Box>
  );
};

export default MapEditor;