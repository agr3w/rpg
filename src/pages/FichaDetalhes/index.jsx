import React, { useState, useEffect, useRef } from "react";
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
import "firebase/compat/storage";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { classes, racas } from "Array/RacaEClasse";
import styles from "./fichaDetalhe.module.css";
import { backgrounds } from "./backgounds/arrayLinksBackgrounds";
import { motion } from "framer-motion";
import { auth } from "APIs/firebaseConfig";
import FichaInventory from "components/FichaDetalhes/FichaInventory";
import FichaXpPanel from "components/FichaDetalhes/FichaXpPanel";
import FichaOrigemPanel from "components/FichaDetalhes/FichaOrigemPanel";
import FichaEstadoPanel from "components/FichaDetalhes/FichaEstadoPanel";
import FichaCoinsPanel from "components/FichaDetalhes/FichaCoinsPanel";
import FichaArmorPanel from "components/FichaDetalhes/FichaArmorPanel";
import FichaHpPanel from "components/FichaDetalhes/FichaHpPanel"; 
import FichaStatusPanel from "components/FichaDetalhes/FichaStatusPanel";
import FichaMagiasPanel from "components/FichaDetalhes/FichaMagiasPanel"; // ✅ novo

const sectionMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.28 },
};

// fundo da página baseado na classe (por enquanto, usa o container padrão)
const getClasseBackground = () => styles.pageContainer;

const DEFAULT_TRAINING = {
  armaduraLeve: false,
  armaduraMedia: false,
  armaduraPesada: false,
  escudos: false,
  armas: "",
  ferramentas: "",
};

