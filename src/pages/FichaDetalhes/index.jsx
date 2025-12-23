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
  CircularProgress,
  Skeleton,
  Button,
  TextField,
  LinearProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import BotaoPainelHabilidade from "components/FichaPage/BotãoPainelHabilidade";
import { classes, racas } from "Array/RacaEClasse";
import { GiHeavyFall, GiRunningNinja, GiHealthNormal, GiBrain } from "react-icons/gi";
import { ImBook } from "react-icons/im";
import { SiStylelint } from "react-icons/si";
import styles from "./fichaDetalhe.module.css";
import { backgrounds } from "./backgounds/arrayLinksBackgrounds";
import { motion } from "framer-motion";
import { auth } from "APIs/firebaseConfig";

const sectionMotion = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.28 } };

/* --- XP thresholds (D&D 5e) --- */
const XP_TABLE = {
  1: 0,
  2: 300,
  3: 900,
  4: 2700,
  5: 6500,
  6: 14000,
  7: 23000,
  8: 34000,
  9: 48000,
  10: 64000,
  11: 85000,
  12: 100000,
  13: 120000,
  14: 140000,
  15: 165000,
  16: 195000,
  17: 225000,
  18: 265000,
  19: 305000,
  20: 350000,
};

const computeLevelFromXp = (xp = 0) => {
  for (let lvl = 20; lvl >= 1; lvl--) {
    if ((xp || 0) >= XP_TABLE[lvl]) return lvl;
  }
  return 1;
};

const nextLevelXp = (level) => {
  if (level >= 20) return XP_TABLE[20];
  return XP_TABLE[level + 1] ?? XP_TABLE[20];
};

