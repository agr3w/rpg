// Carrega todas as imagens da pasta (Vite)
const images = import.meta.glob("./*.{jpg,jpeg,png,webp}", {
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

// Mapeie suas classes (PT-BR) -> arquivo existente na pasta
const CLASS_TO_FILE = {
  barbaro: "Barbarian.jpg",
  bardo: "bard.jpg",
  clerigo: "cleric.jpg",
  druida: "Druid.jpg",
  monge: "Monk.jpg",
  paladino: "Paladin.jpg",
  patrulheiro: "Ranger.jpg",
  ladino: "Rogue.jpg",
  feiticeiro: "Sorcerer.jpg",
  bruxo: "Warlock.jpg",
  // se você tiver "Guerreiro" e existir imagem, adicione aqui:
  guerreiro: "Fighter.jpg",
};

export function getClassBackgroundUrl(classeNome) {
  const key = normalizeKey(classeNome);
  const file = CLASS_TO_FILE[key];
  if (!file) return "";
  return findByFileName(file);
}