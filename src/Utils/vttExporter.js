// src/Utils/vttExporter.js

/**
 * Exporta o mapa no formato Universal VTT (.dd2vtt) compativel com Foundry VTT, Roll20 e Owlbear Rodeo
 */
export function exportUniversalVTT(mapData, backgroundBase64) {
  const widthCells = Number(mapData.gridConfig?.width || mapData.widthCells || 20);
  const heightCells = Number(mapData.gridConfig?.height || mapData.heightCells || 15);
  const cellSize = Number(mapData.gridConfig?.cellSize || mapData.cellSize || 50);

  const cleanBase64 = (backgroundBase64 || "").replace(/^data:image\/[a-zA-Z+]+;base64,/, "");

  const universalVttJson = {
    format: 0.2,
    resolution: {
      map_origin: { x: 0, y: 0 },
      map_size: { x: widthCells, y: heightCells },
      pixels_per_grid: cellSize
    },
    image: cleanBase64,
    line_of_sight: mapData.walls || [],
    portals: mapData.portals || [],
    lights: mapData.lights || [],
    environment: {
      baked_lighting: true,
      ambient_light: mapData.ambientLight || "rgba(255,255,255,1)"
    }
  };

  const blob = new Blob([JSON.stringify(universalVttJson, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${mapData.name || "mapa"}.dd2vtt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Exporta o mapa renderizado em Imagem HD (PNG ou JPEG)
 */
export function exportMapImage(stage, filename = "mapa", format = "png", pixelRatio = 2) {
  if (!stage) return;

  const dataUrl = stage.toDataURL({
    pixelRatio: pixelRatio || 2,
    mimeType: format === "jpeg" || format === "jpg" ? "image/jpeg" : "image/png",
    quality: 0.95
  });

  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = `${filename}.${format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
