//// filepath: src/components/FichaDetalhes/FichaOrigemPanel.jsx
import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { GiHeavyFall, GiRunningNinja, GiHealthNormal, GiBrain } from "react-icons/gi";
import { ImBook } from "react-icons/im";
import { SiStylelint } from "react-icons/si";
import { motion } from "framer-motion";

export default function FichaOrigemPanel({
  ficha,
  atributosComBonus,
  bonusRaca,
  subRacaSelecionada,
  subRacaDetalhes,
  racaSelecionada,
  calcularBonus,
  sectionMotion,
}) {
  return (
    <>
      {/* MIDDLE: Atributos / Equipamentos detalhados */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <motion.div {...sectionMotion}>
            <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Atributos
              </Typography>

              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <GiHeavyFall />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Força: ${atributosComBonus.Força} (${calcularBonus(
                      atributosComBonus.Força
                    )})`}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <GiRunningNinja />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Destreza: ${atributosComBonus.Destreza} (${calcularBonus(
                      atributosComBonus.Destreza
                    )})`}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <GiHealthNormal />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Constituição: ${atributosComBonus.Constituição} (${calcularBonus(
                      atributosComBonus.Constituição
                    )})`}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <GiBrain />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Inteligência: ${atributosComBonus.Inteligência} (${calcularBonus(
                      atributosComBonus.Inteligência
                    )})`}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <ImBook />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Sabedoria: ${atributosComBonus.Sabedoria} (${calcularBonus(
                      atributosComBonus.Sabedoria
                    )})`}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <SiStylelint />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Carisma: ${atributosComBonus.Carisma} (${calcularBonus(
                      atributosComBonus.Carisma
                    )})`}
                  />
                </ListItem>
              </List>

              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Bônus de Raça / Sub-Raça
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {Object.entries(bonusRaca).map(([k, v]) =>
                  v ? (
                    <Chip
                      key={k}
                      label={`${k}: ${v >= 0 ? `+${v}` : v}`}
                      size="small"
                    />
                  ) : null
                )}
                {subRacaSelecionada && (
                  <Chip label={`Sub-raça: ${subRacaSelecionada}`} size="small" />
                )}
              </Box>
            </Paper>
          </motion.div>

          <motion.div {...sectionMotion}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">
                  Equipamentos & Perícias (detalhado)
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle2">Equipamentos</Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary={`Obrigatório: ${
                        ficha.DetalhesDaClasse?.Equipamentos?.equipamentoObgt || "—"
                      }`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={`${
                        ficha.DetalhesDaClasse?.Equipamentos
                          ?.equipamentosClasseSelecionada1 || "—"
                      }`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={`${
                        ficha.DetalhesDaClasse?.Equipamentos
                          ?.equipamentosClasseSelecionada2 || "—"
                      }`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={`${
                        ficha.DetalhesDaClasse?.Equipamentos
                          ?.equipamentosClasseSelecionada3 || "—"
                      }`}
                    />
                  </ListItem>
                </List>

                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2">Perícias selecionadas</Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                    mt: 1,
                  }}
                >
                  {(ficha.DetalhesDaClasse?.periciasClasseSelecionadas || [])
                    .length ? (
                    (ficha.DetalhesDaClasse?.periciasClasseSelecionadas || []).map(
                      (p) => <Chip key={p} label={p} size="small" />
                    )
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      Nenhuma
                    </Typography>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          </motion.div>
        </Grid>

        {/* RIGHT: Raça / Sub-raça / habilidades raciais */}
        <Grid item xs={12} md={5}>
          <motion.div {...sectionMotion}>
            <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">Raça & Sub-raça</Typography>
              <Typography sx={{ mt: 1 }}>{ficha.raca || "—"}</Typography>
              <Typography variant="caption" color="text.secondary">
                Deslocamento: {racaSelecionada.deslocamento || "—"}
              </Typography>

              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2">Habilidades raciais</Typography>
              <List dense>
                {(racaSelecionada.habilidades || []).map((h, i) => (
                  <ListItem key={i}>
                    <ListItemText primary={h} />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2">Sub-raça</Typography>
              <Typography>{subRacaSelecionada || "—"}</Typography>
              <List dense>
                {(subRacaDetalhes.habilidadesSubRaca || []).map((s, i) => (
                  <ListItem key={i}>
                    <ListItemText primary={s} />
                  </ListItem>
                ))}
              </List>

              {subRacaSelecionada === "Gnomo das Rochas" && (
                <Typography variant="caption">
                  Engenhoca:{" "}
                  {ficha.DetalhesDaRaça?.SubRacasInfo?.SubRacaGnomoField
                    ?.Engenhoca || "—"}
                </Typography>
              )}
            </Paper>
          </motion.div>
        </Grid>
      </Grid>

      {/* BOTTOM: Antecedente / Traços / Lore */}
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