// src/pages/LandingPage/components/AboutSection.jsx
import React from "react";
import { motion } from "framer-motion";
import styles from "../LandingPage.module.css";

export default function AboutSection() {
  return (
    <section className={styles.aboutContainer}>
      <div className={styles.aboutGrid}>
        {/* CONTEÚDO E FILOSOFIA */}
        <motion.div
          className={styles.aboutContent}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.ancientBadge}>MANIFESTO & FILOSOFIA</span>
          <h3>Feito por Jogadores, Para Jogadores</h3>
          <p>
            O RPG Companion nasceu da frustração real na mesa: mestres sobrecarregados com dezenas de guias abertas,
            jogadores apagando a folha de papel até rasgar para atualizar pontos de vida, e softwares virtuais
            tão complexos e pesados que travavam no meio do combate.
          </p>
          <p>
            Nossa missão é simples: devolver o foco à narrativa. Quando as regras, os modificadores, os dados e a
            iluminação do mapa trabalham de forma invisível e instantânea, você e seu grupo vivem o verdadeiro
            espírito do RPG de mesa.
          </p>

          <div className={styles.aboutStatsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>100%</span>
              <span className={styles.statLabel}>Navegador Nativo</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>SRD 5.1</span>
              <span className={styles.statLabel}>Regras Oficiais</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>0s</span>
              <span className={styles.statLabel}>Tempo de Instalação</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>60 FPS</span>
              <span className={styles.statLabel}>Canvas Ultra Fluido</span>
            </div>
          </div>
        </motion.div>

        {/* IMAGEM ILUSTRATIVA */}
        <motion.div
          className={styles.vttVisualCard}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <img
            src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80"
            alt="Mesa de RPG e Amigos"
            className={styles.vttVisualImg}
          />
        </motion.div>
      </div>
    </section>
  );
}
