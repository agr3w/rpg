// Centraliza quais imagens cada "elemento" pode usar.
// Troque/complete com as URLs/paths reais que você já tem no seu projeto.

export const ELEMENT_BACKGROUNDS = {
  parchment: [
    // Exemplo Vite:
    // new URL("../pages/FichaDetalhes/backgounds/imagens/parchment-1.png", import.meta.url).href,

    // Exemplo CRA/Webpack:
    // require("../pages/FichaDetalhes/backgounds/imagens/parchment-1.png"),
  ],

  fire: [
    // coloque aqui suas imagens "fire"
  ],

  lightning: [
    // ...
  ],

  poison: [
    // ...
  ],

  ice: [
    // ...
  ],

  void: [
    // ...
  ],
};

function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function pickBackgroundUrl({ element, pathname }) {
  const pool = ELEMENT_BACKGROUNDS[element] || [];
  if (!pool.length) return null;
  const idx = hashString(`${element}:${pathname}`) % pool.length;
  return pool[idx];
}

// Backgrounds por rota (Vite).
// Coloque as imagens em: src/assets/backgrounds/auth/

const AUTH_LOGIN = new URL("../assets/backgrounds/auth/login.jpg", import.meta.url).href;
const AUTH_REGISTER = new URL("../assets/backgrounds/auth/register.jpg", import.meta.url).href;
const AUTH_WELCOME = new URL("../assets/backgrounds/auth/welcome.jpg", import.meta.url).href;

export const ROUTE_BACKGROUND = {
  "/login": AUTH_LOGIN,
  "/Registrar-se": AUTH_REGISTER,
  "/BemVindo": AUTH_WELCOME,
};

export function getRouteBackgroundUrl(pathname) {
  return ROUTE_BACKGROUND[pathname] || null;
}