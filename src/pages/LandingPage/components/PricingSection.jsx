// src/pages/LandingPage/components/PricingSection.jsx
import React from "react";
import { motion } from "framer-motion";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import ForumIcon from "@mui/icons-material/Forum";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import styles from "../LandingPage.module.css";

const GUARANTEES = [
  {
    icon: LockOpenIcon,
    iconColor: "#2d6a4f",
    title: "100% Gratuito no Beta",
    desc: "Crie quantas fichas, notas e mapas precisar. Sem limite de campanhas ou testes pagos."
  },
  {
    icon: ShieldOutlinedIcon,
    iconColor: "#1d4e89",
    title: "Sem Paywall nas Ferramentas Atuais",
    desc: "Tudo o que existe hoje (Fichas 5e, VTT, Névoa, Grimório e Dados) permanecerá gratuito."
  },
  {
    icon: ForumIcon,
    iconColor: "#c89b3c",
    title: "Evolução Guiada por Feedback",
    desc: "O sistema está em desenvolvimento ativo. Sua opinião e testes em mesa moldam as próximas melhorias."
  },
  {
    icon: AutoAwesomeIcon,
    iconColor: "#9e2a2b",
    title: "Atualizações Constantes",
    desc: "Novos recursos continuarão sendo adicionados ao ecossistema base de forma livre."
  }
];

export default function PricingSection({ onStart, onChoosePlan }) {
  const handleAction = onStart || onChoosePlan;

  return (
    <div className={styles.pactManifestoWrapper}>
      <div className={styles.sectionHeading}>
        <span className={styles.ancientBadge}>ACESSO & COMUNIDADE</span>
        <h2>Jogue Livremente. Forje com a Gente.</h2>
        <p>
          O sistema é aberto para quem ama RPG de verdade. Sem cobranças surpresa ou ferramentas essenciais travadas.
        </p>
      </div>

      <motion.div 
        className={styles.manifestoParchment}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className={styles.waxSealDragon}>BETA LIVRE</div>

        <div className={styles.manifestoHeader}>
          <h3>Compromisso com os Jogadores</h3>
          <p>
            Nosso objetivo é entregar a melhor experiência de mesa virtual sem burocracia. No futuro, conteúdos cosméticos ou infraestruturas dedicadas poderão ter suporte opcional de apoiadores, mas o coração do sistema é e continuará sendo livre.
          </p>
        </div>

        <div className={styles.guaranteeGrid}>
          {GUARANTEES.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <motion.div 
                key={idx}
                className={styles.guaranteeItem}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
              >
                <div className={styles.guaranteeIcon}>
                  <IconComp sx={{ color: item.iconColor, fontSize: 26 }} />
                </div>
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.desc}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className={styles.manifestoAction}>
          <button type="button" className={styles.rusticCtaBtn} onClick={handleAction}>
            <span>Começar Agora & Enviar Feedback</span>
            <ArrowForwardIcon sx={{ fontSize: 18, color: "#f1c40f" }} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
