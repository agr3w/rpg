export function normalizeKey(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function parseTags(raw, maxCount = 16) {
  return String(raw || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, maxCount);
}

export function fmtDate(ms) {
  if (!ms) return "—";
  try {
    return new Date(ms).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

export function fmtDateTime(ms) {
  if (!ms) return "";
  try {
    return new Date(ms).toLocaleString("pt-BR");
  } catch {
    return "";
  }
}

export function fmtMonth(ms) {
  if (!ms) return "Sem data";
  try {
    const d = new Date(ms);
    const label = d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
    return label.charAt(0).toUpperCase() + label.slice(1);
  } catch {
    return "Sem data";
  }
}
