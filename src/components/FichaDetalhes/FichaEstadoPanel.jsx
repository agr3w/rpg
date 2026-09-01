//// filepath: src/components/FichaDetalhes/FichaEstadoPanel.jsx
import React, { useMemo, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import InfoIcon from "@mui/icons-material/Info";
import { motion } from "framer-motion";
import FichaTacticalEquipmentHub from "./FichaTacticalEquipmentHub";
import FichaHabilidadesPanel from "./FichaHabilidadesPanel";

// grupos exatamente como na ficha: 1 card por atributo
const SKILL_GROUPS = [
  { ability: "Força", skills: [{ id: "Atletismo", label: "Atletismo" }] },
  {
    ability: "Destreza",
    skills: [
      { id: "Acrobacia", label: "Acrobacia" },
      { id: "Furtividade", label: "Furtividade" },
      { id: "Prestidigitação", label: "Prestidigitação" },
    ],
  },
  { ability: "Constituição", skills: [] },
  {
    ability: "Inteligência",
    skills: [
      { id: "Arcanismo", label: "Arcanismo" },
      { id: "História", label: "História" },
      { id: "Investigação", label: "Investigação" },
      { id: "Natureza", label: "Natureza" },
      { id: "Religião", label: "Religião" },
    ],
  },
  {
    ability: "Sabedoria",
    skills: [
      { id: "Intuição", label: "Intuição" },
      { id: "Lidar com Animais", label: "Lidar com animais" },
      { id: "Medicina", label: "Medicina" },
      { id: "Percepção", label: "Percepção" },
      { id: "Sobrevivência", label: "Sobrevivência" },
    ],
  },
  {
    ability: "Carisma",
    skills: [
      { id: "Atuação", label: "Atuação" },
      { id: "Enganação", label: "Enganação" },
      { id: "Intimidação", label: "Intimidação" },
      { id: "Persuasão", label: "Persuasão" },
    ],
  },
];

const formatBonus = (v = 0) => (v >= 0 ? `+${v}` : `${v}`);

// bônus de proficiência por nível (5e)
const getProfBonus = (level = 1) => {
  const l = Math.max(1, Number(level) || 1);
  return 2 + Math.floor((l - 1) / 4);
};

export default function FichaEstadoPanel({
  userID,
  fichaKey,
  ficha,
  fichaEstado,
  abilityMods = {},
  atributosComBonus = {},
  spellAttr,
  spellcasting = {},
  onChangeSpellcasting,
  profBonus: profBonusProp,
  classe,
  onFichaChange,
  onChangeEquipped,
  onChangeBackpack,
  periciasAtivas = [],
  onChangePericiasAtivas,
  savingThrowsAtivos = [],
  onChangeSavingThrowsAtivos,
  habilidadesRaca = [],
  classFeaturesProgression = [],
  customClassFeatures = [],
  onChangeCustomClassFeatures,
  usosHabilidades = {},
  onChangeUsosHabilidades,
  classeImagens = [],
  backgroundUrl,
  levelAtual = 1,
  sectionMotion,
  loadingEquipped,
  loadingBackpack,
}) {
  const profBonus =
    profBonusProp || 2 + Math.floor(Math.max((fichaEstado.level || 1) - 1, 0) / 4);

  const periciasSet = new Set(periciasAtivas || []);
  const savesSet = new Set(savingThrowsAtivos || []);

  const toggleSkill = (skillId) => {
    if (!onChangePericiasAtivas) return;
    const next = new Set(periciasSet);
    if (next.has(skillId)) next.delete(skillId);
    else next.add(skillId);
    onChangePericiasAtivas(Array.from(next));
  };

  const toggleSavingThrow = (ability) => {
    if (!onChangeSavingThrowsAtivos) return;
    const next = new Set(savesSet);
    if (next.has(ability)) next.delete(ability);
    else next.add(ability);
    onChangeSavingThrowsAtivos(Array.from(next));
  };

  return (
    <Box
      sx={{
        "& .MuiPaper-root": {
          border: "1px solid var(--ficha-accent-soft, rgba(191,143,0,0.2))",
          bgcolor: "var(--ficha-surface, rgba(236,225,207,0.9))",
          color: "var(--ficha-text, #2f2318)",
        },
        "& .MuiDivider-root": { borderColor: "var(--ficha-line, rgba(47,35,24,0.22))" },
        "& .MuiTypography-root": { color: "inherit" },
        "& .MuiListItemText-primary": { color: "var(--ficha-text, #2f2318)" },
        "& .MuiCheckbox-root.Mui-checked": { color: "var(--ficha-accent, #bf8f00)" },
      }}
    >


      {/* 2) Atributos + Salvaguardas + Perícias (estilo ficha oficial) */}
      <motion.div {...sectionMotion}>
        <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2}>
            {/* Bônus de proficiência */}
            <Grid item xs={12} sm={4} md={2}>
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  textAlign: "center",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  BÔNUS DE
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 700, mb: 0.5 }}
                >
                  PROFICIÊNCIA
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>
                  {formatBonus(profBonus)}
                </Typography>
              </Paper>
            </Grid>

            {/* Cards por atributo */}
            <Grid item xs={12} sm={8} md={10}>
              <Grid container spacing={1}>
                {SKILL_GROUPS.map((group) => {
                  const abil = group.ability;
                  const mod = Number(abilityMods?.[abil] ?? 0);
                  const score = Number(atributosComBonus?.[abil] ?? 10);

                  const saveProficient = savesSet.has(abil);
                  const saveTotal = mod + (saveProficient ? profBonus : 0);

                  return (
                    <Grid key={abil} item xs={6} md={4}>
                      <Paper variant="outlined" sx={{ p: 1.25 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 800,
                            textTransform: "uppercase",
                          }}
                        >
                          {abil}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "baseline",
                            gap: 1,
                            mt: 0.5,
                          }}
                        >
                          <Typography
                            variant="h5"
                            sx={{ fontWeight: 900 }}
                          >
                            {formatBonus(mod)}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ opacity: 0.7 }}
                          >{`(valor ${score})`}</Typography>
                        </Box>

                        {/* Salvaguarda */}
                        <Box
                          sx={{
                            mt: 0.75,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 1,
                          }}
                        >
                          <Box
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <Checkbox
                              edge="start"
                              size="small"
                              checked={saveProficient}
                              onChange={() => toggleSavingThrow(abil)}
                              sx={{ mr: 0.5 }}
                            />
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 600 }}
                            >
                              Salvaguarda
                            </Typography>
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 700 }}
                          >
                            {formatBonus(saveTotal)}
                          </Typography>
                        </Box>

                        {/* Perícias do atributo */}
                        {group.skills.length > 0 && (
                          <>
                            <Divider sx={{ my: 0.75 }} />
                            <List dense sx={{ py: 0 }}>
                              {group.skills.map((s) => {
                                const trained = periciasSet.has(s.id);
                                const total =
                                  mod + (trained ? profBonus : 0);

                                return (
                                  <ListItem
                                    key={s.id}
                                    dense
                                    disableGutters
                                    secondaryAction={
                                      <Typography
                                        variant="caption"
                                        sx={{ fontWeight: 700 }}
                                      >
                                        {formatBonus(total)}
                                      </Typography>
                                    }
                                  >
                                    <Checkbox
                                      edge="start"
                                      size="small"
                                      checked={trained}
                                      onChange={() => toggleSkill(s.id)}
                                      sx={{ mr: 0.5 }}
                                    />
                                    <ListItemText
                                      primaryTypographyProps={{
                                        variant: "caption",
                                      }}
                                      primary={s.label}
                                    />
                                  </ListItem>
                                );
                              })}
                            </List>
                          </>
                        )}
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      {/* 3) Hub Tático: Arsenal, Grimório & Mochila */}
      <motion.div {...sectionMotion}>
        <FichaTacticalEquipmentHub
          inventory={fichaEstado.inventory || {}}
          spellcasting={spellcasting || ficha?.spellcasting || {}}
          abilityMods={abilityMods}
          spellAttr={spellAttr}
          profBonus={profBonus || getProfBonus(levelAtual)}
          classe={classe || ficha?.classe || "Aventureiro"}
          level={fichaEstado.level || levelAtual}
          onChangeEquipped={onChangeEquipped}
          onChangeBackpack={onChangeBackpack}
          onChangeSpellcasting={onChangeSpellcasting}
        />
      </motion.div>

      {/* 4) Habilidades de Raça, Recursos de Classe & Talentos */}
      <motion.div {...sectionMotion}>
        <FichaHabilidadesPanel
          ficha={ficha}
          racaNome={ficha?.raca}
          subRacaNome={ficha?.DetalhesDaRaça?.SubRaca}
          classeNome={classe || ficha?.classe}
          levelAtual={fichaEstado.level || levelAtual}
          habilidadesRaca={habilidadesRaca}
          classFeaturesProgression={classFeaturesProgression}
          customClassFeatures={customClassFeatures}
          onChangeCustomClassFeatures={onChangeCustomClassFeatures}
          usosHabilidades={usosHabilidades}
          onChangeUsosHabilidades={onChangeUsosHabilidades}
          abilityMods={abilityMods}
        />
      </motion.div>
    </Box>
  );
}