const FichaDetalhes = () => {
  const { ID } = useParams();
  const [ficha, setFicha] = useState(null);
  const [fichaKey, setFichaKey] = useState(null);
  const [loadingFicha, setLoadingFicha] = useState(true);
  const [bgLoaded, setBgLoaded] = useState(false);
  const [xpInput, setXpInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({ open: false, severity: "success", message: "" });
  const [congratsOpen, setCongratsOpen] = useState(false);

  const user = auth.currentUser;
  const userID = user?.uid;

  useEffect(() => {
    if (!userID || !ID) return;
    setLoadingFicha(true);
    const databaseRef = firebase.database().ref(`fichas/${userID}`);
    databaseRef
      .orderByChild("id")
      .equalTo(ID)
      .once("value")
      .then((snapshot) => {
        const fichaData = snapshot.val();
        if (fichaData) {
          const key = Object.keys(fichaData)[0];
          const fichaEncontrada = fichaData[key];
          setFicha(fichaEncontrada);
          setFichaKey(key);
          setXpInput(String(fichaEncontrada.xp ?? fichaEncontrada.XP ?? 0));
        } else {
          setFicha(null);
          setFichaKey(null);
          setXpInput("0");
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar ficha:", err);
        setFicha(null);
        setFichaKey(null);
      })
      .finally(() => {
        setLoadingFicha(false);
      });
  }, [ID, userID]);

  useEffect(() => {
    setBgLoaded(false);
    if (!ficha) return;
    const url = backgrounds[ficha.classe];
    if (!url) {
      setBgLoaded(true);
      return;
    }
    const img = new Image();
    img.src = url;
    img.onload = () => setBgLoaded(true);
    img.onerror = () => setBgLoaded(true);
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [ficha]);

  const loading = loadingFicha || !bgLoaded;

  if (loading) {
    return (
      <>
        <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
          <Paper sx={{ width: "100%", maxWidth: 1100, p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Skeleton variant="circular" width={72} height={72} />
              <Box sx={{ flex: 1 }}>
                <Skeleton width="40%" height={28} />
                <Skeleton width="35%" height={20} sx={{ mt: 1 }} />
              </Box>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={7}>
                <Skeleton variant="rectangular" height={220} />
                <Box sx={{ mt: 2 }} />
                <Skeleton variant="rectangular" height={180} />
              </Grid>

              <Grid item xs={12} md={5}>
                <Skeleton variant="rectangular" height={140} />
                <Box sx={{ mt: 2 }} />
                <Skeleton variant="rectangular" height={160} />
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <CircularProgress />
            </Box>
          </Paper>
        </Box>
      </>
    );
  }

  if (!ficha) {
    return (
      <>
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
  const subRacaSelecionada = ficha.DetalhesDaRaça?.SubRacasInfo?.SubRaca || null;
  const subRacaDetalhes = racaSelecionada.SubRacas?.find((sr) => sr.subRacaNome === subRacaSelecionada) || {};

  const atributos = ficha.DetalhesDaRaça?.Atributos || {};
  const bonusRaca = racaSelecionada.proficienciaHabilidadeBonus || {};
  const bonusSub = subRacaDetalhes.habilidadeBonusSubRaca || {};

  const atributosComBonus = {
    Força: (Number(atributos.Força) || 0) + (Number(bonusRaca.Força) || 0) + (Number(bonusSub.Força) || 0),
    Destreza: (Number(atributos.Destreza) || 0) + (Number(bonusRaca.Destreza) || 0) + (Number(bonusSub.Destreza) || 0),
    Constituição: (Number(atributos.Constituição) || 0) + (Number(bonusRaca.Constituição) || 0) + (Number(bonusSub.Constituição) || 0),
    Inteligência: (Number(atributos.Inteligência) || 0) + (Number(bonusRaca.Inteligência) || 0) + (Number(bonusSub.Inteligência) || 0),
    Sabedoria: (Number(atributos.Sabedoria) || 0) + (Number(bonusRaca.Sabedoria) || 0) + (Number(bonusSub.Sabedoria) || 0),
    Carisma: (Number(atributos.Carisma) || 0) + (Number(bonusRaca.Carisma) || 0) + (Number(bonusSub.Carisma) || 0),
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

  /* --- XP / Level UI handlers --- */
  const currentXp = Number(ficha.xp ?? ficha.XP ?? 0);
  const currentLevel = Number(ficha.level ?? ficha.Level ?? computeLevelFromXp(currentXp));
  const displayedLevel = computeLevelFromXp(Number(xpInput ?? currentXp));

  const xpToNext = Math.max(0, nextLevelXp(displayedLevel) - Number(xpInput || currentXp));
  const progressFromLevel = (() => {
    const lvl = displayedLevel;
    const base = XP_TABLE[lvl] ?? 0;
    const next = nextLevelXp(lvl);
    const denom = next - base || 1;
    const value = (Number(xpInput || currentXp) - base) / denom;
    return Math.max(0, Math.min(1, value));
  })();

  const handleSaveXp = async () => {
    if (!userID || !fichaKey) {
      setSnack({ open: true, severity: "error", message: "Usuário não autenticado." });
      return;
    }
    const parsed = parseInt(xpInput || "0", 10);
    if (isNaN(parsed) || parsed < 0) {
      setSnack({ open: true, severity: "error", message: "XP inválido." });
      return;
    }

    const newLevel = computeLevelFromXp(parsed);
    const prevLevel = Number(ficha.level ?? ficha.Level ?? computeLevelFromXp(currentXp));

    setSaving(true);
    try {
      await firebase.database().ref(`fichas/${userID}/${fichaKey}`).update({
        xp: parsed,
        level: newLevel,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });
      // update local state
      setFicha((f) => ({ ...f, xp: parsed, level: newLevel }));
      setSnack({ open: true, severity: "success", message: "XP salvo com sucesso." });
      if (newLevel > prevLevel) {
        setCongratsOpen(true);
      }
    } catch (err) {
      console.error("Erro ao salvar XP:", err);
      setSnack({ open: true, severity: "error", message: "Erro ao salvar XP." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`${getClasseBackground(ficha.classe)}`}>
      <Box sx={{ py: 4, background: "transparent" }}>
        <Box sx={{ maxWidth: 1100, mx: "auto", px: { xs: 2, md: 3 }, py: 3, bgcolor: "background.paper", borderRadius: 2, boxShadow: 3 }}>
          {/* TOP: Classe / Habilidades / Quick info */}
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32 }}>
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Grid item xs={12} md={5}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ width: 64, height: 64, bgcolor: "rgba(255,255,255,0.06)" }}>
                      {ficha.nome?.charAt(0)?.toUpperCase() || "?"}
                    </Avatar>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {ficha.nome}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                        <Chip label={ficha.classe || "—"} icon={<AccountTreeIcon />} size="small" />
                        <Chip label={ficha.raca || "—"} icon={<InfoIcon />} size="small" />
                      </Stack>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Características da Classe</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary={classeSelecioanda?.descricaoCurta || ficha.DetalhesDaClasse?.descricao || "—"} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={`Equipamento obrigatório: ${ficha.DetalhesDaClasse?.Equipamentos?.equipamentoObgt || "—"}`} />
                    </ListItem>
                  </List>

                  <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
                    {(ficha.DetalhesDaClasse?.periciasClasseSelecionadas || []).slice(0, 4).map((p) => (
                      <Chip key={p} label={p} size="small" />
                    ))}
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="subtitle2">Riqueza</Typography>
                  <Typography variant="h6" sx={{ mb: 1 }}>{ficha.riquezaInicial ?? "—"} PO</Typography>

                  <Divider sx={{ my: 1 }} />

                  <Typography variant="subtitle2">Idiomas</Typography>
                  <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
                    <Chip label={ficha.DetalhesDaRaça?.Idiomas?.idiomaRacaSelecionado || "—"} size="small" />
                    <Chip label={ficha.DetalhesDaRaça?.Idiomas?.idiomaRacaSelecionado2 || "—"} size="small" />
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={3}>
                <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="subtitle2">Habilidades de Classe</Typography>
                  <Box sx={{ mt: 1 }}>
                    <BotaoPainelHabilidade imagens={ficha.DetalhesDaClasse?.imagens || []} />
                  </Box>
                  <Button component={Link} to={backgrounds[ficha.classe]} target="_blank" sx={{ mt: 1 }} size="small" startIcon={<InfoIcon />}>
                    Ver referência
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </motion.div>

          {/* XP / Level panel (new) */}
          <Box sx={{ mb: 2 }}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2">Nível atual</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {ficha.level ?? ficha.Level ?? computeLevelFromXp(currentXp)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">XP total: {Number(ficha.xp ?? ficha.XP ?? currentXp)}</Typography>
                </Grid>

                <Grid item xs={12} md={5}>
                  <Typography variant="subtitle2">XP (editar)</Typography>
                  <TextField
                    value={xpInput}
                    onChange={(e) => setXpInput(e.target.value.replace(/[^\d]/g, ""))}
                    fullWidth
                    size="small"
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  />
                  <Box sx={{ mt: 1 }}>
                    <LinearProgress variant="determinate" value={progressFromLevel * 100} sx={{ height: 10, borderRadius: 2 }} />
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                      <Typography variant="caption">Nível {displayedLevel}</Typography>
                      <Typography variant="caption">Próx: {nextLevelXp(displayedLevel)} XP</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={3} sx={{ textAlign: { xs: "left", md: "right" } }}>
                  <Button variant="contained" onClick={handleSaveXp} disabled={saving} size="medium">
                    {saving ? "Salvando..." : "Salvar XP"}
                  </Button>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    {xpToNext > 0 ? `${xpToNext} XP para o próximo nível` : "Nível máximo"}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>

          {/* MIDDLE: Atributos */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <motion.div {...sectionMotion}>
                <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>Atributos</Typography>

                  <List dense>
                    <ListItem>
                      <ListItemIcon><GiHeavyFall /></ListItemIcon>
                      <ListItemText primary={`Força: ${atributosComBonus.Força} (${calcularBonus(atributosComBonus.Força)})`} />
                    </ListItem>

                    <ListItem>
                      <ListItemIcon><GiRunningNinja /></ListItemIcon>
                      <ListItemText primary={`Destreza: ${atributosComBonus.Destreza} (${calcularBonus(atributosComBonus.Destreza)})`} />
                    </ListItem>

                    <ListItem>
                      <ListItemIcon><GiHealthNormal /></ListItemIcon>
                      <ListItemText primary={`Constituição: ${atributosComBonus.Constituição} (${calcularBonus(atributosComBonus.Constituição)})`} />
                    </ListItem>

                    <ListItem>
                      <ListItemIcon><GiBrain /></ListItemIcon>
                      <ListItemText primary={`Inteligência: ${atributosComBonus.Inteligência} (${calcularBonus(atributosComBonus.Inteligência)})`} />
                    </ListItem>

                    <ListItem>
                      <ListItemIcon><ImBook /></ListItemIcon>
                      <ListItemText primary={`Sabedoria: ${atributosComBonus.Sabedoria} (${calcularBonus(atributosComBonus.Sabedoria)})`} />
                    </ListItem>

                    <ListItem>
                      <ListItemIcon><SiStylelint /></ListItemIcon>
                      <ListItemText primary={`Carisma: ${atributosComBonus.Carisma} (${calcularBonus(atributosComBonus.Carisma)})`} />
                    </ListItem>
                  </List>

                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Bônus de Raça / Sub-Raça</Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {Object.entries(bonusRaca).map(([k, v]) => v ? <Chip key={k} label={`${k}: ${v >= 0 ? `+${v}` : v}`} size="small" /> : null)}
                    {subRacaSelecionada && <Chip label={`Sub-raça: ${subRacaSelecionada}`} size="small" />}
                  </Box>
                </Paper>
              </motion.div>

              <motion.div {...sectionMotion}>
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Equipamentos & Perícias (detalhado)</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="subtitle2">Equipamentos</Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText primary={`Obrigatório: ${ficha.DetalhesDaClasse?.Equipamentos?.equipamentoObgt || "—"}`} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary={`${ficha.DetalhesDaClasse?.Equipamentos?.equipamentosClasseSelecionada1 || "—"}`} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary={`${ficha.DetalhesDaClasse?.Equipamentos?.equipamentosClasseSelecionada2 || "—"}`} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary={`${ficha.DetalhesDaClasse?.Equipamentos?.equipamentosClasseSelecionada3 || "—"}`} />
                      </ListItem>
                    </List>

                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle2">Perícias selecionadas</Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                      {(ficha.DetalhesDaClasse?.periciasClasseSelecionadas || []).length ? (
                        (ficha.DetalhesDaClasse?.periciasClasseSelecionadas || []).map((p) => <Chip key={p} label={p} size="small" />)
                      ) : (
                        <Typography variant="caption" color="text.secondary">Nenhuma</Typography>
                      )}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            </Grid>

            {/* RIGHT: Raça / Sub-raça / Galeria */}
            <Grid item xs={12} md={5}>
              <motion.div {...sectionMotion}>
                <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6">Raça & Sub-raça</Typography>
                  <Typography sx={{ mt: 1 }}>{ficha.raca || "—"}</Typography>
                  <Typography variant="caption" color="text.secondary">Deslocamento: {racaSelecionada.deslocamento || "—"}</Typography>

                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2">Habilidades raciais</Typography>
                  <List dense>
                    {(racaSelecionada.habilidades || []).map((h, i) => (
                      <ListItem key={i}><ListItemText primary={h} /></ListItem>
                    ))}
                  </List>

                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2">Sub-raça</Typography>
                  <Typography>{subRacaSelecionada || "—"}</Typography>
                  <List dense>
                    {(subRacaDetalhes.habilidadesSubRaca || []).map((s, i) => (
                      <ListItem key={i}><ListItemText primary={s} /></ListItem>
                    ))}
                  </List>

                  {subRacaSelecionada === "Gnomo das Rochas" && (
                    <Typography variant="caption">Engenhoca: {ficha.DetalhesDaRaça?.SubRacasInfo?.SubRacaGnomoField?.Engenhoca || "—"}</Typography>
                  )}
                </Paper>
              </motion.div>
            </Grid>
          </Grid>

          {/* BOTTOM: Lore / Antecedente / Traços (menos prioritário) */}
          <Box sx={{ mt: 3 }}>
            <motion.div {...sectionMotion}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>Antecedente, Traços e Lore</Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2">Antecedente</Typography>
                    <Typography sx={{ mb: 1 }}>{ficha.antecedenteDetalhes?.antecedente || "—"}</Typography>

                    <Typography variant="subtitle2">Características</Typography>
                    <Typography sx={{ mb: 1 }}>{ficha.antecedenteDetalhes?.caracteristicas?.CaracteristicasSugeridas || "—"}</Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2">Traços</Typography>
                    <List dense>
                      <ListItem><ListItemText primary={`Traço: ${ficha.antecedenteDetalhes?.tracoPersonalidade || "—"}`} /></ListItem>
                      <ListItem><ListItemText primary={`Ideal: ${ficha.antecedenteDetalhes?.ideal || "—"}`} /></ListItem>
                      <ListItem><ListItemText primary={`Defeito: ${ficha.antecedenteDetalhes?.defeito || "—"}`} /></ListItem>
                      <ListItem><ListItemText primary={`Vínculo: ${ficha.antecedenteDetalhes?.vinculo || "—"}`} /></ListItem>
                    </List>
                  </Grid>
                </Grid>
              </Paper>
            </motion.div>
          </Box>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography sx={{ fontSize: 13.5, fontWeight: 600 }}>
              BackGround Art By:{" "}
              <Link to={backgrounds[ficha.classe]} target="_blank" rel="noreferrer" style={{ color: "inherit", fontWeight: 700 }}>
                {backgrounds[ficha.classe]}
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Snackbars */}
      <Snackbar open={snack.open} autoHideDuration={3500} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          {snack.message}
        </Alert>
      </Snackbar>

      <Snackbar open={congratsOpen} autoHideDuration={6000} onClose={() => setCongratsOpen(false)}>
        <Alert severity="success" onClose={() => setCongratsOpen(false)}>
          Parabéns — seu personagem subiu de nível!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default FichaDetalhes;
