// src/components/MapEditor/LayersPanel.jsx
import React, { useState } from "react";
import { Tooltip } from "@mui/material";

// Material-UI Icons (ZERO EMOJIS)
import LayersIcon from "@mui/icons-material/Layers";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import PersonIcon from "@mui/icons-material/Person";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import MapIcon from "@mui/icons-material/Map";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import SecurityIcon from "@mui/icons-material/Security";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BrushIcon from "@mui/icons-material/Brush";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import RemoveIcon from "@mui/icons-material/Remove";
import StraightenIcon from "@mui/icons-material/Straighten";

import AssetLibrary from "./AssetLibrary";
import UserVault from "./UserVault";
import styles from "./LayersPanel.module.css";

const LAYERS_ORDER = [
  { id: "roof", name: "Telhado / Efeitos", IconComponent: CloudQueueIcon },
  { id: "tokens", name: "Tokens de Criaturas", IconComponent: PersonIcon },
  { id: "props", name: "Objetos & Mobília", IconComponent: Inventory2Icon },
  { id: "map", name: "Mapa / Chão", IconComponent: MapIcon },
];

export default function LayersPanel({
  elements = [],
  setElements,
  selectedId,
  onSelectElement,
  onDeleteElement,
  onToggleVisibility,
  onToggleLock,
  onEditElement,
  onClose,
  isGM = true
}) {
  const [activeTab, setActiveTab] = useState("layers"); // "layers" | "assets" | "vault"
  const [collapsedLayers, setCollapsedLayers] = useState({});

  const toggleLayerFolder = (layerKey) => {
    setCollapsedLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const handleTogglePlayerVisibility = (id, currentHidden = false) => {
    if (setElements) {
      setElements((prev) =>
        prev.map((el) => (el.id === id ? { ...el, hiddenFromPlayers: !currentHidden } : el))
      );
    }
  };

  const getElementIcon = (el) => {
    switch (el.tool || el.type) {
      case "brush": return <BrushIcon sx={{ fontSize: 14, color: "#bf8f00" }} />;
      case "line": return <RemoveIcon sx={{ fontSize: 14, color: "#bf8f00" }} />;
      case "rect": return <CropSquareIcon sx={{ fontSize: 14, color: "#bf8f00" }} />;
      case "circle": return <RadioButtonUncheckedIcon sx={{ fontSize: 14, color: "#bf8f00" }} />;
      case "text": return <TextFieldsIcon sx={{ fontSize: 14, color: "#bf8f00" }} />;
      case "ruler": return <StraightenIcon sx={{ fontSize: 14, color: "#bf8f00" }} />;
      case "token": return <PersonIcon sx={{ fontSize: 14, color: "#bf8f00" }} />;
      default: return <Inventory2Icon sx={{ fontSize: 14, color: "#bf8f00" }} />;
    }
  };

  return (
    <aside className={styles.layersCard}>
      {/* HEADER DO PAINEL */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <LayersIcon sx={{ color: "#ffd700", fontSize: 18 }} />
          <h4>GERENCIADOR DO CENÁRIO</h4>
        </div>
        <button className={styles.closeBtn} onClick={onClose} title="Fechar Painel">
          <CloseIcon fontSize="small" />
        </button>
      </div>

      {/* ABAS */}
      <div className={styles.tabsHeader}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "layers" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("layers")}
        >
          <LayersIcon sx={{ fontSize: 15 }} />
          <span>Camadas</span>
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "assets" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("assets")}
        >
          <AutoStoriesIcon sx={{ fontSize: 15 }} />
          <span>Biblioteca</span>
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "vault" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("vault")}
        >
          <Inventory2Icon sx={{ fontSize: 15 }} />
          <span>Meu Cofre</span>
        </button>
      </div>

      {/* ABA: CAMADAS */}
      {activeTab === "layers" && (
        <div className={styles.layersContainer}>
          {LAYERS_ORDER.map((layer) => {
            const layerItems = elements.filter(
              (el) => (el.layer || (el.type === "token" ? "tokens" : (el.type === "prop" ? "props" : "map"))) === layer.id
            );
            const isCollapsed = !!collapsedLayers[layer.id];
            const IconComp = layer.IconComponent;

            return (
              <div key={layer.id} className={styles.layerGroup}>
                {/* Header do Grupo de Camadas */}
                <div
                  className={styles.layerGroupHeader}
                  onClick={() => toggleLayerFolder(layer.id)}
                >
                  <div className={styles.layerGroupTitle}>
                    {isCollapsed ? (
                      <ChevronRightIcon sx={{ fontSize: 14, color: "#8b949e" }} />
                    ) : (
                      <ExpandMoreIcon sx={{ fontSize: 14, color: "#8b949e" }} />
                    )}
                    <IconComp sx={{ fontSize: 16, color: "#ffd700" }} />
                    <strong>{layer.name}</strong>
                    <span className={styles.countBadge}>{layerItems.length}</span>
                  </div>
                </div>

                {/* Itens contidos na camada */}
                {!isCollapsed && (
                  <div className={styles.itemsList}>
                    {layerItems.length === 0 ? (
                      <div className={styles.emptyLayer}>Nenhum item nesta camada</div>
                    ) : (
                      layerItems.map((item) => {
                        const isSelected = selectedId === item.id;
                        const isHiddenGM = item.hiddenFromPlayers;
                        const isVisible = item.visible !== false && item.isVisible !== false;
                        const isLocked = !!item.locked;

                        return (
                          <div
                            key={item.id}
                            className={`${styles.itemRow} ${isSelected ? styles.selectedRow : ""} ${
                              isHiddenGM ? styles.stealthRow : ""
                            }`}
                            onClick={() => onSelectElement?.(item.id)}
                          >
                            <div className={styles.itemInfo}>
                              {item.src ? (
                                <img
                                  src={item.src}
                                  alt={item.name || "Elemento"}
                                  className={styles.itemThumb}
                                />
                              ) : (
                                <div className={styles.itemIconWrapper}>
                                  {getElementIcon(item)}
                                </div>
                              )}
                              <span className={styles.itemName} title={item.name || "Elemento"}>
                                {item.name || (item.type === "token" ? "Token" : (item.text ? `Texto: "${item.text.substring(0, 10)}"` : "Objeto"))}
                              </span>
                              {isHiddenGM && (
                                <span className={styles.stealthTag} title="Oculto para os Jogadores">
                                  Emboscada
                                </span>
                              )}
                            </div>

                            <div className={styles.itemActions}>
                              {/* Modo Emboscada / Ocultar para Players */}
                              {isGM && (
                                <Tooltip
                                  title={
                                    isHiddenGM
                                      ? "Invisível aos Players (Clique para Revelar)"
                                      : "Visível a Todos (Clique para Ocultar dos Players / Emboscada)"
                                  }
                                >
                                  <button
                                    type="button"
                                    className={`${styles.actionBtn} ${
                                      isHiddenGM ? styles.stealthActive : styles.actionInactive
                                    }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleTogglePlayerVisibility(item.id, isHiddenGM);
                                    }}
                                  >
                                    <SecurityIcon sx={{ fontSize: 14 }} />
                                  </button>
                                </Tooltip>
                              )}

                              {/* Visibilidade Geral */}
                              <Tooltip title={isVisible ? "Ocultar no Mapa" : "Exibir no Mapa"}>
                                <button
                                  type="button"
                                  className={`${styles.actionBtn} ${
                                    isVisible ? "" : styles.actionInactive
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleVisibility?.(item.id);
                                  }}
                                >
                                  {isVisible ? (
                                    <VisibilityIcon sx={{ fontSize: 14 }} />
                                  ) : (
                                    <VisibilityOffIcon sx={{ fontSize: 14 }} />
                                  )}
                                </button>
                              </Tooltip>

                              {/* Trava de Posição */}
                              <Tooltip title={isLocked ? "Destravar Posição" : "Travar Posição"}>
                                <button
                                  type="button"
                                  className={`${styles.actionBtn} ${
                                    isLocked ? styles.lockActive : styles.actionInactive
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleLock?.(item.id);
                                  }}
                                >
                                  {isLocked ? (
                                    <LockIcon sx={{ fontSize: 14 }} />
                                  ) : (
                                    <LockOpenIcon sx={{ fontSize: 14 }} />
                                  )}
                                </button>
                              </Tooltip>

                              {/* Configurar Elemento */}
                              {onEditElement && (
                                <Tooltip title="Configurar Ficha / Objeto">
                                  <button
                                    type="button"
                                    className={styles.actionBtn}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onEditElement(item);
                                    }}
                                  >
                                    <EditIcon sx={{ fontSize: 14 }} />
                                  </button>
                                </Tooltip>
                              )}

                              {/* Excluir Elemento */}
                              {onDeleteElement && (
                                <Tooltip title="Excluir do Cenário">
                                  <button
                                    type="button"
                                    className={styles.actionBtn}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDeleteElement(item.id);
                                    }}
                                  >
                                    <DeleteOutlineIcon sx={{ fontSize: 14, color: "#e74c3c" }} />
                                  </button>
                                </Tooltip>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ABA: BIBLIOTECA DE ASSETS */}
      {activeTab === "assets" && (
        <div style={{ flex: 1, overflowY: "auto" }}>
          <AssetLibrary onSelectAsset={(asset) => {
            // Callback handled inside AssetLibrary
          }} />
        </div>
      )}

      {/* ABA: MEU COFRE */}
      {activeTab === "vault" && (
        <div style={{ flex: 1, overflowY: "auto" }}>
          <UserVault onSelectAsset={(asset) => {
            // Callback handled inside UserVault
          }} />
        </div>
      )}
    </aside>
  );
}
