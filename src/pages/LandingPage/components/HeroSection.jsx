// src/pages/LandingPage/components/HeroSection.jsx
import React from "react";
import { motion } from "framer-motion";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import styles from "../LandingPage.module.css";

export default function HeroSection({ onStart }) {
  const handleScrollToGrimoire = (e) => {
    e.preventDefault();
    const el = document.querySelector("#recursos");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className={styles.heroSection}>
      {/* Brasas Dracônicas Flutuantes no Topo */}
      <div className={styles.emberGlow} />

      <motion.div
        className={styles.heroContent}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className={styles.dragonInsignia}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <span className={styles.dragonRune}>ᛟ</span>
          <span className={styles.betaParchmentTag}>BETA ABERTO • D&D 5ª EDIÇÃO</span>
          <span className={styles.dragonRune}>ᛟ</span>
        </motion.div>

        <motion.h1
          className={styles.heroTitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          A Forja Definitiva Para Suas <span className={styles.flameWord}>Lendas</span>
        </motion.h1>

        <motion.p
          className={styles.heroSubtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Esqueça as dezenas de guias abertas e o peso das regras manuais. Reúna seus heróis em um
          ecossistema vivo de fichas inteligentes, combate tático e mapas com névoa em tempo real.
        </motion.p>

        <motion.div
          className={styles.heroActions}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <button type="button" className={styles.heroCtaPrimary} onClick={onStart}>
            <span>Iniciar Jornada Gratuita</span>
            <span className={styles.btnArrow}>⟶</span>
          </button>
          <a href="#recursos" onClick={handleScrollToGrimoire} className={styles.heroCtaSecondary}>
            <MenuBookIcon sx={{ fontSize: 18, color: "#8c6e4d" }} />
            <span>Explorar o Grimório</span>
          </a>
        </motion.div>

        {/* Citações de Clima */}
        <motion.div
          className={styles.sessionPledge}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ delay: 0.9, duration: 1 }}
        >
          ✦ Construído por Mestres de RPG para Mestres e Jogadores ✦
        </motion.div>
      </motion.div>
    </section>
  );
}
