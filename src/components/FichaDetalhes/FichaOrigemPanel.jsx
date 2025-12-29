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
} from "@mui/material";
import { motion } from "framer-motion";

export default function FichaOrigemPanel({
  ficha,
  story,
  onStoryChange,
  sectionMotion,
}) {
  const [localStory, setLocalStory] = useState(story || "");

  useEffect(() => {
    setLocalStory(story || "");
  }, [story]);

  const handleBlur = () => {
    if (onStoryChange) onStoryChange(localStory);
  };

  return (
    <>
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
    </>
  );
}