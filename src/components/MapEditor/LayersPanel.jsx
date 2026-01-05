import React, { useState, useEffect } from "react";
import { 
  Paper, Box, Collapse, Typography, List, ListItem, 
  ListItemText, ListItemSecondaryAction, IconButton, Divider, Tabs, Tab 
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
  ChevronRight as ChevronRightIcon,
  DragIndicator as DragIndicatorIcon
} from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// Importando os componentes reais
import AssetLibrary from "./AssetLibrary"; 
import UserVault from "./UserVault";

const LayersPanel = ({ 
  elements, 
  selectedId, 
  onSelectElement, 
  onDeleteElement, 
  onToggleVisibility,
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
      case "brush": return <Brush fontSize="small" />;
      case "rect": return <CropSquare fontSize="small" />;
      case "circle": return <Circle fontSize="small" />;
      case "text": return <TextFields fontSize="small" />;
      case "image": return <ImageIcon fontSize="small" />;
      case "ruler": return <Straighten fontSize="small" />;
      case "line": return <ShowChart fontSize="small" />;
      default: return <TouchApp fontSize="small" />;
    }
  };

  const getElementName = (el, index) => {
    if (el.tool === "text") return `Texto: "${el.text ? el.text.substring(0, 10) : ''}..."`;
    if (el.tool === "image") return "Imagem/Token";
    const layerNum = el.originalIndex !== undefined ? el.originalIndex + 1 : index + 1;
    switch(el.tool) {
      case "brush": return `Pincel Livre #${layerNum}`;
      case "line": return `Parede/Linha #${layerNum}`;
      case "rect": return `Sala (Retângulo) #${layerNum}`;
      case "circle": return `Área (Círculo) #${layerNum}`;
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

  return (
    <Box sx={{ position: "absolute", top: 80, right: 20, zIndex: 10, display: "flex", alignItems: "flex-start", gap: 1, flexDirection: "row-reverse" }}>
      <Collapse in={isOpen} orientation="horizontal">
        <Paper 
          elevation={6} 
          sx={{ 
            width: 300, 
            height: "calc(100vh - 120px)", 
            display: "flex", 
            flexDirection: "column",
            bgcolor: "#1e2a38", 
            border: "1px solid #333", 
            borderRadius: 1,
            // REMOVIDO overflow: "hidden" daqui para evitar conflito, 
            // o overflow será controlado pelos filhos flexíveis
          }}
        >
          <Tabs 
            value={tabIndex} 
            onChange={handleTabChange} 
            variant="fullWidth" 
            sx={{ 
              minHeight: 40, borderBottom: "1px solid #333", bgcolor: "#263238", flexShrink: 0,
              '& .MuiTab-root': { color: "#90a4ae", minHeight: 40, fontSize: "0.75rem", fontFamily: "Cinzel" },
              '& .Mui-selected': { color: "#bf8f00" },
              '& .MuiTabs-indicator': { backgroundColor: "#bf8f00" }
            }}
          >
            <Tab icon={<LayersIcon fontSize="small" />} label="Camadas" />
            <Tab icon={<AutoStoriesIcon fontSize="small" />} label="Biblioteca" />
            <Tab icon={<LockIcon fontSize="small" />} label="Cofre" />
          </Tabs>

          {/* Container de Conteúdo Flexível */}
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
                         bgcolor: "#263238", 
                         boxShadow: "0 5px 15px rgba(0,0,0,0.5)",
                         borderLeft: "4px solid #bf8f00",
                         ...provided.draggableProps.style 
                      }}
                    >
                       <Box sx={{ mr: 1, display: "flex", alignItems: "center", color: "#cfd8dc" }}>
                          <DragIndicatorIcon fontSize="small" />
                        </Box>
                        <Box sx={{ mr: 1.5, display: "flex", alignItems: "center", color: "#90a4ae" }}>
                            {getIcon(visualList[rubric.source.index].tool)}
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
                        overflowY: "auto", // AQUI é o único lugar com scroll
                        flexGrow: 1, 
                        p: 0, 
                        '&::-webkit-scrollbar': { width: '0.4em' }, 
                        '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255,255,255,0.2)' } 
                      }}
                    >
                      {visualList.length === 0 ? (
                        <Typography variant="caption" sx={{ color: "#78909c", p: 2, display: "block", textAlign: "center" }}>Vazio.</Typography>
                      ) : (
                        visualList.map((el, index) => (
                          <Draggable key={el.id.toString()} draggableId={el.id.toString()} index={index}>
                            {(provided, snapshot) => (
                              <React.Fragment>
                                <ListItem 
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  onClick={() => onSelectElement(el.id)} 
                                  selected={selectedId === el.id}
                                  sx={{ 
                                    "&.Mui-selected": { bgcolor: "rgba(191, 143, 0, 0.2)" },
                                    "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
                                    borderLeft: `4px solid ${selectedId === el.id ? '#bf8f00' : (el.stroke || 'transparent')}`,
                                    opacity: el.isVisible === false ? 0.5 : 1,
                                    py: 0.5,
                                    bgcolor: snapshot.isDragging ? "#263238" : "transparent",
                                    // Importante: Preservar o estilo injetado pela lib para posicionamento
                                    ...provided.draggableProps.style
                                  }}
                                >
                                  <Box 
                                    {...provided.dragHandleProps}
                                    sx={{ mr: 1, display: "flex", alignItems: "center", color: "#546e7a", cursor: "grab", "&:hover": { color: "#cfd8dc" } }}
                                  >
                                    <DragIndicatorIcon fontSize="small" />
                                  </Box>

                                  <Box sx={{ mr: 1.5, display: "flex", alignItems: "center", color: "#90a4ae" }}>
                                      {getIcon(el.tool)}
                                  </Box>

                                  <ListItemText 
                                    primary={getElementName(el, index)} 
                                    primaryTypographyProps={{ sx: { color: "#cfd8dc", fontSize: "0.85rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }}
                                  />
                                  
                                  <ListItemSecondaryAction sx={{ display: "flex", alignItems: "center" }}>
                                    <IconButton edge="end" size="small" onClick={(e) => { e.stopPropagation(); onToggleVisibility(el.id); }}>
                                      {el.isVisible === false ? <VisibilityOff sx={{ color: "#78909c", fontSize: 18 }} /> : <Visibility sx={{ color: "#90a4ae", fontSize: 18 }} />}
                                    </IconButton>
                                    <IconButton edge="end" size="small" onClick={(e) => { e.stopPropagation(); onDeleteElement(el.id); }} sx={{ ml: 0.5 }}>
                                      <Delete sx={{ color: "#ef5350", fontSize: 18 }} />
                                    </IconButton>
                                  </ListItemSecondaryAction>
                                </ListItem>
                                {/* Esconde o divider se estiver arrastando para evitar glitch visual */}
                                {snapshot.isDragging ? null : <Divider sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />}
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
          p: 1, bgcolor: "#1e2a38", border: "1px solid #333", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          "&:hover": { bgcolor: "#263238" }
        }}
      >
        {isOpen ? <ChevronRightIcon sx={{ color: "#90a4ae" }} /> : <LayersIcon sx={{ color: "#90a4ae" }} />}
      </Paper>
    </Box>
  );
};

export default LayersPanel;