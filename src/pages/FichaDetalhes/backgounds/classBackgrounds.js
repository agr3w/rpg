// Carrega apenas as imagens WebP otimizadas da pasta (Vite)
const images = import.meta.glob("./*.webp", {
  eager: true,
  import: "default",
});

function findByFileName(fileName) {
  const entry = Object.entries(images).find(([path]) => path.endsWith(`/${fileName}`));
  return entry ? entry[1] : "";
}

function normalizeKey(str) {
  return String(str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .toLowerCase()
    .trim();
}

// Mapeie suas classes (PT-BR) -> arquivo WebP ultraleve existente na pasta
const CLASS_TO_FILE = {
  barbaro: "Barbarian.webp",
  bardo: "bard.webp",
  clerigo: "cleric.webp",
  druida: "Druid.webp",
  monge: "Monk.webp",
  paladino: "Paladin.webp",
  patrulheiro: "Ranger.webp",
  ladino: "Rogue.webp",
  feiticeiro: "Sorcerer.webp",
  bruxo: "Warlock.webp",
  guerreiro: "Fighter.webp",
};

export function getClassBackgroundUrl(classeNome) {
  const key = normalizeKey(classeNome);
  const file = CLASS_TO_FILE[key];
  if (!file) return "";
  return findByFileName(file);
}