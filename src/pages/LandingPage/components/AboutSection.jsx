// src/pages/LandingPage/components/AboutSection.jsx
import React from "react";
import { motion } from "framer-motion";
import CodeIcon from "@mui/icons-material/Code";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import styles from "../LandingPage.module.css";
import dragonTome from "../../../components/Cards/CardsImgs/livroDragao.png";

const MILESTONES = [
  {
    year: "2023",
    tag: "O Primeiro Feitiço",
    text: "O projeto nasceu como um hobby para aprofundar estudos em React.js e unir desenvolvimento de software à paixão por D&D. Em apenas um mês, a primeira versão de ficha funcional estava de pé — uma grande vitória pessoal, mas ainda longe da ferramenta completa que eu queria para as minhas próprias mesas."
  },
  {
    year: "A Travessia",
    tag: "O Peso da Rotina",
    text: "A correria do dia a dia e as demandas profissionais colocaram o projeto em espera. O código ficou guardado, mas a vontade de construir um ecossistema rápido, visualmente imersivo e sem burocracia nunca esfriou."
  },
  {
    year: "2026",
    tag: "O Retorno com Maestria",
    text: "Com mais bagagem técnica e maturidade, retomei o projeto com foco total: reconstrução da arquitetura, adição do VTT nativo, névoa de guerra em tempo real e o grimório inteligente que eu sempre sonhei em usar."
  }
];

export default function AboutSection() {
  return (
    <section className={styles.chronicleSection}>
      <div className={styles.sectionHeading}>
        <span className={styles.ancientBadge}>ORIGEM & PROPÓSITO</span>
        <h2>Da Minha Mesa Para a Sua</h2>
        <p>Um projeto independente, construído linha por linha por quem tenta jogar toda semana.</p>
      </div>

      <div className={styles.chronicleContainer}>
        {/* Lado Esquerdo: Linha do Tempo Pessoal */}
        <div className={styles.timelineCol}>
          {MILESTONES.map((step, idx) => (
            <motion.div
              key={idx}
              className={styles.timelineEntry}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.4 }}
            >
              <div className={styles.timelineMarker}>
                <span className={styles.markerDot} />
                <span className={styles.markerYear}>{step.year}</span>
              </div>
              <div className={styles.timelineContent}>
                <span className={styles.timelineTag}>{step.tag}</span>
                <p>{step.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lado Direito: Filosofia & Voto do Mestre */}
        <motion.div
          className={styles.pledgeCol}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.authorBadgePlate}>
            <img src={dragonTome} alt="Grimório do Dragão" className={styles.dragonSealIcon} />
            <div className={styles.authorTitle}>
              <strong>Desenvolvimento Solo & Ativo</strong>
              <small>Feito no Brasil • D&D 5ª Edição</small>
            </div>
          </div>

          <blockquote className={styles.chronicleQuote}>
            "Assim como Drizzt enfrentando o Underdark, Elminster desafiando deuses ou Nine-Fingers
            lutando nas sombras de Baldur's Gate: a vida é corrida e cheia de barreiras, mas esse
            projeto é a minha batalha. Vou guerrear até o fim para entregar uma plataforma épica,
            gratuita e viva para a comunidade."
          </blockquote>

          <div className={styles.devHighlights}>
            <div className={styles.highlightPill}>
              <div className={styles.pillIcon}>
                <CodeIcon sx={{ color: "#9e2a2b", fontSize: 20 }} />
              </div>
              <div>
                <strong>Sem Intermediários</strong>
                <small>Contato direto com quem programa</small>
              </div>
            </div>
            <div className={styles.highlightPill}>
              <div className={styles.pillIcon}>
                <MenuBookIcon sx={{ color: "#c89b3c", fontSize: 20 }} />
              </div>
              <div>
                <strong>Evolução Contínua</strong>
                <small>Melhorias testadas na prática em mesa</small>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
