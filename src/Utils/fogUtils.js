// src/Utils/fogUtils.js

/**
 * Preenche todo o canvas com a névoa virgem (Blackout)
 */
export function resetFog(ctx, width, height, fogColor = "rgba(5, 7, 12, 1)") {
  if (!ctx) return;
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = fogColor;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

/**
 * Limpa toda a névoa (revela todo o mapa)
 */
export function clearFog(ctx, width, height) {
  if (!ctx) return;
  ctx.save();
  ctx.clearRect(0, 0, width, height);
  ctx.restore();
}

/**
 * Cria ou reinicializa um canvas de Névoa de Guerra
 */
export function createFogCanvas(width, height, filled = false, fogColor = "rgba(5, 7, 12, 1)") {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, width);
  canvas.height = Math.max(1, height);
  const ctx = canvas.getContext("2d");
  if (filled) {
    resetFog(ctx, width, height, fogColor);
  } else {
    clearFog(ctx, width, height);
  }
  return canvas;
}

/**
 * Revela uma área circular (Pincel livre do Mestre)
 */
export function revealCircle(ctx, x, y, radius) {
  if (!ctx) return;
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * Oculta novamente uma área circular (Mestre cobrindo com sombra)
 */
export function hideCircle(ctx, x, y, radius, fogColor = "rgba(5, 7, 12, 1)") {
  if (!ctx) return;
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = fogColor;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * Revela sala retangular com Snap (Caixa do Mestre)
 */
export function revealRect(ctx, x, y, width, height) {
  if (!ctx) return;
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillRect(x, y, width, height);
  ctx.restore();
}

/**
 * Oculta sala retangular (Caixa do Mestre)
 */
export function hideRect(ctx, x, y, width, height, fogColor = "rgba(5, 7, 12, 1)") {
  if (!ctx) return;
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = fogColor;
  ctx.fillRect(x, y, width, height);
  ctx.restore();
}

/**
 * Projeta um Cone de Visão Direcional de Token (Lanterna / Tocha / Campo de Visão)
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} x - Posição X do token
 * @param {number} y - Posição Y do token
 * @param {number} radius - Alcance da visão em pixels (ex: 60ft)
 * @param {number} rotationAngleDeg - Ângulo para onde o token está olhando (0 a 360)
 * @param {number} coneAngleDeg - Abertura do cone (ex: 60°, 90°, 120° ou 360° para circular)
 */
export function revealVisionCone(ctx, x, y, radius, rotationAngleDeg = 0, coneAngleDeg = 90) {
  if (!ctx) return;
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";

  const rotRad = (rotationAngleDeg * Math.PI) / 180;
  const coneHalfRad = ((coneAngleDeg / 2) * Math.PI) / 180;

  ctx.beginPath();
  ctx.moveTo(x, y);

  if (coneAngleDeg >= 360) {
    ctx.arc(x, y, radius, 0, Math.PI * 2);
  } else {
    const startAngle = rotRad - coneHalfRad;
    const endAngle = rotRad + coneHalfRad;
    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.closePath();
  }

  // Gradiente radial para suavizar a transição da borda da luz
  const gradient = ctx.createRadialGradient(x, y, radius * 0.7, x, y, radius);
  gradient.addColorStop(0, "rgba(0, 0, 0, 1)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = gradient;

  ctx.fill();
  ctx.restore();
}

// Aliases para compatibilidade
export const fillFog = resetFog;
export const revealFogCircle = revealCircle;
export const hideFogCircle = hideCircle;
export const revealFogRect = revealRect;
export const hideFogRect = hideRect;
