// src/views/PlayerSessionView.jsx
import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Stage, Layer, Line, Rect, Circle, Text, Image as KonvaImage, Group, Label, Tag } from "react-konva";
import { getDatabase, ref, onValue } from "firebase/database";
import { Box, IconButton, Tooltip, Typography, CircularProgress } from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import CenterFocusStrongIcon from "@mui/icons-material/CenterFocusStrong";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { auth } from "../APIs/firebaseConfig";
import { trackPlayerPresence } from "../APIs/sessionService";
import { pointToCell } from "../Utils/gridUtils";
import { calculateDistance, formatDistance } from "../Utils/rulerUtils";
import { rollDiceString } from "../Utils/DiceRoller";
import ActivePlayersList from "../components/MapEditor/ActivePlayersList";
import TokenMiniSheet from "../components/MapEditor/TokenMiniSheet";
import styles from "./PlayerSessionView.module.css";

// Cache de imagens carregadas para evitar flickering no canvas
const imageCache = new Map();

function useLoadedImage(url) {
  const [image, setImage] = useState(() => (url ? imageCache.get(url) : null));

  useEffect(() => {
    if (!url) {
      setImage(null);
      return;
    }
    if (imageCache.has(url)) {
      setImage(imageCache.get(url));
      return;
    }
    const img = new window.Image();
    img.src = url;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      imageCache.set(url, img);
      setImage(img);
    };
    img.onerror = () => {
      setImage(null);
    };
  }, [url]);

  return image;
}

