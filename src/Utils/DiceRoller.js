import { classes } from "Array/RacaEClasse";

/**
 * Roll dice given notation like "2d4*10" or "5d4" or numeric string.
 * Returns integer.
 */
export function rollDiceNotation(notation) {
  if (notation == null) return 0;
  if (typeof notation === "number") return Math.round(notation);

  const str = String(notation).replace(/\s+/g, "").replace(/×/g, "*").replace(/x/gi, "*");

  // plain number?
  if (/^\d+$/.test(str)) return Number(str);

  // pattern NdM*mult or NdM
  const m = str.match(/^(\d+)d(\d+)(?:\*(\d+))?$/i);
  if (!m) return 0;

  const n = parseInt(m[1], 10);
  const sides = parseInt(m[2], 10);
  const mult = m[3] ? parseInt(m[3], 10) : 1;

  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += Math.floor(Math.random() * sides) + 1;
  }
  return Math.round(sum * mult);
}

/**
 * Recebe classKey (string) ou objeto de classe.
 * Procura no array de classes por nome se necessário e retorna número válido >=1.
 */
export function calcularRiquezaInicialPorClasse(classKeyOrObj) {
  if (!classKeyOrObj) return 1;
  let cls = null;

  if (typeof classKeyOrObj === "string") {
    cls = classes.find((c) => c.nome === classKeyOrObj);
  } else if (typeof classKeyOrObj === "object") {
    // pode ser já o objeto da classe
    if (classKeyOrObj.nome) {
      cls = classes.find((c) => c.nome === classKeyOrObj.nome) || classKeyOrObj;
    } else {
      cls = classKeyOrObj;
    }
  }

  // tenta obter propriedade riqueza no objeto
  const riquezaField = cls?.riqueza ?? cls?.initialGold ?? null;

  let result = 0;
  if (typeof riquezaField === "number") result = riquezaField;
  else if (typeof riquezaField === "string") result = rollDiceNotation(riquezaField);
  else result = 0;

  // fallback seguro mínimo 1
  if (!Number.isFinite(result) || result < 1) result = 1;
  return Math.round(result);
}

export default {
  rollDiceNotation,
  calcularRiquezaInicialPorClasse,
};
