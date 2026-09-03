// src/pages/LandingPage/components/FeatureShowcase.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import styles from "../LandingPage.module.css";

// Assets reais do projeto
import fichaImg from "../../../components/Cards/CardsImgs/fichanova.png";
import mapImg from "../../../assets/Battlemps.png";
import cadernoImg from "../../../components/Cards/CardsImgs/Caderno.png";
import dragonIcon from "../../../components/Cards/CardsImgs/livroDragao.png";

const SHOWCASE_TABS = [
  {
    id: "fichas",
    title: "Fichas Inteligentes 5e",
    dragonTone: "#9E2A2B", // Dragão Vermelho / Brasa
    dragonRune: "ᚠ",
    headline: "Automação sem perda de controle",
    specs: [
      "Grimório com slots de magia interativos e upcasting automático",
      "Rolagem direta de dados 3D para ataques, dano e salvaguardas",
      "Inventário tático com cálculo automático de peso e moedas"
    ],
    mediaType: "image",
    mediaSrc: fichaImg
  },
  {
    id: "vtt",
    title: "Mesa Tática & Névoa",
    dragonTone: "#1D4E89", // Dragão Azul / Relâmpago
    dragonRune: "ᚦ",
    headline: "Névoa de guerra ao vivo no navegador",
    specs: [
      "Blackout total para jogadores: revele salas com o pincel do Mestre",
      "Duplo clique no token abre o HUD de combate e HP da criatura",
      "Modo Emboscada para ocultar monstros antes do combate começar"
    ],
    mediaType: "image",
    mediaSrc: mapImg
  },
  {
    id: "campanha",
    title: "Grimório do Mestre",
    dragonTone: "#2D6A4F", // Dragão Verde / Veneno
    dragonRune: "ᚱ",
    headline: "Anotações e missões interligadas",
    specs: [
      "Árvore de quests com status de objetivos e recompensas",
      "Dossiê de NPCs com históricos, segredos e alianças",
      "Diário de sessões colaborativo em tempo real"
    ],
    mediaType: "image",
    mediaSrc: cadernoImg
  },
  {
    id: "atmosfera",
    title: "Soundboard & Clima",
    dragonTone: "#C89B3C", // Dragão Dourado / Fogo Sagrado
    dragonRune: "ᛟ",
    headline: "Imersão sonora instantânea",
    specs: [
      "Troca rápida de ambiência (taverna, combate, masmorra)",
      "Mixagem de áudio com volumes independentes",
      "Totalmente integrado à mesa de jogo"
    ],
    mediaType: "image",
    mediaSrc: dragonIcon
  }
];

export default function FeatureShowcase() {
  const [activeTab, setActiveTab] = useState(SHOWCASE_TABS[0]);

  return (
    <div className={styles.showcaseSection}>
      <div className={styles.sectionHeading}>
        <span className={styles.ancientBadge}>VITRINE DO SISTEMA</span>
        <h2>O Poder nas Mãos de Mestres e Heróis</h2>
        <p>Um ecossistema desenhado para ser fluido, direto ao ponto e sem enrolação.</p>
      </div>

      {/* Seletor Estilo Papiro com Marcadores Dracônicos */}
      <div className={styles.tabsNavContainer}>
        {SHOWCASE_TABS.map((tab) => {
          const isSelected = activeTab.id === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`${styles.runeTabBtn} ${isSelected ? styles.runeTabActive : ""}`}
              style={{ "--dragon-color": tab.dragonTone }}
              onClick={() => setActiveTab(tab)}
            >
              <span className={styles.tabRuneIcon}>{tab.dragonRune}</span>
              <span className={styles.tabTitleText}>{tab.title}</span>
              {isSelected && (
                <motion.div
                  className={styles.activeTabUnderline}
                  layoutId="activeTabUnderline"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Palco da Mídia e Especificações Rápidas */}
      <div className={styles.mediaStageWrapper}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab.id}
            className={styles.stageGrid}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {/* Visualizador de Mídia (Mockup com Arte Real do Projeto) */}
            <div 
              className={styles.screenDeviceFrame}
              style={{ "--accent-glow": activeTab.dragonTone }}
            >
              <div className={styles.screenHeaderBar}>
                <span className={styles.screenDot} />
                <span className={styles.screenDot} />
                <span className={styles.screenDot} />
                <span className={styles.screenUrl}>rpg.companion // {activeTab.id}</span>
              </div>

              <div className={styles.screenDisplay}>
                {activeTab.mediaType === "video" ? (
                  <video
                    src={activeTab.mediaSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={styles.realMediaContent}
                  />
                ) : (
                  <img
                    src={activeTab.mediaSrc}
                    alt={activeTab.title}
                    className={styles.realMediaContent}
                  />
                )}
              </div>
            </div>

            {/* Texto Descritivo e Direto ao Ponto */}
            <div className={styles.stageSpecsCol}>
              <span 
                className={styles.dragonHeadlineTag}
                style={{ color: activeTab.dragonTone }}
              >
                ✦ {activeTab.headline}
              </span>

              <h3 className={styles.stageTitle}>{activeTab.title}</h3>

              <div className={styles.specBullets}>
                {activeTab.specs.map((spec, i) => (
                  <div key={i} className={styles.specRow}>
                    <span className={styles.specCheckmark}>
                      <AutoAwesomeIcon sx={{ fontSize: 16, color: activeTab.dragonTone }} />
                    </span>
                    <p>{spec}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
