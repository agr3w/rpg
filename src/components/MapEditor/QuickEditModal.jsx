// src/components/MapEditor/QuickEditModal.jsx
import React, { useState } from "react";
import styles from "./QuickEditModal.module.css";

export default function QuickEditModal({ element, onSave, onClose }) {
  const [text, setText] = useState(element.text || element.content || element.name || "");
  const [fontSize, setFontSize] = useState(element.fontSize || 24);
  const [stroke, setStroke] = useState(element.stroke || element.color || "#e5b324");
  const [strokeWidth, setStrokeWidth] = useState(element.strokeWidth || 3);
  const [width, setWidth] = useState(element.width || 100);
  const [height, setHeight] = useState(element.height || 100);
  const [radius, setRadius] = useState(element.radius || 50);
  const [rotation, setRotation] = useState(element.rotation || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...element,
      text,
      content: text,
      name: text || element.name,
      fontSize: Number(fontSize),
      stroke,
      color: stroke,
      strokeWidth: Number(strokeWidth),
      width: Number(width),
      height: Number(height),
      radius: Number(radius),
      rotation: Number(rotation),
    });
  };

  const isText = element.tool === "text" || element.type === "text";
  const isRect = element.tool === "rect" || element.type === "rect";
  const isCircle = element.tool === "circle" || element.type === "circle";
  const isImage = element.tool === "image" || element.type === "token" || element.type === "image";

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>
          {isText ? "Editar Texto" : isImage ? "Editar Objeto / Token" : "Editar Elemento"}
        </h3>
        
        <form onSubmit={handleSubmit}>
          {isText && (
            <>
              <div className={styles.field}>
                <label>Texto:</label>
                <input
                  type="text"
                  value={text}
                  autoFocus
                  onChange={(e) => setText(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label>Tamanho da Fonte (px):</label>
                <input
                  type="number"
                  min="8"
                  max="160"
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                />
              </div>
            </>
          )}

          {isRect && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div className={styles.field}>
                <label>Largura (px):</label>
                <input
                  type="number"
                  min="5"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label>Altura (px):</label>
                <input
                  type="number"
                  min="5"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>
            </div>
          )}

          {isCircle && (
            <div className={styles.field}>
              <label>Raio (px):</label>
              <input
                type="number"
                min="5"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
              />
            </div>
          )}

          {!isImage && (
            <>
              <div className={styles.field}>
                <label>Cor do Traço / Preenchimento:</label>
                <input
                  type="color"
                  value={stroke}
                  onChange={(e) => setStroke(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label>Espessura do Traço (px):</label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(e.target.value)}
                />
              </div>
            </>
          )}

          <div className={styles.field}>
            <label>Rotação (graus):</label>
            <input
              type="number"
              min="0"
              max="360"
              value={rotation}
              onChange={(e) => setRotation(e.target.value)}
            />
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveBtn}>
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
