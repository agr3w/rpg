import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  IconButton,
  Tooltip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Chip,
  FormControlLabel,
  Switch,
  alpha,
  useTheme,
  Stack,
  Divider,
} from "@mui/material";
import ShieldIcon from "@mui/icons-material/Shield";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import VisibilityIcon from "@mui/icons-material/Visibility";
import StarsIcon from "@mui/icons-material/Stars";
import CasinoIcon from "@mui/icons-material/Casino";
import SettingsIcon from "@mui/icons-material/Settings";

import ARMADURAS from "Array/Armaduras";

// Helper para cálculo da CA base da armadura
const computeCaBaseFromArmor = (armor, dexMod) => {
  if (!armor || armor.id === "nenhuma") return 10 + dexMod;
  if (armor.usaModDes) {
    const mod =
      typeof armor.limiteModDes === "number"
        ? Math.min(dexMod, armor.limiteModDes)
        : dexMod;
    return armor.caBase + mod;
  }
  return armor.caBase;
};

// Formatação inteligente de deslocamento (suporta 7.5m, 7,5m, 9m, etc.)
const formatDeslocamento = (val) => {
  if (!val) return { meters: "9m", feet: "30ft / Rodada" };
  const str = String(val).trim();
  const match = str.match(/(\d+([.,]\d+)?)/);
  if (!match) return { meters: "9m", feet: "30ft / Rodada" };
  const numStr = match[1].replace(",", ".");
  const metersNum = parseFloat(numStr);
  const feetNum = Math.round((metersNum / 1.5) * 5);
  return {
    meters: `${match[1]}m`,
    feet: `${feetNum}ft / Rodada`,
  };
};

