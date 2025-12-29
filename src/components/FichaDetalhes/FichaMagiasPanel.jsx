import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Checkbox,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getSpellSlots } from "Array/SpellSlots";

const LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const EMPTY = {
  slots: {},
  spells: {}, // id -> { level, name, time, range, notes, conc, ritual, material }
};

const formatBonus = (v = 0) => (v >= 0 ? `+${v}` : `${v}`);

// tabela de magias conhecidas (Bardo / Bruxo / Feiticeiro) por nível 1–20
// índices: level (1..20)
const KNOWN_SPELLS_TABLE = {
  Bardo: [0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22, 22, 22],
  Bruxo: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15],
  Feiticeiro: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15],
};

function getKnownSpellsMax(classe, level) {
  const arr = KNOWN_SPELLS_TABLE[classe] || null;
  if (!arr) return null;
  const lvl = Math.max(1, Math.min(20, Number(level) || 1));
  return arr[lvl] ?? null;
}

// magias preparadas por classe (5e)
function getPreparedSpellsMax(classe, level, abilityMods) {
  const lvl = Math.max(1, Number(level) || 1);

  switch (classe) {
    case "Clérigo": {
      const mod = Number(abilityMods.Sabedoria || 0);
      return Math.max(1, mod + lvl);
    }
    case "Druida": {
      const mod = Number(abilityMods.Sabedoria || 0);
      return Math.max(1, mod + lvl);
    }
    case "Paladino": {
      const mod = Number(abilityMods.Carisma || 0);
      return Math.max(1, mod + Math.floor(lvl / 2));
    }
    case "Patrulheiro": {
      const mod = Number(abilityMods.Sabedoria || 0);
      return Math.max(1, mod + Math.floor(lvl / 2));
    }
    case "Mago": {
      const mod = Number(abilityMods.Inteligência || 0);
      return Math.max(1, mod + lvl);
    }
    default:
      return null;
  }
}

