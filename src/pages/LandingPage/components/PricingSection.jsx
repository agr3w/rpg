// src/pages/LandingPage/components/PricingSection.jsx
import React from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import styles from "../LandingPage.module.css";

export default function PricingSection({ onChoosePlan }) {
  return (
    <div className={styles.pricingContainer}>
      <div className={styles.sectionHeading}>
        <span className={styles.goldBadge}>ACESSO & PLANOS</span>
        <h2>Jogue de Graça Hoje Durante o Beta Aberto</h2>
        <p>Sem pegadinhas, sem necessidade de cartão de crédito. Crie sua conta e comece agora.</p>
      </div>

      <div className={styles.pricingCardsGrid}>
        {/* PLANO AVENTUREIRO (GRÁTIS) */}
        <div className={styles.priceCard}>
          <div className={styles.priceHeader}>
            <span className={styles.planName}>Aventureiro (Beta Aberto)</span>
            <div className={styles.priceValue}>
              <strong>R$ 0</strong>
              <small>/para sempre</small>
            </div>
            <p>Perfeito para jogadores e mestres que querem tudo o que precisam para jogar D&D sem travas.</p>
          </div>

          <ul className={styles.benefitsList}>
            <li className={styles.benefitItem}>
              <CheckCircleOutlineIcon sx={{ color: "#2ecc71", fontSize: 18 }} />
              <span>Fichas D&D 5e ilimitadas e completas</span>
            </li>
            <li className={styles.benefitItem}>
              <CheckCircleOutlineIcon sx={{ color: "#2ecc71", fontSize: 18 }} />
              <span>Grimório de magias com slots interativos</span>
            </li>
            <li className={styles.benefitItem}>
              <CheckCircleOutlineIcon sx={{ color: "#2ecc71", fontSize: 18 }} />
              <span>Compêndio com todas as raças e classes do SRD 5.1</span>
            </li>
            <li className={styles.benefitItem}>
              <CheckCircleOutlineIcon sx={{ color: "#2ecc71", fontSize: 18 }} />
              <span>Criador e Editor de Mapas com Grid Tático</span>
            </li>
            <li className={styles.benefitItem}>
              <CheckCircleOutlineIcon sx={{ color: "#2ecc71", fontSize: 18 }} />
              <span>Rolador de Dados 3D integrado às ações da ficha</span>
            </li>
            <li className={styles.benefitItem}>
              <CheckCircleOutlineIcon sx={{ color: "#2ecc71", fontSize: 18 }} />
              <span>Diário de Missões, Anotações e Diretório de NPCs</span>
            </li>
            <li className={styles.benefitItem}>
              <CheckCircleOutlineIcon sx={{ color: "#2ecc71", fontSize: 18 }} />
              <span>Exportação oficial da ficha em PDF A4 de 2 páginas</span>
            </li>
          </ul>

          <button type="button" className={styles.primaryPlanBtn} onClick={onChoosePlan}>
            <span>Criar Conta Gratuita</span>
            <ArrowForwardIcon sx={{ fontSize: 17 }} />
          </button>
        </div>

        {/* PLANO MESTRE LENDÁRIO (PRO / APOIADOR) */}
        <div className={`${styles.priceCard} ${styles.featuredPlanCard}`}>
          <div className={styles.featuredRibbon}>MAIS POPULAR</div>
          <div className={styles.priceHeader}>
            <span className={styles.planName}>Mestre Lendário</span>
            <div className={styles.priceValue}>
              <strong>R$ 14,90</strong>
              <small>/mês (Em breve)</small>
            </div>
            <p>Para o mestre que deseja experiência de VTT multiplayer sem limites de armazenamento.</p>
          </div>

          <ul className={styles.benefitsList}>
            <li className={styles.benefitItem}>
              <CheckCircleOutlineIcon sx={{ color: "#ffd700", fontSize: 18 }} />
              <span><strong>Tudo incluído no plano Aventureiro</strong></span>
            </li>
            <li className={styles.benefitItem}>
              <CheckCircleOutlineIcon sx={{ color: "#ffd700", fontSize: 18 }} />
              <span>Sessões VTT multiplayer em tempo real sem limite de jogadores</span>
            </li>
            <li className={styles.benefitItem}>
              <CheckCircleOutlineIcon sx={{ color: "#ffd700", fontSize: 18 }} />
              <span>Névoa de guerra persistente sincronizada na nuvem</span>
            </li>
            <li className={styles.benefitItem}>
              <CheckCircleOutlineIcon sx={{ color: "#ffd700", fontSize: 18 }} />
              <span>Cofre de Assets ilimitado (Upload de tokens e mapas em 4K)</span>
            </li>
            <li className={styles.benefitItem}>
              <CheckCircleOutlineIcon sx={{ color: "#ffd700", fontSize: 18 }} />
              <span>Soundboard multiplayer e trilhas sincronizadas</span>
            </li>
            <li className={styles.benefitItem}>
              <CheckCircleOutlineIcon sx={{ color: "#ffd700", fontSize: 18 }} />
              <span>Acesso antecipado a novos módulos e suporte prioritário</span>
            </li>
          </ul>

          <button type="button" className={styles.goldPlanBtn} onClick={onChoosePlan}>
            <AutoAwesomeIcon sx={{ fontSize: 18 }} />
            <span>Garantir Vantagem no Beta</span>
          </button>
        </div>
      </div>
    </div>
  );
}
