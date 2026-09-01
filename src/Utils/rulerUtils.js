// src/Utils/rulerUtils.js

/**
 * Calcula a distancia tatica entre duas celulas segundo regras de D&D 5e e variantes
 */
export function calculateDistance(startCol, startRow, endCol, endRow, feetPerSquare = 5, variant = "5e-standard") {
  const dx = Math.abs(endCol - startCol);
  const dy = Math.abs(endRow - startRow);

  if (variant === "euclidean") {
    const distanceSquares = Math.sqrt(dx * dx + dy * dy);
    return Number((distanceSquares * feetPerSquare).toFixed(1));
  }

  if (variant === "5-10-5") {
    // Regra alternativa classica: 1a diagonal custa 5ft, 2a custa 10ft...
    const max = Math.max(dx, dy);
    const min = Math.min(dx, dy);
    const diagonals = min;
    const straight = max - min;
    const distanceFeet = (straight * feetPerSquare) + Math.floor(diagonals * 1.5) * feetPerSquare;
    return distanceFeet;
  }

  // Padrao 5e (RAW): Chebyshev (diagonais custam 5ft normalmente)
  return Math.max(dx, dy) * feetPerSquare;
}

/**
 * Formata a distancia em pes e metros
 */
export function formatDistance(distanceFeet, unit = "all") {
  const feet = Number(distanceFeet);
  const meters = (feet * 0.3).toFixed(1);

  if (unit === "m") {
    return `${meters}m`;
  }
  if (unit === "ft") {
    return `${feet}ft`;
  }
  return `${feet}ft (${meters}m)`;
}