const FichaDetalhes = () => {
  const { ID } = useParams();
  const [ficha, setFicha] = useState(null);
  const [fichaKey, setFichaKey] = useState(null);
  const [loadingFicha, setLoadingFicha] = useState(true);
  const [bgLoaded, setBgLoaded] = useState(false);

  // frente/verso da ficha
  const [activeSide, setActiveSide] = useState("estado");
  const [pendingHpLevels, setPendingHpLevels] = useState(0);
  const [editedName, setEditedName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [uploadingPortrait, setUploadingPortrait] = useState(false);
  const lastLevelRef = useRef(null); // ✅ começa sem nível anterior

  const user = auth.currentUser;
  const userID = user?.uid;

  // carrega ficha
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

  // carrega background
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

  // sincroniza níveis de HP pendentes vindos do banco
  useEffect(() => {
    if (!ficha) return;
    setPendingHpLevels(ficha.hpLevelsPendentes || 0);
  }, [ficha, fichaKey]);

  // detecta aumento de nível para marcar rolagem de HP pendente
  useEffect(() => {
    if (!ficha) return;

    const current = ficha.level || 1;

    // primeira vez: só registra o nível atual, não cria rolagem pendente
    if (lastLevelRef.current == null) {
      lastLevelRef.current = current;
      return;
    }

    const prev = lastLevelRef.current;
    const diff = current - prev;

    if (diff > 0) {
      const novoPendentes = (pendingHpLevels || 0) + diff;
      setPendingHpLevels(novoPendentes);

      if (userID && fichaKey) {
        firebase
          .database()
          .ref(`fichas/${userID}/${fichaKey}/hpLevelsPendentes`)
          .set(novoPendentes)
          .catch((e) =>
            console.error("Erro ao salvar níveis de HP pendentes:", e)
          );
      }
    }

    lastLevelRef.current = current;
  }, [ficha, fichaKey, userID, pendingHpLevels]);

  // mantém o campo de nome sincronizado com a ficha carregada
  useEffect(() => {
    if (!ficha) return;
    setEditedName(ficha.nome || "");
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

  const hasNameChange =
    (editedName || "") !== (fichaBase.nome || "");

  // classe / raça / sub‑raça
  const classeSelecioanda =
    classes.find((c) => c.nome === fichaBase.classe) || {};
  const racaSelecionada =
    racas.find((r) => r.nome === fichaBase.raca) || {};
  const subRacaSelecionada =
    ficha.DetalhesDaRaça?.SubRaca || null;
  const subRacaDetalhes =
    racaSelecionada.SubRacas?.find(
      (sr) => sr.subRacaNome === subRacaSelecionada
    ) || {};

  const subClasseSelecionada =
    ficha.DetalhesDaClasse?.SubClasseInfo?.SubClasse ||
    ficha.subclasse ||
    null;

  // deslocamento e tamanho (com padrão por raça)
  const deslocamentoBase =
    ficha.deslocamento ||
    racaSelecionada.deslocamento ||
    "9 metros";

  const DEFAULT_SIZES = {
    Anão: "Médio",
    Elfo: "Médio",
    Halfling: "Pequeno",
    Humano: "Médio",
    Draconato: "Médio",
    Gnomo: "Pequeno",
    "Meio-Elfo": "Médio",
    "Meio-Orc": "Médio",
    Tiefling: "Médio",
  };

  const tamanhoBase =
    ficha.tamanho ||
    DEFAULT_SIZES[fichaBase.raca] ||
    "Médio";

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

  const getProfBonus = (level = 1) =>
    2 + Math.floor((Math.max(1, Number(level) || 1) - 1) / 4);

  // 🔹 riqueza + HP vindos da classe
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
      po: parseInitialPo(),
      pl: 0,
    };

  const hitDie =
    Number(classeSelecioanda?.dadoDeVidaFaces || 0) > 0
      ? Number(classeSelecioanda.dadoDeVidaFaces)
      : 8;

  const levelAtual = ficha.level || 1;
  const conMod = abilityMods.Constituição || 0;

  const hpSalvo = ficha.hp;
  let hpEstado;
  if (hpSalvo) {
    hpEstado = {
      max: Number(hpSalvo.max || 0),
      atual: Number(hpSalvo.atual || 0),
      temp: Number(hpSalvo.temp || 0),
    };
  } else {
    const medioPorNivel = Math.floor(hitDie / 2) + 1;
    const primeiroNivel = hitDie + conMod;
    const niveisExtras = Math.max(levelAtual - 1, 0);
    const extraTotal = niveisExtras * (medioPorNivel + conMod);
    const hpMaxCalc = Math.max(primeiroNivel + extraTotal, 1);

    hpEstado = {
      max: hpMaxCalc,
      atual: hpMaxCalc,
      temp: 0,
    };
  }

  const caDetalhes = ficha.caDetalhes || null;
  const caTotal =
    typeof ficha.ca === "number"
      ? ficha.ca
      : caDetalhes?.total ?? 10;

  const fichaEstado = {
    level: levelAtual,
    xp: ficha.xp ?? ficha.XP ?? 0,
    riquezaMoedas,
    inventory: ficha.inventory || {},
    ca: caTotal,
    caDetalhes,
    hp: hpEstado,
  };

  const spellcasting = ficha.spellcasting || {}; // ✅ novo

  const deathSaves =
    ficha.deathSaves || { successes: 0, failures: 0 };

  // 🔹 habilidades de raça / sub-raça / classe
  const habilidadesRaca = racaSelecionada.habilidades || [];
  const habilidadesSubRaca = subRacaDetalhes.habilidadesSubRaca || [];
  const habilidadesClasse =
    ficha.DetalhesDaClasse?.habilidades ||
    classeSelecioanda?.habilidades ||
    [];

  const getSpellAttributeForClass = (classe) => {
    if (!classe) return "Inteligência";
    const c = String(classe).toLowerCase();
    if (["bardo", "bruxo", "feiticeiro"].includes(c)) return "Carisma";
    if (["clerigo", "clérigo", "druida"].includes(c)) return "Sabedoria";
    if (["mago"].includes(c)) return "Inteligência";
    return "Inteligência";
  };
  const spellAttr = getSpellAttributeForClass(ficha?.classe);

  // 🔹 salvar nome do personagem
  const handleNameSave = async () => {
    const name = (editedName || "").trim();
    if (!name || name === fichaBase.nome) return;

    setFicha((prev) => ({ ...(prev || {}), nome: name }));

    if (!userID || !fichaKey) return;
    try {
      setSavingName(true);
      await firebase
        .database()
        .ref(`fichas/${userID}/${fichaKey}/nome`)
        .set(name);
    } catch (e) {
      console.error("Erro ao salvar nome da ficha:", e);
    } finally {
      setSavingName(false);
    }
  };

  // 🔹 upload de retrato do personagem
  const handlePortraitUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !userID || !fichaKey) return;

    try {
      setUploadingPortrait(true);
      const storageRef = firebase.storage().ref();
      const portraitRef = storageRef.child(
        `portraits/${userID}/${fichaKey}`
      );

      await portraitRef.put(file);
      const url = await portraitRef.getDownloadURL();

      setFicha((prev) => ({ ...(prev || {}), portraitUrl: url }));

      await firebase
        .database()
        .ref(`fichas/${userID}/${fichaKey}/portraitUrl`)
        .set(url);
    } catch (e) {
      console.error("Erro ao enviar retrato:", e);
    } finally {
      setUploadingPortrait(false);
      // limpa o input para permitir reenviar o mesmo arquivo se quiser
      event.target.value = "";
    }
  };

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

  const handleTrainingsChange = async (next) => {
    const safe = { ...DEFAULT_TRAINING, ...(next || {}) };
    setFicha((prev) => ({ ...(prev || {}), treinamentos: safe }));

    if (!userID || !fichaKey) return;
    try {
      await firebase
        .database()
        .ref(`fichas/${userID}/${fichaKey}/treinamentos`)
        .set(safe);
    } catch (e) {
      console.error("Erro ao salvar treinamentos:", e);
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

  // 🔹 riqueza em moedas (salva no banco)
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

  // 🔹 CA (Classe de Armadura)
  const handleArmorChange = async (armorInfo) => {
    const base = Number(armorInfo?.base || 0);
    const usaEscudo = !!armorInfo?.usaEscudo;
    const totalFromInfo = Number(armorInfo?.total || 0);
    const total = totalFromInfo || base + (usaEscudo ? 2 : 0);

    const detalhes = {
      base,
      usaEscudo,
      bonusTexto: armorInfo?.bonusTexto || "",
      armorId: armorInfo?.armorId || null,
      armorNome: armorInfo?.armorNome || "",
      total,
      propriedades: armorInfo?.propriedades || [], // ✅ novo
    };

    setFicha((prev) => ({
      ...(prev || {}),
      ca: total,
      caDetalhes: detalhes,
    }));

    if (!userID || !fichaKey) return;
    try {
      const ref = firebase.database().ref(`fichas/${userID}/${fichaKey}`);
      await ref.child("ca").set(total);
      await ref.child("caDetalhes").set(detalhes);
    } catch (e) {
      console.error("Erro ao salvar CA:", e);
    }
  };

  // 🔹 Pontos de Vida
  const handleHpChange = async (nextHp, consumedLevels = 0) => {
    const safe = {
      max: Number(nextHp.max || 0),
      atual: Number(nextHp.atual || 0),
      temp: Number(nextHp.temp || 0),
    };

    setFicha((prev) => ({ ...(prev || {}), hp: safe }));

    let novoPendentes = pendingHpLevels;
    if (consumedLevels > 0) {
      novoPendentes = Math.max(0, (pendingHpLevels || 0) - consumedLevels);
      setPendingHpLevels(novoPendentes);
    }

    if (!userID || !fichaKey) return;
    try {
      const ref = firebase.database().ref(`fichas/${userID}/${fichaKey}`);
      await ref.child("hp").set(safe);
      if (consumedLevels > 0) {
        await ref.child("hpLevelsPendentes").set(novoPendentes);
      }
    } catch (e) {
      console.error("Erro ao salvar HP:", e);
    }
  };

  // 🔹 salvaguardas contra morte
  const handleDeathSavesChange = async (next) => {
    const safe = {
      successes: Math.min(
        3,
        Math.max(0, Number(next.successes || 0))
      ),
      failures: Math.min(
        3,
        Math.max(0, Number(next.failures || 0))
      ),
    };

    setFicha((prev) => ({ ...(prev || {}), deathSaves: safe }));

    if (!userID || !fichaKey) return;
    try {
      await firebase
        .database()
        .ref(`fichas/${userID}/${fichaKey}/deathSaves`)
        .set(safe);
    } catch (e) {
      console.error("Erro ao salvar salvaguardas contra morte:", e);
    }
  };

  // 🔹 grimório / magias
  const handleSpellcastingChange = async (next) => {
    const safe = next || {};
    setFicha((prev) => ({ ...(prev || {}), spellcasting: safe }));

    if (!userID || !fichaKey) return;
    try {
      await firebase
        .database()
        .ref(`fichas/${userID}/${fichaKey}/spellcasting`)
        .set(safe);
    } catch (e) {
      console.error("Erro ao salvar spellcasting:", e);
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

  // percepção passiva (10 + Sab + prof se treinado em Percepção)
  const profBonus = getProfBonus(fichaEstado.level || 1);
  const isPerceptionProf = (periciasAtivas || []).includes("Percepção");
  const passivePerception =
    10 +
    (abilityMods.Sabedoria || 0) +
    (isPerceptionProf ? profBonus : 0);

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
                      alignItems: "flex-start",
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

                    <Box sx={{ flex: 1 }}>
                      <TextField
                        label="Nome do personagem"
                        variant="standard"
                        fullWidth
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                      />

                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mt: 1, flexWrap: "wrap" }}
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
                        {subRacaSelecionada && (
                          <Chip
                            label={subRacaSelecionada}
                            size="small"
                          />
                        )}
                        {subClasseSelecionada && (
                          <Chip
                            label={subClasseSelecionada}
                            size="small"
                          />
                        )}
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mt: 1, flexWrap: "wrap" }}
                      >
                        <Chip
                          label={`Nível ${fichaEstado.level}`}
                          size="small"
                        />
                        <Chip
                          label={`XP ${fichaEstado.xp}`}
                          size="small"
                        />
                      </Stack>
                    </Box>

                    <Box>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={handleNameSave}
                        disabled={!hasNameChange || savingName}
                      >
                        Salvar
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <FichaCoinsPanel
                  value={fichaEstado.riquezaMoedas}
                  onSave={handleMoedasChange}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 220,
                  }}
                >
                  {/* input escondido para upload */}
                  <input
                    id="portrait-upload-input"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handlePortraitUpload}
                  />

                  <label
                    htmlFor="portrait-upload-input"
                    style={{ cursor: "pointer", width: "100%" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1.5,
                      }}
                    >
                      <Avatar
                        src={ficha.portraitUrl || ""}
                        alt={fichaBase.nome || "Personagem"}
                        sx={{
                          width: 160,
                          height: 160,
                          bgcolor: "rgba(0,0,0,0.10)",
                          fontSize: 48,
                        }}
                      >
                        {!ficha.portraitUrl &&
                          (fichaBase.nome?.charAt(0)?.toUpperCase() || "?")}
                      </Avatar>

                      <Button
                        component="span"
                        size="small"
                        variant="contained"
                        startIcon={<PhotoCameraIcon />}
                        disabled={uploadingPortrait}
                      >
                        {uploadingPortrait ? "Enviando..." : "Escolher imagem"}
                      </Button>
                    </Box>
                  </label>
                </Paper>
              </Grid>
            </Grid>
          </motion.div>

          {/* Status principais + salvaguarda contra morte */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, delay: 0.02 }}
          >
            <Box sx={{ mb: 2 }}>
              <FichaStatusPanel
                dexMod={abilityMods.Destreza || 0}
                deslocamento={deslocamentoBase}
                tamanho={tamanhoBase}
                passivePerception={passivePerception}
                deathSaves={deathSaves}
                onChangeDeathSaves={handleDeathSavesChange}
              />
            </Box>
          </motion.div>

          {/* TOP 2: CA e Pontos de Vida */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, delay: 0.05 }}
          >
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={4}>
                <FichaArmorPanel
                  value={
                    fichaEstado.caDetalhes || {
                      base: fichaEstado.ca,
                      usaEscudo: false,
                      bonusTexto: "",
                      armorId: null,
                      armorNome: "",
                      total: fichaEstado.ca,
                      propriedades: [],
                    }
                  }
                  onSave={handleArmorChange}
                  dexMod={abilityMods.Destreza || 0}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <FichaHpPanel
                  value={fichaEstado.hp}
                  onSave={handleHpChange}
                  hitDie={classeSelecioanda?.dadoDeVidaFaces || 8}
                  conMod={abilityMods.Constituição || 0}
                  pendingLevels={pendingHpLevels}
                  canRollLevelHp={fichaEstado.level >= 2}
                />
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
              <ToggleButton value="magias">
                Grimório / Magias
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
              habilidadesRaca={[...habilidadesRaca, ...habilidadesSubRaca]}
              habilidadesClasse={habilidadesClasse}
              classeImagens={ficha.DetalhesDaClasse?.imagens || []}
              backgroundUrl={backgrounds[ficha.classe]}
              deslocamento={deslocamentoBase}
              tamanho={tamanhoBase}
              deathSaves={deathSaves}
              onChangeDeathSaves={handleDeathSavesChange}
              sectionMotion={sectionMotion}
              loadingEquipped={loadingEquipped}
              loadingBackpack={loadingBackpack}
            />
          ) : activeSide === "origem" ? (
            <FichaOrigemPanel
              ficha={ficha}
              story={ficha.historia || ""}
              onStoryChange={handleStoryChange}
              trainings={ficha.treinamentos || DEFAULT_TRAINING}
              onTrainingsChange={handleTrainingsChange}
              sectionMotion={sectionMotion}
            />
          ) : (
            <FichaMagiasPanel
              spellcasting={spellcasting}
              abilityMods={abilityMods}
              spellAttr={spellAttr}
              profBonus={getProfBonus(fichaEstado.level || 1)}
              classe={fichaBase.classe}
              level={fichaEstado.level}
              onChange={handleSpellcastingChange}
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
