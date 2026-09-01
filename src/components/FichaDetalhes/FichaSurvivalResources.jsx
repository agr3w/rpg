import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  alpha,
  useTheme,
  Stack,
  Divider,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CasinoIcon from "@mui/icons-material/Casino";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import HotelIcon from "@mui/icons-material/Hotel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";

export default function FichaSurvivalResources({
  deathSaves = { successes: 0, failures: 0 },
  hitDie = 8,
  level = 1,
  hitDiceSpent = 0,
  conMod = 0,
  hpState = { max: 10, atual: 10, temp: 0 },
  moedas = { pc: 0, pp: 0, pe: 0, po: 0, pl: 0 },
  onChangeDeathSaves,
  onChangeHitDiceSpent,
  onHpChange,
  onSaveMoedas,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accentColor = theme.palette.secondary.main;
  const strokeColor = isDark ? "rgba(229,179,36,0.22)" : "rgba(131,60,11,0.22)";
  const cardBg = isDark ? "rgba(26, 18, 14, 0.88)" : "rgba(255, 252, 246, 0.94)";

  // Modal de edição de moedas
  const [coinsModalOpen, setCoinsModalOpen] = useState(false);
  const [editCoins, setEditCoins] = useState(moedas);

  // Total de Dados de Vida
  const totalHitDice = Math.max(1, Number(level || 1));
  const spentHitDice = Math.min(totalHitDice, Math.max(0, Number(hitDiceSpent || 0)));
  const availableHitDice = Math.max(0, totalHitDice - spentHitDice);

  // Manipulação de Salvaguardas contra a morte
  const handleToggleDeathSave = (type, index) => {
    if (!onChangeDeathSaves) return;
    const current = Number(deathSaves[type] || 0);
    // Se clicar no número atual, desmarca; se clicar num índice maior, marca até aquele índice
    const nextVal = current === index + 1 ? index : index + 1;
    onChangeDeathSaves({
      ...deathSaves,
      [type]: Math.max(0, Math.min(3, nextVal)),
    });
  };

  const handleResetDeathSaves = () => {
    onChangeDeathSaves?.({ successes: 0, failures: 0 });
  };

  // Descanso curto (gastar 1 dado de vida para curar)
  const handleShortRestSpend = () => {
    if (availableHitDice <= 0) return;
    const roll = Math.floor(Math.random() * hitDie) + 1;
    const healAmount = Math.max(1, roll + conMod);
    const nextAtual = Math.min(Number(hpState.max || 10), Number(hpState.atual || 0) + healAmount);

    onHpChange?.({
      ...hpState,
      atual: nextAtual,
    });
    onChangeHitDiceSpent?.(spentHitDice + 1);
  };

  // Descanso longo (recupera vida máxima, limpa temp e recupera metade dos dados de vida)
  const handleLongRest = () => {
    const recoveredDice = Math.max(1, Math.floor(totalHitDice / 2));
    const nextSpent = Math.max(0, spentHitDice - recoveredDice);

    onChangeHitDiceSpent?.(nextSpent);
    onChangeDeathSaves?.({ successes: 0, failures: 0 });
    onHpChange?.({
      ...hpState,
      atual: Number(hpState.max || 10),
      temp: 0,
    });
  };

  // Riqueza consolidada em Peças de Ouro (PO)
  const totalEmPO =
    (Number(moedas.pc || 0) / 100) +
    (Number(moedas.pp || 0) / 10) +
    (Number(moedas.pe || 0) / 2) +
    Number(moedas.po || 0) +
    (Number(moedas.pl || 0) * 10);

  const handleSaveCoinsModal = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onSaveMoedas?.(editCoins);
    setCoinsModalOpen(false);
  };

  const commonCardSx = {
    p: 2,
    borderRadius: 3,
    border: `1px solid ${strokeColor}`,
    bgcolor: cardBg,
    backdropFilter: "blur(6px)",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
  };

  return (
    <Box sx={{ mb: 2.5 }}>
      <Grid container spacing={2}>
        {/* Bloco C1: Salvaguardas Contra a Morte */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={commonCardSx}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <FavoriteBorderIcon sx={{ color: "error.main", fontSize: 20 }} />
                  <Typography variant="caption" sx={{ fontWeight: 900, letterSpacing: 0.8, color: "text.secondary" }}>
                    SALVAGUARDAS CONTRA A MORTE
                  </Typography>
                </Box>

                <Tooltip title="Resetar / Estabilizado">
                  <span>
                    <IconButton
                      type="button"
                      size="small"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleResetDeathSaves();
                      }}
                      disabled={!deathSaves.successes && !deathSaves.failures}
                      sx={{ p: 0.4 }}
                    >
                      <RestartAltIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>

              <Grid container spacing={1.5} sx={{ my: 0.5 }}>
                {/* Sucessos */}
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: "#66bb6a", fontWeight: 800, display: "block", mb: 0.75 }}>
                    SUCESSOS
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {[0, 1, 2].map((i) => {
                      const isChecked = (deathSaves.successes || 0) > i;
                      return (
                        <Box
                          key={`succ-${i}`}
                          onClick={() => handleToggleDeathSave("successes", i)}
                          sx={{
                            width: 26,
                            height: 26,
                            borderRadius: "50%",
                            border: `2px solid ${isChecked ? "#4caf50" : strokeColor}`,
                            bgcolor: isChecked ? "#4caf50" : "transparent",
                            boxShadow: isChecked ? "0 0 8px #4caf50" : "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.18s ease",
                            "&:hover": {
                              borderColor: "#4caf50",
                              transform: "scale(1.1)",
                            },
                          }}
                        >
                          {isChecked && <CheckCircleIcon sx={{ color: "#fff", fontSize: 16 }} />}
                        </Box>
                      );
                    })}
                  </Stack>
                </Grid>

                {/* Falhas */}
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: "#f44336", fontWeight: 800, display: "block", mb: 0.75 }}>
                    FALHAS
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {[0, 1, 2].map((i) => {
                      const isChecked = (deathSaves.failures || 0) > i;
                      return (
                        <Box
                          key={`fail-${i}`}
                          onClick={() => handleToggleDeathSave("failures", i)}
                          sx={{
                            width: 26,
                            height: 26,
                            borderRadius: "50%",
                            border: `2px solid ${isChecked ? "#f44336" : strokeColor}`,
                            bgcolor: isChecked ? "#f44336" : "transparent",
                            boxShadow: isChecked ? "0 0 8px #f44336" : "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.18s ease",
                            "&:hover": {
                              borderColor: "#f44336",
                              transform: "scale(1.1)",
                            },
                          }}
                        >
                          {isChecked && <CancelIcon sx={{ color: "#fff", fontSize: 16 }} />}
                        </Box>
                      );
                    })}
                  </Stack>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ pt: 1, borderTop: `1px solid ${strokeColor}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.72rem" }}>
                3 Sucessos = Estável | 3 Falhas = Morte
              </Typography>
              <Button
                type="button"
                size="small"
                variant="text"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleResetDeathSaves();
                }}
                disabled={!deathSaves.successes && !deathSaves.failures}
                sx={{ fontSize: "0.72rem", p: 0, minWidth: "auto", color: accentColor, fontWeight: 700 }}
              >
                Limpar
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Bloco C2: Dados de Vida & Descanso */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={commonCardSx}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <CasinoIcon sx={{ color: accentColor, fontSize: 20 }} />
                  <Typography variant="caption" sx={{ fontWeight: 900, letterSpacing: 0.8, color: "text.secondary" }}>
                    DADOS DE VIDA (HIT DICE)
                  </Typography>
                </Box>
                <Chip
                  label={`Total: ${totalHitDice}d${hitDie}`}
                  size="small"
                  sx={{ height: 20, fontSize: "0.72rem", fontWeight: 800, border: `1px solid ${strokeColor}` }}
                />
              </Box>

              <Box sx={{ textAlign: "center", my: 0.5 }}>
                <Typography variant="h4" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: availableHitDice > 0 ? accentColor : "text.secondary", lineHeight: 1 }}>
                  {availableHitDice}d{hitDie}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.5, display: "block" }}>
                  Disponíveis ({spentHitDice} gastos)
                </Typography>
              </Box>
            </Box>

            <Box sx={{ pt: 1, borderTop: `1px solid ${strokeColor}`, display: "flex", gap: 1 }}>
              <Button
                type="button"
                fullWidth
                size="small"
                variant="outlined"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleShortRestSpend();
                }}
                disabled={availableHitDice <= 0}
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  borderColor: strokeColor,
                  py: 0.4,
                  "&:hover": { borderColor: accentColor },
                }}
              >
                Gastar 1d{hitDie}
              </Button>

              <Tooltip title="Recupera vida e metade dos dados de vida">
                <Button
                  type="button"
                  fullWidth
                  size="small"
                  variant="outlined"
                  startIcon={<HotelIcon fontSize="small" />}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleLongRest();
                  }}
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    borderColor: strokeColor,
                    color: accentColor,
                    py: 0.4,
                    "&:hover": { borderColor: accentColor, bgcolor: alpha(accentColor, 0.1) },
                  }}
                >
                  Descanso Longo
                </Button>
              </Tooltip>
            </Box>
          </Paper>
        </Grid>

        {/* Bloco C3: Bolsa de Moedas (Riqueza) */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={commonCardSx}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <MonetizationOnIcon sx={{ color: "#ffd700", fontSize: 20 }} />
                  <Typography variant="caption" sx={{ fontWeight: 900, letterSpacing: 0.8, color: "text.secondary" }}>
                    BOLSA DE MOEDAS
                  </Typography>
                </Box>
                <Tooltip title="Editar Moedas">
                  <IconButton
                    type="button"
                    size="small"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setEditCoins(moedas);
                      setCoinsModalOpen(true);
                    }}
                    sx={{ p: 0.4 }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Linha Compacta de Moedas */}
              <Stack direction="row" spacing={0.75} sx={{ my: 0.5, flexWrap: "wrap", justifyContent: "space-between" }}>
                <Chip
                  label={`${moedas.pc || 0} PC`}
                  size="small"
                  sx={{ fontWeight: 800, bgcolor: "rgba(184, 115, 51, 0.15)", color: "#d7995b", border: "1px solid rgba(184, 115, 51, 0.3)" }}
                />
                <Chip
                  label={`${moedas.pp || 0} PP`}
                  size="small"
                  sx={{ fontWeight: 800, bgcolor: "rgba(192, 192, 192, 0.15)", color: "#cfd8dc", border: "1px solid rgba(192, 192, 192, 0.3)" }}
                />
                <Chip
                  label={`${moedas.pe || 0} PE`}
                  size="small"
                  sx={{ fontWeight: 800, bgcolor: "rgba(0, 188, 212, 0.12)", color: "#80deea", border: "1px solid rgba(0, 188, 212, 0.3)" }}
                />
                <Chip
                  label={`${moedas.po || 0} PO`}
                  size="small"
                  sx={{ fontWeight: 900, bgcolor: "rgba(255, 215, 0, 0.18)", color: "#ffd700", border: "1px solid rgba(255, 215, 0, 0.4)", boxShadow: "0 0 8px rgba(255,215,0,0.2)" }}
                />
                <Chip
                  label={`${moedas.pl || 0} PL`}
                  size="small"
                  sx={{ fontWeight: 800, bgcolor: "rgba(229, 228, 226, 0.15)", color: "#e0e0e0", border: "1px solid rgba(229, 228, 226, 0.3)" }}
                />
              </Stack>
            </Box>

            <Box sx={{ pt: 1, borderTop: `1px solid ${strokeColor}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
                Total: <strong style={{ color: "#ffd700" }}>{totalEmPO.toFixed(2)} PO</strong>
              </Typography>
              <Button
                type="button"
                size="small"
                variant="text"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setEditCoins(moedas);
                  setCoinsModalOpen(true);
                }}
                sx={{ fontSize: "0.72rem", p: 0, minWidth: "auto", color: accentColor, fontWeight: 700 }}
              >
                Gerenciar
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Modal de Edição de Moedas */}
      <Dialog
        open={coinsModalOpen}
        onClose={() => setCoinsModalOpen(false)}
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
          Bolsa de Moedas (Riqueza)
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={6}>
              <TextField
                label="Peças de Cobre (PC)"
                type="number"
                value={editCoins.pc}
                onChange={(e) => setEditCoins((p) => ({ ...p, pc: e.target.value.replace(/[^\d]/g, "") }))}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Peças de Prata (PP)"
                type="number"
                value={editCoins.pp}
                onChange={(e) => setEditCoins((p) => ({ ...p, pp: e.target.value.replace(/[^\d]/g, "") }))}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Peças de Electro (PE)"
                type="number"
                value={editCoins.pe}
                onChange={(e) => setEditCoins((p) => ({ ...p, pe: e.target.value.replace(/[^\d]/g, "") }))}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Peças de Ouro (PO)"
                type="number"
                value={editCoins.po}
                onChange={(e) => setEditCoins((p) => ({ ...p, po: e.target.value.replace(/[^\d]/g, "") }))}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Peças de Platina (PL)"
                type="number"
                value={editCoins.pl}
                onChange={(e) => setEditCoins((p) => ({ ...p, pl: e.target.value.replace(/[^\d]/g, "") }))}
                fullWidth
                size="small"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button type="button" onClick={() => setCoinsModalOpen(false)} sx={{ color: "text.secondary" }}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="contained"
            onClick={handleSaveCoinsModal}
            sx={{ bgcolor: accentColor, color: "#000", fontWeight: 800, "&:hover": { filter: "brightness(0.95)" } }}
          >
            Salvar Moedas
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
