import React from "react";
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
} from "@mui/material";

const SKILL_GROUPS = [
  {
    ability: "Força",
    skills: [{ id: "Atletismo", label: "Atletismo" }],
  },
  {
    ability: "Destreza",
    skills: [
      { id: "Acrobacia", label: "Acrobacia" },
      { id: "Furtividade", label: "Furtividade" },
      { id: "Prestidigitação", label: "Prestidigitação" },
    ],
  },
  {
    ability: "Constituição",
    skills: [], // não tem perícias ligadas direto na 5e
  },
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

const getProfBonus = (level = 1) => {
  const l = Math.max(1, Number(level) || 1);
  return 2 + Math.floor((l - 1) / 4); // regra 5e
};

export default function FichaAtributosPericiasPanel({
  level,
  atributosComBonus,
  abilityMods,
  periciasAtivas = [],
  onChangePericiasAtivas,
}) {
  const profBonus = getProfBonus(level);
  const periciasSet = new Set(periciasAtivas || []);

  const toggleSkill = (skillId) => {
    const next = new Set(periciasSet);
    if (next.has(skillId)) next.delete(skillId);
    else next.add(skillId);
    onChangePericiasAtivas?.(Array.from(next));
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2}>
        {/* Bônus de proficiência em cima, como na ficha oficial */}
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
            <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5 }}>
              PROFICIÊNCIA
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>
              {formatBonus(profBonus)}
            </Typography>
          </Paper>
        </Grid>

        {/* Colunas de atributos + perícias */}
        <Grid item xs={12} sm={8} md={10}>
          <Grid container spacing={1}>
            {SKILL_GROUPS.map((group) => {
              const abil = group.ability;
              const mod = abilityMods?.[abil] ?? 0;
              const score = atributosComBonus?.[abil] ?? 10;

              return (
                <Grid key={abil} item xs={6} md={4}>
                  <Paper variant="outlined" sx={{ p: 1.25 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 800, textTransform: "uppercase" }}
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
                      <Typography variant="h5" sx={{ fontWeight: 900 }}>
                        {formatBonus(mod)}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ opacity: 0.7 }}
                      >{`(valor ${score})`}</Typography>
                    </Box>

                    <Typography
                      variant="caption"
                      sx={{ mt: 0.5, display: "block", fontWeight: 600 }}
                    >
                      Salvaguarda: {formatBonus(mod)}
                    </Typography>

                    {group.skills.length > 0 && (
                      <>
                        <Divider sx={{ my: 0.75 }} />
                        <List dense sx={{ py: 0 }}>
                          {group.skills.map((s) => {
                            const trained = periciasSet.has(s.id);
                            const total = mod + (trained ? profBonus : 0);

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
  );
}