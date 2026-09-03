// src/pages/LandingPage/components/HeroSection.jsx
import React from "react";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ExploreIcon from "@mui/icons-material/Explore";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WifiTetheringIcon from "@mui/icons-material/WifiTethering";
import styles from "../LandingPage.module.css";

export default function HeroSection({ onStart }) {
  const handleScrollToFeatures = () => {
    const el = document.querySelector("#recursos");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className={styles.heroSection}>
      {/* BADGE SUPERIOR */}
      <div className={styles.heroTagBadge}>
        <AutoAwesomeIcon sx={{ fontSize: 16 }} />
        <span>BETA ABERTO • D&D 5E & VTT MULTIPLAYER</span>
      </div>

      {/* TÍTULO PRINCIPAL */}
      <h1 className={styles.heroTitle}>
        A Forja Definitiva Para Suas{" "}
        <span className={styles.heroTitleHighlight}>Aventuras Épicas</span>
      </h1>

      {/* SUBTÍTULO */}
      <p className={styles.heroSubtitle}>
        Fichas inteligentes de D&D 5ª Edição, mesa virtual (VTT) com névoa de guerra em tempo real,
        gerenciador de missões e trilha sonora imersiva. Aposente planilhas pesadas e dezenas de guias abertas.
      </p>

      {/* BOTÕES DE AÇÃO (CTAS) */}
      <div className={styles.heroCtas}>
        <button type="button" className={styles.primaryCta} onClick={onStart}>
          <span>Começar Aventura Grátis</span>
          <ArrowForwardIcon sx={{ fontSize: 18 }} />
        </button>
        <button type="button" className={styles.secondaryCta} onClick={handleScrollToFeatures}>
          <ExploreIcon sx={{ fontSize: 18 }} />
          <span>Explorar Recursos</span>
        </button>
      </div>

      {/* PONTOS DE CONFIANÇA */}
      <ul className={styles.trustList}>
        <li className={styles.trustItem}>
          <CheckCircleOutlineIcon sx={{ color: "#2ecc71", fontSize: 17 }} />
          <span>Acesso Livre Durante o Beta</span>
        </li>
        <li className={styles.trustItem}>
          <CheckCircleOutlineIcon sx={{ color: "#2ecc71", fontSize: 17 }} />
          <span>Regras Oficiais SRD 5.1</span>
        </li>
        <li className={styles.trustItem}>
          <CheckCircleOutlineIcon sx={{ color: "#2ecc71", fontSize: 17 }} />
          <span>Zero Instalação (100% no Navegador)</span>
        </li>
      </ul>

      {/* MOCKUP VISUAL DE ALTO IMPACTO */}
      <div className={styles.heroMockupFrame}>
        <div className={styles.heroMockupInner}>
          <img
            src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80"
            alt="Mesa Virtual RPG Companion Preview"
            className={styles.heroMockupImg}
          />
          <div className={styles.heroFloatingCard}>
            <WifiTetheringIcon sx={{ color: "#2ecc71", fontSize: 26 }} />
            <div className={styles.heroFloatingCardText}>
              <strong>VTT Colaborativo em Tempo Real</strong>
              <span>Névoa dinâmica e tokens sincronizados instantaneamente</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
