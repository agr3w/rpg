import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  FormGroup,
  Divider,
  Stack,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getSpellSlots } from "Array/SpellSlots";

const LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const EMPTY = {
  slots: {},
  spells: {}, // id -> Spell
};

const formatBonus = (v = 0) => (v >= 0 ? `+${v}` : `${v}`);

// presets (para padronizar e facilitar filtro)
const CASTING_TIME_PRESETS = [
  "Ação",
  "Ação bônus",
  "Reação",
  "1 minuto",
  "10 minutos",
  "1 hora",
  "8 horas",
];

const makeBlankSpell = () => ({
  name: "",
  level: 0, // 0 = truque
  castingTime: "",
  range: "",
  duration: "",
  components: { v: false, s: false, m: false },
  material: "",
  ritual: false,
  concentration: false,
  prepared: false,
  description: "",
  higherLevels: "",
});

// migra dados antigos para o novo formato sem quebrar fichas já salvas
function normalizeSpell(spell) {
  const s = spell || {};
  const components =
    s.components && typeof s.components === "object"
      ? {
          v: !!s.components.v,
          s: !!s.components.s,
          m: !!s.components.m,
        }
      : {
          v: !!s.v,
          s: !!s.s,
          m: !!s.material, // antigo "material" boolean
        };

  return {
    ...makeBlankSpell(),
    name: s.name ?? "",
    level: typeof s.level === "number" ? s.level : Number(s.level || 0),
    castingTime: s.castingTime ?? s.time ?? "",
    range: s.range ?? "",
    duration: s.duration ?? "",
    ritual: !!(s.ritual ?? false),
    concentration: !!(s.concentration ?? s.conc ?? false),
    prepared: !!(s.prepared ?? false),
    components,
    material: s.materialText ?? (typeof s.material === "string" ? s.material : "") ?? "",
    description: s.description ?? s.notes ?? "",
    higherLevels: s.higherLevels ?? "",
  };
}

function formatComponents(components, materialText) {
  const parts = [];
  if (components?.v) parts.push("V");
  if (components?.s) parts.push("S");
  if (components?.m) parts.push(materialText?.trim() ? `M (${materialText.trim()})` : "M");
  return parts.length ? parts.join(", ") : "—";
}

