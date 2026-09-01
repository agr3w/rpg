// src/Utils/fogUtils.js

/**
 * Cria ou reinicializa um canvas de Nevoa de Guerra preenchido com a cor de sombra
 */
export function createFogCanvas(width, height, fogColor = "rgba(10, 12, 20, 0.95)") {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, width);
  canvas.height = Math.max(1, height);
  const ctx = canvas.getContext("2d");
  fillFog(ctx, width, height, fogColor);
  return canvas;
}

/**
 * Preenche todo o canvas com sombra
 */
export function fillFog(fogCtx, width, height, fogColor = "rgba(10, 12, 20, 0.95)") {
  if (!fogCtx) return;
  fogCtx.save();
  fogCtx.globalCompositeOperation = "source-over";
  fogCtx.fillStyle = fogColor;
  fogCtx.fillRect(0, 0, width, height);
  fogCtx.restore();
}

/**
 * Limpa toda a sombra (revela todo o mapa)
 */
export function clearFog(fogCtx, width, height) {
  if (!fogCtx) return;
  fogCtx.save();
  fogCtx.clearRect(0, 0, width, height);
  fogCtx.restore();
}

/**
 * Revela uma area circular na nevoa usando destination-out (modo borracha)
 */
export function revealFogCircle(fogCtx, x, y, radius) {
  if (!fogCtx) return;
  fogCtx.save();
  fogCtx.globalCompositeOperation = "destination-out";
  fogCtx.beginPath();
  fogCtx.arc(x, y, radius, 0, Math.PI * 2);
  fogCtx.fill();
  fogCtx.restore();
}

/**
 * Esconde/Restaura uma area circular na nevoa
 */
export function hideFogCircle(fogCtx, x, y, radius, fogColor = "rgba(10, 12, 20, 0.95)") {
  if (!fogCtx) return;
  fogCtx.save();
  fogCtx.globalCompositeOperation = "source-over";
  fogCtx.fillStyle = fogColor;
  fogCtx.beginPath();
  fogCtx.arc(x, y, radius, 0, Math.PI * 2);
  fogCtx.fill();
  fogCtx.restore();
}

/**
 * Revela uma area retangular na nevoa
 */
export function revealFogRect(fogCtx, x, y, width, height) {
  if (!fogCtx) return;
  fogCtx.save();
  fogCtx.globalCompositeOperation = "destination-out";
  fogCtx.fillRect(x, y, width, height);
  fogCtx.restore();
}

/**
 * Esconde/Restaura uma area retangular na nevoa
 */
export function hideFogRect(fogCtx, x, y, width, height, fogColor = "rgba(10, 12, 20, 0.95)") {
  if (!fogCtx) return;
  fogCtx.save();
  fogCtx.globalCompositeOperation = "source-over";
  fogCtx.fillStyle = fogColor;
  fogCtx.fillRect(x, y, width, height);
  fogCtx.restore();
}