export default function PlayerSessionView() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const stageRef = useRef(null);

  const [sessionMeta, setSessionMeta] = useState(null);
  const [mapState, setMapState] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeMiniSheet, setActiveMiniSheet] = useState(null);

  // Zoom & Pan do Jogador
  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

  // Validação de login
  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      }
    });
    return () => unsubAuth();
  }, [navigate]);

  // Carrega metadados da sessão
  useEffect(() => {
    if (!sessionId) return;
    const db = getDatabase();
    const metaRef = ref(db, `vtt_sessions/${sessionId}/meta`);

    const unsubMeta = onValue(metaRef, (snapshot) => {
      const meta = snapshot.val();
      if (!meta) {
        setErrorMsg("Sessão não encontrada.");
        return;
      }
      setSessionMeta(meta);
      if (meta.isPublic || !meta.password) {
        setAuthenticated(true);
      }
    });

    return () => unsubMeta();
  }, [sessionId]);

  // Presença do Jogador e escuta do estado do mapa
  useEffect(() => {
    if (!authenticated || !sessionId) return;

    const unsubPresence = trackPlayerPresence(
      sessionId,
      { name: auth.currentUser?.displayName || "Jogador", isDM: false },
      () => {
        alert("Você foi desconectado da sessão pelo Mestre.");
        navigate("/");
      }
    );

    const db = getDatabase();
    const stateRef = ref(db, `vtt_sessions/${sessionId}/state`);
    const unsubState = onValue(stateRef, (snapshot) => {
      const state = snapshot.val();
      if (state) {
        setMapState(state);
      }
    });

    return () => {
      unsubPresence();
      unsubState();
    };
  }, [authenticated, sessionId, navigate]);

  // Helpers de Dimensões e Cores do Tema
  const width = mapState?.width || 1200;
  const height = mapState?.height || 800;
  const gridConfig = mapState?.gridConfig || { width: 24, height: 16, cellSize: 50, showGrid: true };
  const cellSize = gridConfig.cellSize || 50;
  const mapWidth = gridConfig.width || Math.round(width / cellSize);
  const mapHeight = gridConfig.height || Math.round(height / cellSize);
  const showGrid = gridConfig.showGrid !== false;

  const themeColors = useMemo(() => {
    const theme = mapState?.theme || "void";
    if (theme === "stone") return { bg: "#2b2b2b", grid: "#424242" };
    if (theme === "grass") return { bg: "#2e7d32", grid: "#1b5e20" };
    if (theme === "water") return { bg: "#0288d1", grid: "#01579b" };
    if (theme === "void") return { bg: "#121212", grid: "#333333" };
    return { bg: "#1e1e1e", grid: "#3a3a3a" };
  }, [mapState?.theme]);

  // Imagens de fundo e névoa
  const bgImage = useLoadedImage(mapState?.bgUrl);
  const fogImage = useLoadedImage(mapState?.fogDataUrl);

  // Centralização inicial do mapa
  useEffect(() => {
    if (width && height) {
      setStagePos({
        x: Math.round((window.innerWidth - width) / 2),
        y: Math.round((window.innerHeight - height) / 2)
      });
    }
  }, [width, height]);

  // Manipulação de Zoom com roda do mouse
  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.08;
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const clampedScale = Math.max(0.2, Math.min(newScale, 4));

    setStageScale(clampedScale);
    setStagePos({
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale
    });
  };

  const handleZoomIn = () => {
    setStageScale((prev) => Math.min(4, prev * 1.2));
  };

  const handleZoomOut = () => {
    setStageScale((prev) => Math.max(0.2, prev / 1.2));
  };

  const handleCenterView = () => {
    setStageScale(1);
    setStagePos({
      x: Math.round((window.innerWidth - width) / 2),
      y: Math.round((window.innerHeight - height) / 2)
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (inputPassword === sessionMeta?.password) {
      setAuthenticated(true);
      setErrorMsg("");
    } else {
      setErrorMsg("Senha incorreta!");
    }
  };

  // Renderizador do Grid
  const renderGrid = () => {
    if (!showGrid) return null;
    const lines = [];
    const widthPx = mapWidth * cellSize;
    const heightPx = mapHeight * cellSize;

    for (let i = 0; i <= mapWidth; i++) {
      lines.push(
        <Line
          key={`v-${i}`}
          points={[i * cellSize, 0, i * cellSize, heightPx]}
          stroke={themeColors.grid}
          strokeWidth={1 / stageScale}
          opacity={0.6}
          listening={false}
        />
      );
    }
    for (let j = 0; j <= mapHeight; j++) {
      lines.push(
        <Line
          key={`h-${j}`}
          points={[0, j * cellSize, widthPx, j * cellSize]}
          stroke={themeColors.grid}
          strokeWidth={1 / stageScale}
          opacity={0.6}
          listening={false}
        />
      );
    }
    return lines;
  };

  // Renderizador de Elementos do Mestre
  const renderElement = (el, i) => {
    if (el.isVisible === false || el.hiddenFromPlayers) return null;

    const commonProps = {
      key: el.id || i,
      id: el.id ? el.id.toString() : i.toString(),
      stroke: el.stroke,
      strokeWidth: el.strokeWidth,
      x: el.x,
      y: el.y,
      rotation: el.rotation || 0,
      scaleX: el.scaleX || 1,
      scaleY: el.scaleY || 1,
      opacity: el.opacity ?? 1,
      onDblClick: () => {
        if (el.type === "token" || el.characterId) {
          setActiveMiniSheet(el);
        }
      },
      onDblTap: () => {
        if (el.type === "token" || el.characterId) {
          setActiveMiniSheet(el);
        }
      }
    };

    if (el.tool === "brush" || el.tool === "line") {
      return (
        <Line
          {...commonProps}
          points={el.points}
          tension={el.tool === "brush" ? 0.5 : 0}
          lineCap="round"
          lineJoin="round"
        />
      );
    } else if (el.tool === "rect") {
      return <Rect {...commonProps} width={el.width} height={el.height} />;
    } else if (el.tool === "circle") {
      return <Circle {...commonProps} radius={el.radius} />;
    } else if (el.tool === "text") {
      return (
        <Text
          {...commonProps}
          text={el.text || el.content}
          fontSize={el.fontSize || 24}
          fill={el.stroke || el.color || "#e5b324"}
          fontFamily="Cinzel"
        />
      );
    } else if (el.tool === "ruler") {
      if (!el.points || el.points.length < 4) return null;
      const x2 = el.points[2];
      const y2 = el.points[3];
      const startCell = pointToCell(el.x, el.y, cellSize);
      const endCell = pointToCell(el.x + x2, el.y + y2, cellSize);
      const dist = calculateDistance(startCell.col, startCell.row, endCell.col, endCell.row, 5, "5e-standard");
      const label = formatDistance(dist, "all");

      return (
        <Group {...commonProps}>
          <Line points={[0, 0, x2, y2]} stroke={el.stroke || "#e5b324"} strokeWidth={3} dash={[10, 5]} />
          <Label x={x2 / 2} y={y2 / 2}>
            <Tag fill="rgba(24,20,18,0.92)" cornerRadius={6} stroke="rgba(212,175,55,0.4)" strokeWidth={1} />
            <Text text={label} fill="#e5b324" padding={6} fontSize={13} fontFamily="Cinzel" fontStyle="bold" />
          </Label>
        </Group>
      );
    } else if (el.tool === "image" || el.type === "token" || el.type === "prop") {
      return <KonvaImageElement key={el.id || i} el={el} commonProps={commonProps} />;
    }
    return null;
  };

  if (!authenticated) {
    return (
      <div className={styles.passwordScreen}>
        <div className={styles.passwordCard}>
          <LockIcon sx={{ fontSize: 40, color: "#f1c40f", mx: "auto" }} />
          <h2>{sessionMeta?.name || "Mundo Protegido"}</h2>
          <p>Esta sessão requer uma senha informada pelo Mestre.</p>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              placeholder="Digite a senha da sala"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              required
            />
            {errorMsg && <span className={styles.error}>{errorMsg}</span>}
            <button type="submit">Entrar no Mapa</button>
          </form>
        </div>
      </div>
    );
  }

  const elementsList = mapState?.elements || [];

  return (
    <div className={styles.playerContainer}>
      {/* Widget de Jogadores Conectados no Topo Central */}
      <ActivePlayersList sessionId={sessionId} isMaster={false} />

      {/* Controles de Zoom e Centralização no Canto Inferior Esquerdo */}
      <div className={styles.zoomControls}>
        <Tooltip title="Aproximar Zoom (+)">
          <button className={styles.zoomBtn} onClick={handleZoomIn}>
            <ZoomInIcon fontSize="small" />
          </button>
        </Tooltip>
        <Tooltip title="Afastar Zoom (-)">
          <button className={styles.zoomBtn} onClick={handleZoomOut}>
            <ZoomOutIcon fontSize="small" />
          </button>
        </Tooltip>
        <Tooltip title="Centralizar Visualização">
          <button className={styles.zoomBtn} onClick={handleCenterView}>
            <CenterFocusStrongIcon fontSize="small" />
          </button>
        </Tooltip>
      </div>

      {/* Mini Ficha Lateral do Jogador */}
      {activeMiniSheet && (
        <TokenMiniSheet
          token={activeMiniSheet}
          sheetData={null}
          onRollDice={(formula, label) => {
            const res = rollDiceString(formula);
            alert(`${label}: Rolou [${res.rolls.join(", ")}] ${res.modifier >= 0 ? `+${res.modifier}` : res.modifier} = Total: ${res.total}`);
          }}
          onUpdateToken={() => {}}
          onClose={() => setActiveMiniSheet(null)}
        />
      )}

      {/* Stage Konva em Tela Cheia para o Jogador */}
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        draggable={true}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stagePos.x}
        y={stagePos.y}
        onWheel={handleWheel}
        onDragEnd={(e) => {
          if (e.target === stageRef.current) {
            setStagePos({ x: e.target.x(), y: e.target.y() });
          }
        }}
        style={{ cursor: "grab" }}
      >
        <Layer>
          {/* Fundo infinito e superfície do mapa */}
          <Rect
            width={window.innerWidth * 10}
            height={window.innerHeight * 10}
            x={-window.innerWidth * 5}
            y={-window.innerHeight * 5}
            fill="#05070c"
            listening={false}
          />
          <Rect
            x={0}
            y={0}
            width={mapWidth * cellSize}
            height={mapHeight * cellSize}
            fill={themeColors.bg}
            shadowBlur={25}
            shadowColor="black"
            shadowOpacity={0.7}
            listening={false}
          />

          {/* Imagem de Fundo se houver */}
          {bgImage && (
            <KonvaImage
              image={bgImage}
              x={0}
              y={0}
              width={mapWidth * cellSize}
              height={mapHeight * cellSize}
              opacity={1}
              listening={false}
            />
          )}

          {/* Grid de Batalha */}
          {renderGrid()}

          {/* Todos os Elementos, Desenhos, Paredes e Tokens do Mapa */}
          {elementsList.map((el, i) => renderElement(el, i))}
        </Layer>

        {/* Camada de Névoa de Guerra Sincronizada (100% Blackout) */}
        {mapState?.fogEnabled && fogImage && (
          <Layer listening={false}>
            <KonvaImage
              image={fogImage}
              x={0}
              y={0}
              width={mapWidth * cellSize}
              height={mapHeight * cellSize}
              opacity={1.0}
              listening={false}
            />
          </Layer>
        )}
      </Stage>
    </div>
  );
}

// Subcomponente auxiliar de imagem para Konva
function KonvaImageElement({ el, commonProps }) {
  const img = useLoadedImage(el.src);
  if (!img) return null;
  return (
    <KonvaImage
      {...commonProps}
      image={img}
      width={el.width || 50}
      height={el.height || 50}
    />
  );
}
