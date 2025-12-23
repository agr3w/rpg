export function isValidEmail(email) {
  const v = String(email || "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export function getPasswordRuleError(pass) {
  const v = String(pass || "");
  if (!v) return "Informe a nova senha.";
  if (v.length < 8) return "A senha deve ter pelo menos 8 caracteres.";
  return "";
}