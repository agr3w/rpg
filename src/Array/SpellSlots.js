//// filepath: src/Array/SpellSlots.js

// Tabela de espaços de magia do CONJURADOR COMPLETO (nível 1–20)
// Usada por: Bardo, Clérigo, Druida, Mago, Feiticeiro.
// Índice do array: círculo 1..9 (posição 0 = 1º círculo)
const FULL_CASTER_SLOTS = {
  1:  [2, 0, 0, 0, 0, 0, 0, 0, 0],
  2:  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  3:  [4, 2, 0, 0, 0, 0, 0, 0, 0],
  4:  [4, 3, 0, 0, 0, 0, 0, 0, 0],
  5:  [4, 3, 2, 0, 0, 0, 0, 0, 0],
  6:  [4, 3, 3, 0, 0, 0, 0, 0, 0],
  7:  [4, 3, 3, 1, 0, 0, 0, 0, 0],
  8:  [4, 3, 3, 2, 0, 0, 0, 0, 0],
  9:  [4, 3, 3, 3, 1, 0, 0, 0, 0],
  10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
  11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
  12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
  13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
  14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
  15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
  16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
  17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
  18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
  19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
  20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
};

// Bruxo (Pacto Místico): todos os espaços do mesmo círculo
// level -> { slots, slotLevel }
const WARLOCK_PACT_TABLE = {
  1:  { slots: 1, slotLevel: 1 },
  2:  { slots: 2, slotLevel: 1 },
  3:  { slots: 2, slotLevel: 2 },
  4:  { slots: 2, slotLevel: 2 },
  5:  { slots: 2, slotLevel: 3 },
  6:  { slots: 2, slotLevel: 3 },
  7:  { slots: 2, slotLevel: 4 },
  8:  { slots: 2, slotLevel: 4 },
  9:  { slots: 2, slotLevel: 5 },
  10: { slots: 2, slotLevel: 5 },
  11: { slots: 3, slotLevel: 5 },
  12: { slots: 3, slotLevel: 5 },
  13: { slots: 3, slotLevel: 5 },
  14: { slots: 3, slotLevel: 5 },
  15: { slots: 3, slotLevel: 5 },
  16: { slots: 3, slotLevel: 5 },
  17: { slots: 4, slotLevel: 5 },
  18: { slots: 4, slotLevel: 5 },
  19: { slots: 4, slotLevel: 5 },
  20: { slots: 4, slotLevel: 5 },
};

// -------- helpers internos ----------

function getFullCasterSlots(level) {
  const lvl = Math.max(1, Math.min(20, Number(level) || 1));
  return FULL_CASTER_SLOTS[lvl] || null;
}

// Paladino / Patrulheiro: meio-conjuradores
// usam a tabela de conjurador completo com nível efetivo = ceil(nível / 2),
// mas só até o 5º círculo.
function getHalfCasterSlots(level) {
  const lvl = Math.max(1, Math.min(20, Number(level) || 1));
  const effective = Math.max(1, Math.ceil(lvl / 2));
  const full = FULL_CASTER_SLOTS[effective];
  if (!full) return null;

  // zera círculos acima do 5º
  const result = [...full];
  for (let i = 5; i < result.length; i += 1) {
    result[i] = 0;
  }
  return result;
}

// Bruxo: converte a tabela de pacto para o formato [c1..c9]
function getWarlockSlots(level) {
  const lvl = Math.max(1, Math.min(20, Number(level) || 1));
  const row = WARLOCK_PACT_TABLE[lvl];
  if (!row) return null;

  const arr = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  const index = Math.max(1, Math.min(9, row.slotLevel)) - 1;
  arr[index] = row.slots;
  return arr;
}

// -------- API pública ----------

export function getSpellSlots(classe, level) {
  const lvl = Math.max(1, Math.min(20, Number(level) || 1));

  switch (classe) {
    // conjuradores completos
    case "Bardo":
    case "Clérigo":
    case "Druida":
    case "Mago":
    case "Feiticeiro":
      return getFullCasterSlots(lvl);

    // meio-conjuradores
    case "Paladino":
    case "Patrulheiro":
      return getHalfCasterSlots(lvl);

    // pacto místico
    case "Bruxo":
      return getWarlockSlots(lvl);

    default:
      return null; // classes sem progressão automática
  }
}