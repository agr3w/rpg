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
  Stack,
  IconButton,
  CircularProgress,
  Skeleton,
  Button,
  ToggleButtonGroup,
  ToggleButton,
   TextField,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import BotaoPainelHabilidade from "components/FichaPage/BotãoPainelHabilidade";
import { classes, racas } from "Array/RacaEClasse";
import styles from "./fichaDetalhe.module.css";
import { backgrounds } from "./backgounds/arrayLinksBackgrounds";
import { motion } from "framer-motion";
import { auth } from "APIs/firebaseConfig";
import FichaInventory from "components/FichaDetalhes/FichaInventory";
import FichaXpPanel from "components/FichaDetalhes/FichaXpPanel";
import FichaOrigemPanel from "components/FichaDetalhes/FichaOrigemPanel";
import FichaEstadoPanel from "components/FichaDetalhes/FichaEstadoPanel";

const sectionMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.28 },
};

const FichaDetalhes = () => {
  const { ID } = useParams();
  const [ficha, setFicha] = useState(null);
  const [fichaKey, setFichaKey] = useState(null);
  const [loadingFicha, setLoadingFicha] = useState(true);
  const [bgLoaded, setBgLoaded] = useState(false);

  // frente/verso da ficha
  const [activeSide, setActiveSide] = useState("estado");

  // 🔹 rascunho da riqueza (editar antes de salvar)
  const [coinsDraft, setCoinsDraft] = useState(null);

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
        } else {
          setFicha(null);
          setFichaKey(null);
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

  // 🔹 dados “inatos” / de criação de ficha
  const fichaBase = {
    id: ficha.id,
    nome: ficha.nome,
    classe: ficha.classe,
    raca: ficha.raca,
    detalhesRaca: ficha.DetalhesDaRaça,
    detalhesClasse: ficha.DetalhesDaClasse,
    antecedente: ficha.antecedenteDetalhes,
  };

  // 🔹 dados de estado de jogo (mudam ao longo da campanha)
  const parseInitialPo = () => {
    const raw = ficha.riquezaInicial;
    if (!raw) return 0;
    const num = parseInt(String(raw).replace(/\D/g, ""), 10);
    return Number.isNaN(num) ? 0 : num;
  };

  const riquezaMoedas =
    ficha.riquezaMoedas || {
      pc: 0,
      pp: 0,
      pe: 0,
      po: parseInitialPo(), // assume riqueza inicial em PO
      pl: 0,
    };

  const fichaEstado = {
    level: ficha.level || 1,
    xp: ficha.xp ?? ficha.XP ?? 0,
    riquezaMoedas,               // ✅ agora é objeto
    inventory: ficha.inventory || {},
  };

  const classeSelecioanda =
    classes.find((c) => c.nome === fichaBase.classe) || {};
  const racaSelecionada =
    racas.find((r) => r.nome === fichaBase.raca) || {};
  const subRacaSelecionada =
    ficha.DetalhesDaRaça?.SubRacasInfo?.SubRaca || null;
  const subRacaDetalhes =
    racaSelecionada.SubRacas?.find(
      (sr) => sr.subRacaNome === subRacaSelecionada
    ) || {};

  const atributos = ficha.DetalhesDaRaça?.Atributos || {};
  const bonusRaca = racaSelecionada.proficienciaHabilidadeBonus || {};
  const bonusSub = subRacaDetalhes.habilidadeBonusSubRaca || {};

  // 🔹 habilidades de raça / sub-raça / classe
  const habilidadesRaca = racaSelecionada.habilidades || [];
  const habilidadesSubRaca = subRacaDetalhes.habilidadesSubRaca || [];

  const habilidadesClasse =
    ficha.DetalhesDaClasse?.habilidades ||
    classeSelecioanda?.habilidades ||
    [];

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

  const abilityMods = {
    Força: Math.floor(((atributosComBonus.Força || 0) - 10) / 2),
    Destreza: Math.floor(((atributosComBonus.Destreza || 0) - 10) / 2),
    Constituição: Math.floor(
      ((atributosComBonus.Constituição || 0) - 10) / 2
    ),
    Inteligência: Math.floor(
      ((atributosComBonus.Inteligência || 0) - 10) / 2
    ),
    Sabedoria: Math.floor(
      ((atributosComBonus.Sabedoria || 0) - 10) / 2
    ),
    Carisma: Math.floor(
      ((atributosComBonus.Carisma || 0) - 10) / 2
    ),
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

  const getClasseBackground = (classe) =>
    classeBackgrounds[classe] || "";

  const getSpellAttributeForClass = (classe) => {
    if (!classe) return "Inteligência";
    const c = String(classe).toLowerCase();
    if (["bardo", "bruxo", "feiticeiro"].includes(c)) return "Carisma";
    if (["clerigo", "clérigo", "druida"].includes(c)) return "Sabedoria";
    if (["mago"].includes(c)) return "Inteligência";
    return "Inteligência";
  };
  const spellAttr = getSpellAttributeForClass(ficha?.classe);

  // 🔹 salvar história do personagem (verso)
  const handleStoryChange = async (newStory) => {
    const text = String(newStory || "");

    setFicha((prev) => ({ ...(prev || {}), historia: text }));

    if (!userID || !fichaKey) return;
    try {
      await firebase
        .database()
        .ref(`fichas/${userID}/${fichaKey}/historia`)
        .set(text);
    } catch (e) {
      console.error("Erro ao salvar história da ficha:", e);
    }
  };

  // helpers de inventário (mantém no container)
  const persistInventoryPartial = async (partial) => {
    setFicha((prev) => {
      const invAtual = prev?.inventory || {};
      const novoInv = { ...invAtual, ...partial };
      return { ...(prev || {}), inventory: novoInv };
    });

    if (!userID || !fichaKey) return;
    try {
      await firebase
        .database()
        .ref(`fichas/${userID}/${fichaKey}/inventory`)
        .update(partial);
    } catch (e) {
      console.error("Erro ao salvar inventário:", e);
    }
  };

  const handleEquippedChange = (nextEquipped) =>
    persistInventoryPartial({ equipped: nextEquipped || {} });

  const handleBackpackChange = (nextBackpack) =>
    persistInventoryPartial({ backpack: nextBackpack || {} });

  // 🔹 riqueza em moedas
  const handleMoedasChange = async (nextCoins) => {
    const safe = {
      pc: Number(nextCoins.pc || 0),
      pp: Number(nextCoins.pp || 0),
      pe: Number(nextCoins.pe || 0),
      po: Number(nextCoins.po || 0),
      pl: Number(nextCoins.pl || 0),
    };

    setFicha((prev) => ({ ...(prev || {}), riquezaMoedas: safe }));

    if (!userID || !fichaKey) return;
    try {
      await firebase
        .database()
        .ref(`fichas/${userID}/${fichaKey}/riquezaMoedas`)
        .set(safe);
    } catch (e) {
      console.error("Erro ao salvar riqueza:", e);
    }
  };

  // 🔹 riqueza em moedas (editar localmente + salvar no clique)
  const handleMoedasFieldChange = (partial) => {
    const base =
      coinsDraft ||
      fichaEstado.riquezaMoedas || {
        pc: 0,
        pp: 0,
        pe: 0,
        po: 0,
        pl: 0,
      };

    const merged = { ...base, ...partial };
    setCoinsDraft(merged);
  };

  const handleMoedasSave = async () => {
    const source =
      coinsDraft ||
      fichaEstado.riquezaMoedas || {
        pc: 0,
        pp: 0,
        pe: 0,
        po: 0,
        pl: 0,
      };

    const safe = {
      pc: Number(source.pc || 0),
      pp: Number(source.pp || 0),
      pe: Number(source.pe || 0),
      po: Number(source.po || 0),
      pl: Number(source.pl || 0),
    };

    setFicha((prev) => ({ ...(prev || {}), riquezaMoedas: safe }));
    setCoinsDraft(safe);

    if (!userID || !fichaKey) return;
    try {
      await firebase
        .database()
        .ref(`fichas/${userID}/${fichaKey}/riquezaMoedas`)
        .set(safe);
    } catch (e) {
      console.error("Erro ao salvar riqueza:", e);
    }
  };

  // 🔹 perícias ativas (classe + antecedente, com override pelo jogador)
  const basePericiasClasse =
    ficha.DetalhesDaClasse?.periciasClasseSelecionadas || [];
  const basePericiasAntecedente =
    ficha.antecedenteDetalhes?.periciasAntecedenteSelecionadas || [];
  const periciasBase = Array.from(
    new Set([...basePericiasClasse, ...basePericiasAntecedente])
  );

  // se já existir no banco, usa; senão usa as de base
  const periciasAtivas = ficha.periciasAtivas || periciasBase;

  const handlePericiasAtivasChange = async (nextList) => {
    const arr = nextList || [];
    setFicha((prev) => ({ ...(prev || {}), periciasAtivas: arr }));

    if (!userID || !fichaKey) return;
    try {
      await firebase
        .database()
        .ref(`fichas/${userID}/${fichaKey}/periciasAtivas`)
        .set(arr);
    } catch (e) {
      console.error("Erro ao salvar perícias ativas:", e);
    }
  };

  // 🔹 salvaguardas (testes de resistência) ativas
  const rawSavingThrows =
    classeSelecioanda?.proficiencias?.testesDeResistecia || [];

  const savingThrowsBase = Array.isArray(rawSavingThrows)
    ? rawSavingThrows.map((s) => s.trim()).filter(Boolean)
    : String(rawSavingThrows || "")
        .split(/[;,]/)
        .map((s) => s.trim())
        .filter(Boolean);

  const savingThrowsAtivos = ficha.savingThrowsAtivos || savingThrowsBase;

  const handleSavingThrowsAtivosChange = async (nextList) => {
    const arr = nextList || [];
    setFicha((prev) => ({ ...(prev || {}), savingThrowsAtivos: arr }));

    if (!userID || !fichaKey) return;
    try {
      await firebase
        .database()
        .ref(`fichas/${userID}/${fichaKey}/savingThrowsAtivos`)
        .set(arr);
    } catch (e) {
      console.error("Erro ao salvar salvaguardas ativas:", e);
    }
  };

  const loadingEquipped = false;
  const loadingBackpack = false;

  return (
    <div className={`${getClasseBackground(fichaBase.classe)}`}>
      <Box sx={{ py: 4, background: "transparent" }}>
        <Box
          sx={{
            maxWidth: 1100,
            mx: "auto",
            px: { xs: 2, md: 3 },
            py: 3,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          {/* TOP: info rápida da ficha */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32 }}
          >
            <Grid
              container
              spacing={2}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Grid item xs={12} md={5}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: "rgba(255,255,255,0.06)",
                      }}
                    >
                      {fichaBase.nome?.charAt(0)?.toUpperCase() || "?"}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 700 }}
                      >
                        {fichaBase.nome}
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mt: 0.5 }}
                      >
                        <Chip
                          label={fichaBase.classe || "—"}
                          icon={<AccountTreeIcon />}
                          size="small"
                        />
                        <Chip
                          label={fichaBase.raca || "—"}
                          icon={<InfoIcon />}
                          size="small"
                        />
                      </Stack>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 0.5 }}
                  >
                    Características da Classe
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary={
                          classeSelecioanda?.descricaoCurta ||
                          ficha.DetalhesDaClasse?.descricao ||
                          "—"
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary={`Equipamento obrigatório: ${
                          ficha.DetalhesDaClasse?.Equipamentos
                            ?.equipamentoObgt || "—"
                        }`}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="subtitle2">Riqueza</Typography>

                  {(() => {
                    const original =
                      fichaEstado.riquezaMoedas || {
                        pc: 0,
                        pp: 0,
                        pe: 0,
                        po: 0,
                        pl: 0,
                      };

                    const coins = coinsDraft || original;

                    // câmbio padrão em peças de ouro (PO)
                    const totalEmPO =
                      coins.pc / 100 +
                      coins.pp / 10 +
                      coins.pe / 2 +
                      coins.po +
                      coins.pl * 10;

                    const handleField = (key) => (e) => {
                      const value = e.target.value.replace(/[^\d]/g, "");
                      handleMoedasFieldChange({
                        [key]: value === "" ? 0 : Number(value),
                      });
                    };

                    const changed = ["pc", "pp", "pe", "po", "pl"].some(
                      (k) => Number(coins[k] || 0) !== Number(original[k] || 0)
                    );

                    return (
                      <>
                        <Grid container spacing={1} sx={{ mt: 1 }}>
                          <Grid item xs={4}>
                            <TextField
                              label="PC"
                              size="small"
                              type="number"
                              value={coins.pc}
                              onChange={handleField("pc")}
                              fullWidth
                              inputProps={{ min: 0 }}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <TextField
                              label="PP"
                              size="small"
                              type="number"
                              value={coins.pp}
                              onChange={handleField("pp")}
                              fullWidth
                              inputProps={{ min: 0 }}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <TextField
                              label="PE"
                              size="small"
                              type="number"
                              value={coins.pe}
                              onChange={handleField("pe")}
                              fullWidth
                              inputProps={{ min: 0 }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              label="PO"
                              size="small"
                              type="number"
                              value={coins.po}
                              onChange={handleField("po")}
                              fullWidth
                              inputProps={{ min: 0 }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              label="PL"
                              size="small"
                              type="number"
                              value={coins.pl}
                              onChange={handleField("pl")}
                              fullWidth
                              inputProps={{ min: 0 }}
                            />
                          </Grid>
                        </Grid>

                        <Divider sx={{ my: 1 }} />

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 1,
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Total aproximado:{" "}
                            <strong>{totalEmPO.toFixed(2)} PO</strong>
                          </Typography>

                          <Button
                            size="small"
                            variant="contained"
                            onClick={handleMoedasSave}
                            disabled={!changed}
                          >
                            Salvar
                          </Button>
                        </Box>
                      </>
                    );
                  })()}
                </Paper>
              </Grid>

              <Grid item xs={12} md={3}>
                <Paper
                  elevation={3}
                  sx={{ p: 2, textAlign: "center" }}
                >
                  <Typography variant="subtitle2">
                    Habilidades de Classe
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <BotaoPainelHabilidade
                      imagens={ficha.DetalhesDaClasse?.imagens || []}
                    />
                  </Box>

                  <Stack spacing={1} sx={{ mt: 1 }}>
                    <Button
                      component={Link}
                      to={backgrounds[ficha.classe]}
                      target="_blank"
                      size="small"
                      startIcon={<InfoIcon />}
                    >
                      Ver referência
                    </Button>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </motion.div>

          {/* Seletor frente/verso */}
          <Box
            sx={{
              mt: 1,
              mb: 2,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <ToggleButtonGroup
              size="small"
              exclusive
              value={activeSide}
              onChange={(_, v) => v && setActiveSide(v)}
            >
              <ToggleButton value="estado">
                Frente — Estado de jogo
              </ToggleButton>
              <ToggleButton value="origem">
                Verso — História & Antecedente
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Conteúdo da “página” */}
          {activeSide === "estado" ? (
            <FichaEstadoPanel
              userID={userID}
              fichaKey={fichaKey}
              ficha={ficha}
              fichaEstado={fichaEstado}
              abilityMods={abilityMods}
              atributosComBonus={atributosComBonus}
              spellAttr={spellAttr}
              onFichaChange={setFicha}
              onChangeEquipped={handleEquippedChange}
              onChangeBackpack={handleBackpackChange}
              periciasAtivas={periciasAtivas}
              onChangePericiasAtivas={handlePericiasAtivasChange}
              savingThrowsAtivos={savingThrowsAtivos}
              onChangeSavingThrowsAtivos={handleSavingThrowsAtivosChange}
              habilidadesRaca={[...habilidadesRaca, ...habilidadesSubRaca]} // ✅ novo
              habilidadesClasse={habilidadesClasse}                         // ✅ novo
              sectionMotion={sectionMotion}
              loadingEquipped={loadingEquipped}
              loadingBackpack={loadingBackpack}
            />
          ) : (
            <FichaOrigemPanel
              ficha={ficha}
              story={ficha.historia || ""}
              onStoryChange={handleStoryChange}
              sectionMotion={sectionMotion}
            />
          )}

          {/* crédito de background (comum às duas páginas) */}
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography sx={{ fontSize: 13.5, fontWeight: 600 }}>
              BackGround Art By:{" "}
              <Link
                to={backgrounds[ficha.classe]}
                target="_blank"
                rel="noreferrer"
                style={{ color: "inherit", fontWeight: 700 }}
              >
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