export default function FichaMagiasPanel({
  spellcasting,
  abilityMods = {},
  spellAttr = "Inteligência",
  profBonus = 2,
  classe = "",
  level = 1,
  onChange,
}) {
  const [local, setLocal] = useState(EMPTY);

  useEffect(() => {
    const base = spellcasting || {};
    const slots = { ...(base.slots || {}) };

    // tenta pegar progressão automática (ex.: Bardo)
    const autoSlots = getSpellSlots(classe, level);
    const hasAutoSlots = Array.isArray(autoSlots);

    LEVELS.forEach((lvl) => {
      const index = lvl - 1;
      const autoTotal =
        hasAutoSlots && autoSlots[index] != null
          ? autoSlots[index]
          : null;

      const prev = slots[lvl] || { total: 0, used: 0 };

      slots[lvl] = {
        total: autoTotal != null ? autoTotal : prev.total || 0,
        used:
          autoTotal != null && prev.used > autoTotal
            ? autoTotal
            : prev.used || 0,
      };
    });

    setLocal({
      slots,
      spells: base.spells || {},
    });
  }, [spellcasting, classe, level]);

  const attrMod = Number(abilityMods[spellAttr] || 0);
  const dc = 8 + profBonus + attrMod;
  const atkBonus = profBonus + attrMod;

  const preparedMax = useMemo(
    () => getPreparedSpellsMax(classe, level, abilityMods),
    [classe, level, abilityMods]
  );

  const knownMax = useMemo(
    () => getKnownSpellsMax(classe, level),
    [classe, level]
  );

  const spellsArray = useMemo(
    () =>
      Object.entries(local.spells || {}).sort(
        (a, b) => Number(a[1]?.level || 0) - Number(b[1]?.level || 0)
      ),
    [local.spells]
  );

  const updateSlotsField = (levelCircle, field, value) => {
    const num = Math.max(0, Number(value || 0));
    setLocal((prev) => {
      const prevRow = prev.slots?.[levelCircle] || { total: 0, used: 0 };
      let nextRow = { ...prevRow };

      if (field === "total") {
        nextRow.total = num;
        if (nextRow.used > num) nextRow.used = num;
      } else if (field === "used") {
        nextRow.used = Math.min(num, prevRow.total);
      }

      return {
        ...prev,
        slots: {
          ...prev.slots,
          [levelCircle]: nextRow,
        },
      };
    });
  };

  const updateSpellField = (id, field, value) => {
    setLocal((prev) => ({
      ...prev,
      spells: {
        ...(prev.spells || {}),
        [id]: {
          ...(prev.spells?.[id] || {}),
          [field]: value,
        },
      },
    }));
  };

  const toggleSpellFlag = (id, field) => {
    setLocal((prev) => ({
      ...prev,
      spells: {
        ...(prev.spells || {}),
        [id]: {
          ...(prev.spells?.[id] || {}),
          [field]: !prev.spells?.[id]?.[field],
        },
      },
    }));
  };

  const handleAddSpell = () => {
    const id = String(Date.now());
    setLocal((prev) => ({
      ...prev,
      spells: {
        ...(prev.spells || {}),
        [id]: {
          level: 1,
          name: "",
          time: "",
          range: "",
          notes: "",
          conc: false,
          ritual: false,
          material: false,
        },
      },
    }));
  };

  const handleDeleteSpell = (id) => {
    setLocal((prev) => {
      const next = { ...(prev.spells || {}) };
      delete next[id];
      return { ...prev, spells: next };
    });
  };

  const handleSaveAll = () => {
    onChange?.({
      slots: local.slots || {},
      spells: local.spells || {},
    });
  };

  // slots automáticos para o render (ex.: Bardo)
  const autoSlotsRender = getSpellSlots(classe, level);
  const hasAutoSlots = Array.isArray(autoSlotsRender);

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Atributo de conjuração */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Magia — Atributo de Conjuração
            </Typography>

            <Typography variant="subtitle2">Atributo</Typography>
            <Typography sx={{ mb: 1.5 }}>{spellAttr}</Typography>

            <Typography variant="subtitle2">Modificador de conjuração</Typography>
            <Typography sx={{ mb: 1.5 }}>{formatBonus(attrMod)}</Typography>

            <Typography variant="subtitle2">CD para resistir às suas magias</Typography>
            <Typography sx={{ mb: 1.5 }}>8 + prof + mod = {dc}</Typography>

            <Typography variant="subtitle2">Modificador de ataque mágico</Typography>
            <Typography sx={{ mb: 1.5 }}>{formatBonus(atkBonus)}</Typography>

            {preparedMax != null && (
              <>
                <Box sx={{ mt: 1.5 }} />
                <Typography variant="subtitle2">
                  Magias preparadas (máx.)
                </Typography>
                <Typography>
                  {preparedMax} magias preparadas por dia
                </Typography>
              </>
            )}

            {knownMax != null && (
              <>
                <Box sx={{ mt: 1.5 }} />
                <Typography variant="subtitle2">
                  Magias conhecidas (referência)
                </Typography>
                <Typography>
                  {knownMax} magias conhecidas no nível atual
                </Typography>
              </>
            )}
          </Paper>
        </Grid>

        {/* Espaços de magias por círculo */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Espaços de Magia
            </Typography>

            <Grid container spacing={1}>
              {LEVELS.map((lvlCircle) => {
                const row = local.slots?.[lvlCircle] || { total: 0, used: 0 };
                return (
                  <Grid key={lvlCircle} item xs={12} sm={6} md={4}>
                    <Box
                      sx={{
                        border: "1px solid rgba(0,0,0,0.12)",
                        borderRadius: 1.5,
                        p: 1,
                      }}
                    >
                      <Typography variant="subtitle2">
                        {lvlCircle}º círculo
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                        <TextField
                          label="Total"
                          type="number"
                          size="small"
                          value={row.total}
                          onChange={(e) =>
                            !hasAutoSlots &&
                            updateSlotsField(
                              lvlCircle,
                              "total",
                              e.target.value
                            )
                          }
                          sx={{ flex: 1 }}
                          inputProps={{ min: 0, readOnly: hasAutoSlots }}
                        />
                        <TextField
                          label="Gastos"
                          type="number"
                          size="small"
                          value={row.used}
                          onChange={(e) =>
                            updateSlotsField(lvlCircle, "used", e.target.value)
                          }
                          sx={{ flex: 1 }}
                          inputProps={{ min: 0, max: row.total }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Truques & magias preparadas */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <Box
          sx={{
            mb: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="h6">Truques e Magias Preparadas</Typography>
          <Button size="small" variant="contained" onClick={handleAddSpell}>
            Adicionar magia
          </Button>
        </Box>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Círculo</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Tempo</TableCell>
              <TableCell>Alcance</TableCell>
              <TableCell>Concentração</TableCell>
              <TableCell>Ritual</TableCell>
              <TableCell>M</TableCell>
              <TableCell>Notas</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {spellsArray.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    Nenhuma magia cadastrada ainda.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              spellsArray.map(([id, spell]) => (
                <TableRow key={id}>
                  <TableCell width={80}>
                    <TextField
                      type="number"
                      size="small"
                      value={spell.level ?? 1}
                      onChange={(e) =>
                        updateSpellField(id, "level", Number(e.target.value || 0))
                      }
                      inputProps={{ min: 0, max: 9 }}
                    />
                  </TableCell>
                  <TableCell width={180}>
                    <TextField
                      size="small"
                      value={spell.name || ""}
                      onChange={(e) =>
                        updateSpellField(id, "name", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell width={120}>
                    <TextField
                      size="small"
                      value={spell.time || ""}
                      onChange={(e) =>
                        updateSpellField(id, "time", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell width={120}>
                    <TextField
                      size="small"
                      value={spell.range || ""}
                      onChange={(e) =>
                        updateSpellField(id, "range", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      size="small"
                      checked={!!spell.conc}
                      onChange={() => toggleSpellFlag(id, "conc")}
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      size="small"
                      checked={!!spell.ritual}
                      onChange={() => toggleSpellFlag(id, "ritual")}
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      size="small"
                      checked={!!spell.material}
                      onChange={() => toggleSpellFlag(id, "material")}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      value={spell.notes || ""}
                      onChange={(e) =>
                        updateSpellField(id, "notes", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteSpell(id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Box sx={{ mt: 2, textAlign: "right" }}>
          <Button variant="contained" onClick={handleSaveAll}>
            Salvar grimório
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}