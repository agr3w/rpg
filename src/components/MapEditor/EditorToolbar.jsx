// src/components/MapEditor/EditorToolbar.jsx
import React, { useState } from "react";
import { 
  Popover, Typography, Stack, Slider, Button, Tooltip, Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Material-UI Icons (ZERO EMOJIS)
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NearMeIcon from "@mui/icons-material/NearMe";
import PanToolIcon from "@mui/icons-material/PanTool";
import StraightenIcon from "@mui/icons-material/Straighten";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import BrushIcon from "@mui/icons-material/Brush";
import RemoveIcon from "@mui/icons-material/Remove";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import PaletteIcon from "@mui/icons-material/Palette";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import BlurOnIcon from "@mui/icons-material/BlurOn";
import GridOnIcon from "@mui/icons-material/GridOn";
import SettingsIcon from "@mui/icons-material/Settings";
import LayersIcon from "@mui/icons-material/Layers";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CasinoIcon from "@mui/icons-material/Casino";
import ShareIcon from "@mui/icons-material/Share";
import UndoIcon from "@mui/icons-material/Undo";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import LayersClearIcon from "@mui/icons-material/LayersClear";
import TuneIcon from "@mui/icons-material/Tune";

import DiceRoller from "./DiceRoller";
import styles from "./EditorToolbar.module.css";

export default function EditorToolbar({
  tool,
  setTool,
  showGrid,
  setShowGrid,
  fogEnabled,
  setFogEnabled,
  fogMode = "reveal-brush",
  setFogMode,
  fogBrushRadius = 60,
  setFogBrushRadius,
  onFogFillAll,
  onFogClearAll,
  onToggleLayers,
  layersOpen,
  onToggleAssets,
  assetsOpen,
  onToggleDice,
  diceOpen,
  onOpenSettings,
  onOpenShareSession,
  onUndo,
  onExportImage,
  onExportUniversalVTT,
  strokeColor,
  setStrokeColor,
  strokeWidth,
  setStrokeWidth,
  snapMode = "center",
  setSnapMode,
  rulerVariant = "5e-standard",
  setRulerVariant,
  rulerUnit = "all",
  setRulerUnit,
  isGM = true
}) {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Popovers
  const [colorAnchorEl, setColorAnchorEl] = useState(null);
  const [fogAnchorEl, setFogAnchorEl] = useState(null);
  const [rulerAnchorEl, setRulerAnchorEl] = useState(null);
  const [snapAnchorEl, setSnapAnchorEl] = useState(null);
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [diceAnchorEl, setDiceAnchorEl] = useState(null);

  const colors = ["#e5b324", "#ffffff", "#000000", "#e74c3c", "#3498db", "#2ecc71", "#9b59b6", "#e67e22"];

  return (
    <aside className={`${styles.toolbarWrapper} ${isCollapsed ? styles.collapsed : ""}`}>
      {/* Botão Retrátil */}
      <button
        type="button"
        className={styles.toggleCollapseBtn}
        onClick={() => setIsCollapsed((prev) => !prev)}
        title={isCollapsed ? "Expandir Ferramentas" : "Recolher Ferramentas"}
      >
        {isCollapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
      </button>

      {!isCollapsed && (
        <div className={styles.toolbarContent}>
          {/* VOLTAR */}
          <div className={styles.toolGroup}>
            <div className={styles.buttonsRow}>
              <Tooltip title="Voltar para Mapas" placement="right">
                <button
                  type="button"
                  className={styles.toolBtn}
                  onClick={() => navigate("/mapas")}
                >
                  <ArrowBackIcon fontSize="small" />
                </button>
              </Tooltip>
            </div>
          </div>

          <div className={styles.divider} />

          {/* CATEGORIA 1: CONTROLE & NAVEGAÇÃO */}
          <div className={styles.toolGroup}>
            <span className={styles.groupLabel}>Controle</span>
            <div className={styles.buttonsRow}>
              <Tooltip title="Selecionar e Mover Tokens (V)" placement="right">
                <button
                  type="button"
                  className={`${styles.toolBtn} ${tool === "select" ? styles.active : ""}`}
                  onClick={() => setTool("select")}
                >
                  <NearMeIcon fontSize="small" sx={{ transform: "rotate(-90deg)" }} />
                </button>
              </Tooltip>

              <Tooltip title="Mover Tela / Pan (Espaço ou H)" placement="right">
                <button
                  type="button"
                  className={`${styles.toolBtn} ${tool === "pan" ? styles.active : ""}`}
                  onClick={() => setTool("pan")}
                >
                  <PanToolIcon fontSize="small" />
                </button>
              </Tooltip>

              <Tooltip title="Régua de Deslocamento Tático (R)" placement="right">
                <button
                  type="button"
                  className={`${styles.toolBtn} ${tool === "ruler" ? styles.active : ""}`}
                  onClick={(e) => {
                    setTool("ruler");
                    setRulerAnchorEl(e.currentTarget);
                  }}
                >
                  <StraightenIcon fontSize="small" />
                </button>
              </Tooltip>

              <Tooltip title="Sinalizar Ponto de Interesse (Ping)" placement="right">
                <button
                  type="button"
                  className={`${styles.toolBtn} ${tool === "ping" ? styles.active : ""}`}
                  onClick={() => setTool("ping")}
                >
                  <FmdGoodIcon fontSize="small" />
                </button>
              </Tooltip>
            </div>
          </div>

          <div className={styles.divider} />

          {/* CATEGORIA 2: DESENHO & CONSTRUÇÃO */}
          <div className={styles.toolGroup}>
            <span className={styles.groupLabel}>Desenho</span>
            <div className={styles.buttonsRow}>
              <Tooltip title="Pincel Livre (B)" placement="right">
                <button
                  type="button"
                  className={`${styles.toolBtn} ${tool === "brush" ? styles.active : ""}`}
                  onClick={() => setTool("brush")}
                >
                  <BrushIcon fontSize="small" />
                </button>
              </Tooltip>

              <Tooltip title="Linha / Parede (L)" placement="right">
                <button
                  type="button"
                  className={`${styles.toolBtn} ${tool === "line" ? styles.active : ""}`}
                  onClick={() => setTool("line")}
                >
                  <RemoveIcon fontSize="small" />
                </button>
              </Tooltip>

              <Tooltip title="Sala / Retângulo (R)" placement="right">
                <button
                  type="button"
                  className={`${styles.toolBtn} ${tool === "rect" ? styles.active : ""}`}
                  onClick={() => setTool("rect")}
                >
                  <CropSquareIcon fontSize="small" />
                </button>
              </Tooltip>

              <Tooltip title="Área / Círculo (C)" placement="right">
                <button
                  type="button"
                  className={`${styles.toolBtn} ${tool === "circle" ? styles.active : ""}`}
                  onClick={() => setTool("circle")}
                >
                  <RadioButtonUncheckedIcon fontSize="small" />
                </button>
              </Tooltip>

              <Tooltip title="Inserir Texto (T)" placement="right">
                <button
                  type="button"
                  className={`${styles.toolBtn} ${tool === "text" ? styles.active : ""}`}
                  onClick={() => setTool("text")}
                >
                  <TextFieldsIcon fontSize="small" />
                </button>
              </Tooltip>

              <Tooltip title="Cor e Espessura" placement="right">
                <button
                  type="button"
                  className={styles.toolBtn}
                  onClick={(e) => setColorAnchorEl(e.currentTarget)}
                >
                  <PaletteIcon fontSize="small" sx={{ color: strokeColor }} />
                </button>
              </Tooltip>
            </div>
          </div>

          <div className={styles.divider} />

          {/* CATEGORIA 3: NÉVOA DE GUERRA (GM ONLY) */}
          {isGM && (
            <>
              <div className={styles.toolGroup}>
                <span className={styles.groupLabel}>Névoa</span>
                <div className={styles.buttonsRow}>
                  <Tooltip title={fogEnabled ? "Névoa Ativa no Mapa" : "Névoa Desativada"} placement="right">
                    <button
                      type="button"
                      className={`${styles.toolBtn} ${fogEnabled ? styles.glowActive : ""}`}
                      onClick={() => setFogEnabled?.(!fogEnabled)}
                    >
                      <BlurOnIcon fontSize="small" />
                    </button>
                  </Tooltip>

                  <Tooltip title="Pincel: Revelar Área" placement="right">
                    <button
                      type="button"
                      disabled={!fogEnabled}
                      className={`${styles.toolBtn} ${tool === "fog" && (fogMode === "reveal" || fogMode === "reveal-brush") ? styles.active : ""}`}
                      onClick={(e) => {
                        setTool("fog");
                        setFogMode?.("reveal-brush");
                        setFogAnchorEl(e.currentTarget);
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </button>
                  </Tooltip>

                  <Tooltip title="Pincel: Ocultar Área" placement="right">
                    <button
                      type="button"
                      disabled={!fogEnabled}
                      className={`${styles.toolBtn} ${tool === "fog" && (fogMode === "hide" || fogMode === "hide-brush") ? styles.active : ""}`}
                      onClick={(e) => {
                        setTool("fog");
                        setFogMode?.("hide-brush");
                        setFogAnchorEl(e.currentTarget);
                      }}
                    >
                      <VisibilityOffIcon fontSize="small" />
                    </button>
                  </Tooltip>
                </div>
              </div>

              <div className={styles.divider} />
            </>
          )}

          {/* CATEGORIA 4: MUNDO & GRID */}
          <div className={styles.toolGroup}>
            <span className={styles.groupLabel}>Mundo</span>
            <div className={styles.buttonsRow}>
              <Tooltip title="Alternar Grid Tático" placement="right">
                <button
                  type="button"
                  className={`${styles.toolBtn} ${showGrid ? styles.active : ""}`}
                  onClick={() => setShowGrid?.(!showGrid)}
                >
                  <GridOnIcon fontSize="small" />
                </button>
              </Tooltip>

              <Tooltip title="Alinhamento ao Grid (Snap)" placement="right">
                <button
                  type="button"
                  className={styles.toolBtn}
                  onClick={(e) => setSnapAnchorEl(e.currentTarget)}
                >
                  <TuneIcon fontSize="small" />
                </button>
              </Tooltip>

              {isGM && (
                <Tooltip title="Ajustes do Mapa & Grid" placement="right">
                  <button
                    type="button"
                    className={styles.toolBtn}
                    onClick={onOpenSettings}
                  >
                    <SettingsIcon fontSize="small" />
                  </button>
                </Tooltip>
              )}
            </div>
          </div>

          <div className={styles.divider} />

          {/* CATEGORIA 5: PAINÉIS & AUXILIARES */}
          <div className={styles.toolGroup}>
            <span className={styles.groupLabel}>Painéis</span>
            <div className={styles.buttonsRow}>
              <Tooltip title="Gerenciar Camadas do Mapa" placement="right">
                <button
                  type="button"
                  className={`${styles.toolBtn} ${layersOpen ? styles.active : ""}`}
                  onClick={onToggleLayers}
                >
                  <LayersIcon fontSize="small" />
                </button>
              </Tooltip>

              <Tooltip title="Cofre de Assets & Biblioteca" placement="right">
                <button
                  type="button"
                  className={`${styles.toolBtn} ${assetsOpen ? styles.active : ""}`}
                  onClick={onToggleAssets}
                >
                  <Inventory2Icon fontSize="small" />
                </button>
              </Tooltip>

              <Tooltip title="Rolador de Dados 3D" placement="right">
                <button
                  type="button"
                  className={`${styles.toolBtn} ${diceOpen ? styles.active : ""}`}
                  onClick={(e) => {
                    onToggleDice?.();
                    setDiceAnchorEl(e.currentTarget);
                  }}
                >
                  <CasinoIcon fontSize="small" />
                </button>
              </Tooltip>

              {isGM && (
                <Tooltip title="Convidar / Compartilhar Mesa" placement="right">
                  <button
                    type="button"
                    className={`${styles.toolBtn} ${styles.shareBtn}`}
                    onClick={onOpenShareSession}
                  >
                    <ShareIcon fontSize="small" />
                  </button>
                </Tooltip>
              )}

              <Tooltip title="Desfazer Ação (Ctrl+Z)" placement="right">
                <button
                  type="button"
                  className={styles.toolBtn}
                  onClick={onUndo}
                >
                  <UndoIcon fontSize="small" />
                </button>
              </Tooltip>

              <Tooltip title="Exportar Imagem / VTT" placement="right">
                <button
                  type="button"
                  className={styles.toolBtn}
                  onClick={(e) => setExportAnchorEl(e.currentTarget)}
                >
                  <FileDownloadIcon fontSize="small" />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      )}

      {/* POPOVER DE COR & ESPESSURA */}
      <Popover
        open={Boolean(colorAnchorEl)}
        anchorEl={colorAnchorEl}
        onClose={() => setColorAnchorEl(null)}
        anchorOrigin={{ vertical: "center", horizontal: "right" }}
        transformOrigin={{ vertical: "center", horizontal: "left" }}
        PaperProps={{ sx: { bgcolor: "#181412", p: 2, border: "1px solid rgba(212,175,55,0.3)", borderRadius: 2 } }}
      >
        <Typography variant="caption" sx={{ color: "#ffd700", fontWeight: "bold", mb: 1, display: "block" }}>
          COR DO TRAÇO
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          {colors.map((c) => (
            <Box
              key={c}
              onClick={() => setStrokeColor?.(c)}
              sx={{
                width: 24,
                height: 24,
                bgcolor: c,
                borderRadius: "50%",
                cursor: "pointer",
                border: strokeColor === c ? "2px solid #ffd700" : "1px solid #555"
              }}
            />
          ))}
        </Stack>
        <Typography variant="caption" sx={{ color: "#ffd700", fontWeight: "bold", mb: 0.5, display: "block" }}>
          ESPESSURA: {strokeWidth}px
        </Typography>
        <Slider
          size="small"
          min={1}
          max={20}
          value={strokeWidth || 3}
          onChange={(_, v) => setStrokeWidth?.(v)}
          sx={{ color: "#bf8f00" }}
        />
      </Popover>

      {/* POPOVER DE NÉVOA DE GUERRA */}
      <Popover
        open={Boolean(fogAnchorEl)}
        anchorEl={fogAnchorEl}
        onClose={() => setFogAnchorEl(null)}
        anchorOrigin={{ vertical: "center", horizontal: "right" }}
        transformOrigin={{ vertical: "center", horizontal: "left" }}
        PaperProps={{ sx: { bgcolor: "#181412", p: 2, border: "1px solid rgba(212,175,55,0.3)", borderRadius: 2, width: 220 } }}
      >
        <Typography variant="caption" sx={{ color: "#ffd700", fontWeight: "bold", mb: 1, display: "block" }}>
          CONTROLES DA NÉVOA
        </Typography>
        <Typography variant="caption" sx={{ color: "#888", display: "block", mb: 0.5 }}>
          RAIO DO PINCEL: {fogBrushRadius}px
        </Typography>
        <Slider
          size="small"
          min={20}
          max={250}
          value={fogBrushRadius || 60}
          onChange={(_, v) => setFogBrushRadius?.(v)}
          sx={{ color: "#9b59b6", mb: 1.5 }}
        />
        <Stack spacing={1}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<AutoFixHighIcon />}
            onClick={() => onFogFillAll?.()}
            sx={{ borderColor: "rgba(212,175,55,0.4)", color: "#ffd700", fontSize: "0.72rem" }}
          >
            Cobrir Mapa Inteiro
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<LayersClearIcon />}
            onClick={() => onFogClearAll?.()}
            sx={{ borderColor: "rgba(231,76,60,0.4)", color: "#ff7675", fontSize: "0.72rem" }}
          >
            Revelar Mapa Inteiro
          </Button>
        </Stack>
      </Popover>

      {/* POPOVER DE RÉGUA TÁTICA */}
      <Popover
        open={Boolean(rulerAnchorEl)}
        anchorEl={rulerAnchorEl}
        onClose={() => setRulerAnchorEl(null)}
        anchorOrigin={{ vertical: "center", horizontal: "right" }}
        transformOrigin={{ vertical: "center", horizontal: "left" }}
        PaperProps={{ sx: { bgcolor: "#181412", p: 2, border: "1px solid rgba(212,175,55,0.3)", borderRadius: 2, width: 200 } }}
      >
        <Typography variant="caption" sx={{ color: "#ffd700", fontWeight: "bold", mb: 1, display: "block" }}>
          MÉTRICA DA RÉGUA (5E)
        </Typography>
        <Stack spacing={0.8}>
          <Button
            size="small"
            variant={rulerVariant === "5e-standard" ? "contained" : "outlined"}
            onClick={() => setRulerVariant?.("5e-standard")}
            sx={{ fontSize: "0.7rem", bgcolor: rulerVariant === "5e-standard" ? "#bf8f00" : "transparent" }}
          >
            Padrão 5e (Euclidiana)
          </Button>
          <Button
            size="small"
            variant={rulerVariant === "manhattan" ? "contained" : "outlined"}
            onClick={() => setRulerVariant?.("manhattan")}
            sx={{ fontSize: "0.7rem", bgcolor: rulerVariant === "manhattan" ? "#bf8f00" : "transparent" }}
          >
            Ortogonal (Manhattan)
          </Button>
        </Stack>
      </Popover>

      {/* POPOVER DE SNAPPING */}
      <Popover
        open={Boolean(snapAnchorEl)}
        anchorEl={snapAnchorEl}
        onClose={() => setSnapAnchorEl(null)}
        anchorOrigin={{ vertical: "center", horizontal: "right" }}
        transformOrigin={{ vertical: "center", horizontal: "left" }}
        PaperProps={{ sx: { bgcolor: "#181412", p: 2, border: "1px solid rgba(212,175,55,0.3)", borderRadius: 2 } }}
      >
        <Typography variant="caption" sx={{ color: "#ffd700", fontWeight: "bold", mb: 1, display: "block" }}>
          ALINHAMENTO (SNAP)
        </Typography>
        <Stack spacing={0.8}>
          <Button
            size="small"
            variant={snapMode === "center" ? "contained" : "outlined"}
            onClick={() => setSnapMode?.("center")}
            sx={{ fontSize: "0.7rem", bgcolor: snapMode === "center" ? "#bf8f00" : "transparent" }}
          >
            Centro da Célula
          </Button>
          <Button
            size="small"
            variant={snapMode === "corner" ? "contained" : "outlined"}
            onClick={() => setSnapMode?.("corner")}
            sx={{ fontSize: "0.7rem", bgcolor: snapMode === "corner" ? "#bf8f00" : "transparent" }}
          >
            Vértice / Canto
          </Button>
          <Button
            size="small"
            variant={snapMode === "none" ? "contained" : "outlined"}
            onClick={() => setSnapMode?.("none")}
            sx={{ fontSize: "0.7rem", bgcolor: snapMode === "none" ? "#bf8f00" : "transparent" }}
          >
            Livre (Sem Snap)
          </Button>
        </Stack>
      </Popover>

      {/* POPOVER DE EXPORTAÇÃO */}
      <Popover
        open={Boolean(exportAnchorEl)}
        anchorEl={exportAnchorEl}
        onClose={() => setExportAnchorEl(null)}
        anchorOrigin={{ vertical: "center", horizontal: "right" }}
        transformOrigin={{ vertical: "center", horizontal: "left" }}
        PaperProps={{ sx: { bgcolor: "#181412", p: 2, border: "1px solid rgba(212,175,55,0.3)", borderRadius: 2, width: 220 } }}
      >
        <Typography variant="caption" sx={{ color: "#ffd700", fontWeight: "bold", mb: 1, display: "block" }}>
          EXPORTAR TABULEIRO
        </Typography>
        <Stack spacing={1}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              onExportImage?.("png");
              setExportAnchorEl(null);
            }}
            sx={{ borderColor: "rgba(212,175,55,0.4)", color: "#ffd700", fontSize: "0.72rem" }}
          >
            Salvar Imagem PNG
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              onExportUniversalVTT?.();
              setExportAnchorEl(null);
            }}
            sx={{ borderColor: "rgba(212,175,55,0.4)", color: "#ffd700", fontSize: "0.72rem" }}
          >
            Universal VTT (.dd2vtt)
          </Button>
        </Stack>
      </Popover>

      {/* ROLADOR DE DADOS */}
      <Popover
        open={Boolean(diceAnchorEl)}
        anchorEl={diceAnchorEl}
        onClose={() => setDiceAnchorEl(null)}
        anchorOrigin={{ vertical: "center", horizontal: "right" }}
        transformOrigin={{ vertical: "center", horizontal: "left" }}
        PaperProps={{ sx: { bgcolor: "#181412", p: 1.5, border: "1px solid rgba(212,175,55,0.3)", borderRadius: 2 } }}
      >
        <DiceRoller />
      </Popover>
    </aside>
  );
}
