// src/Utils/gridUtils.js

/**
 * Calcula a posicao com Snap ao Grid (centralizado na celula ou vertice)
 */
export function snapToGrid(x, y, cellSize, snapMode = "center") {
  const safeCellSize = Math.max(1, Number(cellSize) || 50);
  
  if (snapMode === "center") {
    const col = Math.floor(x / safeCellSize);
    const row = Math.floor(y / safeCellSize);
    return {
      x: col * safeCellSize + safeCellSize / 2,
      y: row * safeCellSize + safeCellSize / 2,
      col,
      row
    };
  }
  
  // Snap no vertice (canto superior esquerdo / intersecao)
  const col = Math.round(x / safeCellSize);
  const row = Math.round(y / safeCellSize);
  return {
    x: col * safeCellSize,
    y: row * safeCellSize,
    col,
    row
  };
}

/**
 * Converte coordenadas de pixels para indice de celula (coluna, linha)
 */
export function pointToCell(x, y, cellSize) {
  const safeCellSize = Math.max(1, Number(cellSize) || 50);
  return {
    col: Math.floor(x / safeCellSize),
    row: Math.floor(y / safeCellSize)
  };
}

/**
 * Converte indice de celula (col, row) para coordenadas em pixels
 */
export function cellToPoint(col, row, cellSize, snapMode = "center") {
  const safeCellSize = Math.max(1, Number(cellSize) || 50);
  if (snapMode === "center") {
    return {
      x: col * safeCellSize + safeCellSize / 2,
      y: row * safeCellSize + safeCellSize / 2
    };
  }
  return {
    x: col * safeCellSize,
    y: row * safeCellSize
  };
}

/**
 * Renderizador de Grid Otimizado em Canvas 2D
 */
export function drawGrid(ctx, width, height, cellSize, gridColor = "rgba(212, 175, 55, 0.25)", gridType = "square") {
  if (!ctx || width <= 0 || height <= 0 || cellSize <= 0) return;

  ctx.save();
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  ctx.beginPath();

  if (gridType === "square") {
    // Linhas verticais
    for (let x = 0; x <= width; x += cellSize) {
      ctx.moveTo(Math.floor(x) + 0.5, 0);
      ctx.lineTo(Math.floor(x) + 0.5, height);
    }
    // Linhas horizontais
    for (let y = 0; y <= height; y += cellSize) {
      ctx.moveTo(0, Math.floor(y) + 0.5);
      ctx.lineTo(width, Math.floor(y) + 0.5);
    }
  }

  ctx.stroke();
  ctx.restore();
}
