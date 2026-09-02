import React, { useState, useEffect } from "react";
import { 
  Paper, Box, Collapse, Typography, List, ListItem, 
  ListItemText, ListItemSecondaryAction, IconButton, Divider, Tabs, Tab, Tooltip
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Delete,
  Brush,
  CropSquare,
  Circle,
  TextFields,
  Image as ImageIcon,
  Straighten,
  ShowChart,
  TouchApp,
  Layers as LayersIcon,
  AutoStories as AutoStoriesIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  ChevronRight as ChevronRightIcon,
  DragIndicator as DragIndicatorIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Edit as EditIcon,
  Inventory2 as VaultIcon
} from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import AssetLibrary from "./AssetLibrary"; 
import UserVault from "./UserVault";

const LayersPanel = ({ 
  elements, 
  selectedId, 
  onSelectElement, 
  onDeleteElement, 
  onToggleVisibility,
  onToggleLock,
  onEditElement,
  onReorderElements
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [visualList, setVisualList] = useState([]);

  useEffect(() => {
    setVisualList([...elements].map((el, i) => ({ ...el, originalIndex: i })).reverse());
  }, [elements]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const getIcon = (tool) => {
    switch (tool) {
      case "brush": return <Brush fontSize="small" sx={{ color: "#bf8f00" }} />;
      case "rect": return <CropSquare fontSize="small" sx={{ color: "#bf8f00" }} />;
      case "circle": return <Circle fontSize="small" sx={{ color: "#bf8f00" }} />;
      case "text": return <TextFields fontSize="small" sx={{ color: "#bf8f00" }} />;
      case "image": return <ImageIcon fontSize="small" sx={{ color: "#bf8f00" }} />;
      case "ruler": return <Straighten fontSize="small" sx={{ color: "#bf8f00" }} />;
      case "line": return <ShowChart fontSize="small" sx={{ color: "#bf8f00" }} />;
      default: return <TouchApp fontSize="small" sx={{ color: "#bf8f00" }} />;
    }
  };

  const getElementName = (el, index) => {
    if (el.tool === "text" || el.type === "text") return `Texto: "${(el.text || el.content || '').substring(0, 12)}"`;
    if (el.tool === "image" || el.type === "token") return el.name || "Imagem / Token";
    const layerNum = el.originalIndex !== undefined ? el.originalIndex + 1 : index + 1;
    switch(el.tool || el.type) {
      case "brush": return `Pincel Livre #${layerNum}`;
      case "line": return `Linha / Parede #${layerNum}`;
      case "rect": return `Sala / Retângulo #${layerNum}`;
      case "circle": return `Área Circular #${layerNum}`;
      case "ruler": return `Régua #${layerNum}`;
      default: return `Objeto #${layerNum}`;
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    if (sourceIndex === destinationIndex) return;

    const newVisualList = Array.from(visualList);
    const [reorderedItem] = newVisualList.splice(sourceIndex, 1);
    newVisualList.splice(destinationIndex, 0, reorderedItem);

    setVisualList(newVisualList);

    const newElementsData = [...newVisualList].reverse().map(item => {
        const { originalIndex, ...cleanItem } = item;
        return cleanItem;
    });

    if (onReorderElements) {
        onReorderElements(newElementsData);
    }
  };

  const handleMoveStep = (indexInVisual, direction, e) => {
    e.stopPropagation();
    const newVisual = [...visualList];
    const targetIndex = direction === "up" ? indexInVisual - 1 : indexInVisual + 1;
    if (targetIndex < 0 || targetIndex >= newVisual.length) return;

    const temp = newVisual[indexInVisual];
    newVisual[indexInVisual] = newVisual[targetIndex];
    newVisual[targetIndex] = temp;

    setVisualList(newVisual);

    const newElementsData = [...newVisual].reverse().map(item => {
      const { originalIndex, ...cleanItem } = item;
      return cleanItem;
    });

    if (onReorderElements) {
      onReorderElements(newElementsData);
    }
  };

  return (
    <Box sx={{ position: "absolute", top: 24, right: 24, zIndex: 30, display: "flex", alignItems: "flex-start", gap: 1, flexDirection: "row-reverse" }}>
      <Collapse in={isOpen} orientation="horizontal">
        <Paper 
          elevation={6} 
          sx={{ 
            width: 320, 
            height: "calc(100vh - 120px)", 
            display: "flex", 
            flexDirection: "column",
            bgcolor: "#181412", 
            border: "1px solid rgba(212,175,55,0.3)", 
            borderRadius: 2,
            boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
            overflow: "hidden"
          }}
        >
          <Tabs 
            value={tabIndex} 
            onChange={handleTabChange} 
            variant="fullWidth" 
            sx={{ 
              minHeight: 44, 
              borderBottom: "1px solid rgba(212,175,55,0.2)", 
              bgcolor: "#1e1814", 
              flexShrink: 0,
              '& .MuiTab-root': { color: "#888", minHeight: 44, fontSize: "0.75rem", fontFamily: "Cinzel", fontWeight: 700 },
              '& .Mui-selected': { color: "#bf8f00" },
              '& .MuiTabs-indicator': { backgroundColor: "#bf8f00" }
            }}
          >
            <Tab icon={<LayersIcon fontSize="small" />} label={`Camadas (${elements.length})`} />
            <Tab icon={<AutoStoriesIcon fontSize="small" />} label="Biblioteca" />
            <Tab icon={<VaultIcon fontSize="small" />} label="Cofre" />
          </Tabs>

          <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
            
            {tabIndex === 0 && (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable 
                  droppableId="layers-list"
                  mode="virtual"
                  renderClone={(provided, snapshot, rubric) => (
                    <ListItem 
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{ 
                         bgcolor: "#241d18", 
                         boxShadow: "0 5px 15px rgba(0,0,0,0.5)",
                         borderLeft: "4px solid #bf8f00",
                         ...provided.draggableProps.style 
                      }}
                    >
                       <Box sx={{ mr: 1, display: "flex", alignItems: "center", color: "#bf8f00" }}>
                          <DragIndicatorIcon fontSize="small" />
                        </Box>
                        <Box sx={{ mr: 1.5, display: "flex", alignItems: "center" }}>
                            {getIcon(visualList[rubric.source.index]?.tool || visualList[rubric.source.index]?.type)}
                        </Box>
                        <ListItemText primary={getElementName(visualList[rubric.source.index], rubric.source.index)} />
                    </ListItem>
                  )}
                >
                  {(provided) => (
                    <List 
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      sx={{ 
                        overflowY: "auto",
                        flexGrow: 1, 
                        p: 0.5, 
                        '&::-webkit-scrollbar': { width: '6px' }, 
                        '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(212,175,55,0.3)', borderRadius: '3px' } 
                      }}
                    >
                      {visualList.length === 0 ? (
                        <Typography variant="caption" sx={{ color: "#777", p: 3, display: "block", textAlign: "center", fontFamily: "Cinzel" }}>
                          Nenhum elemento no mapa.
                        </Typography>
                      ) : (
                        visualList.map((el, index) => (
                          <Draggable key={el.id.toString()} draggableId={el.id.toString()} index={index}>
                            {(provided, snapshot) => (
                              <React.Fragment>
                                <ListItem 
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  onClick={() => onSelectElement(el.id)} 
                                  onDoubleClick={() => onEditElement?.(el)}
                                  selected={selectedId === el.id}
                                  sx={{ 
                                    "&.Mui-selected": { bgcolor: "rgba(191, 143, 0, 0.18)" },
                                    "&:hover": { bgcolor: "rgba(255,255,255,0.04)" },
                                    borderLeft: `4px solid ${selectedId === el.id ? '#bf8f00' : (el.stroke || 'transparent')}`,
                                    opacity: el.isVisible === false ? 0.45 : 1,
                                    py: 0.5,
                                    borderRadius: 1,
                                    my: 0.3,
                                    bgcolor: snapshot.isDragging ? "#241d18" : "transparent",
                                    ...provided.draggableProps.style
                                  }}
                                >
                                  <Box 
                                    {...provided.dragHandleProps}
                                    sx={{ mr: 0.5, display: "flex", alignItems: "center", color: "#666", cursor: "grab", "&:hover": { color: "#bf8f00" } }}
                                  >
                                    <DragIndicatorIcon fontSize="small" />
                                  </Box>

                                  <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                                      {getIcon(el.tool || el.type)}
                                  </Box>

                                  <ListItemText 
                                    primary={getElementName(el, index)} 
                                    primaryTypographyProps={{ 
                                      sx: { 
                                        color: selectedId === el.id ? "#fff" : "#ccc", 
                                        fontSize: "0.8rem", 
                                        whiteSpace: "nowrap", 
                                        overflow: "hidden", 
                                        textOverflow: "ellipsis",
                                        fontFamily: "Cinzel",
                                        fontWeight: selectedId === el.id ? 700 : 500
                                      } 
                                    }}
                                  />
                                  
                                  <ListItemSecondaryAction sx={{ display: "flex", alignItems: "center", gap: 0.2 }}>
                                    <Tooltip title={el.locked ? "Destravar" : "Travar Posição"}>
                                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); onToggleLock?.(el.id); }}>
                                        {el.locked ? <LockIcon sx={{ color: "#bf8f00", fontSize: 16 }} /> : <LockOpenIcon sx={{ color: "#555", fontSize: 16 }} />}
                                      </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Subir Camada">
                                      <IconButton size="small" onClick={(e) => handleMoveStep(index, "up", e)} disabled={index === 0}>
                                        <KeyboardArrowUpIcon sx={{ color: index === 0 ? "#333" : "#aaa", fontSize: 16 }} />
                                      </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Descer Camada">
                                      <IconButton size="small" onClick={(e) => handleMoveStep(index, "down", e)} disabled={index === visualList.length - 1}>
                                        <KeyboardArrowDownIcon sx={{ color: index === visualList.length - 1 ? "#333" : "#aaa", fontSize: 16 }} />
                                      </IconButton>
                                    </Tooltip>

                                    <Tooltip title={el.isVisible === false ? "Exibir" : "Ocultar"}>
                                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); onToggleVisibility(el.id); }}>
                                        {el.isVisible === false ? <VisibilityOff sx={{ color: "#666", fontSize: 16 }} /> : <Visibility sx={{ color: "#aaa", fontSize: 16 }} />}
                                      </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Editar">
                                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); onEditElement?.(el); }}>
                                        <EditIcon sx={{ color: "#bf8f00", fontSize: 16 }} />
                                      </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Deletar">
                                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDeleteElement(el.id); }}>
                                        <Delete sx={{ color: "#ef5350", fontSize: 16 }} />
                                      </IconButton>
                                    </Tooltip>
                                  </ListItemSecondaryAction>
                                </ListItem>
                              </React.Fragment>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </List>
                  )}
                </Droppable>
              </DragDropContext>
            )}

            {tabIndex === 1 && <AssetLibrary />}
            {tabIndex === 2 && <UserVault />}

          </Box>
        </Paper>
      </Collapse>

      <Paper 
        onClick={() => setIsOpen(!isOpen)}
        sx={{ 
          p: 1, 
          bgcolor: "#181412", 
          border: "1px solid rgba(212,175,55,0.3)", 
          cursor: "pointer",
          borderRadius: 1.5,
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
          "&:hover": { bgcolor: "#241d18" }
        }}
      >
        {isOpen ? <ChevronRightIcon sx={{ color: "#bf8f00" }} /> : <LayersIcon sx={{ color: "#bf8f00" }} />}
      </Paper>
    </Box>
  );
};

export default LayersPanel;