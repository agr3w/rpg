// src/pages/LandingPage/index.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import LandingNav from "./components/LandingNav";
import HeroSection from "./components/HeroSection";
import ParchmentDivider from "./components/ParchmentDivider";
import FeatureShowcase from "./components/FeatureShowcase";
import VttHighlightSection from "./components/VttHighlightSection";
import PricingSection from "./components/PricingSection";
import AboutSection from "./components/AboutSection";
import FaqSection from "./components/FaqSection";
import LandingFooter from "./components/LandingFooter";
import styles from "./LandingPage.module.css";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGoToLogin = () => navigate("/login");
  const handleGoToRegister = () => navigate("/Registrar-se");

  return (
    <div className={styles.landingWrapper}>
      {/* NAVBAR PÚBLICA FIXA ESTILO PERGAMINHO */}
      <LandingNav
        onLogin={handleGoToLogin}
        onRegister={handleGoToRegister}
      />

      {/* CONTEÚDO PRINCIPAL DO GRIMÓRIO */}
      <main>
        {/* HERO SECTION: O CHAMADO ÀS ARMAS */}
        <HeroSection onStart={handleGoToRegister} />

        {/* DIVISOR RÚNICO (VERMELHO - BRASA) */}
        <ParchmentDivider rune="ᛟ" dragonColor="#9E2A2B" />

        {/* O GRIMÓRIO ABERTO (SHOWCASE COM FITAS DRACÔNICAS) */}
        <section id="recursos">
          <FeatureShowcase />
        </section>

        {/* DIVISOR RÚNICO (AZUL - SAFIRA ARCANA) */}
        <ParchmentDivider rune="᚛" dragonColor="#1D4E89" />

        {/* DESTAQUE VTT & NÉVOA DE GUERRA */}
        <section id="vtt">
          <VttHighlightSection onTestVtt={handleGoToRegister} />
        </section>

        {/* DIVISOR RÚNICO (DOURADO - IMPERIAL) */}
        <ParchmentDivider rune="✦" dragonColor="#C89B3C" />

        {/* PACTOS & ACESSO (PREÇOS EM PERGAMINHO COM SELOS DE CERA) */}
        <section id="precos">
          <PricingSection onChoosePlan={handleGoToRegister} />
        </section>

        {/* DIVISOR RÚNICO (VERDE - ESMERALDA) */}
        <ParchmentDivider rune="ᛟ" dragonColor="#2D6A4F" />

        {/* SOBRE O TOMO & FILOSOFIA */}
        <section id="sobre">
          <AboutSection />
        </section>

        {/* DIVISOR RÚNICO (FERRO & PEDRA) */}
        <ParchmentDivider rune="✦" dragonColor="#7D5F42" />

        {/* PERGUNTAS FREQUENTES (FAQ) */}
        <section id="faq">
          <FaqSection />
        </section>
      </main>

      {/* ENCADERNAÇÃO & RODAPÉ COM AVISO OGL/SRD 5.1 */}
      <LandingFooter />
    </div>
  );
}
