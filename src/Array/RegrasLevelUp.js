// src/Array/RegrasLevelUp.js

export const DADO_VIDA_POR_CLASSE = {
  "Bárbaro": { dado: 12, media: 7 },
  "Guerreiro": { dado: 10, media: 6 },
  "Paladino": { dado: 10, media: 6 },
  "Patrulheiro": { dado: 10, media: 6 },
  "Bardo": { dado: 8, media: 5 },
  "Bruxo": { dado: 8, media: 5 },
  "Clérigo": { dado: 8, media: 5 },
  "Druida": { dado: 8, media: 5 },
  "Ladino": { dado: 8, media: 5 },
  "Monge": { dado: 8, media: 5 },
  "Feiticeiro": { dado: 6, media: 4 },
  "Mago": { dado: 6, media: 4 },
};

export const NIVEIS_ASI_POR_CLASSE = {
  "Guerreiro": [4, 6, 8, 12, 14, 16, 19],
  "Ladino": [4, 8, 10, 12, 16, 19],
  "Padrão": [4, 8, 12, 16, 19],
};

export function classeTemASI(classe, nivel) {
  const niveis = NIVEIS_ASI_POR_CLASSE[classe] || NIVEIS_ASI_POR_CLASSE["Padrão"];
  return niveis.includes(Number(nivel));
}

// Retorna as escolhas pendentes da classe para um determinado nível
export function getEscolhasClasseNivel(classe, nivel, ficha = {}) {
  const n = Number(nivel);
  const escolhas = [];

  // 1. Escolha de Subclasse / Arquétipo
  const nivelSubclasse =
    {
      "Clérigo": 1,
      "Feiticeiro": 1,
      "Bruxo": 1,
      "Druida": 2,
      "Mago": 2,
      "Bárbaro": 3,
      "Bardo": 3,
      "Guerreiro": 3,
      "Ladino": 3,
      "Monge": 3,
      "Paladino": 3,
      "Patrulheiro": 3,
    }[classe] || 3;

  if (n === nivelSubclasse && (!ficha.subclasse || ficha.subclasse.trim() === "")) {
    escolhas.push({
      tipo: "subclasse",
      titulo: "Escolha seu Arquétipo / Subclasse",
      descricao: "Você atingiu o nível de especialização da sua classe.",
    });
  }

  // 2. Escolhas Específicas
  if (classe === "Guerreiro" && n === 1) {
    escolhas.push({ tipo: "estilo_luta", titulo: "Escolha seu Estilo de Luta", qtd: 1 });
  }
  if (classe === "Paladino" && n === 2) {
    escolhas.push({ tipo: "estilo_luta_paladino", titulo: "Escolha seu Estilo de Luta", qtd: 1 });
  }
  if (classe === "Patrulheiro" && n === 2) {
    escolhas.push({ tipo: "estilo_luta_patrulheiro", titulo: "Escolha seu Estilo de Luta", qtd: 1 });
  }
  if (classe === "Feiticeiro" && n === 3) {
    escolhas.push({ tipo: "metamagica", titulo: "Escolha 2 Opções de Metamágica", qtd: 2 });
  }
  if (classe === "Bruxo" && n === 3) {
    escolhas.push({ tipo: "dadiva_pacto", titulo: "Escolha sua Dádiva do Pacto", qtd: 1 });
  }
  if (classe === "Bardo" && n === 3) {
    escolhas.push({ tipo: "aptidao", titulo: "Escolha 2 Perícias para Especialização", qtd: 2 });
  }
  if (classe === "Ladino" && n === 1) {
    escolhas.push({ tipo: "especializacao", titulo: "Escolha 2 Perícias para Especialização", qtd: 2 });
  }

  return escolhas;
}
