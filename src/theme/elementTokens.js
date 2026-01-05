import { alpha } from "@mui/material/styles";

export const ROUTE_TO_ELEMENT = {
  "/": "parchment",
  "/fichas": "fire",
  "/criar-ficha": "fire",
  "/ficha-completa": "fire",

  "/livros": "lightning",
  "/mapas": "poison",
  "/anotacoes": "ice",
  "/musicas": "void",
  "/Taverna-do-Bardo": "void",
  "/Biblioteca-Arcana": "ice",

  "/perfil": "lightning",
  "/diario": "parchment",
  "/quests": "parchment",
  "/npcs": "parchment",
};

export function getElementFromPath(pathname) {
  // Match exato
  if (ROUTE_TO_ELEMENT[pathname]) return ROUTE_TO_ELEMENT[pathname];
  
  // Match por prefixo (ex: /mapas/editor/123 -> poison)
  const keys = Object.keys(ROUTE_TO_ELEMENT);
  for (const key of keys) {
    if (key !== "/" && pathname.startsWith(key)) {
      return ROUTE_TO_ELEMENT[key];
    }
  }
  return "parchment";
}

// ✅ AQUI ESTÁ O SEGREDO: Definimos as variáveis CSS para cada elemento
export const ELEMENT_VARS = {
  parchment: {
    "--rpg-accent": "#833c0b",
    "--rpg-accent2": "#bf8f00",
    "--rpg-ink": "#2c1a10",
    "--rpg-navBg": "#fdfbf7", // Claro
    "--rpg-woodOpacity": "0.6",
    "--rpg-emberOpacity": "0.4",
    "--rpg-stroke": "rgba(0,0,0,0.12)",
  },
  fire: {
    "--rpg-accent": "#ffcc00",
    "--rpg-accent2": "#ff4500",
    "--rpg-ink": "#2a0505",
    "--rpg-navBg": "#2a0505", // Escuro avermelhado
    "--rpg-woodOpacity": "0.8",
    "--rpg-emberOpacity": "0.6",
    "--rpg-stroke": "rgba(255, 100, 0, 0.3)",
  },
  poison: {
    "--rpg-accent": "#adff2f",
    "--rpg-accent2": "#228b22",
    "--rpg-ink": "#061a06",
    "--rpg-navBg": "#0a140a", // Escuro esverdeado
    "--rpg-woodOpacity": "0.7",
    "--rpg-emberOpacity": "0.5",
    "--rpg-stroke": "rgba(50, 205, 50, 0.3)",
  },
  ice: {
    "--rpg-accent": "#00ffff",
    "--rpg-accent2": "#0044cc",
    "--rpg-ink": "#08131f",
    "--rpg-navBg": "#08131f", // Azul profundo
    "--rpg-woodOpacity": "0.5",
    "--rpg-emberOpacity": "0.7",
    "--rpg-stroke": "rgba(100, 200, 255, 0.3)",
  },
  lightning: {
    "--rpg-accent": "#ccffff",
    "--rpg-accent2": "#ffd700",
    "--rpg-ink": "#06061a",
    "--rpg-navBg": "#0a0a20", // Roxo elétrico escuro
    "--rpg-woodOpacity": "0.6",
    "--rpg-emberOpacity": "0.8",
    "--rpg-stroke": "rgba(200, 200, 255, 0.3)",
  },
  void: {
    "--rpg-accent": "#9370DB",
    "--rpg-accent2": "#4B0082",
    "--rpg-ink": "#e0e0e0",
    "--rpg-navBg": "#05000a", // Quase preto
    "--rpg-woodOpacity": "0.4",
    "--rpg-emberOpacity": "0.6",
    "--rpg-stroke": "rgba(147, 112, 219, 0.3)",
  },
};