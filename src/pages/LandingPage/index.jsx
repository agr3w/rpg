// src/pages/LandingPage/index.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import LandingNav from "./components/LandingNav";
import HeroSection from "./components/HeroSection";
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
      {/* CAMADA DE ILUMINAÇÃO E AMBIÊNCIA */}
      <div className={styles.ambientBackground} />

      {/* NAVBAR PÚBLICA FIXA */}
      <LandingNav
        onLogin={handleGoToLogin}
        onRegister={handleGoToRegister}
      />

      {/* CONTEÚDO PRINCIPAL */}
      <main>
        {/* HERO SECTION */}
        <HeroSection onStart={handleGoToRegister} />

        {/* DEMONSTRAÇÃO DOS RECURSOS (SHOWCASE INTERATIVO) */}
        <section id="recursos">
          <FeatureShowcase />
        </section>

        {/* DESTAQUE VTT & NÉVOA DE GUERRA */}
        <section id="vtt">
          <VttHighlightSection onTestVtt={handleGoToRegister} />
        </section>

        {/* TABELA DE PLANOS & BETA GRATUITA */}
        <section id="precos">
          <PricingSection onChoosePlan={handleGoToRegister} />
        </section>

        {/* SOBRE O PROJETO & FILOSOFIA */}
        <section id="sobre">
          <AboutSection />
        </section>

        {/* PERGUNTAS FREQUENTES (FAQ) */}
        <section id="faq">
          <FaqSection />
        </section>
      </main>

      {/* RODAPÉ INSTITUCIONAL & AVISO OGL/SRD 5.1 */}
      <LandingFooter />
    </div>
  );
}
