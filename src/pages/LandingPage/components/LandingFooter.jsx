// src/pages/LandingPage/components/LandingFooter.jsx
import React from "react";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import styles from "../LandingPage.module.css";

export default function LandingFooter() {
  const handleScroll = (selector) => {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className={styles.landingFooter}>
      <div className={styles.footerInner}>
        {/* BRAND & MISSÃO */}
        <div className={styles.footerBrand}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <ShieldOutlinedIcon sx={{ color: "#f1c40f", fontSize: 22 }} />
            <h3 style={{ margin: 0 }}>RPG ORGANIZER</h3>
          </div>
          <p>A plataforma definitiva para mestres e jogadores de D&D 5ª Edição construírem lendas.</p>
        </div>

        {/* LINKS RÁPIDOS */}
        <div className={styles.footerLinks}>
          <a href="#recursos" onClick={(e) => { e.preventDefault(); handleScroll("#recursos"); }}>
            Recursos
          </a>
          <a href="#vtt" onClick={(e) => { e.preventDefault(); handleScroll("#vtt"); }}>
            Mesa Virtual (VTT)
          </a>
          <a href="#precos" onClick={(e) => { e.preventDefault(); handleScroll("#precos"); }}>
            Planos & Preços
          </a>
          <a href="#sobre" onClick={(e) => { e.preventDefault(); handleScroll("#sobre"); }}>
            Sobre o Projeto
          </a>
          <a href="#faq" onClick={(e) => { e.preventDefault(); handleScroll("#faq"); }}>
            Perguntas Frequentes
          </a>
        </div>
      </div>

      {/* AVISO LEGAL OGL / SRD 5.1 */}
      <div className={styles.oglNotice}>
        <p>
          Este projeto utiliza regras sob o System Reference Document 5.1 (SRD 5.1) licenciado sob a Open Game License
          (OGL 1.0a) da Wizards of the Coast LLC. Dungeons & Dragons e D&D são marcas registradas da Wizards of the
          Coast. Este produto não é afiliado, patrocinado ou endossado pela Wizards of the Coast.
        </p>
        <small>© {new Date().getFullYear()} RPG Organizer. Todos os direitos reservados.</small>
      </div>
    </footer>
  );
}
