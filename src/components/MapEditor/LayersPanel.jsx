import React, { useState } from "react";
import { 
  Paper, Box, Collapse, Typography, List, ListItem, 
  ListItemText, ListItemSecondaryAction, IconButton, Divider, Tabs, Tab 
} from "@mui/material";

// Ícones
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LayersIcon from '@mui/icons-material/Layers';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AutoStoriesIcon from '@mui/icons-material/AutoStories'; // Biblioteca
import LockIcon from '@mui/icons-material/Lock'; // Cofre

// Sub-componentes
import AssetLibrary from "./AssetLibrary";
import UserVault from "./UserVault";

const LayersPanel = ({ elements, selectedId, onSelectElement, onDeleteElement, onToggleVisibility }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const getElementName = (el) => {
    if (el.tool === "text") return `Texto: "${el.text.substring(0, 10)}..."`;
    if (el.tool === "image") return "Imagem/Token";
    switch(el.tool) {
      case "brush": return "Pincel Livre";
      case "line": return "Parede/Linha";
      case "rect": return "Sala (Retângulo)";
      case "circle": return "Área (Círculo)";
      case "ruler": return "Régua";
      default: return "Objeto";
    }
  };

  return (
    <Box sx={{ position: "absolute", top: 20, right: 20, zIndex: 10, display: "flex", alignItems: "flex-start", gap: 1, flexDirection: "row-reverse" }}>
      <Collapse in={isOpen} orientation="horizontal">
        <Paper 
          elevation={6} 
          sx={{ 
            width: 300, height: "80vh", display: "flex", flexDirection: "column",
            bgcolor: "#1e2a38", border: "1px solid #333", borderRadius: 1, overflow: "hidden"
          }}
        >
          {/* Abas */}
          <Tabs 
            value={tabIndex} 
            onChange={handleTabChange} 
            variant="fullWidth" 
            sx={{ 
              minHeight: 40, borderBottom: "1px solid #333", bgcolor: "#263238",
              '& .MuiTab-root': { color: "#90a4ae", minHeight: 40, fontSize: "0.75rem", fontFamily: "Cinzel" },
              '& .Mui-selected': { color: "#bf8f00" },
              '& .MuiTabs-indicator': { backgroundColor: "#bf8f00" }
            }}
          >
            <Tab icon={<LayersIcon fontSize="small" />} label="Camadas" />
            <Tab icon={<AutoStoriesIcon fontSize="small" />} label="Biblioteca" />
            <Tab icon={<LockIcon fontSize="small" />} label="Cofre" />
          </Tabs>

          {/* Conteúdo das Abas */}
          <Box sx={{ flexGrow: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            
            {/* ABA 0: CAMADAS (Lista existente) */}
            {tabIndex === 0 && (
              <List sx={{ overflowY: "auto", flexGrow: 1, p: 0, '&::-webkit-scrollbar': { width: '0.4em' }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255,255,255,0.2)' } }}>
                {elements.length === 0 ? (
                  <Typography variant="caption" sx={{ color: "#78909c", p: 2, display: "block", textAlign: "center" }}>Vazio.</Typography>
                ) : (
                  elements.map((el, index) => (
                    <React.Fragment key={el.id || index}>
                      <ListItem 
                        button onClick={() => onSelectElement(el.id)} selected={selectedId === el.id}
                        sx={{ 
                          "&.Mui-selected": { bgcolor: "rgba(191, 143, 0, 0.2)" },
                          "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
                          borderLeft: `4px solid ${el.stroke || 'transparent'}`,
                          opacity: el.isVisible === false ? 0.5 : 1
                        }}
                      >
                        <ListItemText 
                          primary={getElementName(el)} 
                          primaryTypographyProps={{ sx: { color: "#cfd8dc", fontSize: "0.85rem" } }}
                        />
                        <ListItemSecondaryAction sx={{ display: "flex" }}>
                          <IconButton edge="end" size="small" onClick={() => onToggleVisibility(el.id)}>
                            {el.isVisible === false ? <VisibilityOffIcon sx={{ color: "#78909c", fontSize: 16 }} /> : <VisibilityIcon sx={{ color: "#90a4ae", fontSize: 16 }} />}
                          </IconButton>
                          <IconButton edge="end" size="small" onClick={() => onDeleteElement(el.id)}>
                            <DeleteIcon sx={{ color: "#ef5350", fontSize: 16 }} />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
                    </React.Fragment>
                  )).reverse()
                )}
              </List>
            )}

            {/* ABA 1: BIBLIOTECA PÚBLICA */}
            {tabIndex === 1 && <AssetLibrary />}

            {/* ABA 2: COFRE PESSOAL */}
            {tabIndex === 2 && <UserVault />}

          </Box>
        </Paper>
      </Collapse>

      <Paper 
        onClick={() => setIsOpen(!isOpen)}
        sx={{ 
          p: 0.5, bgcolor: "#1e2a38", border: "1px solid #333", cursor: "pointer",
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