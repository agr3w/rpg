import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { motion } from "framer-motion";

const DEFAULT_TRAINING = {
  armaduraLeve: false,
  armaduraMedia: false,
  armaduraPesada: false,
  escudos: false,
  armas: "",
  ferramentas: "",
};

export default function FichaOrigemPanel({
  ficha,
  story,
  onStoryChange,
  sectionMotion,
  trainings,
  onTrainingsChange,
}) {
  const [localStory, setLocalStory] = useState(story || "");
  const [localTraining, setLocalTraining] = useState(
    trainings || DEFAULT_TRAINING
  );

  useEffect(() => {
    setLocalStory(story || "");
  }, [story]);

  useEffect(() => {
    setLocalTraining(trainings || DEFAULT_TRAINING);
  }, [trainings]);

  const handleBlur = () => {
    if (onStoryChange) onStoryChange(localStory);
  };

  const updateTraining = (partial) => {
    const next = { ...localTraining, ...partial };
    setLocalTraining(next);
    onTrainingsChange && onTrainingsChange(next);
  };

  return (
    <Box
      sx={{
        "& .MuiPaper-root": {
          border: "1px solid var(--ficha-accent-soft, rgba(191,143,0,0.2))",
          bgcolor: "var(--ficha-surface, rgba(236,225,207,0.9))",
          color: "var(--ficha-text, #2f2318)",
          borderRadius: 2,
        },
        "& .MuiTypography-root": { color: "inherit" },
        "& .MuiListItemText-primary": { color: "var(--ficha-text, #2f2318)" },
        "& .MuiFormLabel-root": { color: "var(--ficha-text-muted, rgba(47,35,24,0.74))" },
        "& .MuiInputBase-input": { color: "var(--ficha-text, #2f2318)" },
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
          borderColor: "var(--ficha-line, rgba(47,35,24,0.22))",
        },
        "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "var(--ficha-accent, #bf8f00)",
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "var(--ficha-accent, #bf8f00)",
        },
        "& .MuiCheckbox-root.Mui-checked": { color: "var(--ficha-accent, #bf8f00)" },
      }}
    >
      {/* Verso: História + Antecedente / Traços / Lore */}
      <Box sx={{ mt: 1 }}>
        <motion.div {...sectionMotion}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              História do personagem
            </Typography>

            <TextField
              value={localStory}
              onChange={(e) => setLocalStory(e.target.value)}
              onBlur={handleBlur}
              placeholder="Conte aqui a história, motivações e eventos marcantes do personagem..."
              fullWidth
              multiline
              minRows={4}
            />
          </Paper>
        </motion.div>
      </Box>

      <Box sx={{ mt: 3 }}>
        <motion.div {...sectionMotion}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Antecedente, Traços e Lore
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Antecedente</Typography>
                <Typography sx={{ mb: 1 }}>
                  {ficha.antecedenteDetalhes?.antecedente || "—"}
                </Typography>

                <Typography variant="subtitle2">Características</Typography>
                <Typography sx={{ mb: 1 }}>
                  {ficha.antecedenteDetalhes?.caracteristicas
                    ?.CaracteristicasSugeridas || "—"}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Traços</Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary={`Traço: ${
                        ficha.antecedenteDetalhes?.tracoPersonalidade || "—"
                      }`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={`Ideal: ${
                        ficha.antecedenteDetalhes?.ideal || "—"
                      }`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={`Defeito: ${
                        ficha.antecedenteDetalhes?.defeito || "—"
                      }`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={`Vínculo: ${
                        ficha.antecedenteDetalhes?.vinculo || "—"
                      }`}
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
      </Box>

      <Box sx={{ mt: 3 }}>
        <motion.div {...sectionMotion}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Treinamentos em equipamentos e proficiências
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 0.5, fontSize: 13 }}
              >
                Treinamento em armaduras
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  alignItems: "center",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={!!localTraining.armaduraLeve}
                      onChange={(e) =>
                        updateTraining({
                          armaduraLeve: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Leve"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={!!localTraining.armaduraMedia}
                      onChange={(e) =>
                        updateTraining({
                          armaduraMedia: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Média"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={!!localTraining.armaduraPesada}
                      onChange={(e) =>
                        updateTraining({
                          armaduraPesada: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Pesada"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={!!localTraining.escudos}
                      onChange={(e) =>
                        updateTraining({ escudos: e.target.checked })
                      }
                    />
                  }
                  label="Escudos"
                />
              </Box>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  Armas
                </Typography>
                <TextField
                  value={localTraining.armas}
                  onChange={(e) =>
                    updateTraining({ armas: e.target.value })
                  }
                  placeholder="Ex.: Armas simples, marciais, espadas longas..."
                  fullWidth
                  multiline
                  minRows={2}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  Ferramentas
                </Typography>
                <TextField
                  value={localTraining.ferramentas}
                  onChange={(e) =>
                    updateTraining({ ferramentas: e.target.value })
                  }
                  placeholder="Ex.: Kit de ladrão, ferramentas de artesão, instrumento musical..."
                  fullWidth
                  multiline
                  minRows={2}
                />
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
      </Box>
    </Box>
  );
}