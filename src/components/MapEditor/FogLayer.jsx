// src/components/MapEditor/FogLayer.jsx
import React, { useRef, useEffect, useState } from "react";
import { 
  resetFog, 
  revealCircle, 
  hideCircle, 
  revealRect, 
  hideRect, 
  revealVisionCone 
} from "../../Utils/fogUtils";
import styles from "./FogLayer.module.css";

export default function FogLayer({
  width = 1200,
  height = 800,
  activeTool,       // "fog-brush-reveal", "fog-brush-hide", "fog-rect-reveal", etc.
  brushRadius = 40,
  isMaster = true,
  masterFogOpacity = 0.45,
  tokens = [],      // Tokens com visão ativa
  onSyncFogState    // Callback para enviar estado da névoa ao Firebase
}) {
  const fogCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [rectStart, setRectStart] = useState(null);

  // Inicializa o canvas de névoa preenchido
  useEffect(() => {
    const canvas = fogCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    resetFog(ctx, width, height);

    // Se houver tokens com visão ativa, projeta os cones
    tokens.forEach((t) => {
      if (t.hasVision) {
        revealVisionCone(
          ctx, 
          t.x, 
          t.y, 
          t.visionRadius || 180, 
          t.rotation || 0, 
          t.coneAngle || 360
        );
      }
    });
  }, [width, height, tokens]);

  const handleMouseDown = (e) => {
    if (!activeTool?.startsWith("fog-")) return;
    const rect = fogCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    const ctx = fogCanvasRef.current.getContext("2d");

    if (activeTool === "fog-brush-reveal") {
      revealCircle(ctx, x, y, brushRadius);
    } else if (activeTool === "fog-brush-hide") {
      hideCircle(ctx, x, y, brushRadius);
    } else if (activeTool.includes("rect")) {
      setRectStart({ x, y });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const rect = fogCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = fogCanvasRef.current.getContext("2d");

    if (activeTool === "fog-brush-reveal") {
      revealCircle(ctx, x, y, brushRadius);
    } else if (activeTool === "fog-brush-hide") {
      hideCircle(ctx, x, y, brushRadius);
    }
  };

  const handleMouseUp = (e) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const ctx = fogCanvasRef.current.getContext("2d");
    if (rectStart && activeTool.includes("rect")) {
      const rect = fogCanvasRef.current.getBoundingClientRect();
      const endX = e.clientX - rect.left;
      const endY = e.clientY - rect.top;

      const rw = Math.abs(endX - rectStart.x);
      const rh = Math.abs(endY - rectStart.y);
      const rx = Math.min(rectStart.x, endX);
      const ry = Math.min(rectStart.y, endY);

      if (activeTool === "fog-rect-reveal") {
        revealRect(ctx, rx, ry, rw, rh);
      } else {
        hideRect(ctx, rx, ry, rw, rh);
      }
      setRectStart(null);
    }

    // Salva snapshots compactados para sync Firebase
    if (onSyncFogState) {
      const dataUrl = fogCanvasRef.current.toDataURL("image/webp", 0.5);
      onSyncFogState(dataUrl);
    }
  };

  return (
    <canvas
      ref={fogCanvasRef}
      width={width}
      height={height}
      className={styles.fogCanvas}
      style={{
        opacity: isMaster ? masterFogOpacity : 1,
        pointerEvents: activeTool?.startsWith("fog-") ? "auto" : "none"
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
}