export default function FichaCombatHud({
  caState = { base: 10, usaEscudo: false, total: 10, armorId: null, armorNome: "" },
  hpState = { max: 10, atual: 10, temp: 0 },
  dexMod = 0,
  conMod = 0,
  hitDie = 8,
  pendingLevels = 0,
  canRollLevelHp = true,
  deslocamento = "9 metros",
  profBonus = 2,
  passivePerception = 10,
  onArmorChange,
  onHpChange,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accentColor = theme.palette.secondary.main;
  const strokeColor = isDark ? "rgba(229,179,36,0.22)" : "rgba(131,60,11,0.22)";
  const cardBg = isDark ? "rgba(26, 18, 14, 0.88)" : "rgba(255, 252, 246, 0.94)";

  // Modais de armadura e edição de HP
  const [armorModalOpen, setArmorModalOpen] = useState(false);
  const [hpModalOpen, setHpModalOpen] = useState(false);

  // Estados locais para edição de HP
  const [editHp, setEditHp] = useState({
    max: hpState?.max || 1,
    atual: hpState?.atual || 1,
    temp: hpState?.temp || 0,
  });
  const [quickAmount, setQuickAmount] = useState("");

  // Cálculo da CA
  const baseCa = typeof caState.base === "number" ? caState.base : 10;
  const usaEscudo = !!caState.usaEscudo;
  const totalCa = baseCa + (usaEscudo ? 2 : 0);

  const selectedArmor =
    ARMADURAS.find((a) => a.id === caState.armorId) ||
    ARMADURAS.find((a) => a.id === "nenhuma") ||
    null;

  const handleToggleEscudo = (e) => {
    const checked = e.target.checked;
    const newTotal = baseCa + (checked ? 2 : 0);
    onArmorChange?.({
      ...caState,
      usaEscudo: checked,
      total: newTotal,
    });
  };

  const handleSelectArmor = (armor) => {
    const newBase = computeCaBaseFromArmor(armor, dexMod);
    const newTotal = newBase + (usaEscudo ? 2 : 0);
    onArmorChange?.({
      ...caState,
      armorId: armor.id,
      armorNome: armor.nome,
      base: newBase,
      total: newTotal,
    });
    setArmorModalOpen(false);
  };

  // Cálculos de HP e porcentagem
  const hpMax = Math.max(1, Number(hpState?.max || 1));
  const hpAtual = Number(hpState?.atual || 0);
  const hpTemp = Number(hpState?.temp || 0);
  const hpPercent = Math.max(0, Math.min(100, (hpAtual / hpMax) * 100));

  let hpBarColor = "#4caf50"; // Verde
  if (hpPercent <= 25) {
    hpBarColor = "#f44336"; // Vermelho crítico
  } else if (hpPercent <= 50) {
    hpBarColor = "#ff9800"; // Laranja
  }

  const handleQuickHpDelta = (delta) => {
    const nextAtual = Math.max(0, Math.min(hpMax, hpAtual + delta));
    onHpChange?.({
      ...hpState,
      atual: nextAtual,
    });
  };

  const handleApplyDamageOrHeal = (isHeal) => {
    const val = parseInt(quickAmount || "0", 10);
    if (!val || val <= 0) return;

    if (isHeal) {
      const nextAtual = Math.min(hpMax, hpAtual + val);
      onHpChange?.({ ...hpState, atual: nextAtual });
    } else {
      let damageRemaining = val;
      let nextTemp = hpTemp;
      if (nextTemp > 0) {
        if (damageRemaining <= nextTemp) {
          nextTemp -= damageRemaining;
          damageRemaining = 0;
        } else {
          damageRemaining -= nextTemp;
          nextTemp = 0;
        }
      }
      const nextAtual = Math.max(0, hpAtual - damageRemaining);
      onHpChange?.({
        ...hpState,
        atual: nextAtual,
        temp: nextTemp,
      });
    }
    setQuickAmount("");
  };

  const handleRollLevelUpHp = () => {
    if (!pendingLevels || hitDie <= 0 || !canRollLevelHp) return;
    const roll = Math.floor(Math.random() * hitDie) + 1;
    const ganho = Math.max(roll + conMod, 1);
    const updated = {
      max: hpMax + ganho,
      atual: hpAtual + ganho,
      temp: hpTemp,
    };
    onHpChange?.(updated, 1);
  };

  const handleSaveHpManual = () => {
    onHpChange?.({
      max: Number(editHp.max || 1),
      atual: Number(editHp.atual || 0),
      temp: Number(editHp.temp || 0),
    });
    setHpModalOpen(false);
  };

  const speedInfo = useMemo(() => formatDeslocamento(deslocamento), [deslocamento]);

  const commonCardSx = {
    p: { xs: 1.5, md: 1.75 },
    borderRadius: 3,
    border: `1px solid ${strokeColor}`,
    bgcolor: cardBg,
    backdropFilter: "blur(6px)",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    overflow: "hidden",
    transition: "transform 0.18s ease, box-shadow 0.18s ease",
    "&:hover": {
      boxShadow: isDark ? "0 8px 24px rgba(0,0,0,0.45)" : "0 6px 20px rgba(0,0,0,0.08)",
      borderColor: alpha(accentColor, 0.4),
    },
  };

  return (
    <Box sx={{ mb: 2.5 }}>
      <Grid container spacing={1.5}>
        {/* Card 1: Classe de Armadura (CA) */}
        <Grid item xs={12} sm={6} md={2.6}>
          <Paper elevation={0} sx={commonCardSx}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <ShieldIcon sx={{ color: accentColor, fontSize: 18 }} />
                  <Typography variant="caption" sx={{ fontWeight: 900, fontSize: "0.68rem", letterSpacing: 0.5, color: "text.secondary", whiteSpace: "nowrap" }}>
                    ARMADURA (CA)
                  </Typography>
                </Box>
                <Tooltip title="Alterar Armadura">
                  <IconButton size="small" onClick={() => setArmorModalOpen(true)} sx={{ p: 0.2 }}>
                    <SettingsIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Número Grande da CA */}
              <Box sx={{ textAlign: "center", my: 0.5 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: "Cinzel",
                    fontWeight: 900,
                    color: usaEscudo ? accentColor : "text.primary",
                    lineHeight: 1,
                    fontSize: { xs: "1.9rem", md: "2.1rem" },
                    textShadow: isDark ? "0 2px 10px rgba(0,0,0,0.6)" : "none",
                  }}
                >
                  {totalCa}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.68rem", mt: 0.25, display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {selectedArmor ? `${selectedArmor.nome}` : "Sem Armadura"}
                </Typography>
              </Box>
            </Box>

            {/* Switch de Escudo */}
            <Box
              sx={{
                pt: 0.75,
                borderTop: `1px solid ${strokeColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={usaEscudo}
                    onChange={handleToggleEscudo}
                    color="secondary"
                  />
                }
                label={
                  <Typography variant="caption" sx={{ fontWeight: 800, fontSize: "0.7rem", whiteSpace: "nowrap" }}>
                    Escudo (+2)
                  </Typography>
                }
                sx={{ m: 0 }}
              />
              <Button
                size="small"
                variant="text"
                onClick={() => setArmorModalOpen(true)}
                sx={{ fontSize: "0.68rem", p: 0, minWidth: "auto", color: accentColor, fontWeight: 700 }}
              >
                Trocar
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Card 2: Pontos de Vida (PV) */}
        <Grid item xs={12} sm={6} md={4.0}>
          <Paper elevation={0} sx={commonCardSx}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <FavoriteIcon sx={{ color: hpBarColor, fontSize: 18 }} />
                  <Typography variant="caption" sx={{ fontWeight: 900, fontSize: "0.68rem", letterSpacing: 0.5, color: "text.secondary" }}>
                    PONTOS DE VIDA (PV)
                  </Typography>
                </Box>
                <Tooltip title="Editar Vida Máxima e Temporária">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setEditHp({ max: hpMax, atual: hpAtual, temp: hpTemp });
                      setHpModalOpen(true);
                    }}
                    sx={{ p: 0.2 }}
                  >
                    <SettingsIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Medidor de PV Atual / Máx + Temp */}
              <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 0.75, my: 0.25 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: "Cinzel",
                    fontWeight: 900,
                    color: hpBarColor,
                    lineHeight: 1,
                    fontSize: { xs: "1.9rem", md: "2.1rem" },
                  }}
                >
                  {hpAtual}
                </Typography>
                <Typography variant="h6" sx={{ color: "text.secondary", fontFamily: "Cinzel", fontWeight: 700, fontSize: "1.1rem" }}>
                  / {hpMax}
                </Typography>
                {hpTemp > 0 && (
                  <Chip
                    label={`+${hpTemp} Temp`}
                    size="small"
                    color="primary"
                    sx={{ height: 18, fontSize: "0.7rem", fontWeight: 800 }}
                  />
                )}
              </Box>

              {/* Barra de Vida Dinâmica */}
              <LinearProgress
                variant="determinate"
                value={hpPercent}
                sx={{
                  height: 7,
                  borderRadius: 3.5,
                  bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                  mb: 1,
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 3.5,
                    bgcolor: hpBarColor,
                    boxShadow: `0 0 8px ${alpha(hpBarColor, 0.6)}`,
                  },
                }}
              />
            </Box>

            {/* Ações Rápidas de PV (Incremento, Dano/Cura, Level Up) */}
            <Box sx={{ pt: 0.75, borderTop: `1px solid ${strokeColor}` }}>
              {pendingLevels > 0 && canRollLevelHp ? (
                <Button
                  fullWidth
                  size="small"
                  variant="contained"
                  startIcon={<CasinoIcon />}
                  onClick={handleRollLevelUpHp}
                  sx={{
                    bgcolor: accentColor,
                    color: "#000",
                    fontWeight: 900,
                    fontSize: "0.72rem",
                    py: 0.4,
                    animation: "pulse 2s infinite",
                    "&:hover": { filter: "brightness(0.95)" },
                  }}
                >
                  Rolar +1d{hitDie} ({pendingLevels}x)
                </Button>
              ) : (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 0.5 }}>
                  {/* Botões Rápidos */}
                  <Stack direction="row" spacing={0.3}>
                    {[-5, -1, 1, 5].map((amt) => (
                      <Button
                        key={amt}
                        size="small"
                        variant="outlined"
                        onClick={() => handleQuickHpDelta(amt)}
                        sx={{
                          minWidth: 26,
                          px: 0.4,
                          py: 0.1,
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          borderColor: strokeColor,
                          color: amt < 0 ? "#ef5350" : "#66bb6a",
                        }}
                      >
                        {amt > 0 ? `+${amt}` : amt}
                      </Button>
                    ))}
                  </Stack>

                  {/* Input Rápido de Dano / Cura */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
                    <TextField
                      size="small"
                      placeholder="Qtd"
                      type="number"
                      value={quickAmount}
                      onChange={(e) => setQuickAmount(e.target.value.replace(/[^\d]/g, ""))}
                      inputProps={{ min: 1, style: { padding: "2px 4px", fontSize: "0.75rem", width: 32, textAlign: "center" } }}
                    />
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => handleApplyDamageOrHeal(false)}
                      disabled={!quickAmount}
                      sx={{ minWidth: 26, px: 0.6, py: 0.2, fontSize: "0.68rem", fontWeight: 800 }}
                    >
                      Dano
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      onClick={() => handleApplyDamageOrHeal(true)}
                      disabled={!quickAmount}
                      sx={{ minWidth: 26, px: 0.6, py: 0.2, fontSize: "0.68rem", fontWeight: 800 }}
                    >
                      Cura
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Card 3: Iniciativa */}
        <Grid item xs={4} sm={4} md={1.8}>
          <Paper elevation={0} sx={commonCardSx}>
            <Box sx={{ textAlign: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.3, mb: 0.25 }}>
                <FlashOnIcon sx={{ color: accentColor, fontSize: 16 }} />
                <Typography variant="caption" sx={{ fontWeight: 900, fontSize: "0.68rem", letterSpacing: 0.5, color: "text.secondary", whiteSpace: "nowrap" }}>
                  INICIATIVA
                </Typography>
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Cinzel",
                  fontWeight: 900,
                  color: dexMod >= 0 ? accentColor : "error.main",
                  lineHeight: 1,
                  my: 0.75,
                  fontSize: { xs: "1.75rem", md: "2.1rem" },
                }}
              >
                {dexMod >= 0 ? `+${dexMod}` : dexMod}
              </Typography>
            </Box>

            <Typography variant="caption" sx={{ textAlign: "center", color: "text.secondary", fontSize: "0.65rem", fontWeight: 700, pt: 0.5, borderTop: `1px solid ${strokeColor}`, whiteSpace: "nowrap" }}>
              Mod. Destreza
            </Typography>
          </Paper>
        </Grid>

        {/* Card 4: Deslocamento (Speed) */}
        <Grid item xs={4} sm={4} md={1.8}>
          <Paper elevation={0} sx={commonCardSx}>
            <Box sx={{ textAlign: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.3, mb: 0.25 }}>
                <DirectionsRunIcon sx={{ color: accentColor, fontSize: 16 }} />
                <Typography variant="caption" sx={{ fontWeight: 900, fontSize: "0.68rem", letterSpacing: 0.5, color: "text.secondary", whiteSpace: "nowrap" }}>
                  DESLOC.
                </Typography>
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Cinzel",
                  fontWeight: 900,
                  color: "text.primary",
                  lineHeight: 1,
                  my: 0.75,
                  fontSize: { xs: "1.75rem", md: "2.1rem" },
                }}
              >
                {speedInfo.meters}
              </Typography>
            </Box>

            <Typography variant="caption" sx={{ textAlign: "center", color: "text.secondary", fontSize: "0.65rem", fontWeight: 700, pt: 0.5, borderTop: `1px solid ${strokeColor}`, whiteSpace: "nowrap" }}>
              {speedInfo.feet}
            </Typography>
          </Paper>
        </Grid>

        {/* Card 5: Bônus de Proficiência & Percepção Passiva */}
        <Grid item xs={4} sm={4} md={1.8}>
          <Paper elevation={0} sx={commonCardSx}>
            <Box sx={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
              {/* Proficiência */}
              <Box sx={{ textAlign: "center", pb: 0.25 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.3 }}>
                  <StarsIcon sx={{ color: accentColor, fontSize: 14 }} />
                  <Typography variant="caption" sx={{ fontWeight: 900, color: "text.secondary", fontSize: "0.65rem", letterSpacing: 0.4, whiteSpace: "nowrap" }}>
                    PROFICIÊNCIA
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: accentColor, lineHeight: 1.1, mt: 0.2, fontSize: "1.25rem" }}>
                  +{profBonus}
                </Typography>
              </Box>

              <Divider sx={{ borderColor: strokeColor, my: 0.25 }} />

              {/* Percepção Passiva */}
              <Box sx={{ textAlign: "center", pt: 0.25 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.3 }}>
                  <VisibilityIcon sx={{ color: "text.secondary", fontSize: 14 }} />
                  <Typography variant="caption" sx={{ fontWeight: 900, color: "text.secondary", fontSize: "0.65rem", letterSpacing: 0.4, whiteSpace: "nowrap" }}>
                    PERCEPÇÃO
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: "text.primary", lineHeight: 1.1, mt: 0.2, fontSize: "1.25rem" }}>
                  {passivePerception}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Modal de Seleção de Armadura */}
      <Dialog
        open={armorModalOpen}
        onClose={() => setArmorModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: `1px solid ${strokeColor}`,
            bgcolor: isDark ? "#1c1410" : "#fffcf6",
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: "Cinzel", fontWeight: 900 }}>
          Selecionar Armadura
        </DialogTitle>
        <DialogContent dividers>
          <List dense>
            {ARMADURAS.filter((a) => a.categoria !== "Escudo").map((armor) => (
              <ListItemButton
                key={armor.id}
                selected={armor.id === (caState.armorId || "nenhuma")}
                onClick={() => handleSelectArmor(armor)}
                sx={{
                  borderRadius: 1.5,
                  mb: 0.5,
                  "&.Mui-selected": {
                    bgcolor: alpha(accentColor, 0.2),
                  },
                }}
              >
                <ListItemText
                  primary={`${armor.nome} (${armor.categoria})`}
                  secondary={`${armor.caFormula} • Força: ${armor.forcaMin ?? "—"} • Furtividade: ${armor.furtividade}`}
                  primaryTypographyProps={{ fontWeight: 700 }}
                />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setArmorModalOpen(false)} sx={{ color: "text.secondary" }}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Edição Manual de HP */}
      <Dialog
        open={hpModalOpen}
        onClose={() => setHpModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: `1px solid ${strokeColor}`,
            bgcolor: isDark ? "#1c1410" : "#fffcf6",
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: "Cinzel", fontWeight: 900 }}>
          Configurar Pontos de Vida
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="PV Máximo"
              type="number"
              value={editHp.max}
              onChange={(e) => setEditHp((prev) => ({ ...prev, max: e.target.value }))}
              fullWidth
              size="small"
            />
            <TextField
              label="PV Atual"
              type="number"
              value={editHp.atual}
              onChange={(e) => setEditHp((prev) => ({ ...prev, atual: e.target.value }))}
              fullWidth
              size="small"
            />
            <TextField
              label="PV Temporário"
              type="number"
              value={editHp.temp}
              onChange={(e) => setEditHp((prev) => ({ ...prev, temp: e.target.value }))}
              fullWidth
              size="small"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setHpModalOpen(false)} sx={{ color: "text.secondary" }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveHpManual}
            sx={{ bgcolor: accentColor, color: "#000", fontWeight: 800, "&:hover": { filter: "brightness(0.95)" } }}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
