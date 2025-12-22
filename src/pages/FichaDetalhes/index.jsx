import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/database";
import { Link, useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Chip,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DeleteIcon from "@mui/icons-material/Delete";
import Nav from "components/nav";
import BotaoPainelHabilidade from "components/FichaPage/BotãoPainelHabilidade";
import { classes, racas } from "Array/RacaEClasse";
import {
  GiHeavyFall,
  GiRunningNinja,
  GiHealthNormal,
  GiBrain,
} from "react-icons/gi";
import { ImBook } from "react-icons/im";
import { SiStylelint } from "react-icons/si";
import styles from "./fichaDetalhe.module.css";
import { backgrounds } from "./backgounds/arrayLinksBackgrounds";
import { motion } from "framer-motion";
import { getAuth } from "firebase/auth";

const sectionMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.28 },
};

const FichaDetalhes = () => {
  const { ID } = useParams();
  const [ficha, setFicha] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;
  const userID = user?.uid;

  useEffect(() => {
    if (!userID || !ID) return;
    const databaseRef = firebase.database().ref(`fichas/${userID}`);
    databaseRef
      .orderByChild("id")
      .equalTo(ID)
      .once("value")
      .then((snapshot) => {
        const fichaData = snapshot.val();
        if (fichaData) {
          const fichaEncontrada = Object.values(fichaData)[0];
          setFicha(fichaEncontrada);
        } else {
          setFicha(null);
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar ficha:", err);
        setFicha(null);
      });
  }, [ID, userID]);

  if (!ficha) {
    return (
      <>
        <Nav />
        <Box className={styles.pageContainer} sx={{ p: 3 }}>
          <Typography variant="h4" align="center">
            Ficha não encontrada
          </Typography>
        </Box>
      </>
    );
  }

  const classeSelecioanda = classes.find((c) => c.nome === ficha.classe) || {};
  const racaSelecionada = racas.find((r) => r.nome === ficha.raca) || {};
  const subRacaSelecionada =
    ficha.DetalhesDaRaça?.SubRacasInfo?.SubRaca || null;
  const subRacaDetalhes =
    racaSelecionada.SubRacas?.find(
      (sr) => sr.subRacaNome === subRacaSelecionada
    ) || {};

  const atributos = ficha.DetalhesDaRaça?.Atributos || {};
  const bonusRaca = racaSelecionada.proficienciaHabilidadeBonus || {};
  const bonusSub = subRacaDetalhes.habilidadeBonusSubRaca || {};

  const atributosComBonus = {
    Força:
      (Number(atributos.Força) || 0) +
      (Number(bonusRaca.Força) || 0) +
      (Number(bonusSub.Força) || 0),
    Destreza:
      (Number(atributos.Destreza) || 0) +
      (Number(bonusRaca.Destreza) || 0) +
      (Number(bonusSub.Destreza) || 0),
    Constituição:
      (Number(atributos.Constituição) || 0) +
      (Number(bonusRaca.Constituição) || 0) +
      (Number(bonusSub.Constituição) || 0),
    Inteligência:
      (Number(atributos.Inteligência) || 0) +
      (Number(bonusRaca.Inteligência) || 0) +
      (Number(bonusSub.Inteligência) || 0),
    Sabedoria:
      (Number(atributos.Sabedoria) || 0) +
      (Number(bonusRaca.Sabedoria) || 0) +
      (Number(bonusSub.Sabedoria) || 0),
    Carisma:
      (Number(atributos.Carisma) || 0) +
      (Number(bonusRaca.Carisma) || 0) +
      (Number(bonusSub.Carisma) || 0),
  };

  const calcularBonus = (v) => {
    const bonus = Math.floor((v - 10) / 2);
    return bonus >= 0 ? `+${bonus}` : `${bonus}`;
  };

  const classeBackgrounds = {
    Bárbaro: styles.classeBárbaro,
    Bardo: styles.classeBardo,
    Bruxo: styles.classeBruxo,
    Clérigo: styles.classeClérigo,
    Druida: styles.classeDruida,
    Feiticeiro: styles.classeFeiticeiro,
    Guerreiro: styles.classeGuerreiro,
    Ladino: styles.classeLadino,
    Mago: styles.classeMago,
    Monge: styles.classeMonge,
    Paladino: styles.classePaladino,
    Patrulheiro: styles.classePatrulheiro,
  };

  const getClasseBackground = (classe) => classeBackgrounds[classe] || "";

  return (
    <div className={`${getClasseBackground(ficha.classe)}`}>
      <Nav />
      <Box className={styles.fundo}>
        <Box className={styles.pageContainer} sx={{ py: 3 }}>
          <motion.div {...sectionMotion}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 2,
              }}
            >
              <Avatar
                sx={{
                  width: 72,
                  height: 72,
                  bgcolor: "rgba(255,255,255,0.08)",
                }}
              >
                {ficha.nome?.charAt(0)?.toUpperCase() || "?"}
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {ficha.nome}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                  <Chip
                    label={ficha.classe || "—"}
                    icon={<AccountTreeIcon />}
                    size="small"
                  />
                  <Chip
                    label={ficha.raca || "—"}
                    icon={<InfoIcon />}
                    size="small"
                  />
                  <Chip
                    label={`${ficha.riquezaInicial ?? "—"} PO`}
                    icon={<Inventory2Icon />}
                    size="small"
                  />
                </Stack>
              </Box>
            </Box>
          </motion.div>

          <Grid container spacing={3}>
            {/* LEFT: Attributes + Skills */}
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
                      <Chip
                        label={`Sub-raça: ${subRacaSelecionada}`}
                        size="small"
                      />
                    )}
                  </Box>
                </Paper>
              </motion.div>

              <motion.div {...sectionMotion}>
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Equipamentos & Perícias</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="subtitle2">Equipamentos</Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText
                          primary={`Obrigatório: ${
                            ficha.DetalhesDaClasse?.Equipamentos?.equipamentoObgt ||
                            "—"
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
                    <Typography variant="subtitle2">
                      Perícias selecionadas
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                        mt: 1,
                      }}
                    >
                      {(ficha.DetalhesDaClasse?.periciasClasseSelecionadas ||
                        []).length ? (
                        (ficha.DetalhesDaClasse?.periciasClasseSelecionadas ||
                          []).map((p) => (
                          <Chip key={p} label={p} size="small" />
                        ))
                      ) : (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ p: 0.5 }}
                        >
                          Nenhuma
                        </Typography>
                      )}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </motion.div>

              <motion.div {...sectionMotion}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Antecedente & Traços</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="subtitle2">Antecedente</Typography>
                    <Typography sx={{ mb: 1 }}>
                      {ficha.antecedenteDetalhes?.antecedente || "—"}
                    </Typography>

                    <Typography variant="subtitle2">Características</Typography>
                    <Typography sx={{ mb: 1 }}>
                      {
                        ficha.antecedenteDetalhes?.caracteristicas
                          ?.CaracteristicasSugeridas || "—"
                      }
                    </Typography>

                    <Divider sx={{ my: 1 }} />
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
                            ficha.antecedenteDetalhes?.ideal ||
                            ficha.antecedenteDetalhes?.ideal ||
                            "—"
                          }`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary={`Defeito: ${ficha.antecedenteDetalhes?.defeito}`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary={`Vínculo: ${ficha.antecedenteDetalhes?.vinculo}`}
                        />
                      </ListItem>
                    </List>
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            </Grid>

            {/* RIGHT: Race, Languages, Sub-race, Visuals */}
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
                  <Typography variant="subtitle2">Idiomas</Typography>
                  <Box
                    sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}
                  >
                    <Chip
                      label={ficha.DetalhesDaRaça?.Idiomas?.idiomaRacaSelecionado}
                      size="small"
                    />
                    <Chip
                      label={ficha.DetalhesDaRaça?.Idiomas?.idiomaRacaSelecionado2}
                      size="small"
                    />
                  </Box>
                </Paper>
              </motion.div>

              <motion.div {...sectionMotion}>
                <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6">Sub-raça</Typography>
                  <Typography sx={{ mt: 1 }}>{subRacaSelecionada || "—"}</Typography>
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
                      {
                        ficha.DetalhesDaRaça?.SubRacasInfo?.SubRacaGnomoField
                          ?.Engenhoca || "—"
                      }
                    </Typography>
                  )}
                </Paper>
              </motion.div>

              <motion.div {...sectionMotion}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="h6">Galeria / Referência</Typography>
                    <IconButton
                      size="small"
                      component={Link}
                      to={backgrounds[ficha.classe]}
                      target="_blank"
                      aria-label="Background Link"
                    >
                      <InfoIcon />
                    </IconButton>
                  </Box>
                  <BotaoPainelHabilidade
                    imagens={ficha.DetalhesDaClasse?.imagens || []}
                  />
                </Paper>
              </motion.div>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography className={styles.support}>
              BackGround Art By:{" "}
              <Link to={backgrounds[ficha.classe]} className={styles.supportLink}>
                {backgrounds[ficha.classe]}
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default FichaDetalhes;
