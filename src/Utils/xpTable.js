export const XP_TABLE = {
  1: 0,
  2: 300,
  3: 900,
  4: 2700,
  5: 6500,
  6: 14000,
  7: 23000,
  8: 34000,
  9: 48000,
  10: 64000,
  11: 85000,
  12: 100000,
  13: 120000,
  14: 140000,
  15: 165000,
  16: 195000,
  17: 225000,
  18: 265000,
  19: 305000,
  20: 350000,
};

export function computeLevelFromXp(xp = 0) {
  const v = Number(xp || 0);
  for (let lvl = 20; lvl >= 1; lvl--) {
    if (v >= (XP_TABLE[lvl] ?? 0)) return lvl;
  }
  return 1;
}

export function nextLevelXp(level = 1) {
  const lvl = Number(level || 1);
  if (lvl >= 20) return XP_TABLE[20];
  return XP_TABLE[lvl + 1] ?? XP_TABLE[20];
}