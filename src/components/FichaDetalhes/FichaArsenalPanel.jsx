import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  alpha,
  useTheme,
  Divider,
  Alert,
} from "@mui/material";
import SportsKabaddiIcon from "@mui/icons-material/SportsKabaddi";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CasinoIcon from "@mui/icons-material/Casino";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import CloseIcon from "@mui/icons-material/Close";

const ATTR_OPTIONS = [
  "Força",
  "Destreza",
  "Constituição",
  "Inteligência",
  "Sabedoria",
  "Carisma",
];

const DAMAGE_TYPES = [
  "Cortante",
  "Perfurante",
  "Concussão",
  "Fogo",
  "Frio",
  "Elétrico",
  "Ácido",
  "Veneno",
  "Radiante",
  "Necrótico",
  "Psíquico",
  "Trovejante",
  "Força",
];

const DAMAGE_DICE_OPTIONS = [
  "1d4",
  "1d6",
  "1d8",
  "1d10",
  "1d12",
  "2d6",
  "2d4",
  "3d6",
  "1d20",
];

const WEAPON_PROPERTIES = [
  { id: "agil", label: "Ágil (Usa DES ou FOR)" },
  { id: "alcance", label: "Alcance (+1.5m)" },
  { id: "arremesso", label: "Arremesso" },
  { id: "duasMaos", label: "Duas Mãos" },
  { id: "leve", label: "Leve (Combate com duas armas)" },
  { id: "pesada", label: "Pesada" },
  { id: "recarga", label: "Recarga" },
  { id: "versatil", label: "Versátil" },
  { id: "municao", label: "Munição" },
];

