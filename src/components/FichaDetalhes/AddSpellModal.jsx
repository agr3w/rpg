import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Grid,
  Stack,
  FormControlLabel,
  Switch,
  Checkbox,
  Box,
  Typography,
  Paper,
  useTheme,
} from "@mui/material";

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

const MECHANIC_TYPES = [
  { id: "attack", label: "Ataque Mágico vs CA" },
  { id: "save", label: "Teste de Resistência (CD)" },
  { id: "heal", label: "Cura / Suporte" },
  { id: "utility", label: "Utilidade / Efeito" },
];

const SAVE_ATTRIBUTES = [
  "Força",
  "Destreza",
  "Constituição",
  "Inteligência",
  "Sabedoria",
  "Carisma",
];

export default function AddSpellModal({
  open,
  editingSpell = null,
  presetCircle = 0,
  onClose,
  onSave,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const arcanaColor = isDark ? "#ba68c8" : "#8e24aa";
  const arcanaBorder = isDark ? "rgba(186, 104, 200, 0.3)" : "rgba(142, 36, 170, 0.25)";
  const strokeColor = isDark ? "rgba(229,179,36,0.2)" : "rgba(131,60,11,0.2)";

  const [spellForm, setSpellForm] = useState({
    name: "",
    level: presetCircle,
    school: "Evocação",
    mechanic: "attack",
    saveType: "Destreza",
    damage: "",
    castingTime: "1 Ação",
    range: "18m (60ft)",
    duration: "Instantânea",
    components: { v: true, s: true, m: false },
    materialText: "",
    concentration: false,
    ritual: false,
    prepared: presetCircle === 0,
    description: "",
    higherLevels: "",
  });

  useEffect(() => {
    if (editingSpell) {
      setSpellForm({
        name: editingSpell.name || "",
        level: Number(editingSpell.level || 0),
        school: editingSpell.school || "Evocação",
        mechanic: editingSpell.mechanic || "attack",
        saveType: editingSpell.saveType || "Destreza",
        damage: editingSpell.damage || "",
        castingTime: editingSpell.castingTime || "1 Ação",
        range: editingSpell.range || "18m (60ft)",
        duration: editingSpell.duration || "Instantânea",
        components: {
          v: !!editingSpell.components?.v,
          s: !!editingSpell.components?.s,
          m: !!editingSpell.components?.m,
        },
        materialText: editingSpell.materialText || editingSpell.material || "",
        concentration: !!editingSpell.concentration,
        ritual: !!editingSpell.ritual,
        prepared: !!editingSpell.prepared,
        description: editingSpell.description || "",
        higherLevels: editingSpell.higherLevels || "",
      });
    } else {
      setSpellForm({
        name: "",
        level: presetCircle,
        school: "Evocação",
        mechanic: "attack",
        saveType: "Destreza",
        damage: "",
        castingTime: "1 Ação",
        range: "18m (60ft)",
        duration: "Instantânea",
        components: { v: true, s: true, m: false },
        materialText: "",
        concentration: false,
        ritual: false,
        prepared: presetCircle === 0,
        description: "",
        higherLevels: "",
      });
    }
  }, [editingSpell, presetCircle, open]);

  const handleConfirmSave = () => {
    const name = spellForm.name.trim();
    if (!name) return;

    onSave?.({
      ...spellForm,
      name,
      level: Number(spellForm.level || 0),
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        {editingSpell ? "Editar Magia" : "Nova Magia no Grimório"}
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {/* Nome e Círculo */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={7}>
              <TextField
                label="Nome da Magia"
                placeholder="ex: Bola de Fogo, Mísseis Mágicos, Curar Ferimentos"
                value={spellForm.name}
                onChange={(e) => setSpellForm((p) => ({ ...p, name: e.target.value }))}
                fullWidth
                size="small"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={5}>
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

          {/* Escola e Mecânica */}
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
                label="Tipo de Mecânica D&D 5e"
                value={spellForm.mechanic}
                onChange={(e) => setSpellForm((p) => ({ ...p, mechanic: e.target.value }))}
                fullWidth
                size="small"
              >
                {MECHANIC_TYPES.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          {/* Dano / Efeito e Atributo de Salvaguarda se aplicável */}
          <Grid container spacing={2}>
            <Grid item xs={spellForm.mechanic === "save" ? 6 : 12}>
              <TextField
                label="Dano / Cura / Efeito"
                placeholder="ex: 8d6 Fogo, 1d8+3 Cura, 3d6 Elétrico"
                value={spellForm.damage}
                onChange={(e) => setSpellForm((p) => ({ ...p, damage: e.target.value }))}
                fullWidth
                size="small"
              />
            </Grid>

            {spellForm.mechanic === "save" && (
              <Grid item xs={6}>
                <TextField
                  select
                  label="Atributo de Salvaguarda"
                  value={spellForm.saveType}
                  onChange={(e) => setSpellForm((p) => ({ ...p, saveType: e.target.value }))}
                  fullWidth
                  size="small"
                >
                  {SAVE_ATTRIBUTES.map((attr) => (
                    <MenuItem key={attr} value={attr}>
                      {attr}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}
          </Grid>

          {/* Tempo, Alcance e Duração */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
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

            <Grid item xs={6} sm={4}>
              <TextField
                label="Alcance"
                placeholder="ex: 18m (60ft), Toque"
                value={spellForm.range}
                onChange={(e) => setSpellForm((p) => ({ ...p, range: e.target.value }))}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid item xs={6} sm={4}>
              <TextField
                label="Duração"
                placeholder="ex: Instantânea, 1 min"
                value={spellForm.duration}
                onChange={(e) => setSpellForm((p) => ({ ...p, duration: e.target.value }))}
                fullWidth
                size="small"
              />
            </Grid>
          </Grid>

          {/* Concentração e Ritual */}
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

          {/* Descrição */}
          <TextField
            label="Descrição / Efeito Detalhado da Magia"
            placeholder="Descreva o que a magia faz, alvos, área de efeito, regras, etc."
            value={spellForm.description}
            onChange={(e) => setSpellForm((p) => ({ ...p, description: e.target.value }))}
            fullWidth
            multiline
            minRows={3}
            size="small"
          />

          {/* Em Níveis Superiores */}
          <TextField
            label="Em Níveis Superiores (Upcasting)"
            placeholder="ex: Quando conjurada com espaço de 4º nível ou superior, o dano aumenta em +1d6 para cada nível."
            value={spellForm.higherLevels}
            onChange={(e) => setSpellForm((p) => ({ ...p, higherLevels: e.target.value }))}
            fullWidth
            size="small"
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ color: "text.secondary" }}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirmSave}
          disabled={!spellForm.name.trim()}
          sx={{
            bgcolor: arcanaColor,
            color: "#fff",
            fontWeight: 800,
            "&:hover": { bgcolor: arcanaColor, filter: "brightness(0.92)" },
          }}
        >
          Salvar Magia
        </Button>
      </DialogActions>
    </Dialog>
  );
}
