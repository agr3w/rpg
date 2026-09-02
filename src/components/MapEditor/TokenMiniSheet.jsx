// src/components/MapEditor/TokenMiniSheet.jsx
import React, { useState } from "react";
import ShieldIcon from "@mui/icons-material/Shield";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import CasinoIcon from "@mui/icons-material/Casino";
import HealingIcon from "@mui/icons-material/Healing";
import CloseIcon from "@mui/icons-material/Close";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import SportsKabaddiIcon from "@mui/icons-material/SportsKabaddi";
import styles from "./TokenMiniSheet.module.css";

export default function TokenMiniSheet({
  token,
  sheetData,
  onUpdateToken,
  onRollDice,
  onClose
}) {
  const [activeTab, setActiveTab] = useState("combate"); // "combate" | "atributos" | "magias"
  const [hpModInput, setHpModInput] = useState("");

  const currentHp = token.hp ?? sheetData?.hpAtual ?? sheetData?.hp ?? 20;
  const maxHp = token.maxHp ?? sheetData?.hpMaximo ?? sheetData?.maxHp ?? 20;
  const ca = sheetData?.classeArmadura ?? sheetData?.ca ?? token.ca ?? 10;
  const speed = sheetData?.deslocamento ?? sheetData?.speed ?? "9m (30ft)";

  // Atributos base e cálculo de modificador D&D 5e: (Val - 10) / 2
  const atributos = sheetData?.atributos || {
    forca: sheetData?.forca || 14,
    destreza: sheetData?.destreza || 16,
    constituicao: sheetData?.constituicao || 12,
    inteligencia: sheetData?.inteligencia || 10,
    sabedoria: sheetData?.sabedoria || 13,
    carisma: sheetData?.carisma || 8
  };

  const getMod = (val = 10) => Math.floor((val - 10) / 2);
  const formatMod = (mod) => (mod >= 0 ? `+${mod}` : `${mod}`);

  // Ajustes de Vida
  const handleApplyDamage = () => {
    const val = Number(hpModInput);
    if (!val) return;
    onUpdateToken(token.id, { hp: Math.max(0, currentHp - val) });
    setHpModInput("");
  };

  const handleApplyHeal = () => {
    const val = Number(hpModInput);
    if (!val) return;
    onUpdateToken(token.id, { hp: Math.min(maxHp, currentHp + val) });
    setHpModInput("");
  };

  return (
    <div className={styles.miniSheetDrawer}>
      {/* Header Compacto */}
      <div className={styles.header}>
        {token.src ? (
          <img src={token.src} alt={token.name} className={styles.avatar} />
        ) : (
          <div className={styles.avatarPlaceholder}>
            {(sheetData?.nome || token.name || "T")[0].toUpperCase()}
          </div>
        )}
        <div className={styles.characterInfo}>
          <h4 title={sheetData?.nome || token.name}>{sheetData?.nome || token.name || "Token"}</h4>
          <span>{sheetData?.raca || "Raça"} • {sheetData?.classe || "Classe"} (Nvl {sheetData?.nivel || 1})</span>
        </div>
        <button className={styles.closeBtn} onClick={onClose} title="Fechar Mini Ficha" aria-label="Fechar">
          <CloseIcon fontSize="small" />
        </button>
      </div>

      {/* Badges Táticos Principais */}
      <div className={styles.coreBadges}>
        <div className={styles.badge}>
          <span className={styles.badgeLabel}>CA</span>
          <span className={styles.badgeValue}>
            <ShieldIcon sx={{ fontSize: 14, color: "#f1c40f", verticalAlign: "middle", mr: 0.3 }} />
            {ca}
          </span>
        </div>
        <div className={styles.badge}>
          <span className={styles.badgeLabel}>DESLOC.</span>
          <span className={styles.badgeValue}>
            <DirectionsRunIcon sx={{ fontSize: 14, color: "#f1c40f", verticalAlign: "middle", mr: 0.3 }} />
            {speed}
          </span>
        </div>
        <div className={styles.badge}>
          <span className={styles.badgeLabel}>INICIATIVA</span>
          <button
            className={styles.miniRollBtn}
            onClick={() => {
              const desMod = getMod(atributos.destreza);
              onRollDice(`1d20${formatMod(desMod)}`, `Iniciativa de ${sheetData?.nome || token.name}`);
            }}
          >
            <CasinoIcon sx={{ fontSize: 13, verticalAlign: "middle", mr: 0.3 }} />
            {formatMod(getMod(atributos.destreza))}
          </button>
        </div>
      </div>

      {/* Barra e Gestão de HP */}
      <div className={styles.hpContainer}>
        <div className={styles.hpLabels}>
          <span>PONTOS DE VIDA</span>
          <span>{currentHp} / {maxHp}</span>
        </div>
        <div className={styles.hpBar}>
          <div
            className={styles.hpBarFill}
            style={{
              width: `${Math.min(100, Math.max(0, (currentHp / maxHp) * 100))}%`,
              backgroundColor: currentHp < maxHp * 0.3 ? "#e74c3c" : "#2ecc71"
            }}
          />
        </div>
        <div className={styles.hpActions}>
          <input
            type="number"
            min="1"
            placeholder="Qtd"
            value={hpModInput}
            onChange={(e) => setHpModInput(e.target.value)}
          />
          <button className={styles.damageBtn} onClick={handleApplyDamage}>
            <FlashOnIcon sx={{ fontSize: 13, verticalAlign: "middle", mr: 0.3 }} />
            Dano
          </button>
          <button className={styles.healBtn} onClick={handleApplyHeal}>
            <HealingIcon sx={{ fontSize: 13, verticalAlign: "middle", mr: 0.3 }} />
            Cura
          </button>
        </div>
      </div>

      {/* Navegação por Abas Rápidas */}
      <div className={styles.tabsNav}>
        <button
          className={activeTab === "combate" ? styles.activeTab : ""}
          onClick={() => setActiveTab("combate")}
        >
          <SportsKabaddiIcon sx={{ fontSize: 14, verticalAlign: "middle", mr: 0.3 }} />
          Ataques
        </button>
        <button
          className={activeTab === "atributos" ? styles.activeTab : ""}
          onClick={() => setActiveTab("atributos")}
        >
          <AssessmentIcon sx={{ fontSize: 14, verticalAlign: "middle", mr: 0.3 }} />
          Testes
        </button>
        <button
          className={activeTab === "magias" ? styles.activeTab : ""}
          onClick={() => setActiveTab("magias")}
        >
          <AutoFixHighIcon sx={{ fontSize: 14, verticalAlign: "middle", mr: 0.3 }} />
          Magias
        </button>
      </div>

      {/* Conteúdo da Aba */}
      <div className={styles.tabContent}>
        {/* ABA: COMBATE / ARSENAL */}
        {activeTab === "combate" && (
          <div className={styles.weaponsList}>
            {(sheetData?.armasEquipadas || sheetData?.armas || [
              { nome: "Espada Longa", dano: "1d8+3", bonusAtaque: 5, tipo: "Cortante" },
              { nome: "Arco Curto", dano: "1d6+3", bonusAtaque: 5, tipo: "Perfurante" }
            ]).map((arma, idx) => (
              <div key={idx} className={styles.actionCard}>
                <div className={styles.actionInfo}>
                  <strong>{arma.nome}</strong>
                  <small>{arma.dano} ({arma.tipo || "Dano"})</small>
                </div>
                <div className={styles.actionBtns}>
                  <button
                    onClick={() =>
                      onRollDice(`1d20+${arma.bonusAtaque || 0}`, `Ataque: ${arma.nome}`)
                    }
                  >
                    Atacar (+{arma.bonusAtaque || 0})
                  </button>
                  <button
                    onClick={() =>
                      onRollDice(`${arma.dano}`, `Dano: ${arma.nome}`)
                    }
                  >
                    Dano
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ABA: ATRIBUTOS & TESTES RÁPIDOS */}
        {activeTab === "atributos" && (
          <div className={styles.attributesGrid}>
            {Object.entries(atributos).map(([attr, val]) => {
              const numVal = typeof val === "number" ? val : 10;
              const mod = getMod(numVal);
              return (
                <div key={attr} className={styles.attrCard}>
                  <span className={styles.attrName}>{attr.slice(0, 3).toUpperCase()}</span>
                  <span className={styles.attrVal}>{numVal}</span>
                  <button
                    className={styles.attrRollBtn}
                    onClick={() => onRollDice(`1d20${formatMod(mod)}`, `Teste de ${attr.toUpperCase()}`)}
                  >
                    {formatMod(mod)}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ABA: MAGIAS RÁPIDAS */}
        {activeTab === "magias" && (
          <div className={styles.spellsList}>
            {(sheetData?.magiasPreparadas || sheetData?.magias || [
              { nome: "Rajada Mística", circulo: 0, formula: "1d10" },
              { nome: "Mísseis Mágicos", circulo: 1, formula: "3d4+3" }
            ]).map((magia, idx) => (
              <div key={idx} className={styles.actionCard}>
                <div className={styles.actionInfo}>
                  <strong>{magia.nome}</strong>
                  <small>{magia.circulo === 0 ? "Truque" : `${magia.circulo}º Círculo`}</small>
                </div>
                <button
                  className={styles.castBtn}
                  onClick={() => onRollDice(magia.formula || "1d20", `Magia: ${magia.nome}`)}
                >
                  Conjurar ({magia.formula || "1d20"})
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
