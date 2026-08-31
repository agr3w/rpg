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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Switch,
  Checkbox,
} from "@mui/material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HotelIcon from "@mui/icons-material/Hotel";
import FlareIcon from "@mui/icons-material/Flare";
import PsychologyIcon from "@mui/icons-material/Psychology";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

import { getSpellSlots } from "Array/SpellSlots";

const MAGIC_SCHOOLS = [
  "Abjuração",
  "Adivinhação",
  "Conjuração",
  "Encantamento",
  "Evocação",
  "Ilusão",
  "Necromancia",
  "Transmutação",
];

const CASTING_TIMES = [
  "1 Ação",
  "1 Ação Bônus",
  "1 Reação",
  "1 Minuto",
  "10 Minutos",
  "1 Hora",
  "8 Horas",
];

const SPELL_CIRCLES = [
  { level: 0, label: "Truques (Nível 0)" },
  { level: 1, label: "1º Círculo" },
  { level: 2, label: "2º Círculo" },
  { level: 3, label: "3º Círculo" },
  { level: 4, label: "4º Círculo" },
  { level: 5, label: "5º Círculo" },
  { level: 6, label: "6º Círculo" },
  { level: 7, label: "7º Círculo" },
  { level: 8, label: "8º Círculo" },
  { level: 9, label: "9º Círculo" },
];

