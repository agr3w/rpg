// src/pages/LandingPage/components/VttHighlightSection.jsx
import React from "react";
import { motion } from "framer-motion";
import BlurOnIcon from "@mui/icons-material/BlurOn";
import PersonIcon from "@mui/icons-material/Person";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import StraightenIcon from "@mui/icons-material/Straighten";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SecurityIcon from "@mui/icons-material/Security";
import styles from "../LandingPage.module.css";

export default function VttHighlightSection({ onTestVtt }) {
  return (
    <section className={styles.vttSection}>
      <div className={styles.vttGrid}>
        {/* LADO ESQUERDO: DETALHES TÁTICOS */}
        <motion.div
          className={styles.vttDetails}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.ancientBadge}>MESA DE JOGO VTT</span>
          <h3>A Verdadeira Experiência de Masmorra na Sua Tela</h3>
          <p>
            Construído para simular o suspense de explorar catacumbas desconhecidas. Cada token possui
            seu próprio campo de visão, e a névoa esconde perigos e emboscadas até que seja tarde demais.
          </p>

          <div className={styles.vttFeatureItem}>
            <div className={styles.vttFeatureIcon}>
              <BlurOnIcon />
            </div>
            <div className={styles.vttFeatureText}>
              <strong>Névoa de Guerra & Blackout Real</strong>
              <span>
                O Mestre enxerga a névoa translúcida com todas as armadilhas, enquanto os jogadores só
                veem o que a tocha de seus personagens ilumina.
              </span>
            </div>
          </div>

          <div className={styles.vttFeatureItem}>
            <div className={styles.vttFeatureIcon}>
              <PersonIcon />
            </div>
            <div className={styles.vttFeatureText}>
              <strong>Tokens Vivos com Mini Ficha HUD</strong>
              <span>
                Dê um duplo clique em qualquer token para abrir a gaveta tática com HP sincronizado, CA,
                ataques de armas e magias preparados.
              </span>
            </div>
          </div>

          <div className={styles.vttFeatureItem}>
            <div className={styles.vttFeatureIcon}>
              <LockOpenIcon />
            </div>
            <div className={styles.vttFeatureText}>
              <strong>Controle e Permissões por Jogador</strong>
              <span>
                Defina com precisão quem tem liberdade para movimentar cada criatura ou objeto do mapa
                com sincronização em milissegundos.
              </span>
            </div>
          </div>

          <div className={styles.vttFeatureItem}>
            <div className={styles.vttFeatureIcon}>
              <StraightenIcon />
            </div>
            <div className={styles.vttFeatureText}>
              <strong>Régua de Deslocamento Tático 5E</strong>
              <span>
                Calcule distâncias e áreas de efeito de magias no grid quadrado com métrica euclidiana oficial de D&D.
              </span>
            </div>
          </div>

          <button type="button" className={styles.heroCtaPrimary} onClick={onTestVtt} style={{ marginTop: "1.2rem" }}>
            <span>Experimentar Mesa Virtual</span>
            <ArrowForwardIcon sx={{ fontSize: 18 }} />
          </button>
        </motion.div>

        {/* LADO DIREITO: MOLDURA DO MAPA COM SELO */}
        <motion.div
          className={styles.vttVisualCard}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80"
            alt="Mesa Virtual VTT Tática"
            className={styles.vttVisualImg}
          />
          <div className={styles.vttParchmentSeal}>
            <SecurityIcon sx={{ fontSize: 16 }} />
            <span>Modo Emboscada Ativo</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
