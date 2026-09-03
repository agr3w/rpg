// src/pages/LandingPage/components/LandingNav.jsx
import React, { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { Drawer, Box, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import styles from "../LandingPage.module.css";

export default function LandingNav({ onLogin, onRegister }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Detecção inteligente de rolagem:
  // - Esconde suavemente ao descer a página após passar do topo
  // - Revela instantaneamente com rolagem para cima para navegação rápida
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const diff = latest - previous;

    // Ativa sombra e formato compacto após 40px
    setScrolled(latest > 40);

    // Se rolar para baixo e já tiver passado do topo, oculta
    if (latest > 120 && diff > 4) {
      setHidden(true);
    } else if (diff < -4 || latest <= 50) {
      // Se rolar para cima ou estiver no topo, exibe
      setHidden(false);
    }
  });

  const navItems = [
    { label: "Grimório", href: "#recursos" },
    { label: "Mesa Virtual", href: "#vtt" },
    { label: "Pactos & Preços", href: "#precos" },
    { label: "Sobre o Tomo", href: "#sobre" },
    { label: "Dúvidas", href: "#faq" }
  ];

  const handleNavClick = (href) => {
    setMobileOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.header
      className={`${styles.navWrapper} ${scrolled ? styles.navScrolled : ""}`}
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: "-100%", opacity: 0 }
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.navContainer}>
        {/* LOGO OFICIAL COM O FAVICON DO PROJETO */}
        <div
          className={styles.navBrand}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          title="Voltar ao início"
        >
          <img src="/Favicon.png" alt="RPG Companion Logo" className={styles.brandLogoImg} />
          <span className={styles.navBrandTitle}>RPG COMPANION</span>
        </div>

        {/* LINKS PRINCIPAIS (DESKTOP) */}
        <nav className={styles.navLinks}>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.href);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* AÇÕES (LOGIN & REGISTRO) */}
        <div className={styles.navActions}>
          <button type="button" className={styles.loginBtn} onClick={onLogin}>
            Entrar
          </button>
          <button type="button" className={styles.registerBtn} onClick={onRegister}>
            <AutoAwesomeIcon sx={{ fontSize: 16 }} />
            <span>Criar Conta</span>
          </button>
          <button
            type="button"
            className={styles.mobileMenuToggle}
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir Menu de Navegação"
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {/* GAVETA MOBILE */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: 270,
            bgcolor: "#f7f1e1",
            color: "#2c1a0e",
            borderLeft: "2px solid #8c6e4d",
            p: 2
          }
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <img src="/Favicon.png" alt="Logo" style={{ width: 28, height: 28, objectFit: "contain" }} />
            <span style={{ fontFamily: "Cinzel", fontWeight: 700, color: "#2c1a0e", fontSize: "1.1rem" }}>
              MENU
            </span>
          </Box>
          <button
            onClick={() => setMobileOpen(false)}
            style={{ background: "transparent", border: "none", color: "#8c6e4d", cursor: "pointer" }}
            aria-label="Fechar Menu"
          >
            <CloseIcon />
          </button>
        </Box>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.href} disablePadding>
              <ListItemButton
                onClick={() => handleNavClick(item.href)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  "&:hover": { bgcolor: "rgba(140,110,70,0.15)", color: "#9e2a2b" }
                }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontFamily: "Cinzel", fontWeight: 700, fontSize: "0.94rem" }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 1.5 }}>
          <button className={styles.loginBtn} onClick={onLogin} style={{ width: "100%" }}>
            Entrar
          </button>
          <button className={styles.registerBtn} onClick={onRegister} style={{ width: "100%", justifyContent: "center" }}>
            Criar Conta
          </button>
        </Box>
      </Drawer>
    </motion.header>
  );
}