export default function FichaArsenalPanel({
  equipped = {},
  abilityMods = {},
  level = 1,
  onChangeEquipped,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Cores temáticas do Arsenal (Cobre/Carmesim de Combate)
  const combatColor = isDark ? "#ff7043" : "#d84315";
  const combatBorder = isDark ? "rgba(255, 112, 67, 0.3)" : "rgba(216, 67, 21, 0.25)";
  const strokeColor = isDark ? "rgba(229,179,36,0.2)" : "rgba(131,60,11,0.2)";
  const cardBg = isDark ? "rgba(28, 18, 14, 0.85)" : "rgba(255, 252, 246, 0.92)";

  const profBonus = useMemo(() => {
    const lvl = Math.max(1, Number(level || 1));
    return 2 + Math.floor((lvl - 1) / 4);
  }, [level]);

  // Lista de armas/ataques
  const weapons = useMemo(() => {
    return Object.entries(equipped || {})
      .filter(([_, item]) => item && (item.kind === "weapon" || !item.kind || item.damageDice))
      .map(([slotKey, item]) => ({ slotKey, ...item }));
  }, [equipped]);

  // Estado do Modal de Criação / Edição
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [weaponForm, setWeaponForm] = useState({
    name: "",
    category: "melee", // melee ou ranged
    attackStat: "Força",
    damageDice: "1d8",
    damageType: "Cortante",
    attackBonus: 0,
    proficiente: true,
    props: {},
    versatileDice: "1d10",
    notes: "",
  });

  // Estado do Resultado de Rolagem
  const [rollResult, setRollResult] = useState(null);

  const computeWeaponAttackBonus = (item) => {
    let stat = item.attackStat || "Força";
    if (item.props?.agil) {
      const forMod = Number(abilityMods["Força"] || 0);
      const desMod = Number(abilityMods["Destreza"] || 0);
      stat = desMod >= forMod ? "Destreza" : "Força";
    } else if (item.category === "ranged") {
      stat = "Destreza";
    }

    const mod = Number(abilityMods[stat] || 0);
    const prof = item.proficiente === false ? 0 : profBonus;
    const extra = Number(item.attackBonus || 0);
    return {
      total: mod + prof + extra,
      statUsed: stat,
      mod,
      prof,
      extra,
    };
  };

  const computeWeaponDamageBonus = (item) => {
    let stat = item.attackStat || "Força";
    if (item.props?.agil) {
      const forMod = Number(abilityMods["Força"] || 0);
      const desMod = Number(abilityMods["Destreza"] || 0);
      stat = desMod >= forMod ? "Destreza" : "Força";
    } else if (item.category === "ranged") {
      stat = "Destreza";
    }
    const mod = Number(abilityMods[stat] || 0);
    const extra = Number(item.attackBonus || 0);
    return mod + extra;
  };

  const handleOpenAddModal = () => {
    setEditingSlot(null);
    setWeaponForm({
      name: "",
      category: "melee",
      attackStat: "Força",
      damageDice: "1d8",
      damageType: "Cortante",
      attackBonus: 0,
      proficiente: true,
      props: {},
      versatileDice: "1d10",
      notes: "",
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (weapon) => {
    setEditingSlot(weapon.slotKey);
    setWeaponForm({
      name: weapon.name || "",
      category: weapon.category || "melee",
      attackStat: weapon.attackStat || "Força",
      damageDice: weapon.damageDice || "1d8",
      damageType: weapon.damageType || "Cortante",
      attackBonus: Number(weapon.attackBonus || 0),
      proficiente: weapon.proficiente !== false,
      props: { ...(weapon.props || {}) },
      versatileDice: weapon.versatileDice || "1d10",
      notes: weapon.notes || "",
    });
    setModalOpen(true);
  };

  const handleToggleProperty = (propId) => {
    setWeaponForm((prev) => ({
      ...prev,
      props: {
        ...prev.props,
        [propId]: !prev.props?.[propId],
      },
    }));
  };

  const handleSaveWeapon = () => {
    const name = weaponForm.name.trim();
    if (!name) return;

    const slotKey = editingSlot || `weapon_${Date.now()}`;
    const nextEquipped = {
      ...(equipped || {}),
      [slotKey]: {
        id: slotKey,
        kind: "weapon",
        name,
        category: weaponForm.category,
        attackStat: weaponForm.attackStat,
        damageDice: weaponForm.damageDice,
        damageType: weaponForm.damageType,
        attackBonus: Number(weaponForm.attackBonus || 0),
        proficiente: weaponForm.proficiente,
        props: weaponForm.props,
        versatileDice: weaponForm.versatileDice,
        notes: weaponForm.notes,
        createdAt: editingSlot ? (equipped?.[editingSlot]?.createdAt || Date.now()) : Date.now(),
      },
    };

    onChangeEquipped?.(nextEquipped);
    setModalOpen(false);
  };

  const handleDeleteWeapon = (slotKey) => {
    const next = { ...(equipped || {}) };
    delete next[slotKey];
    onChangeEquipped?.(next);
  };

  // Rolagem de Ataque e Dano
  const handleRollWeapon = (weapon) => {
    const d20 = Math.floor(Math.random() * 20) + 1;
    const { total: attackTotal, statUsed, mod, prof, extra } = computeWeaponAttackBonus(weapon);
    const totalHit = d20 + attackTotal;

    // Rola dados de dano
    const diceMatch = (weapon.damageDice || "1d8").match(/^(\d+)d(\d+)/i);
    const numDice = diceMatch ? parseInt(diceMatch[1], 10) : 1;
    const diceFaces = diceMatch ? parseInt(diceMatch[2], 10) : 8;

    let damageRolls = [];
    let damageDiceSum = 0;
    const multiplier = d20 === 20 ? numDice * 2 : numDice; // Crítico dobra os dados

    for (let i = 0; i < multiplier; i++) {
      const roll = Math.floor(Math.random() * diceFaces) + 1;
      damageRolls.push(roll);
      damageDiceSum += roll;
    }

    const damageBonus = computeWeaponDamageBonus(weapon);
    const totalDamage = Math.max(1, damageDiceSum + damageBonus);

    setRollResult({
      weaponName: weapon.name,
      d20,
      isCrit: d20 === 20,
      isFumble: d20 === 1,
      attackTotal,
      totalHit,
      statUsed,
      damageDice: weapon.damageDice,
      damageRolls,
      damageBonus,
      totalDamage,
      damageType: weapon.damageType,
    });
  };

  return (
    <Box>
      {/* Barra de Ação Superior */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SportsKabaddiIcon sx={{ color: combatColor, fontSize: 24 }} />
          <Typography variant="h6" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: isDark ? "#fff" : "#2c1a10" }}>
            Arsenal & Ataques de Combate
          </Typography>
          <Chip
            label={`${weapons.length} ${weapons.length === 1 ? "arma equipada" : "armas equipadas"}`}
            size="small"
            sx={{ fontWeight: 800, fontSize: "0.72rem", bgcolor: alpha(combatColor, 0.15), color: combatColor, border: `1px solid ${combatBorder}` }}
          />
        </Box>

        <Button
          size="small"
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleOpenAddModal}
          sx={{
            bgcolor: combatColor,
            color: "#fff",
            fontWeight: 800,
            fontSize: "0.78rem",
            px: 1.5,
            py: 0.5,
            "&:hover": { filter: "brightness(0.92)", bgcolor: combatColor },
          }}
        >
          Nova Arma / Ataque
        </Button>
      </Box>

      {/* Alerta de Resultado de Rolagem */}
      {rollResult && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 2.5,
            borderRadius: 3,
            border: `2px solid ${rollResult.isCrit ? "#4caf50" : rollResult.isFumble ? "#f44336" : combatColor}`,
            bgcolor: isDark ? "rgba(35, 20, 15, 0.95)" : "#fff5f0",
            boxShadow: `0 8px 24px ${alpha(combatColor, 0.25)}`,
            position: "relative",
          }}
        >
          <IconButton
            size="small"
            onClick={() => setRollResult(null)}
            sx={{ position: "absolute", top: 8, right: 8, color: "text.secondary" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <CasinoIcon sx={{ color: combatColor }} />
            <Typography variant="subtitle1" sx={{ fontFamily: "Cinzel", fontWeight: 900 }}>
              Ataque com {rollResult.weaponName}
            </Typography>
            {rollResult.isCrit && (
              <Chip label="ACERTO CRÍTICO! (DANO DOBRADO)" color="success" size="small" sx={{ fontWeight: 900 }} />
            )}
            {rollResult.isFumble && (
              <Chip label="FALHA CRÍTICA (1 NATURAL)" color="error" size="small" sx={{ fontWeight: 900 }} />
            )}
          </Box>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.04)", textAlign: "center" }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: "text.secondary", display: "block" }}>
                  TESTE DE ATAQUE (PARA ACERTAR)
                </Typography>
                <Typography variant="h4" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: rollResult.isCrit ? "#4caf50" : rollResult.isFumble ? "#f44336" : combatColor }}>
                  {rollResult.totalHit}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  d20 ({rollResult.d20}) + Bônus ({rollResult.attackTotal >= 0 ? `+${rollResult.attackTotal}` : rollResult.attackTotal})
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.04)", textAlign: "center" }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: "text.secondary", display: "block" }}>
                  DANO TOTAL ({rollResult.damageType})
                </Typography>
                <Typography variant="h4" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: "#e65100" }}>
                  {rollResult.totalDamage}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Dados [{rollResult.damageRolls.join(" + ")}] + Mod ({rollResult.damageBonus >= 0 ? `+${rollResult.damageBonus}` : rollResult.damageBonus})
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Lista de Cards de Armas */}
      {weapons.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            border: `1px dashed ${strokeColor}`,
            bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
          }}
        >
          <SportsKabaddiIcon sx={{ fontSize: 44, color: "text.secondary", opacity: 0.4, mb: 1 }} />
          <Typography variant="body1" sx={{ fontWeight: 800, color: "text.secondary" }}>
            Nenhuma arma ou ação de combate cadastrada.
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 2 }}>
            Cadastre suas armas para rolar ataques e calcular danos com 1 clique.
          </Typography>
          <Button
            size="small"
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleOpenAddModal}
            sx={{ borderColor: combatColor, color: combatColor, fontWeight: 800 }}
          >
            Adicionar Primeira Arma
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {weapons.map((weapon) => {
            const attackInfo = computeWeaponAttackBonus(weapon);
            const damageBonus = computeWeaponDamageBonus(weapon);
            const activeProps = Object.entries(weapon.props || {})
              .filter(([_, active]) => active)
              .map(([id]) => WEAPON_PROPERTIES.find((p) => p.id === id))
              .filter(Boolean);

            return (
              <Grid item xs={12} md={6} key={weapon.slotKey}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    border: `1px solid ${combatBorder}`,
                    bgcolor: cardBg,
                    backdropFilter: "blur(6px)",
                    position: "relative",
                    transition: "all 0.18s ease",
                    "&:hover": {
                      boxShadow: isDark ? "0 8px 24px rgba(0,0,0,0.4)" : "0 6px 20px rgba(0,0,0,0.08)",
                      borderColor: combatColor,
                    },
                  }}
                >
                  {/* Cabeçalho do Card */}
                  <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 1 }}>
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                        <Typography variant="h6" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: isDark ? "#fff" : "#2c1a10", lineHeight: 1.1 }}>
                          {weapon.name}
                        </Typography>
                        <Chip
                          label={weapon.category === "ranged" ? "À Distância" : "Corpo a Corpo"}
                          size="small"
                          sx={{ height: 20, fontSize: "0.68rem", fontWeight: 800, bgcolor: alpha(combatColor, 0.12), color: combatColor }}
                        />
                      </Box>
                      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
                        Atributo: {attackInfo.statUsed}
                      </Typography>
                    </Box>

                    {/* Botões de Ação */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Tooltip title="Editar Arma">
                        <IconButton size="small" onClick={() => handleOpenEditModal(weapon)}>
                          <EditIcon fontSize="small" sx={{ color: "text.secondary" }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Remover Arma">
                        <IconButton size="small" onClick={() => handleDeleteWeapon(weapon.slotKey)}>
                          <DeleteOutlineIcon fontSize="small" color="error" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  {/* Números Centrais: Acerto & Dano */}
                  <Grid container spacing={1.5} sx={{ my: 1 }}>
                    {/* Bônus de Acerto */}
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          p: 1.25,
                          borderRadius: 2,
                          bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                          border: `1px solid ${strokeColor}`,
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="caption" sx={{ fontWeight: 800, color: "text.secondary", display: "block" }}>
                          BÔNUS DE ATAQUE
                        </Typography>
                        <Typography variant="h5" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: combatColor }}>
                          {attackInfo.total >= 0 ? `+${attackInfo.total}` : attackInfo.total}
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: "0.65rem", color: "text.secondary" }}>
                          para acertar
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Dano & Tipo */}
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          p: 1.25,
                          borderRadius: 2,
                          bgcolor: isDark ? "rgba(255, 112, 67, 0.08)" : "rgba(216, 67, 21, 0.06)",
                          border: `1px solid ${combatBorder}`,
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="caption" sx={{ fontWeight: 800, color: combatColor, display: "block" }}>
                          DANO & TIPO
                        </Typography>
                        <Typography variant="h5" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: "#e65100" }}>
                          {weapon.damageDice} {damageBonus >= 0 ? `+ ${damageBonus}` : `- ${Math.abs(damageBonus)}`}
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: "0.65rem", color: "text.secondary", fontWeight: 700 }}>
                          {weapon.damageType || "Dano"}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Propriedades da Arma em Chips */}
                  {activeProps.length > 0 && (
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ my: 1 }}>
                      {activeProps.map((p) => (
                        <Chip
                          key={p.id}
                          label={p.id === "versatil" && weapon.versatileDice ? `Versátil (${weapon.versatileDice})` : p.label.split(" (")[0]}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: "0.68rem",
                            fontWeight: 800,
                            bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                            border: `1px solid ${strokeColor}`,
                          }}
                        />
                      ))}
                    </Stack>
                  )}

                  {/* Notas */}
                  {weapon.notes && (
                    <Typography variant="caption" sx={{ color: "text.secondary", fontStyle: "italic", display: "block", mb: 1 }}>
                      {weapon.notes}
                    </Typography>
                  )}

                  {/* Botão de Rolagem Rápida */}
                  <Button
                    fullWidth
                    size="small"
                    variant="contained"
                    startIcon={<CasinoIcon />}
                    onClick={() => handleRollWeapon(weapon)}
                    sx={{
                      mt: 1,
                      bgcolor: combatColor,
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: "0.78rem",
                      py: 0.6,
                      "&:hover": { filter: "brightness(0.92)", bgcolor: combatColor },
                    }}
                  >
                    Rolar Ataque & Dano
                  </Button>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Modal de Criação / Edição de Arma */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: `1px solid ${combatBorder}`,
            bgcolor: isDark ? "#1c1410" : "#fffcf6",
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: "Cinzel", fontWeight: 900, color: combatColor }}>
          {editingSlot ? "Editar Arma / Ataque" : "Nova Arma / Ação de Combate"}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <TextField
                  label="Nome da Arma"
                  placeholder="ex: Espada Longa, Arco Curto, Rapieira"
                  value={weaponForm.name}
                  onChange={(e) => setWeaponForm((p) => ({ ...p, name: e.target.value }))}
                  fullWidth
                  size="small"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  label="Categoria"
                  value={weaponForm.category}
                  onChange={(e) => setWeaponForm((p) => ({ ...p, category: e.target.value }))}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="melee">Corpo a Corpo</MenuItem>
                  <MenuItem value="ranged">À Distância</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6} sm={4}>
                <TextField
                  select
                  label="Atributo de Ataque"
                  value={weaponForm.attackStat}
                  onChange={(e) => setWeaponForm((p) => ({ ...p, attackStat: e.target.value }))}
                  fullWidth
                  size="small"
                >
                  {ATTR_OPTIONS.map((attr) => (
                    <MenuItem key={attr} value={attr}>
                      {attr}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={6} sm={4}>
                <TextField
                  select
                  label="Dado de Dano"
                  value={weaponForm.damageDice}
                  onChange={(e) => setWeaponForm((p) => ({ ...p, damageDice: e.target.value }))}
                  fullWidth
                  size="small"
                >
                  {DAMAGE_DICE_OPTIONS.map((dice) => (
                    <MenuItem key={dice} value={dice}>
                      {dice}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  label="Tipo de Dano"
                  value={weaponForm.damageType}
                  onChange={(e) => setWeaponForm((p) => ({ ...p, damageType: e.target.value }))}
                  fullWidth
                  size="small"
                >
                  {DAMAGE_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Bônus Mágico (+X)"
                  type="number"
                  placeholder="0"
                  value={weaponForm.attackBonus}
                  onChange={(e) => setWeaponForm((p) => ({ ...p, attackBonus: Number(e.target.value || 0) }))}
                  fullWidth
                  size="small"
                />
              </Grid>

              {weaponForm.props?.versatil && (
                <Grid item xs={6}>
                  <TextField
                    select
                    label="Dano com Duas Mãos (Versátil)"
                    value={weaponForm.versatileDice}
                    onChange={(e) => setWeaponForm((p) => ({ ...p, versatileDice: e.target.value }))}
                    fullWidth
                    size="small"
                  >
                    {DAMAGE_DICE_OPTIONS.map((dice) => (
                      <MenuItem key={dice} value={dice}>
                        {dice}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}
            </Grid>

            {/* Propriedades da Arma em Chips Clicáveis */}
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 800, color: "text.secondary", display: "block", mb: 1 }}>
                PROPRIEDADES DA ARMA (CLIQUE PARA ATIVAR):
              </Typography>
              <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                {WEAPON_PROPERTIES.map((prop) => {
                  const active = !!weaponForm.props?.[prop.id];
                  return (
                    <Chip
                      key={prop.id}
                      label={prop.label}
                      clickable
                      onClick={() => handleToggleProperty(prop.id)}
                      sx={{
                        fontWeight: 800,
                        fontSize: "0.75rem",
                        bgcolor: active ? combatColor : "transparent",
                        color: active ? "#fff" : "text.primary",
                        border: `1px solid ${active ? combatColor : strokeColor}`,
                        "&:hover": {
                          bgcolor: active ? combatColor : alpha(combatColor, 0.1),
                        },
                      }}
                    />
                  );
                })}
              </Stack>
            </Box>

            <TextField
              label="Notas / Efeitos Especiais"
              placeholder="ex: Causa +1d6 de dano de fogo em acertos críticos."
              value={weaponForm.notes}
              onChange={(e) => setWeaponForm((p) => ({ ...p, notes: e.target.value }))}
              fullWidth
              multiline
              minRows={2}
              size="small"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setModalOpen(false)} sx={{ color: "text.secondary" }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveWeapon}
            disabled={!weaponForm.name.trim()}
            sx={{ bgcolor: combatColor, color: "#fff", fontWeight: 800, "&:hover": { bgcolor: combatColor, filter: "brightness(0.92)" } }}
          >
            Salvar Arma
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
