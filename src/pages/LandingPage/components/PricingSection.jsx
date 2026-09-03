// src/pages/LandingPage/components/PricingSection.jsx
import React from "react";
import { motion } from "framer-motion";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import styles from "../LandingPage.module.css";

export default function PricingSection({ onChoosePlan }) {
  return (
    <div className={styles.pactsSection}>
      <div className={styles.sectionHeading}>
        <span className={styles.ancientBadge}>PACTOS & ACESSO</span>
        <h2>Honesto, Livre e Feito para Durar</h2>
        <p>Durante o período de Beta Aberto, todas as ferramentas essenciais são 100% gratuitas.</p>
      </div>

      <div className={styles.pactsGrid}>
        {/* PACTO DO AVENTUREIRO */}
        <motion.div
          className={styles.scrollParchment}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.waxSealGreen}>GRÁTIS</div>
          <h3>Pacto do Aventureiro</h3>
          <div className={styles.costBadge}>
            <strong>R$ 0</strong>
            <span>/ Beta Oficial</span>
          </div>
          <p className={styles.pactDesc}>Tudo o que jogadores e mestres precisam para campanhas completas.</p>

          <ul className={styles.pactPerks}>
            <li>✦ Criação ilimitada de fichas D&D 5e</li>
            <li>✦ Grimório completo com slots de magia interativos</li>
            <li>✦ Criação e montagem de mapas de batalha com grid</li>
            <li>✦ Rolagens de dados 3D em tempo real</li>
            <li>✦ Diário de notas, catálogo de NPCs e inventário de grupo</li>
            <li>✦ Exportação oficial em PDF A4 de 2 páginas</li>
          </ul>

          <button type="button" className={styles.pactBtnRustic} onClick={onChoosePlan}>
            <span>Entrar no Beta Sem Custos</span>
            <ArrowForwardIcon sx={{ fontSize: 16 }} />
          </button>
        </motion.div>

        {/* PACTO DO ARQUI-MESTRE (APOIADOR) */}
        <motion.div
          className={`${styles.scrollParchment} ${styles.archmageScroll}`}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={styles.waxSealRed}>APOIADOR</div>
          <h3>Pacto do Arqui-Mestre</h3>
          <div className={styles.costBadge}>
            <strong>R$ 14,90</strong>
            <span>/ mês (Em breve)</span>
          </div>
          <p className={styles.pactDesc}>Recursos de alta performance para quem comanda grandes mesas.</p>

          <ul className={styles.pactPerks}>
            <li>✦ <strong>Tudo incluído no Pacto do Aventureiro</strong></li>
            <li>✦ Névoa de guerra persistente na nuvem com visão avançada</li>
            <li>✦ Armazenamento ilimitado no Cofre de Assets (mapas pesados & tokens)</li>
            <li>✦ Soundboard multiplayer com trilha sonora sincronizada</li>
            <li>✦ Distintivo exclusivo de Fundador Lendário no perfil</li>
          </ul>

          <button type="button" className={styles.pactBtnGold} onClick={onChoosePlan}>
            <AutoAwesomeIcon sx={{ fontSize: 18 }} />
            <span>Tornar-se um Fundador</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
