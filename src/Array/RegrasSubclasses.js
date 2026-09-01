/**
 * Regras e Configurações de Sub-raças e Subclasses de D&D 5e
 * Arquivo: src/Array/RegrasSubclasses.js
 */

// Nível exato em que cada classe desbloqueia sua subclasse no D&D 5e
export const NIVEL_DESBLOQUEIO_SUBCLASSE = {
  "Clérigo": 1,     // Domínio Divino
  "Feiticeiro": 1,  // Origem de Feitiçaria
  "Bruxo": 1,       // Patrono Transcendental
  "Druida": 2,      // Círculo Druídico
  "Mago": 2,        // Tradição Arcana
  "Bárbaro": 3,     // Caminho Primitivo
  "Bardo": 3,       // Colégio de Bardo
  "Guerreiro": 3,   // Arquétipo Marcial
  "Ladino": 3,      // Arquétipo Ladino
  "Monge": 3,       // Tradição Monástica
  "Paladino": 3,    // Juramento Sagrado
  "Patrulheiro": 3, // Arquétipo de Patrulheiro
};

// Mapeamento de Sub-raças oficiais disponíveis
export const SUBRACAS_POR_RACA = {
  "Anão": ["Anão da Colina", "Anão da Montanha"],
  "Elfo": ["Alto Elfo", "Elfo da Floresta", "Drow (Elfo Negro)"],
  "Halfling": ["Pés Leves", "Robusto"],
  "Gnomo": ["Gnomo da Floresta", "Gnomo das Rochas"],
  "Humano": ["Humano Variante"],
  "Draconato": [],
  "Meio-Orc": [],
  "Meio-Elfo": [],
  "Tiefling": [],
};

// Mapeamento de Subclasses por Classe (Livro do Jogador D&D 5e)
export const SUBCLASSES_POR_CLASSE = {
  "Bardo": ["Colégio do Conhecimento", "Colégio da Bravura"],
  "Bárbaro": ["Caminho do Furioso", "Caminho do Guerreiro Totêmico"],
  "Bruxo": ["A Arquifada", "O Corruptor", "O Grande Antigo"],
  "Clérigo": [
    "Domínio do Conhecimento",
    "Domínio da Enganação",
    "Domínio da Guerra",
    "Domínio da Luz",
    "Domínio da Morte",
    "Domínio da Natureza",
    "Domínio da Tempestade",
    "Domínio da Vida",
  ],
  "Druida": ["Círculo da Terra", "Círculo da Lua"],
  "Feiticeiro": ["Linhagem Dracônica", "Magia Selvagem"],
  "Guerreiro": ["Campeão", "Mestre de Batalha", "Cavaleiro Arcano"],
  "Ladino": ["Assassino", "Ladrão", "Trapaceiro Arcano"],
  "Mago": [
    "Abjuração",
    "Adivinhação",
    "Conjuração",
    "Encantamento",
    "Evocação",
    "Ilusão",
    "Necromancia",
    "Transmutação",
  ],
  "Monge": ["Caminho da Mão Aberta", "Caminho da Sombra", "Caminho dos Quatro Elementos"],
  "Paladino": ["Juramento de Devoção", "Juramento dos Anciões", "Juramento de Vingança"],
  "Patrulheiro": [
    "Conclave do Caçador",
    "Conclave da Besta",
    "Conclave do Rastreador Subterrâneo",
  ],
};

/**
 * Retorna o status de necessidade de seleção de arquétipo/subclasse
 */
export function checarPendenciasSubclasse(ficha) {
  if (!ficha) {
    return {
      requerSubclasse: false,
      nivelRequerido: 3,
      pendente: false,
      opcoesDisponiveis: [],
    };
  }

  const classe = String(ficha.classe || "").trim();
  const nivel = Number(ficha.nivel || ficha.level) || 1;
  const nivelRequerido = NIVEL_DESBLOQUEIO_SUBCLASSE[classe] ?? 3;

  const requerSubclasse = nivel >= nivelRequerido && Boolean(classe);
  const subclasseAtual = ficha.subclasse || ficha.subClasse || "";
  const possuiSubclasse = Boolean(subclasseAtual && String(subclasseAtual).trim() !== "");

  // Localiza lista de subclasses suportadas (com correspondência flexível)
  const matchingClass = Object.keys(SUBCLASSES_POR_CLASSE).find(
    (c) => c.toLowerCase() === classe.toLowerCase()
  );
  const opcoesDisponiveis = matchingClass ? SUBCLASSES_POR_CLASSE[matchingClass] : [];

  return {
    requerSubclasse,
    nivelRequerido,
    pendente: requerSubclasse && !possuiSubclasse && opcoesDisponiveis.length > 0,
    opcoesDisponiveis,
    subclasseAtual,
  };
}

/**
 * Retorna o status de necessidade de seleção de sub-raça
 */
export function checarPendenciasSubraca(ficha) {
  if (!ficha) return { requerSubraca: false, opcoesDisponiveis: [] };

  const raca = String(ficha.raca || "").trim();
  const matchingRace = Object.keys(SUBRACAS_POR_RACA).find(
    (r) => r.toLowerCase() === raca.toLowerCase()
  );
  const opcoesDisponiveis = matchingRace ? SUBRACAS_POR_RACA[matchingRace] : [];
  const subracaAtual = ficha.subraca || ficha.subRaca || ficha.DetalhesDaRaça?.SubRaca || "";
  const possuiSubraca = Boolean(subracaAtual && String(subracaAtual).trim() !== "");

  return {
    requerSubraca: opcoesDisponiveis.length > 0,
    pendente: opcoesDisponiveis.length > 0 && !possuiSubraca,
    opcoesDisponiveis,
    subracaAtual,
  };
}