// tabela de magias conhecidas (Bardo / Bruxo / Feiticeiro) por nível 1–20
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

  // modal
  const [spellModalOpen, setSpellModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(makeBlankSpell());

  // busca/filtros
  const [q, setQ] = useState("");
  const [levelFilter, setLevelFilter] = useState("all"); // "all" | "0".."9"
  const [timeFilter, setTimeFilter] = useState("all"); // "all" | preset strings
  const [preparedOnly, setPreparedOnly] = useState(false);

  // evita persistir quando estamos só “hidratando” do props
  const isHydratingRef = useRef(false);

  const persist = (nextState) => {
    if (!onChange) return;
    if (isHydratingRef.current) return;
    onChange({
      slots: nextState?.slots || {},
      spells: nextState?.spells || {},
    });
  };

  useEffect(() => {
    const base = spellcasting || {};
    const slots = { ...(base.slots || {}) };

    const autoSlots = getSpellSlots(classe, level);
    const hasAutoSlotsLocal = Array.isArray(autoSlots);

    LEVELS.forEach((lvl) => {
      const index = lvl - 1;
      const autoTotal = hasAutoSlotsLocal && autoSlots[index] != null ? autoSlots[index] : null;
      const prev = slots[lvl] || { total: 0, used: 0 };

      slots[lvl] = {
        total: autoTotal != null ? autoTotal : prev.total || 0,
        used: autoTotal != null && prev.used > autoTotal ? autoTotal : prev.used || 0,
      };
    });

    const spells = {};
    const baseSpells = base.spells || {};
    Object.entries(baseSpells).forEach(([id, sp]) => {
      spells[id] = normalizeSpell(sp);
    });

    isHydratingRef.current = true;
    setLocal({ slots, spells });
    // libera persist no próximo tick (evita salvar durante hidratação)
    queueMicrotask(() => {
      isHydratingRef.current = false;
    });
  }, [spellcasting, classe, level]);

  const attrMod = Number(abilityMods[spellAttr] || 0);
  const dc = 8 + profBonus + attrMod;
  const atkBonus = profBonus + attrMod;

  const preparedMax = useMemo(
    () => getPreparedSpellsMax(classe, level, abilityMods),
    [classe, level, abilityMods]
  );
  const knownMax = useMemo(() => getKnownSpellsMax(classe, level), [classe, level]);

  const autoSlotsRender = getSpellSlots(classe, level);
  const hasAutoSlots = Array.isArray(autoSlotsRender);

  const spellsArray = useMemo(() => {
    const entries = Object.entries(local.spells || {});
    return entries.sort((a, b) => {
      const la = Number(a[1]?.level || 0);
      const lb = Number(b[1]?.level || 0);
      if (la !== lb) return la - lb;
      return String(a[1]?.name || "").localeCompare(String(b[1]?.name || ""));
    });
  }, [local.spells]);

  const filteredSpells = useMemo(() => {
    const query = q.trim().toLowerCase();

    return spellsArray.filter(([_, raw]) => {
      const sp = normalizeSpell(raw);

      if (preparedOnly && !sp.prepared) return false;

      if (levelFilter !== "all") {
        const wanted = Number(levelFilter);
        if (Number(sp.level) !== wanted) return false;
      }

      if (timeFilter !== "all") {
        const ct = String(sp.castingTime || "").toLowerCase();
        const wanted = String(timeFilter).toLowerCase();
        // usa includes pra tolerar textos antigos
        if (!ct.includes(wanted)) return false;
      }

      if (!query) return true;

      const hay = [
        sp.name,
        sp.description,
        sp.higherLevels,
        sp.range,
        sp.duration,
        sp.castingTime,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return hay.includes(query);
    });
  }, [spellsArray, q, preparedOnly, levelFilter, timeFilter]);

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

      const next = {
        ...prev,
        slots: {
          ...prev.slots,
          [levelCircle]: nextRow,
        },
      };
      persist(next);
      return next;
    });
  };

  const handleDeleteSpell = (id) => {
    setLocal((prev) => {
      const nextSpells = { ...(prev.spells || {}) };
      delete nextSpells[id];
      const next = { ...prev, spells: nextSpells };
      persist(next);
      return next;
    });
  };

  const handleTogglePrepared = (id) => {
    setLocal((prev) => ({
      ...(() => {
        const next = {
          ...prev,
          spells: {
            ...(prev.spells || {}),
            [id]: {
              ...normalizeSpell(prev.spells?.[id]),
              prepared: !prev.spells?.[id]?.prepared,
            },
          },
        };
        persist(next);
        return next;
      })(),
    }));
  };

  const handleOpenNewSpell = () => {
    setEditingId(null);
    setDraft(makeBlankSpell());
    setSpellModalOpen(true);
  };

  const handleOpenEditSpell = (id) => {
    const sp = normalizeSpell(local.spells?.[id]);
    setEditingId(id);
    setDraft(sp);
    setSpellModalOpen(true);
  };

  const handleCloseSpellModal = () => {
    setSpellModalOpen(false);
    setEditingId(null);
  };

  const handleSaveDraft = () => {
    const cleaned = normalizeSpell(draft);
    if (!cleaned.name.trim()) return;

    const id = editingId || String(Date.now());

    setLocal((prev) => ({
      ...(() => {
        const next = {
          ...prev,
          spells: {
            ...(prev.spells || {}),
            [id]: cleaned,
          },
        };
        // salvamento explícito ao clicar "Salvar" no modal
        persist(next);
        return next;
      })(),
    }));

    setSpellModalOpen(false);
    setEditingId(null);
  };

  const castingTimeSelectValue = useMemo(() => {
    const v = String(draft.castingTime || "").trim();
    if (!v) return "__custom__";
    return CASTING_TIME_PRESETS.includes(v) ? v : "__custom__";
  }, [draft.castingTime]);

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
                <Typography variant="subtitle2">Magias preparadas (máx.)</Typography>
                <Typography>{preparedMax} magias preparadas por dia</Typography>
              </>
            )}

            {knownMax != null && (
              <>
                <Box sx={{ mt: 1.5 }} />
                <Typography variant="subtitle2">Magias conhecidas (referência)</Typography>
                <Typography>{knownMax} magias conhecidas no nível atual</Typography>
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
                      <Typography variant="subtitle2">{lvlCircle}º círculo</Typography>
                      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                        <TextField
                          label="Total"
                          type="number"
                          size="small"
                          value={row.total}
                          onChange={(e) =>
                            !hasAutoSlots && updateSlotsField(lvlCircle, "total", e.target.value)
                          }
                          sx={{ flex: 1 }}
                          inputProps={{ min: 0, readOnly: hasAutoSlots }}
                        />
                        <TextField
                          label="Gastos"
                          type="number"
                          size="small"
                          value={row.used}
                          onChange={(e) => updateSlotsField(lvlCircle, "used", e.target.value)}
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

      {/* Grimório */}
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
          <Typography variant="h6">Truques e Magias do Grimório</Typography>
          <Button size="small" variant="contained" onClick={handleOpenNewSpell}>
            Adicionar magia
          </Button>
        </Box>

        {/* Barra de busca/filtros */}
        <Grid container spacing={1} sx={{ mb: 1 }}>
          <Grid item xs={12} md={5}>
            <TextField
              label="Buscar (nome/descrição...)"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              fullWidth
              size="small"
            />
          </Grid>

          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Nível</InputLabel>
              <Select
                label="Nível"
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="0">Truques</MenuItem>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <MenuItem key={n} value={String(n)}>
                    {n}º
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Tempo</InputLabel>
              <Select
                label="Tempo"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
              >
                <MenuItem value="all">Todos</MenuItem>
                {CASTING_TIME_PRESETS.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2} sx={{ display: "flex", alignItems: "center" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={preparedOnly}
                  onChange={(e) => setPreparedOnly(e.target.checked)}
                />
              }
              label="Só preparadas"
            />
          </Grid>
        </Grid>

        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          {filteredSpells.length} resultado(s)
        </Typography>

        {filteredSpells.length === 0 ? (
          <Typography variant="caption" sx={{ display: "block", mt: 1, opacity: 0.7 }}>
            Nenhuma magia encontrada com os filtros atuais.
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
            {filteredSpells.map(([id, spellRaw]) => {
              const spell = normalizeSpell(spellRaw);
              const levelLabel = spell.level === 0 ? "Truque" : `${spell.level}º círculo`;

              return (
                <Accordion key={id} disableGutters>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ width: "100%", pr: 1 }}>
                      <FormControlLabel
                        onClick={(e) => e.stopPropagation()}
                        onFocus={(e) => e.stopPropagation()}
                        control={
                          <Checkbox
                            size="small"
                            checked={!!spell.prepared}
                            onChange={() => handleTogglePrepared(id)}
                          />
                        }
                        label="Preparada"
                        sx={{ mr: 1 }}
                      />

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 600 }} noWrap>
                          {spell.name || "(Sem nome)"}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: "wrap" }}>
                          <Chip size="small" label={levelLabel} />
                          <Chip size="small" variant="outlined" label={`Tempo: ${spell.castingTime || "—"}`} />
                          <Chip size="small" variant="outlined" label={`Alcance: ${spell.range || "—"}`} />
                          <Chip size="small" variant="outlined" label={`Duração: ${spell.duration || "—"}`} />
                          <Chip
                            size="small"
                            variant="outlined"
                            label={`Comp.: ${formatComponents(spell.components, spell.material)}`}
                          />
                          {spell.concentration && <Chip size="small" color="warning" label="Concentração" />}
                          {spell.ritual && <Chip size="small" color="info" label="Ritual" />}
                        </Stack>
                      </Box>

                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditSpell(id);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>

                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSpell(id);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </AccordionSummary>

                  <AccordionDetails>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2">Descrição</Typography>
                      <Typography sx={{ whiteSpace: "pre-wrap" }}>
                        {spell.description?.trim() ? spell.description.trim() : "—"}
                      </Typography>

                      {spell.higherLevels?.trim() ? (
                        <>
                          <Divider />
                          <Typography variant="subtitle2">Em níveis superiores</Typography>
                          <Typography sx={{ whiteSpace: "pre-wrap" }}>
                            {spell.higherLevels.trim()}
                          </Typography>
                        </>
                      ) : null}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        )}
      </Paper>

      {/* Modal de criação/edição de magia */}
      <Dialog open={spellModalOpen} onClose={handleCloseSpellModal} fullWidth maxWidth="md">
        <DialogTitle>{editingId ? "Editar magia" : "Adicionar magia"}</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={7}>
                <TextField
                  label="Nome"
                  value={draft.name}
                  onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={5}>
                <FormControl fullWidth>
                  <InputLabel>Nível</InputLabel>
                  <Select
                    label="Nível"
                    value={draft.level}
                    onChange={(e) => setDraft((p) => ({ ...p, level: Number(e.target.value) }))}
                  >
                    <MenuItem value={0}>Truque (0)</MenuItem>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                      <MenuItem key={n} value={n}>
                        {n}º círculo
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Tempo de conjuração</InputLabel>
                  <Select
                    label="Tempo de conjuração"
                    value={castingTimeSelectValue}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "__custom__") {
                        setDraft((p) => ({ ...p, castingTime: "" }));
                        return;
                      }
                      setDraft((p) => ({ ...p, castingTime: String(v) }));
                    }}
                  >
                    {CASTING_TIME_PRESETS.map((t) => (
                      <MenuItem key={t} value={t}>
                        {t}
                      </MenuItem>
                    ))}
                    <MenuItem value="__custom__">Outro…</MenuItem>
                  </Select>
                </FormControl>

                {castingTimeSelectValue === "__custom__" && (
                  <TextField
                    label="Tempo (personalizado)"
                    value={draft.castingTime}
                    onChange={(e) => setDraft((p) => ({ ...p, castingTime: e.target.value }))}
                    fullWidth
                    sx={{ mt: 1 }}
                  />
                )}
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Alcance"
                  value={draft.range}
                  onChange={(e) => setDraft((p) => ({ ...p, range: e.target.value }))}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Duração"
                  value={draft.duration}
                  onChange={(e) => setDraft((p) => ({ ...p, duration: e.target.value }))}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  Componentes
                </Typography>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!draft.components.v}
                        onChange={(e) =>
                          setDraft((p) => ({
                            ...p,
                            components: { ...p.components, v: e.target.checked },
                          }))
                        }
                      />
                    }
                    label="V"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!draft.components.s}
                        onChange={(e) =>
                          setDraft((p) => ({
                            ...p,
                            components: { ...p.components, s: e.target.checked },
                          }))
                        }
                      />
                    }
                    label="S"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!draft.components.m}
                        onChange={(e) =>
                          setDraft((p) => ({
                            ...p,
                            components: { ...p.components, m: e.target.checked },
                          }))
                        }
                      />
                    }
                    label="M"
                  />
                </FormGroup>

                {draft.components.m && (
                  <TextField
                    label="Materiais (se houver)"
                    value={draft.material}
                    onChange={(e) => setDraft((p) => ({ ...p, material: e.target.value }))}
                    fullWidth
                    sx={{ mt: 1 }}
                  />
                )}
              </Grid>

              <Grid item xs={12}>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!draft.concentration}
                        onChange={(e) => setDraft((p) => ({ ...p, concentration: e.target.checked }))}
                      />
                    }
                    label="Concentração"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!draft.ritual}
                        onChange={(e) => setDraft((p) => ({ ...p, ritual: e.target.checked }))}
                      />
                    }
                    label="Ritual"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!draft.prepared}
                        onChange={(e) => setDraft((p) => ({ ...p, prepared: e.target.checked }))}
                      />
                    }
                    label="Preparada"
                  />
                </FormGroup>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Descrição"
                  value={draft.description}
                  onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))}
                  fullWidth
                  multiline
                  minRows={5}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Em níveis superiores (opcional)"
                  value={draft.higherLevels}
                  onChange={(e) => setDraft((p) => ({ ...p, higherLevels: e.target.value }))}
                  fullWidth
                  multiline
                  minRows={3}
                />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseSpellModal}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveDraft} disabled={!draft.name.trim()}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}