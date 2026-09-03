// src/pages/LandingPage/components/FeatureShowcase.jsx
import React, { useState } from "react";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import MapIcon from "@mui/icons-material/Map";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import styles from "../LandingPage.module.css";

const FEATURES_DATA = [
  {
    id: "fichas",
    titleShort: "Fichas Vivas D&D 5e",
    tag: "Automação & Regras",
    icon: AutoStoriesIcon,
    title: "Fichas Inteligentes com Grimório Dinâmico",
    description: "Cálculo automático de modificadores, bônus de proficiência, salvaguardas, classe de armadura e inventário tático. Suba de nível com um assistente guiado passo a passo e controle espaços de magia (spell slots) com um clique.",
    bulletPoints: [
      "Compêndio completo com todas as classes e raças oficiais do SRD 5.1",
      "Slots de magia interativos por círculo com suporte a upcasting",
      "Rolagens automáticas de ataque e dano com cálculo de atributos e dados 3D",
      "Exportação para PDF oficial no formato clássico de 2 páginas A4"
    ],
    badgeText: "Zero Contas Manuais",
    mediaPlaceholder: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "vtt",
    titleShort: "Mesa Virtual & Névoa",
    tag: "Imersão em Tempo Real",
    icon: MapIcon,
    title: "VTT Nativo com Névoa de Guerra Dinâmica",
    description: "Crie ou importe mapas em alta definição. Revele salas conforme os jogadores exploram com pincéis e cones de visão direcional vinculados aos tokens, gerando suspense tático imediato.",
    bulletPoints: [
      "Névoa de Guerra em tempo real via Firebase (100% blackout para jogadores)",
      "Tokens vinculados diretamente à ficha: duplo clique abre mini-ficha e ataques",
      "Snap-to-grid milimétrico, controle de permissões e régua de medição 5E",
      "Modo Emboscada: oculte criaturas do mapa até o momento da surpresa"
    ],
    badgeText: "Multijogador Sem Lag",
    mediaPlaceholder: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "campanha",
    titleShort: "Caderno & Missões",
    tag: "Organização do Mestre",
    icon: MenuBookIcon,
    title: "Organize Campanhas Inteiras Sem se Perder",
    description: "Mantenha o registro vivo da sua história com fluxogramas visuais de quests, notas ramificadas por pastas e diretório de NPCs com segredos e laços ocultos.",
    bulletPoints: [
      "Árvore de quests conectada com objetivos, recompensas de XP e loot",
      "Diário de sessões colaborativo com linha do tempo de acontecimentos",
      "Catálogo de NPCs com atitudes, estatísticas e itens carregados",
      "Biblioteca Arcana com pastas e notas em formatação rica"
    ],
    badgeText: "Fim das Anotações Perdidas",
    mediaPlaceholder: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "atmosfera",
    titleShort: "Trilha & Soundboard",
    tag: "Atmosfera Sonora",
    icon: MusicNoteIcon,
    title: "Som e Ambientação que Dão Vida à Sessão",
    description: "Troque a atmosfera da taverna calorosa para a masmorra assustadora com um clique. Soundboard categorizado para combate épico, mistério, descanso e viagens.",
    bulletPoints: [
      "Mixagem de áudio ambiente com controle de volume independente",
      "Categorias sonoras rápidas para combates épicos e exploração",
      "Player de música do Bardo integrado ao ecossistema da mesa"
    ],
    badgeText: "Imersão Sonora",
    mediaPlaceholder: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80"
  }
];

export default function FeatureShowcase() {
  const [activeTabId, setActiveTabId] = useState("fichas");
  const currentFeature = FEATURES_DATA.find((f) => f.id === activeTabId) || FEATURES_DATA[0];

  return (
    <div className={styles.showcaseContainer}>
      <div className={styles.sectionHeading}>
        <span className={styles.goldBadge}>FERRAMENTAS SUPREMAS</span>
        <h2>Tudo o que sua mesa precisa em um só lugar</h2>
        <p>Aposente dezenas de guias abertas, planilhas confusas e programas pesados.</p>
      </div>

      <div className={styles.showcaseGrid}>
        {/* COLUNA LATERAL DE ABAS */}
        <div className={styles.tabsCol}>
          {FEATURES_DATA.map((feat) => {
            const IconComp = feat.icon;
            const isActive = activeTabId === feat.id;
            return (
              <button
                key={feat.id}
                type="button"
                className={`${styles.tabButton} ${isActive ? styles.tabActive : ""}`}
                onClick={() => setActiveTabId(feat.id)}
              >
                <IconComp sx={{ color: isActive ? "#ffd700" : "#8b949e", fontSize: 24 }} />
                <div className={styles.tabTextWrapper}>
                  <span className={styles.tabIconTitle}>{feat.titleShort}</span>
                  <span className={styles.tabCategory}>{feat.tag}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* COLUNA DO PREVIEW ATIVO */}
        <div className={styles.previewCol}>
          <div className={styles.previewHeader}>
            <span className={styles.miniTag}>{currentFeature.tag}</span>
            <h3>{currentFeature.title}</h3>
            <p>{currentFeature.description}</p>
          </div>

          <div className={styles.mediaFrame}>
            <img
              src={currentFeature.mediaPlaceholder}
              alt={currentFeature.title}
              loading="lazy"
              className={styles.featureMedia}
            />
            <div className={styles.mediaOverlayBadge}>
              <AutoAwesomeIcon sx={{ fontSize: 14 }} />
              <span>{currentFeature.badgeText}</span>
            </div>
          </div>

          <ul className={styles.bulletList}>
            {currentFeature.bulletPoints.map((pt, i) => (
              <li key={i}>
                <CheckCircleOutlineIcon sx={{ color: "#f1c40f", fontSize: 18 }} />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