export default function FichaMagiasPanel({
  spellcasting = { slots: {}, spells: {} },
  abilityMods = {},
  spellAttr = "Carisma",
  profBonus = 2,
  classe = "Mago",
  level = 1,
  onChange,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const arcanaColor = isDark ? "#ba68c8" : "#8e24aa";
  const arcanaBorder = isDark ? "rgba(186, 104, 200, 0.3)" : "rgba(142, 36, 170, 0.25)";
  const strokeColor = isDark ? "rgba(229,179,36,0.2)" : "rgba(131,60,11,0.2)";
  const cardBg = isDark ? "rgba(24, 16, 28, 0.88)" : "rgba(255, 252, 246, 0.94)";

  const keyAttr = spellAttr || "Carisma";
  const spellMod = Number(abilityMods[keyAttr] || 0);
  const spellDc = 8 + profBonus + spellMod;
  const spellAttackBonus = profBonus + spellMod;

  const defaultSlots = useMemo(() => {
    return getSpellSlots(classe, level) || {};
  }, [classe, level]);

  const slotsState = spellcasting?.slots || {};
  const spellsObj = spellcasting?.spells || {};
  const spellsList = useMemo(() => Object.entries(spellsObj).map(([id, s]) => ({ id, ...s })), [spellsObj]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [spellForm, setSpellForm] = useState({
    name: "",
    level: 0,
    school: "Evocação",
    castingTime: "1 Ação",
    range: "18m (60ft)",
    duration: "Instantânea",
    components: { v: true, s: true, m: false },
    materialText: "",
    concentration: false,
    ritual: false,
    prepared: false,
    description: "",
    higherLevels: "",
  });

  const handleOpenAddModal = (presetLevel = 0) => {
    setEditingId(null);
    setSpellForm({
      name: "",
      level: presetLevel,
      school: "Evocação",
      castingTime: "1 Ação",
      range: "18m (60ft)",
      duration: "Instantânea",
      components: { v: true, s: true, m: false },
      materialText: "",
      concentration: false,
      ritual: false,
      prepared: presetLevel === 0,
      description: "",
      higherLevels: "",
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (spell) => {
    setEditingId(spell.id);
    setSpellForm({
      name: spell.name || "",
      level: Number(spell.level || 0),
      school: spell.school || "Evocação",
      castingTime: spell.castingTime || "1 Ação",
      range: spell.range || "18m (60ft)",
      duration: spell.duration || "Instantânea",
      components: {
        v: !!spell.components?.v,
        s: !!spell.components?.s,
        m: !!spell.components?.m,
      },
      materialText: spell.materialText || spell.material || "",
      concentration: !!spell.concentration,
      ritual: !!spell.ritual,
      prepared: !!spell.prepared,
      description: spell.description || "",
      higherLevels: spell.higherLevels || "",
    });
    setModalOpen(true);
  };

  const handleSaveSpell = () => {
    const name = spellForm.name.trim();
    if (!name) return;

    const id = editingId || `spell_${Date.now()}`;
    const nextSpells = {
      ...spellsObj,
      [id]: {
        id,
        name,
        level: Number(spellForm.level || 0),
        school: spellForm.school,
        castingTime: spellForm.castingTime,
        range: spellForm.range,
        duration: spellForm.duration,
        components: spellForm.components,
        materialText: spellForm.materialText,
        concentration: spellForm.concentration,
        ritual: spellForm.ritual,
        prepared: spellForm.prepared,
        description: spellForm.description,
        higherLevels: spellForm.higherLevels,
        createdAt: editingId ? (spellsObj[editingId]?.createdAt || Date.now()) : Date.now(),
      },
    };

    onChange?.({
      ...spellcasting,
      spells: nextSpells,
    });
    setModalOpen(false);
  };

  const handleDeleteSpell = (id) => {
    const nextSpells = { ...spellsObj };
    delete nextSpells[id];
    onChange?.({
      ...spellcasting,
      spells: nextSpells,
    });
  };

  const handleTogglePrepared = (id) => {
    const current = spellsObj[id];
    if (!current) return;
    onChange?.({
      ...spellcasting,
      spells: {
        ...spellsObj,
        [id]: {
          ...current,
          prepared: !current.prepared,
        },
      },
    });
  };

  const handleToggleSlotUsed = (lvl, slotIndex, maxSlots) => {
    const currentUsed = Number(slotsState[lvl]?.used || 0);
    const newUsed = currentUsed === maxSlots - slotIndex ? currentUsed - 1 : maxSlots - slotIndex;
    const safeUsed = Math.max(0, Math.min(maxSlots, newUsed));

    onChange?.({
      ...spellcasting,
      slots: {
        ...slotsState,
        [lvl]: {
          total: maxSlots,
          used: safeUsed,
        },
      },
    });
  };

  const handleRestoreAllSlots = () => {
    const nextSlots = {};
    Object.keys(defaultSlots).forEach((lvl) => {
      nextSlots[lvl] = {
        total: defaultSlots[lvl],
        used: 0,
      };
    });
    onChange?.({
      ...spellcasting,
      slots: nextSlots,
    });
  };

  const handleCastSpell = (spell) => {
    const lvl = Number(spell.level || 0);
    if (lvl === 0) return;

    const maxSlots = defaultSlots[lvl] || slotsState[lvl]?.total || 0;
    const currentUsed = Number(slotsState[lvl]?.used || 0);
    if (currentUsed < maxSlots) {
      onChange?.({
        ...spellcasting,
        slots: {
          ...slotsState,
          [lvl]: {
            total: maxSlots,
            used: currentUsed + 1,
          },
        },
      });
    }
  };

  const spellsByCircle = useMemo(() => {
    const map = {};
    SPELL_CIRCLES.forEach((c) => {
      map[c.level] = [];
    });
    spellsList.forEach((s) => {
      const lvl = Math.max(0, Math.min(9, Number(s.level || 0)));
      if (!map[lvl]) map[lvl] = [];
      map[lvl].push(s);
    });
    return map;
  }, [spellsList]);

  return (
    <Box>
      {/* 1. Header de Conjuração */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 3,
          border: `1px solid ${arcanaBorder}`,
          bgcolor: cardBg,
          backdropFilter: "blur(6px)",
          mb: 2.5,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, mb: 0.25 }}>
                <PsychologyIcon sx={{ color: arcanaColor, fontSize: 18 }} />
                <Typography variant="caption" sx={{ fontWeight: 900, color: "text.secondary", fontSize: "0.7rem", letterSpacing: 0.5 }}>
                  ATRIBUTO-CHAVE
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: isDark ? "#fff" : "#2c1a10" }}>
                {keyAttr} ({spellMod >= 0 ? `+${spellMod}` : spellMod})
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, mb: 0.25 }}>
                <FlareIcon sx={{ color: arcanaColor, fontSize: 18 }} />
                <Typography variant="caption" sx={{ fontWeight: 900, color: "text.secondary", fontSize: "0.7rem", letterSpacing: 0.5 }}>
                  CD RESISTÊNCIA
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: arcanaColor, lineHeight: 1 }}>
                CD {spellDc}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, mb: 0.25 }}>
                <AutoFixHighIcon sx={{ color: arcanaColor, fontSize: 18 }} />
                <Typography variant="caption" sx={{ fontWeight: 900, color: "text.secondary", fontSize: "0.7rem", letterSpacing: 0.5 }}>
                  ATAQUE MÁGICO
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: arcanaColor, lineHeight: 1 }}>
                +{spellAttackBonus}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6} sm={3} sx={{ textAlign: "center" }}>
            <Tooltip title="Recupera todos os espaços de magia gastos">
              <Button
                fullWidth
                size="small"
                variant="outlined"
                startIcon={<HotelIcon />}
                onClick={handleRestoreAllSlots}
                sx={{
                  borderColor: arcanaBorder,
                  color: arcanaColor,
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  py: 0.75,
                  "&:hover": { borderColor: arcanaColor, bgcolor: alpha(arcanaColor, 0.1) },
                }}
              >
                Restaurar Slots
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {/* 2. Gerenciador de Spell Slots */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 3,
          border: `1px solid ${arcanaBorder}`,
          bgcolor: cardBg,
          backdropFilter: "blur(6px)",
          mb: 2.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AutoStoriesIcon sx={{ color: arcanaColor, fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: isDark ? "#fff" : "#2c1a10" }}>
              Espaços de Magia (Spell Slots)
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
            Clique no círculo para gastar ou recuperar
          </Typography>
        </Box>

        <Grid container spacing={1.5}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => {
            const maxSlots = defaultSlots[lvl] || slotsState[lvl]?.total || 0;
            if (maxSlots <= 0) return null;

            const usedSlots = Number(slotsState[lvl]?.used || 0);
            const availableSlots = Math.max(0, maxSlots - usedSlots);

            return (
              <Grid item xs={12} sm={6} md={4} key={`slots-lvl-${lvl}`}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.25,
                    borderRadius: 2,
                    border: `1px solid ${strokeColor}`,
                    bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 900, color: isDark ? "#fff" : "#2c1a10", display: "block" }}>
                      {lvl}º Círculo
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.68rem" }}>
                      {availableSlots} de {maxSlots} disp.
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={0.75}>
                    {Array.from({ length: maxSlots }).map((_, i) => {
                      const isAvailable = i < availableSlots;
                      return (
                        <Box
                          key={`slot-${lvl}-${i}`}
                          onClick={() => handleToggleSlotUsed(lvl, i, maxSlots)}
                          sx={{
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            border: `2px solid ${isAvailable ? arcanaColor : strokeColor}`,
                            bgcolor: isAvailable ? arcanaColor : "transparent",
                            boxShadow: isAvailable ? `0 0 8px ${alpha(arcanaColor, 0.6)}` : "none",
                            cursor: "pointer",
                            transition: "all 0.18s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            "&:hover": {
                              transform: "scale(1.15)",
                              borderColor: arcanaColor,
                            },
                          }}
                        />
                      );
                    })}
                  </Stack>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Paper>

      {/* 3. Lista de Magias */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: isDark ? "#fff" : "#2c1a10" }}>
          Grimório de Magias
        </Typography>

        <Button
          size="small"
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => handleOpenAddModal(0)}
          sx={{
            bgcolor: arcanaColor,
            color: "#fff",
            fontWeight: 800,
            fontSize: "0.78rem",
            px: 1.5,
            py: 0.5,
            "&:hover": { filter: "brightness(0.92)", bgcolor: arcanaColor },
          }}
        >
          Nova Magia
        </Button>
      </Box>

      <Stack spacing={1.5}>
        {SPELL_CIRCLES.map((circle) => {
          const list = spellsByCircle[circle.level] || [];
          if (list.length === 0 && circle.level > 0 && !(defaultSlots[circle.level] > 0)) {
            return null;
          }

          return (
            <Accordion
              key={`circle-acc-${circle.level}`}
              defaultExpanded={circle.level <= 2}
              sx={{
                borderRadius: "12px !important",
                border: `1px solid ${arcanaBorder}`,
                bgcolor: cardBg,
                backdropFilter: "blur(6px)",
                "&:before": { display: "none" },
                overflow: "hidden",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: arcanaColor }} />}
                sx={{
                  bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                  borderBottom: `1px solid ${strokeColor}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", pr: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: isDark ? "#fff" : "#2c1a10" }}>
                      {circle.label}
                    </Typography>
                    <Chip
                      label={`${list.length} ${list.length === 1 ? "magia" : "magias"}`}
                      size="small"
                      sx={{ height: 20, fontSize: "0.7rem", fontWeight: 800, bgcolor: alpha(arcanaColor, 0.12), color: arcanaColor }}
                    />
                  </Box>

                  <Button
                    size="small"
                    variant="text"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenAddModal(circle.level);
                    }}
                    sx={{ fontSize: "0.72rem", color: arcanaColor, fontWeight: 800 }}
                  >
                    Adicionar
                  </Button>
                </Box>
              </AccordionSummary>

              <AccordionDetails sx={{ p: 2 }}>
                {list.length === 0 ? (
                  <Typography variant="caption" sx={{ color: "text.secondary", fontStyle: "italic", textAlign: "center", display: "block", py: 1 }}>
                    Nenhuma magia cadastrada neste círculo.
                  </Typography>
                ) : (
                  <Grid container spacing={1.5}>
                    {list.map((spell) => {
                      const compParts = [];
                      if (spell.components?.v) compParts.push("V");
                      if (spell.components?.s) compParts.push("S");
                      if (spell.components?.m) compParts.push(spell.materialText ? `M (${spell.materialText})` : "M");

                      return (
                        <Grid item xs={12} md={6} key={spell.id}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 1.75,
                              borderRadius: 2.5,
                              border: `1px solid ${strokeColor}`,
                              bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              height: "100%",
                              transition: "all 0.18s ease",
                              "&:hover": {
                                borderColor: arcanaColor,
                                boxShadow: isDark ? "0 6px 20px rgba(0,0,0,0.4)" : "0 4px 14px rgba(0,0,0,0.06)",
                              },
                            }}
                          >
                            <Box>
                              <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 0.75 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap" }}>
                                  <Typography variant="subtitle1" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: isDark ? "#fff" : "#2c1a10", lineHeight: 1.1 }}>
                                    {spell.name}
                                  </Typography>
                                  {spell.school && (
                                    <Chip
                                      label={spell.school}
                                      size="small"
                                      sx={{ height: 18, fontSize: "0.65rem", fontWeight: 700 }}
                                    />
                                  )}
                                </Box>

                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
                                  <Tooltip title="Editar Magia">
                                    <IconButton size="small" onClick={() => handleOpenEditModal(spell)}>
                                      <EditIcon fontSize="small" sx={{ color: "text.secondary" }} />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Remover Magia">
                                    <IconButton size="small" onClick={() => handleDeleteSpell(spell.id)}>
                                      <DeleteOutlineIcon fontSize="small" color="error" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </Box>

                              <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
                                <Chip
                                  label={spell.castingTime || "1 Ação"}
                                  size="small"
                                  sx={{ height: 20, fontSize: "0.68rem", fontWeight: 700, bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}
                                />
                                <Chip
                                  label={spell.range || "18m"}
                                  size="small"
                                  sx={{ height: 20, fontSize: "0.68rem", fontWeight: 700, bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}
                                />
                                <Chip
                                  label={spell.duration || "Instantânea"}
                                  size="small"
                                  sx={{ height: 20, fontSize: "0.68rem", fontWeight: 700, bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}
                                />
                                {compParts.length > 0 && (
                                  <Chip
                                    label={`Comp: ${compParts.join(", ")}`}
                                    size="small"
                                    sx={{ height: 20, fontSize: "0.68rem", fontWeight: 700 }}
                                  />
                                )}
                                {spell.concentration && (
                                  <Chip
                                    label="Concentração"
                                    size="small"
                                    sx={{ height: 20, fontSize: "0.68rem", fontWeight: 900, bgcolor: "rgba(255, 152, 0, 0.15)", color: "#ff9800", border: "1px solid rgba(255, 152, 0, 0.4)" }}
                                  />
                                )}
                                {spell.ritual && (
                                  <Chip
                                    label="Ritual"
                                    size="small"
                                    sx={{ height: 20, fontSize: "0.68rem", fontWeight: 900, bgcolor: "rgba(33, 150, 243, 0.15)", color: "#2196f3", border: "1px solid rgba(33, 150, 243, 0.4)" }}
                                  />
                                )}
                              </Stack>

                              {spell.description && (
                                <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 1, whiteSpace: "pre-line" }}>
                                  {spell.description}
                                </Typography>
                              )}
                              {spell.higherLevels && (
                                <Typography variant="caption" sx={{ color: arcanaColor, fontWeight: 700, display: "block", mb: 1 }}>
                                  Em Níveis Superiores: {spell.higherLevels}
                                </Typography>
                              )}
                            </Box>

                            <Box sx={{ pt: 1, borderTop: `1px solid ${strokeColor}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              {circle.level > 0 ? (
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      size="small"
                                      checked={!!spell.prepared}
                                      onChange={() => handleTogglePrepared(spell.id)}
                                      sx={{ p: 0.5, color: arcanaColor, "&.Mui-checked": { color: arcanaColor } }}
                                    />
                                  }
                                  label={
                                    <Typography variant="caption" sx={{ fontWeight: 800, fontSize: "0.72rem" }}>
                                      Preparada
                                    </Typography>
                                  }
                                  sx={{ m: 0 }}
                                />
                              ) : (
                                <Typography variant="caption" sx={{ fontWeight: 800, color: "text.secondary" }}>
                                  Truque Ilimitado
                                </Typography>
                              )}

                              {circle.level > 0 && (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<AutoFixHighIcon fontSize="small" />}
                                  onClick={() => handleCastSpell(spell)}
                                  sx={{
                                    fontSize: "0.7rem",
                                    py: 0.2,
                                    px: 1,
                                    borderColor: arcanaBorder,
                                    color: arcanaColor,
                                    fontWeight: 800,
                                    "&:hover": { borderColor: arcanaColor, bgcolor: alpha(arcanaColor, 0.1) },
                                  }}
                                >
                                  Gastar Slot & Conjurar
                                </Button>
                              )}
                            </Box>
                          </Paper>
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Stack>

      {/* Modal de Criação / Edição de Magia */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: `1px solid ${arcanaBorder}`,
            bgcolor: isDark ? "#1c1410" : "#fffcf6",
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: "Cinzel", fontWeight: 900, color: arcanaColor }}>
          {editingId ? "Editar Magia" : "Nova Magia no Grimório"}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={7}>
                <TextField
                  label="Nome da Magia"
                  placeholder="ex: Bola de Fogo, Escudo Arcano, Curar Ferimentos"
                  value={spellForm.name}
                  onChange={(e) => setSpellForm((p) => ({ ...p, name: e.target.value }))}
                  fullWidth
                  size="small"
                  autoFocus
                />
              </Grid>
              <Grid item xs={6} sm={5}>
                <TextField
                  select
                  label="Círculo de Magia"
                  value={spellForm.level}
                  onChange={(e) => setSpellForm((p) => ({ ...p, level: Number(e.target.value) }))}
                  fullWidth
                  size="small"
                >
                  {SPELL_CIRCLES.map((c) => (
                    <MenuItem key={c.level} value={c.level}>
                      {c.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Escola de Magia"
                  value={spellForm.school}
                  onChange={(e) => setSpellForm((p) => ({ ...p, school: e.target.value }))}
                  fullWidth
                  size="small"
                >
                  {MAGIC_SCHOOLS.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Tempo de Conjuração"
                  value={spellForm.castingTime}
                  onChange={(e) => setSpellForm((p) => ({ ...p, castingTime: e.target.value }))}
                  fullWidth
                  size="small"
                >
                  {CASTING_TIMES.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Alcance"
                  placeholder="ex: 18m (60ft), Toque, Pessoal"
                  value={spellForm.range}
                  onChange={(e) => setSpellForm((p) => ({ ...p, range: e.target.value }))}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Duração"
                  placeholder="ex: Instantânea, 1 minuto, 1 hora"
                  value={spellForm.duration}
                  onChange={(e) => setSpellForm((p) => ({ ...p, duration: e.target.value }))}
                  fullWidth
                  size="small"
                />
              </Grid>
            </Grid>

            {/* Switches de Concentração e Ritual */}
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                borderRadius: 2,
                border: `1px solid ${strokeColor}`,
                bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={spellForm.concentration}
                    onChange={(e) => setSpellForm((p) => ({ ...p, concentration: e.target.checked }))}
                    color="secondary"
                  />
                }
                label={<Typography variant="body2" sx={{ fontWeight: 800 }}>Exige Concentração</Typography>}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={spellForm.ritual}
                    onChange={(e) => setSpellForm((p) => ({ ...p, ritual: e.target.checked }))}
                    color="primary"
                  />
                }
                label={<Typography variant="body2" sx={{ fontWeight: 800 }}>Pode ser Ritual</Typography>}
              />
            </Paper>

            {/* Componentes */}
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 800, color: "text.secondary", display: "block", mb: 0.5 }}>
                COMPONENTES:
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={spellForm.components.v}
                      onChange={(e) => setSpellForm((p) => ({ ...p, components: { ...p.components, v: e.target.checked } }))}
                    />
                  }
                  label="Verbal (V)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={spellForm.components.s}
                      onChange={(e) => setSpellForm((p) => ({ ...p, components: { ...p.components, s: e.target.checked } }))}
                    />
                  }
                  label="Somático (S)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={spellForm.components.m}
                      onChange={(e) => setSpellForm((p) => ({ ...p, components: { ...p.components, m: e.target.checked } }))}
                    />
                  }
                  label="Material (M)"
                />
              </Stack>

              {spellForm.components.m && (
                <TextField
                  label="Descrição dos Materiais"
                  placeholder="ex: Uma pitada de enxofre e guano de morcego"
                  value={spellForm.materialText}
                  onChange={(e) => setSpellForm((p) => ({ ...p, materialText: e.target.value }))}
                  fullWidth
                  size="small"
                />
              )}
            </Box>

            <TextField
              label="Descrição / Efeito da Magia"
              placeholder="Descreva o que a magia faz, testes de resistência, dano, etc."
              value={spellForm.description}
              onChange={(e) => setSpellForm((p) => ({ ...p, description: e.target.value }))}
              fullWidth
              multiline
              minRows={3}
              size="small"
            />

            <TextField
              label="Em Níveis Superiores (Opcional)"
              placeholder="ex: Quando conjurada com espaço de 4º nível ou superior, o dano aumenta em +1d6 para cada nível."
              value={spellForm.higherLevels}
              onChange={(e) => setSpellForm((p) => ({ ...p, higherLevels: e.target.value }))}
              fullWidth
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
            onClick={handleSaveSpell}
            disabled={!spellForm.name.trim()}
            sx={{ bgcolor: arcanaColor, color: "#fff", fontWeight: 800, "&:hover": { bgcolor: arcanaColor, filter: "brightness(0.92)" } }}
          >
            Salvar Magia
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}