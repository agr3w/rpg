// src/components/MapEditor/ConvertElementModal.jsx
import React, { useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import MapIcon from "@mui/icons-material/Map";
import CloseIcon from "@mui/icons-material/Close";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import styles from "./ConvertElementModal.module.css";

export default function ConvertElementModal({
  element = {},
  userSheets = [],
  activePlayers = [],
  onUpdateElement,
  onClose
}) {
  const [selectedType, setSelectedType] = useState(element.type || element.tool || "token");
  const [selectedSheetId, setSelectedSheetId] = useState(element.characterId || "");
  const [controlledBy, setControlledBy] = useState(element.controlledBy || "dm_only");
  const [visionRadius, setVisionRadius] = useState(element.visionRadius || 180);
  const [coneAngle, setConeAngle] = useState(element.coneAngle || 90);

  const handleSave = (e) => {
    e.preventDefault();

    let updatedFields = {
      type: selectedType,
      controlledBy: controlledBy || "dm_only",
      characterId: selectedType === "token" ? selectedSheetId : null
    };

    if (selectedType === "token") {
      const sheet = userSheets.find((s) => (s.id === selectedSheetId || s.key === selectedSheetId));
      updatedFields = {
        ...updatedFields,
        hasVision: true,
        visionRadius: Number(visionRadius),
        coneAngle: Number(coneAngle),
        name: sheet?.nome || sheet?.name || element.name || "Token",
        hp: sheet?.hpAtual ?? sheet?.hp ?? element.hp ?? 20,
        maxHp: sheet?.hpMaximo ?? sheet?.maxHp ?? element.maxHp ?? 20,
        ca: sheet?.classeArmadura ?? sheet?.ca ?? element.ca ?? 10
      };
    } else {
      updatedFields.hasVision = false;
    }

    onUpdateElement(element.id, updatedFields);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h4>CONFIGURAR OBJETO / TOKEN</h4>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">
            <CloseIcon fontSize="small" />
          </button>
        </div>

        <form onSubmit={handleSave} className={styles.form}>
          <div className={styles.field}>
            <label>Função do Elemento no Mapa:</label>
            <div className={styles.typeGrid}>
              <button
                type="button"
                className={`${styles.typeBtn} ${selectedType === "token" ? styles.activeType : ""}`}
                onClick={() => setSelectedType("token")}
              >
                <PersonIcon sx={{ fontSize: 18 }} />
                <span>Token de Personagem</span>
              </button>
              <button
                type="button"
                className={`${styles.typeBtn} ${selectedType === "prop" ? styles.activeType : ""}`}
                onClick={() => setSelectedType("prop")}
              >
                <Inventory2Icon sx={{ fontSize: 18 }} />
                <span>Prop / Mobília</span>
              </button>
              <button
                type="button"
                className={`${styles.typeBtn} ${selectedType === "background" ? styles.activeType : ""}`}
                onClick={() => setSelectedType("background")}
              >
                <MapIcon sx={{ fontSize: 18 }} />
                <span>Chão / Fundo</span>
              </button>
            </div>
          </div>

          {/* PERMISSÃO DE CONTROLE / MOVIMENTAÇÃO */}
          <div className={styles.field}>
            <label>Quem pode mover / controlar este elemento:</label>
            <select
              value={controlledBy}
              onChange={(e) => setControlledBy(e.target.value)}
              className={styles.select}
            >
              <option value="dm_only">Apenas o Mestre (Padrão)</option>
              <option value="all">Todos os Jogadores da Mesa</option>
              {activePlayers
                .filter((p) => !p.isDM)
                .map((player) => (
                  <option key={player.uid} value={player.uid}>
                    Jogador: {player.name || "Aventureiro"}
                  </option>
                ))}
            </select>
          </div>

          {selectedType === "token" && (
            <>
              <div className={styles.field}>
                <label>Vincular Ficha de Personagem do seu Perfil:</label>
                <select
                  value={selectedSheetId}
                  onChange={(e) => setSelectedSheetId(e.target.value)}
                  className={styles.select}
                >
                  <option value="">-- Sem ficha vinculada (Criatura Genérica) --</option>
                  {userSheets.map((sheet) => (
                    <option key={sheet.id || sheet.key} value={sheet.id || sheet.key}>
                      {sheet.nome || sheet.name || "Sem Nome"} ({sheet.classe || sheet.class || "Guerreiro"} Nvl {sheet.nivel || sheet.level || 1})
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Alcance da Visão (px):</label>
                  <input
                    type="number"
                    min="50"
                    max="600"
                    step="10"
                    value={visionRadius}
                    onChange={(e) => setVisionRadius(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label>Abertura da Luz (°):</label>
                  <select
                    value={coneAngle}
                    onChange={(e) => setConeAngle(e.target.value)}
                    className={styles.select}
                  >
                    <option value="60">60° (Facho Estreito)</option>
                    <option value="90">90° (Lanterna / Visão Padrão)</option>
                    <option value="120">120° (Cone Amplo)</option>
                    <option value="360">360° (Tocha / Iluminação Total)</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancelar</button>
            <button type="submit" className={styles.submitBtn}>Aplicar ao Elemento</button>
          </div>
        </form>
      </div>
    </div>
  );
}
