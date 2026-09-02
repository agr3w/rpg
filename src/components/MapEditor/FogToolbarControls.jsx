// src/components/MapEditor/FogToolbarControls.jsx
import React from "react";
import styles from "./FogToolbarControls.module.css";

export default function FogToolbarControls({ 
  activeTool, 
  setActiveTool, 
  brushRadius, 
  setBrushRadius,
  onResetFog,
  onClearFog
}) {
  return (
    <div className={styles.fogControlsPopover}>
      <div className={styles.sectionHeader}>NÉVOA DE GUERRA</div>

      <div className={styles.buttonGroup}>
        <button
          className={`${styles.fogBtn} ${activeTool === "fog-brush-reveal" ? styles.active : ""}`}
          onClick={() => setActiveTool("fog-brush-reveal")}
          title="Pincel: Revelar"
        >
          🖌️ Revelar
        </button>

        <button
          className={`${styles.fogBtn} ${activeTool === "fog-brush-hide" ? styles.active : ""}`}
          onClick={() => setActiveTool("fog-brush-hide")}
          title="Pincel: Ocultar"
        >
          🌑 Cobrir
        </button>

        <button
          className={`${styles.fogBtn} ${activeTool === "fog-rect-reveal" ? styles.active : ""}`}
          onClick={() => setActiveTool("fog-rect-reveal")}
          title="Caixa: Revelar Sala"
        >
          ▭ Sala Livre
        </button>

        <button
          className={`${styles.fogBtn} ${activeTool === "fog-rect-hide" ? styles.active : ""}`}
          onClick={() => setActiveTool("fog-rect-hide")}
          title="Caixa: Ocultar Sala"
        >
          ⬛ Sala Oculta
        </button>
      </div>

      <div className={styles.sliderControl}>
        <label>Raio do Pincel: {brushRadius}px</label>
        <input
          type="range"
          min="15"
          max="150"
          value={brushRadius}
          onChange={(e) => setBrushRadius(Number(e.target.value))}
        />
      </div>

      <div className={styles.globalActions}>
        <button onClick={onResetFog} className={styles.dangerBtn}>Cubra o Mapa Todo</button>
        <button onClick={onClearFog} className={styles.clearBtn}>Revelar Tudo</button>
      </div>
    </div>
  );
}
