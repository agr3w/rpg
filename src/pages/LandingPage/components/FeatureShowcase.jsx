// src/pages/LandingPage/components/FeatureShowcase.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import styles from "../LandingPage.module.css";

const CHAPTERS = [
  {
    id: "fichas",
    ribbonColor: "#9E2A2B", // Vermelho
    dragonType: "Fogo do Dragão Vermelho",
    icon: LocalFireDepartmentIcon,
    tabLabel: "Fichas Vivas 5e",
    title: "Cálculos Automáticos e Grimório Tático",
    lore: "Cada número responde instantaneamente. Modificadores, proficiências, salvaguardas e slots de magia operam em perfeita sintonia para que você nunca mais interrompa o fluxo narrativo para consultar tabelas.",
    highlights: [
      "Subida de nível guiada com distribuição automatizada de PV e magias",
      "Controle de Espaços de Magia (Spell Slots) por círculo com suporte a conjuração superior",
      "Inventário com cálculo de peso, capacidade de carga e moedas convertidas",
      "Exportação oficial para PDF no formato clássico de 2 páginas A4"
    ],
    demoCaption: "Grimório dinâmico com rolagem tática integrada."
  },
  {
    id: "vtt",
    ribbonColor: "#1D4E89", // Azul
    dragonType: "Relâmpago do Dragão Azul",
    icon: FlashOnIcon,
    tabLabel: "Mesa Tática & Névoa",
    title: "Névoa de Guerra & Tokens com Alma",
    lore: "Mapas em alta resolução ganham vida com controle de visão. O Mestre desenha a escuridão enquanto jogadores desbravam masmorras sem saber o perigo que os aguarda na próxima curva.",
    highlights: [
      "Névoa de guerra em tempo real: os jogadores só enxergam onde a tocha alcança",
      "Modo Emboscada: oculte criaturas no mapa com um clique antes do combate",
      "Duplo clique no token abre o resumo tático da criatura instantaneamente",
      "Régua de deslocamento tático e controle de permissões por jogador"
    ],
    demoCaption: "Visão tática e névoa viva diretamente no navegador."
  },
  {
    id: "aventuras",
    ribbonColor: "#2D6A4F", // Verde
    dragonType: "Veneno do Dragão Verde",
    icon: ShieldOutlinedIcon,
    tabLabel: "Diário & Quests",
    title: "A Crônica Viva da Sua Campanha",
    lore: "Organize NPCs, notas secretas, pistas e a árvore de missões da sua história em pastas arcanas interligadas.",
    highlights: [
      "Árvore visual de missões com rastreamento de recompensas, loot e status",
      "Catálogo de NPCs com alianças, fraquezas e laços com os heróis",
      "Bloco de notas rápido para anotações no calor da batalha",
      "Diário de sessões colaborativo com linha do tempo de acontecimentos"
    ],
    demoCaption: "Linha do tempo e dossiê de NPCs sem desorganização."
  },
  {
    id: "som",
    ribbonColor: "#C89B3C", // Dourado
    dragonType: "Sopro do Dragão Dourado",
    icon: AutoAwesomeIcon,
    tabLabel: "Atmosfera Sonora",
    title: "Paisagens Sonoras que Guiam o Clima",
    lore: "Transforme uma simples taverna em um refúgio acolhedor ou uma cripta em uma marcha fúnebre com sons sincronizados.",
    highlights: [
      "Mixagem de áudio com canais independentes para clima e efeitos sonoros",
      "Troca rápida de ambiência entre exploração, suspense e combate épico",
      "Player de música do Bardo integrado ao ecossistema da mesa"
    ],
    demoCaption: "Soundboard orquestrado para imersão total."
  }
];

export default function FeatureShowcase() {
  const [selectedChapter, setSelectedChapter] = useState(CHAPTERS[0]);
  const ChapterIcon = selectedChapter.icon;

  return (
    <div className={styles.grimoireSection}>
      <div className={styles.sectionHeading}>
        <span className={styles.ancientBadge}>TOMO DE RECURSOS</span>
        <h2>O Poder nas Mãos de Mestres e Heróis</h2>
        <p>Um sistema desenhado para ser leve, fluido e esteticamente conectado às mesas clássicas.</p>
      </div>

      {/* Livro Aberto */}
      <div className={styles.tomeSpread}>
        {/* Marcadores de Fita Laterais (Abas) */}
        <nav className={styles.ribbonsNav} aria-label="Capítulos de Recursos">
          {CHAPTERS.map((chap) => {
            const isActive = selectedChapter.id === chap.id;
            return (
              <button
                key={chap.id}
                type="button"
                className={`${styles.ribbonBtn} ${isActive ? styles.ribbonActive : ""}`}
                style={{ "--ribbon-accent": chap.ribbonColor }}
                onClick={() => setSelectedChapter(chap)}
              >
                <span className={styles.ribbonFlameDot} />
                <span className={styles.ribbonText}>{chap.tabLabel}</span>
              </button>
            );
          })}
        </nav>

        {/* Páginas do Grimório (Conteúdo) */}
        <div className={styles.tomePages}>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedChapter.id}
              className={styles.pageContent}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <div className={styles.pageTextCol}>
                <span
                  className={styles.dragonOriginTag}
                  style={{ color: selectedChapter.ribbonColor }}
                >
                  <ChapterIcon sx={{ fontSize: 16 }} />
                  <span>{selectedChapter.dragonType}</span>
                </span>
                <h3>{selectedChapter.title}</h3>
                <p className={styles.chapterDescription}>{selectedChapter.lore}</p>

                <ul className={styles.runicFeatureList}>
                  {selectedChapter.highlights.map((item, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 * idx, duration: 0.3 }}
                    >
                      <span className={styles.runicBullet}>᚛</span>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Área de Demonstração Visual (Vídeo/GIF em loop) */}
              <div className={styles.pageVisualCol}>
                <div className={styles.pergaminhoFrame}>
                  <div className={styles.mockVideoSurface}>
                    <div className={styles.videoEmblem}>
                      <ShieldOutlinedIcon sx={{ fontSize: 48, color: selectedChapter.ribbonColor }} />
                    </div>
                    <span className={styles.mockVideoLabel}>
                      Módulo Tático Integrado
                    </span>
                    <small style={{ color: "#a8947c" }}>{selectedChapter.demoCaption}</small>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
