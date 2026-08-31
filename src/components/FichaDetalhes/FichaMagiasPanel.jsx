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
  TextField,
  InputAdornment,
  Stack,
  alpha,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Collapse,
} from "@mui/material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import FlareIcon from "@mui/icons-material/Flare";
import PsychologyIcon from "@mui/icons-material/Psychology";
import CloseIcon from "@mui/icons-material/Close";
import BoltIcon from "@mui/icons-material/Bolt";

import { getSpellSlots } from "Array/SpellSlots";
import SpellSlotsTracker from "./SpellSlotsTracker";
import SpellCard from "./SpellCard";
import AddSpellModal from "./AddSpellModal";

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

  // Identidade Roxo Arcana
  const arcanaColor = isDark ? "#ba68c8" : "#8e24aa";
  const arcanaBorder = isDark ? "rgba(186, 104, 200, 0.3)" : "rgba(142, 36, 170, 0.25)";
  const cardBg = isDark ? "rgba(24, 16, 28, 0.88)" : "rgba(255, 252, 246, 0.94)";

  // Atributos de Conjuração
  const keyAttr = spellAttr || "Carisma";
  const spellMod = Number(abilityMods[keyAttr] || 0);
  const spellDc = 8 + profBonus + spellMod;
  const spellAttackBonus = profBonus + spellMod;

  // Slots padrão da classe para o nível atual
  const defaultSlots = useMemo(() => {
    const arr = getSpellSlots(classe, level);
    if (!arr) return {};
    const map = {};
    arr.forEach((qtd, idx) => {
      const circulo = idx + 1;
      if (qtd > 0) map[circulo] = qtd;
    });
    return map;
  }, [classe, level]);

  const slotsState = spellcasting?.slots || {};
  const spellsObj = spellcasting?.spells || {};
  const spellsList = useMemo(
    () => Object.entries(spellsObj).map(([id, s]) => ({ id, ...s })),
    [spellsObj]
  );

  // Estados de busca e filtros
  const [searchTerm, setSearchTerm] = useState("");

  // Estado do Modal de Cadastro / Edição
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSpell, setEditingSpell] = useState(null);
  const [presetCircle, setPresetCircle] = useState(0);

  // Feedback Visual de Conjuração
  const [castFeedback, setCastFeedback] = useState(null);

  // Manipulação de Slots
  const handleToggleSlot = (circulo, nextGastos) => {
    const total = Number(slotsState[circulo]?.total || defaultSlots[circulo] || 0);
    const safeGastos = Math.max(0, Math.min(total, nextGastos));

    onChange?.({
      ...spellcasting,
      slots: {
        ...slotsState,
        [circulo]: {
          total,
          used: safeGastos,
          gastos: safeGastos,
        },
      },
    });
  };

  const handleLongRest = () => {
    const nextSlots = {};
    const activeCircles = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    activeCircles.forEach((c) => {
      const total = Number(slotsState[c]?.total || defaultSlots[c] || 0);
      if (total > 0) {
        nextSlots[c] = {
          total,
          used: 0,
          gastos: 0,
        };
      }
    });

    onChange?.({
      ...spellcasting,
      slots: nextSlots,
    });

    setCastFeedback({
      type: "success",
      message: "🌟 Descanso Longo concluído! Todos os espaços de magia foram restaurados.",
    });
  };

  // Ação Rápida de "Conjurar"
  const handleCastSpell = (spell, castCircleLevel = null) => {
    const spellLvl = Number(spell.level || 0);
    const targetCircle = castCircleLevel !== null ? castCircleLevel : spellLvl;

    if (spellLvl === 0) {
      // Truque (Sem Custo de Slot)
      setCastFeedback({
        type: "info",
        message: `✨ ${spell.name} lançado com sucesso! (Truque sem custo de espaço)`,
      });
      return;
    }

    // Magia de Círculo 1+: consome 1 slot do círculo alvo
    const total = Number(slotsState[targetCircle]?.total || defaultSlots[targetCircle] || 0);
    const currentUsed = Number(
      slotsState[targetCircle]?.used ?? slotsState[targetCircle]?.gastos ?? 0
    );

    if (currentUsed >= total) {
      setCastFeedback({
        type: "warning",
        message: `⚠️ Não há espaços de ${targetCircle}º Círculo disponíveis!`,
      });
      return;
    }

    const nextUsed = currentUsed + 1;
    const remaining = total - nextUsed;

    onChange?.({
      ...spellcasting,
      slots: {
        ...slotsState,
        [targetCircle]: {
          total,
          used: nextUsed,
          gastos: nextUsed,
        },
      },
    });

    const isUpcast = targetCircle > spellLvl;
    setCastFeedback({
      type: "success",
      message: isUpcast
        ? `⚡ ${spell.name} conjurado em ${targetCircle}º Círculo (Upcast)! Restam ${remaining} espaço(s) de ${targetCircle}º Círculo.`
        : `⚡ ${spell.name} conjurado! Restam ${remaining} espaço(s) de ${targetCircle}º Círculo.`,
    });
  };

  // Modal Abrir / Salvar / Deletar
  const handleOpenAddModal = (circleLvl = 0) => {
    setEditingSpell(null);
    setPresetCircle(circleLvl);
    setModalOpen(true);
  };

  const handleOpenEditModal = (spell) => {
    setEditingSpell(spell);
    setPresetCircle(Number(spell.level || 0));
    setModalOpen(true);
  };

  const handleSaveSpellModal = (spellData) => {
    const id = editingSpell?.id || `spell_${Date.now()}`;
    const nextSpells = {
      ...spellsObj,
      [id]: {
        ...spellData,
        id,
        createdAt: editingSpell ? (spellsObj[editingSpell.id]?.createdAt || Date.now()) : Date.now(),
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

  // Filtragem de Magias
  const filteredSpells = useMemo(() => {
    return spellsList.filter((s) => {
      const matchName = String(s.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchSchool = String(s.school || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchName || matchSchool;
    });
  }, [spellsList, searchTerm]);

  // Agrupamento por Círculo
  const spellsByCircle = useMemo(() => {
    const map = {};
    SPELL_CIRCLES.forEach((c) => {
      map[c.level] = [];
    });
    filteredSpells.forEach((s) => {
      const lvl = Math.max(0, Math.min(9, Number(s.level || 0)));
      if (!map[lvl]) map[lvl] = [];
      map[lvl].push(s);
    });
    return map;
  }, [filteredSpells]);

  // Círculos com slots disponíveis para Upcasting
  const availableCirclesForUpcasting = useMemo(() => {
    const result = [];
    for (let c = 1; c <= 9; c++) {
      const total = Number(slotsState[c]?.total || defaultSlots[c] || 0);
      const used = Number(slotsState[c]?.used ?? slotsState[c]?.gastos ?? 0);
      if (total - used > 0) {
        result.push(c);
      }
    }
    return result;
  }, [slotsState, defaultSlots]);

  return (
    <Box>
      {/* 1. Header de Conjuração Arcana / Divina */}
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
          {/* Atributo-Chave */}
          <Grid item xs={6} sm={4}>
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

          {/* CD de Resistência */}
          <Grid item xs={6} sm={4}>
            <Box sx={{ textAlign: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, mb: 0.25 }}>
                <FlareIcon sx={{ color: arcanaColor, fontSize: 18 }} />
                <Typography variant="caption" sx={{ fontWeight: 900, color: "text.secondary", fontSize: "0.7rem", letterSpacing: 0.5 }}>
                  CD DE RESISTÊNCIA
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: arcanaColor, lineHeight: 1 }}>
                CD {spellDc}
              </Typography>
            </Box>
          </Grid>

          {/* Bônus de Ataque Mágico */}
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, mb: 0.25 }}>
                <AutoFixHighIcon sx={{ color: arcanaColor, fontSize: 18 }} />
                <Typography variant="caption" sx={{ fontWeight: 900, color: "text.secondary", fontSize: "0.7rem", letterSpacing: 0.5 }}>
                  BÔNUS DE ATAQUE MÁGICO
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: arcanaColor, lineHeight: 1 }}>
                +{spellAttackBonus}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* 2. Gerenciador Visual de Espaços de Magia (SpellSlotsTracker) */}
      <SpellSlotsTracker
        slots={slotsState}
        defaultSlots={defaultSlots}
        onToggleSlot={handleToggleSlot}
        onLongRest={handleLongRest}
      />

      {/* Feedback Visual de Conjuração */}
      <Collapse in={Boolean(castFeedback)}>
        {castFeedback && (
          <Alert
            severity={castFeedback.type || "info"}
            action={
              <IconButton
                type="button"
                size="small"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCastFeedback(null);
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
            sx={{
              mb: 2.5,
              borderRadius: 2.5,
              fontWeight: 800,
              boxShadow: `0 4px 16px ${alpha(arcanaColor, 0.2)}`,
            }}
          >
            {castFeedback.message}
          </Alert>
        )}
      </Collapse>

      {/* 3. Barra de Pesquisa e Botão Nova Magia */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
          mb: 2,
        }}
      >
        <TextField
          size="small"
          placeholder="Buscar magia por nome ou escola..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: { xs: "100%", sm: 280 } }}
        />

        <Button
          type="button"
          size="small"
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleOpenAddModal(0);
          }}
          sx={{
            bgcolor: arcanaColor,
            color: "#fff",
            fontWeight: 800,
            fontSize: "0.78rem",
            px: 1.5,
            py: 0.6,
            "&:hover": { filter: "brightness(0.92)", bgcolor: arcanaColor },
          }}
        >
          Nova Magia
        </Button>
      </Box>

      {/* 4. Lista de Magias por Círculo */}
      <Stack spacing={1.5}>
        {SPELL_CIRCLES.map((circle) => {
          const list = spellsByCircle[circle.level] || [];
          const totalInCircle = Number(
            slotsState[circle.level]?.total || defaultSlots[circle.level] || 0
          );
          const usedInCircle = Number(
            slotsState[circle.level]?.used ?? slotsState[circle.level]?.gastos ?? 0
          );
          const availableInCircle = Math.max(0, totalInCircle - usedInCircle);

          // Círculos superiores disponíveis para upcast
          const higherAvailableCircles = availableCirclesForUpcasting.filter(
            (c) => c > circle.level
          );

          if (list.length === 0 && circle.level > 0 && !(totalInCircle > 0) && !searchTerm) {
            return null;
          }

          return (
            <Accordion
              key={`circle-accordion-${circle.level}`}
              defaultExpanded={circle.level <= 2 || list.length > 0}
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
                  borderBottom: `1px solid ${alpha(arcanaBorder, 0.4)}`,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    pr: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontFamily: "Cinzel",
                        fontWeight: 900,
                        color: isDark ? "#fff" : "#2c1a10",
                      }}
                    >
                      {circle.label}
                    </Typography>
                    <Chip
                      label={`${list.length} ${list.length === 1 ? "magia" : "magias"}`}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        bgcolor: alpha(arcanaColor, 0.12),
                        color: arcanaColor,
                      }}
                    />
                    {circle.level > 0 && totalInCircle > 0 && (
                      <Chip
                        icon={<BoltIcon sx={{ fontSize: "14px !important" }} />}
                        label={`${availableInCircle}/${totalInCircle} slots`}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          bgcolor: availableInCircle > 0 ? "rgba(76, 175, 80, 0.15)" : "rgba(244, 67, 54, 0.15)",
                          color: availableInCircle > 0 ? "#4caf50" : "#f44336",
                        }}
                      />
                    )}
                  </Box>

                  <Button
                    type="button"
                    size="small"
                    variant="text"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={(e) => {
                      e.preventDefault();
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
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      fontStyle: "italic",
                      textAlign: "center",
                      display: "block",
                      py: 1,
                    }}
                  >
                    Nenhuma magia cadastrada neste círculo.
                  </Typography>
                ) : (
                  <Grid container spacing={1.5}>
                    {list.map((spell) => (
                      <Grid item xs={12} md={6} key={spell.id}>
                        <SpellCard
                          spell={spell}
                          spellDc={spellDc}
                          spellAttackBonus={spellAttackBonus}
                          availableSlotsInCircle={availableInCircle}
                          availableHigherCircles={higherAvailableCircles}
                          onCast={handleCastSpell}
                          onTogglePrepared={handleTogglePrepared}
                          onEdit={handleOpenEditModal}
                          onDelete={handleDeleteSpell}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Stack>

      {/* Modal de Criação / Edição de Magia */}
      <AddSpellModal
        open={modalOpen}
        editingSpell={editingSpell}
        presetCircle={presetCircle}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveSpellModal}
      />
    </Box>
  );
}