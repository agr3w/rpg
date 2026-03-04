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
} from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import InfoIcon from "@mui/icons-material/Info";
import { motion } from "framer-motion";
import FichaXpPanel from "./FichaXpPanel";
import FichaInventory from "./FichaInventory";
import BotaoPainelHabilidade from "components/FichaPage/BotãoPainelHabilidade";

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
  onFichaChange,
  onChangeEquipped,
  onChangeBackpack,
  periciasAtivas = [],
  onChangePericiasAtivas,
  savingThrowsAtivos = [],
  onChangeSavingThrowsAtivos,
  habilidadesRaca = [],
  habilidadesClasse = [],
  classeImagens = [],
  backgroundUrl,
  sectionMotion,
  loadingEquipped,
  loadingBackpack,
}) {
  const [inventoryOpen, setInventoryOpen] = useState(false);

const profBonus =
+    2 + Math.floor(Math.max((fichaEstado.level || 1) - 1, 0) / 4);

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
      {/* 1) XP / Nível */}
      <motion.div {...sectionMotion}>
        <Box sx={{ mb: 3 }}>
          <FichaXpPanel
            userID={userID}
            fichaKey={fichaKey}
            ficha={ficha}
            onFichaChange={onFichaChange}
          />
        </Box>
      </motion.div>

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

      {/* 3) Inventário / Equipamentos */}
      <motion.div {...sectionMotion}>
        <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Inventory2Icon
                fontSize="small"
                style={{ marginRight: 8 }}
              />
              <Typography variant="h6">Inventário & Equipamentos</Typography>
            </Box>

            <Button size="small" onClick={() => setInventoryOpen(true)}>
              Tela cheia
            </Button>
          </Box>

          <FichaInventory
            inventory={fichaEstado.inventory}
            abilityMods={abilityMods}
            level={fichaEstado.level}
            spellAttr={spellAttr}
            onChangeEquipped={onChangeEquipped}
            onChangeBackpack={onChangeBackpack}
          />
        </Paper>
      </motion.div>

      <Dialog
        open={inventoryOpen}
        onClose={() => setInventoryOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            border: "1px solid var(--ficha-accent-soft, rgba(191,143,0,0.2))",
            backgroundColor: "var(--ficha-surface, rgba(236,225,207,0.9))",
            color: "var(--ficha-text, #2f2318)",
          },
        }}
      >
        <DialogTitle>Inventário</DialogTitle>
        <DialogContent dividers>
          <FichaInventory
            inventory={fichaEstado.inventory}
            abilityMods={abilityMods}
            level={fichaEstado.level}
            spellAttr={spellAttr}
            onChangeEquipped={onChangeEquipped}
            onChangeBackpack={onChangeBackpack}
          />
        </DialogContent>
      </Dialog>

      {/* 4) Habilidades de Raça e de Classe */}
      <motion.div {...sectionMotion}>
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Habilidades de Raça & Classe
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Habilidades de Raça
              </Typography>
              {habilidadesRaca.length === 0 ? (
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  Nenhuma habilidade racial cadastrada.
                </Typography>
              ) : (
                <List dense>
                  {habilidadesRaca.map((h, idx) => (
                    <ListItem key={idx}>
                      <ListItemText primary={h} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Habilidades de Classe
              </Typography>

              {/* 🔽 bloco movido pra cá */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
                  mb: 1,
                }}
              >
                <BotaoPainelHabilidade imagens={classeImagens || []} />

                {backgroundUrl && (
                  <Button
                    size="small"
                    variant="text"
                    href={backgroundUrl}
                    target="_blank"
                    rel="noreferrer"
                    startIcon={<InfoIcon fontSize="small" />}
                  >
                    Ver referência
                  </Button>
                )}
              </Box>

              {habilidadesClasse.length === 0 ? (
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  Nenhuma habilidade de classe cadastrada.
                </Typography>
              ) : (
                <List dense>
                  {habilidadesClasse.map((h, idx) => (
                    <ListItem key={idx}>
                      <ListItemText primary={h} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Grid>
          </Grid>
        </Paper>
      </motion.div>
    </Box>
  );
}