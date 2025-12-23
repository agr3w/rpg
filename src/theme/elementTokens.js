export const ROUTE_TO_ELEMENT = {
  "/": "parchment",
  "/fichas": "fire",
  "/criar-ficha": "fire",
  "/livros": "lightning",
  "/mapas": "poison",
  "/anotacoes": "ice",
  "/musicas": "void",
};

export function getElementFromPath(pathname) {
  const matched =
    Object.keys(ROUTE_TO_ELEMENT).find((path) =>
      path !== "/" ? pathname.startsWith(path) : pathname === "/"
    ) || "/musicas";

  return ROUTE_TO_ELEMENT[matched] || "void";
}

// CSS vars (cores “de ambiente”). Mantém desempenho: sem blur, sem animação obrigatória.
export const ELEMENT_VARS = {
  parchment: {
    "--rpg-accent": "#833c0b",
    "--rpg-accent2": "#bf8f00",
    "--rpg-ink": "#2c1a10",
    "--rpg-surface": "rgba(223,214,205,0.94)",
    "--rpg-navBg": "rgba(223,214,205,0.88)",
    "--rpg-stroke": "rgba(0,0,0,0.12)",

    // controle de intensidade das texturas
    "--rpg-woodOpacity": "0.10",
    "--rpg-ashOpacity": "0.10",
    "--rpg-emberOpacity": "0.06",

    "--rpg-cardPanelBg": "rgba(255,255,255,0.42)",
    "--rpg-cardText": "#2c1a10",
    "--rpg-cardTextMuted": "rgba(44,26,16,0.78)",
  },

  fire: {
    // ✅ madeira queimada + cinzas + brasa (texto claro em superfície escura)
    "--rpg-accent": "#b32d00",
    "--rpg-accent2": "#ffcc00",
    "--rpg-ink": "#f3ead6",                 // cinza/papel (legível no fundo escuro)
    "--rpg-surface": "rgba(22, 18, 16, 0.88)", // carvão mais “sólido”
    "--rpg-navBg": "rgba(18, 14, 12, 0.92)",
    "--rpg-stroke": "rgba(255,255,255,0.12)",

    "--rpg-woodOpacity": "0.28", // mais forte
    "--rpg-ashOpacity": "0.22",
    "--rpg-emberOpacity": "0.22",

    // ✅ painel de leitura no carvão
    "--rpg-cardPanelBg": "rgba(0,0,0,0.38)",
    "--rpg-cardText": "rgba(243,234,214,0.92)",
    "--rpg-cardTextMuted": "rgba(243,234,214,0.74)",
  },

  lightning: {
    "--rpg-accent": "#0044cc",
    "--rpg-accent2": "#ccffff",
    "--rpg-ink": "#0b1220",
    "--rpg-surface": "rgba(223,214,205,0.92)",
    "--rpg-navBg": "rgba(223,214,205,0.86)",
    "--rpg-stroke": "rgba(0,0,0,0.12)",

    "--rpg-woodOpacity": "0.10",
    "--rpg-ashOpacity": "0.08",
    "--rpg-emberOpacity": "0.06",

    "--rpg-cardPanelBg": "rgba(255,255,255,0.40)",
    "--rpg-cardText": "#2c1a10",
    "--rpg-cardTextMuted": "rgba(44,26,16,0.78)",
  },

  poison: {
    "--rpg-accent": "#228b22",
    "--rpg-accent2": "#adff2f",
    "--rpg-ink": "#0f2014",
    "--rpg-surface": "rgba(223,214,205,0.92)",
    "--rpg-navBg": "rgba(223,214,205,0.86)",
    "--rpg-stroke": "rgba(0,0,0,0.12)",

    "--rpg-woodOpacity": "0.10",
    "--rpg-ashOpacity": "0.08",
    "--rpg-emberOpacity": "0.06",

    "--rpg-cardPanelBg": "rgba(255,255,255,0.40)",
    "--rpg-cardText": "#2c1a10",
    "--rpg-cardTextMuted": "rgba(44,26,16,0.78)",
  },

  ice: {
    "--rpg-accent": "#4da6ff",
    "--rpg-accent2": "#ffffff",
    "--rpg-ink": "#0c1b2a",
    "--rpg-surface": "rgba(223,214,205,0.92)",
    "--rpg-navBg": "rgba(223,214,205,0.86)",
    "--rpg-stroke": "rgba(0,0,0,0.12)",

    "--rpg-woodOpacity": "0.10",
    "--rpg-ashOpacity": "0.08",
    "--rpg-emberOpacity": "0.06",

    "--rpg-cardPanelBg": "rgba(255,255,255,0.40)",
    "--rpg-cardText": "#2c1a10",
    "--rpg-cardTextMuted": "rgba(44,26,16,0.78)",
  },

  void: {
    "--rpg-accent": "#4B0082",
    "--rpg-accent2": "#9370DB",
    "--rpg-ink": "#12081a",
    "--rpg-surface": "rgba(223,214,205,0.92)",
    "--rpg-navBg": "rgba(223,214,205,0.86)",
    "--rpg-stroke": "rgba(0,0,0,0.12)",

    "--rpg-woodOpacity": "0.10",
    "--rpg-ashOpacity": "0.08",
    "--rpg-emberOpacity": "0.06",

    "--rpg-cardPanelBg": "rgba(255,255,255,0.40)",
    "--rpg-cardText": "#2c1a10",
    "--rpg-cardTextMuted": "rgba(44,26,16,0.78)",
  },
};