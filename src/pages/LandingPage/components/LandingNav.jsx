// src/pages/LandingPage/components/LandingNav.jsx
import React, { useState } from "react";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { Drawer, Box, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import styles from "../LandingPage.module.css";

export default function LandingNav({ onLogin, onRegister }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Recursos", href: "#recursos" },
    { label: "Mesa Virtual (VTT)", href: "#vtt" },
    { label: "Planos & Preços", href: "#precos" },
    { label: "Sobre", href: "#sobre" },
    { label: "Dúvidas (FAQ)", href: "#faq" }
  ];

  const handleNavClick = (href) => {
    setMobileOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className={styles.navWrapper}>
      <div className={styles.navContainer}>
        {/* LOGO DA PLATAFORMA */}
        <div className={styles.navBrand} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <ShieldOutlinedIcon sx={{ color: "#f1c40f", fontSize: 26 }} />
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
            aria-label="Abrir Menu"
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
            width: 260,
            bgcolor: "#0d111a",
            color: "#e6edf3",
            borderLeft: "1px solid rgba(212,175,55,0.3)",
            p: 2
          }
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ShieldOutlinedIcon sx={{ color: "#f1c40f", fontSize: 22 }} />
            <span style={{ fontFamily: "Cinzel", fontWeight: 700, color: "#f1c40f" }}>MENU</span>
          </Box>
          <button
            onClick={() => setMobileOpen(false)}
            style={{ background: "transparent", border: "none", color: "#8b949e", cursor: "pointer" }}
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
                  "&:hover": { bgcolor: "rgba(212,175,55,0.1)", color: "#ffd700" }
                }}
              >
                <ListItemText primary={item.label} />
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
    </header>
  );
}
