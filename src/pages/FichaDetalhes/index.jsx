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
import { getClassBackgroundUrl } from "./backgounds/classBackgrounds";
import { motion } from "framer-motion";
import { auth } from "APIs/firebaseConfig";
import { computeLevelFromXp } from "Utils/xpTable";
import FichaIdentityHeader from "components/FichaDetalhes/FichaIdentityHeader";
import FichaCombatHud from "components/FichaDetalhes/FichaCombatHud";
import FichaSurvivalResources from "components/FichaDetalhes/FichaSurvivalResources";
import FichaInventory from "components/FichaDetalhes/FichaInventory";
import FichaXpPanel from "components/FichaDetalhes/FichaXpPanel";
import FichaOrigemPanel from "components/FichaDetalhes/FichaOrigemPanel";
import FichaEstadoPanel from "components/FichaDetalhes/FichaEstadoPanel";
import FichaCoinsPanel from "components/FichaDetalhes/FichaCoinsPanel";
import FichaArmorPanel from "components/FichaDetalhes/FichaArmorPanel";
import FichaHpPanel from "components/FichaDetalhes/FichaHpPanel"; 
import FichaStatusPanel from "components/FichaDetalhes/FichaStatusPanel";

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

const CLASS_THEMES = {
  barbaro: {
    accent: "#b45309",
    accentSoft: "rgba(180,83,9,0.2)",
    accentDeep: "rgba(120,53,15,0.38)",
    surface: "rgba(237,223,208,0.9)",
    surfaceAlt: "rgba(228,210,192,0.86)",
    text: "#332318",
    textMuted: "rgba(51,35,24,0.74)",
    line: "rgba(51,35,24,0.24)",
  },
  monge: {
    accent: "#c18a2f",
    accentSoft: "rgba(193,138,47,0.2)",
    accentDeep: "rgba(129,88,24,0.38)",
    surface: "rgba(236,225,206,0.9)",
    surfaceAlt: "rgba(226,213,190,0.86)",
    text: "#2f2318",
    textMuted: "rgba(47,35,24,0.74)",
    line: "rgba(47,35,24,0.24)",
  },
  bruxo: {
    accent: "#8b5cf6",
    accentSoft: "rgba(139,92,246,0.24)",
    accentDeep: "rgba(56,34,93,0.44)",
    surface: "rgba(206,195,227,0.9)",
    surfaceAlt: "rgba(190,176,214,0.88)",
    text: "#1d152b",
    textMuted: "rgba(29,21,43,0.78)",
    line: "rgba(29,21,43,0.28)",
  },
  druida: {
    accent: "#2f855a",
    accentSoft: "rgba(47,133,90,0.22)",
    accentDeep: "rgba(29,78,52,0.4)",
    surface: "rgba(206,225,203,0.9)",
    surfaceAlt: "rgba(191,214,187,0.87)",
    text: "#1b2f21",
    textMuted: "rgba(27,47,33,0.78)",
    line: "rgba(27,47,33,0.26)",
  },
  bardo: {
    accent: "#7c3aed",
    accentSoft: "rgba(124,58,237,0.2)",
    accentDeep: "rgba(83,40,140,0.38)",
    surface: "rgba(226,214,236,0.9)",
    surfaceAlt: "rgba(214,198,228,0.86)",
    text: "#2d1e37",
    textMuted: "rgba(45,30,55,0.76)",
    line: "rgba(45,30,55,0.24)",
  },
  clerigo: {
    accent: "#2563eb",
    accentSoft: "rgba(37,99,235,0.2)",
    accentDeep: "rgba(30,64,175,0.38)",
    surface: "rgba(216,226,241,0.9)",
    surfaceAlt: "rgba(202,214,234,0.86)",
    text: "#1c2a42",
    textMuted: "rgba(28,42,66,0.76)",
    line: "rgba(28,42,66,0.24)",
  },
  guerreiro: {
    accent: "#3b82f6",
    accentSoft: "rgba(59,130,246,0.2)",
    accentDeep: "rgba(30,58,138,0.4)",
    surface: "rgba(214,224,240,0.9)",
    surfaceAlt: "rgba(199,212,234,0.86)",
    text: "#1b2740",
    textMuted: "rgba(27,39,64,0.76)",
    line: "rgba(27,39,64,0.24)",
  },
  feiticeiro: {
    accent: "#c026d3",
    accentSoft: "rgba(192,38,211,0.2)",
    accentDeep: "rgba(134,25,143,0.4)",
    surface: "rgba(233,213,238,0.9)",
    surfaceAlt: "rgba(224,199,231,0.86)",
    text: "#321a3a",
    textMuted: "rgba(50,26,58,0.76)",
    line: "rgba(50,26,58,0.24)",
  },
  ladino: {
    accent: "#334155",
    accentSoft: "rgba(51,65,85,0.22)",
    accentDeep: "rgba(15,23,42,0.44)",
    surface: "rgba(211,216,224,0.9)",
    surfaceAlt: "rgba(197,204,214,0.86)",
    text: "#1d2430",
    textMuted: "rgba(29,36,48,0.78)",
    line: "rgba(29,36,48,0.26)",
  },
  mago: {
    accent: "#4f46e5",
    accentSoft: "rgba(79,70,229,0.2)",
    accentDeep: "rgba(55,48,163,0.4)",
    surface: "rgba(216,214,239,0.9)",
    surfaceAlt: "rgba(201,198,232,0.86)",
    text: "#232042",
    textMuted: "rgba(35,32,66,0.76)",
    line: "rgba(35,32,66,0.24)",
  },
  paladino: {
    accent: "#ef4444",
    accentSoft: "rgba(239,68,68,0.2)",
    accentDeep: "rgba(127,29,29,0.4)",
    surface: "rgba(241,219,216,0.9)",
    surfaceAlt: "rgba(233,204,200,0.86)",
    text: "#3a201d",
    textMuted: "rgba(58,32,29,0.76)",
    line: "rgba(58,32,29,0.24)",
  },
  patrulheiro: {
    accent: "#16a34a",
    accentSoft: "rgba(22,163,74,0.2)",
    accentDeep: "rgba(20,83,45,0.4)",
    surface: "rgba(214,232,211,0.9)",
    surfaceAlt: "rgba(199,223,196,0.86)",
    text: "#1b322b",
    textMuted: "rgba(27,50,43,0.76)",
    line: "rgba(27,50,43,0.24)",
  },
  default: {
    accent: "#bf8f00",
    accentSoft: "rgba(191,143,0,0.2)",
    accentDeep: "rgba(131,60,11,0.38)",
    surface: "rgba(232,220,201,0.9)",
    surfaceAlt: "rgba(222,207,183,0.86)",
    text: "#2f2318",
    textMuted: "rgba(47,35,24,0.76)",
    line: "rgba(47,35,24,0.24)",
  },
};

function normalizeClassName(v) {
  return String(v || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function parseFeatureLevelFromKey(key) {
  const normalized = String(key || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const match = normalized.match(/nv\s*(\d+)|nivel\s*(\d+)|level\s*(\d+)/i);
  return Number(match?.[1] || match?.[2] || match?.[3] || 1);
}

function extractClassProgressionFeatures(habilidadesClasseObj = {}, fallbackList = []) {
  const fromObject = Object.entries(habilidadesClasseObj || {}).flatMap(([key, value]) => {
    const level = parseFeatureLevelFromKey(key);
    if (Array.isArray(value)) {
      return value
        .map((item) => String(item || "").trim())
        .filter(Boolean)
        .map((name, index) => ({
          id: `class-${key}-${index}-${name}`,
          name,
          level,
          source: "progression",
        }));
    }

    const one = String(value || "").trim();
    if (!one) return [];
    return [
      {
        id: `class-${key}-${one}`,
        name: one,
        level,
        source: "progression",
      },
    ];
  });

  const fromFallback = (fallbackList || [])
    .map((item, index) => String(item || "").trim())
    .filter(Boolean)
    .map((name, index) => ({
      id: `class-fallback-${index}-${name}`,
      name,
      level: 1,
      source: "fallback",
    }));

  const dedup = new Set();
  return [...fromObject, ...fromFallback].filter((item) => {
    const key = `${item.level}::${item.name.toLowerCase()}`;
    if (dedup.has(key)) return false;
    dedup.add(key);
    return true;
  });
}

const PANEL_SX = {
  p: 2,
  borderRadius: 3,
  border: "1px solid var(--ficha-accent-soft, rgba(191,143,0,0.2))",
  bgcolor: "var(--ficha-surface, rgba(236,225,207,0.9))",
  color: "var(--ficha-text, #2f2318)",
  boxShadow: "0 10px 26px rgba(0,0,0,0.32)",
  backdropFilter: "blur(4px)",
};

const FichaDetalhes = () => {
  const { ID } = useParams();
  const [ficha, setFicha] = useState(null);
  const [fichaKey, setFichaKey] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
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

  // carrega ficha (apenas inicial)
  useEffect(() => {
    if (!userID || !ID) return;
    setIsInitialLoading(true);
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
        setIsInitialLoading(false);
      });
  }, [ID, userID]);

  // carrega background (apenas quando a classe muda)
  const fichaClasse = ficha?.classe;
  useEffect(() => {
    if (!fichaClasse) {
      setBgLoaded(true);
      return;
    }
    const url = getClassBackgroundUrl(fichaClasse);
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
  }, [fichaClasse]);

  useEffect(() => {
    if (!ficha) return;
    setPendingHpLevels(ficha.hpLevelsPendentes || 0);
  }, [ficha?.hpLevelsPendentes]);

  // mantém o campo de nome sincronizado com a ficha carregada
  useEffect(() => {
    if (!ficha) return;
    setEditedName(ficha.nome || "");
  }, [ficha?.nome]);

  if (isInitialLoading && !ficha) {
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

  const classTheme =
    CLASS_THEMES[normalizeClassName(fichaBase.classe)] || CLASS_THEMES.default;

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
  const classFeaturesProgression = extractClassProgressionFeatures(
    classeSelecioanda?.habilidadesClasse || {},
    ficha.DetalhesDaClasse?.habilidades || classeSelecioanda?.habilidades || []
  );
  const customClassFeatures = Array.isArray(ficha.habilidadesClasseCustom)
    ? ficha.habilidadesClasseCustom
    : [];

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
  const handleNameSave = async (customName) => {
    const name = (typeof customName === "string" ? customName : editedName || "").trim();
    if (!name || name === fichaBase.nome) return;

    setFicha((prev) => ({ ...(prev || {}), nome: name }));
    setEditedName(name);

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

  // 🔹 salvar XP e nível do personagem
  const handleXpSave = async (newXp) => {
    const parsed = parseInt(newXp || "0", 10);
    if (Number.isNaN(parsed) || parsed < 0) return;
    const newLevel = computeLevelFromXp(parsed);

    setFicha((prev) => ({ ...(prev || {}), xp: parsed, level: newLevel }));

    if (!userID || !fichaKey) return;
    try {
      await firebase.database().ref(`fichas/${userID}/${fichaKey}`).update({
        xp: parsed,
        level: newLevel,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });
    } catch (e) {
      console.error("Erro ao salvar XP:", e);
    }
  };

  // 🔹 salvar dados de vida gastos
  const handleHitDiceSpentChange = async (spent) => {
    const val = Math.max(0, Number(spent || 0));
    setFicha((prev) => ({ ...(prev || {}), hitDiceSpent: val }));

    if (!userID || !fichaKey) return;
    try {
      await firebase
        .database()
        .ref(`fichas/${userID}/${fichaKey}/hitDiceSpent`)
        .set(val);
    } catch (e) {
      console.error("Erro ao salvar dados de vida gastos:", e);
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

  // 🔹 salvar subclasse do personagem
  const handleSubclasseSave = async (subclasse) => {
    if (!subclasse) return;
    setFicha((prev) => ({
      ...(prev || {}),
      subclasse,
      DetalhesDaClasse: {
        ...(prev?.DetalhesDaClasse || {}),
        SubClasseInfo: {
          ...(prev?.DetalhesDaClasse?.SubClasseInfo || {}),
          SubClasse: subclasse,
        },
      },
    }));
    if (!userID || !fichaKey) return;
    try {
      await firebase.database().ref(`fichas/${userID}/${fichaKey}`).update({
        subclasse,
        "DetalhesDaClasse/SubClasseInfo/SubClasse": subclasse,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });
    } catch (e) {
      console.error("Erro ao salvar subclasse:", e);
    }
  };

  // 🔹 salvar sub-raça do personagem
  const handleSubracaSave = async (subraca) => {
    if (!subraca) return;
    setFicha((prev) => ({
      ...(prev || {}),
      subraca,
      DetalhesDaRaça: {
        ...(prev?.DetalhesDaRaça || {}),
        SubRaca: subraca,
      },
    }));
    if (!userID || !fichaKey) return;
    try {
      await firebase.database().ref(`fichas/${userID}/${fichaKey}`).update({
        subraca,
        "DetalhesDaRaça/SubRaca": subraca,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });
    } catch (e) {
      console.error("Erro ao salvar sub-raça:", e);
    }
  };

  // 🔹 salvar subida de nível completa (Level Up)
  const handleLevelUpSave = async (payload) => {
    if (!payload) return;
    const { nivel, vidaMax, vidaAtual, atributos, subclasse, xp } = payload;

    const currentHpState = ficha?.hp || {};
    const finalHpMax = Number(vidaMax || currentHpState.max || 10);
    const finalHpAtual = Number(vidaAtual || currentHpState.atual || finalHpMax);
    const hpPayload = {
      max: finalHpMax,
      atual: finalHpAtual,
      temp: Number(currentHpState.temp || 0),
    };

    const newXp = xp !== undefined ? Number(xp) : (ficha?.xp ?? ficha?.XP ?? 0);

    setFicha((prev) => ({
      ...(prev || {}),
      nivel,
      level: nivel,
      xp: newXp,
      XP: newXp,
      hp: hpPayload,
      vidaMax: finalHpMax,
      vidaAtual: finalHpAtual,
      hpLevelsPendentes: 0,
      atributos: atributos || prev?.atributos,
      subclasse: subclasse || prev?.subclasse,
    }));
    setPendingHpLevels(0);

    if (!userID || !fichaKey) return;
    try {
      const updates = {
        nivel,
        level: nivel,
        xp: newXp,
        XP: newXp,
        hp: hpPayload,
        vidaMax: finalHpMax,
        vidaAtual: finalHpAtual,
        hpLevelsPendentes: 0,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      };
      if (atributos) updates.atributos = atributos;
      if (subclasse) {
        updates.subclasse = subclasse;
        updates["DetalhesDaClasse/SubClasseInfo/SubClasse"] = subclasse;
      }
      await firebase.database().ref(`fichas/${userID}/${fichaKey}`).update(updates);
    } catch (e) {
      console.error("Erro ao salvar evolução de nível:", e);
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

  const handleCustomClassFeaturesChange = async (nextList) => {
    const safe = Array.isArray(nextList)
      ? nextList
          .map((item) => ({
            id: item?.id || String(Date.now()),
            name: String(item?.name || "").trim(),
            description: String(item?.description || "").trim(),
            level: Math.max(1, Number(item?.level || 1)),
            createdAt: Number(item?.createdAt || Date.now()),
          }))
          .filter((item) => !!item.name)
      : [];

    setFicha((prev) => ({ ...(prev || {}), habilidadesClasseCustom: safe }));

    if (!userID || !fichaKey) return;
    try {
      await firebase
        .database()
        .ref(`fichas/${userID}/${fichaKey}/habilidadesClasseCustom`)
        .set(safe);
    } catch (e) {
      console.error("Erro ao salvar habilidades de classe personalizadas:", e);
    }
  };

  const handleUsosHabilidadesChange = async (nextUsos) => {
    const safe = nextUsos || {};
    setFicha((prev) => ({ ...(prev || {}), usosHabilidades: safe }));

    if (!userID || !fichaKey) return;
    try {
      await firebase
        .database()
        .ref(`fichas/${userID}/${fichaKey}/usosHabilidades`)
        .set(safe);
    } catch (e) {
      console.error("Erro ao salvar usos de habilidades:", e);
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

    // atualiza estado local (HP + pendentes) de forma consistente
    if (consumedLevels > 0) {
      setPendingHpLevels((prevPend) =>
        Math.max(0, Number(prevPend || 0) - consumedLevels)
      );
    }

    setFicha((prev) => {
      const base = prev || {};
      const beforePend = Number(base.hpLevelsPendentes || 0);
      const nextPend =
        consumedLevels > 0 ? Math.max(0, beforePend - consumedLevels) : beforePend;

      return {
        ...base,
        hp: safe,
        hpLevelsPendentes: nextPend, // ✅ importantíssimo (evita “voltar” no useEffect)
      };
    });

    if (!userID || !fichaKey) return;
    try {
      const ref = firebase.database().ref(`fichas/${userID}/${fichaKey}`);
      await ref.child("hp").set(safe);

      if (consumedLevels > 0) {
        // decremento atômico com clamp (não deixa ficar negativo)
        await ref
          .child("hpLevelsPendentes")
          .transaction((curr) =>
            Math.max(0, Number(curr || 0) - consumedLevels)
          );
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
    <div
      className={`${getClasseBackground(fichaBase.classe)}`}
      style={{
        "--ficha-accent": classTheme.accent,
        "--ficha-accent-soft": classTheme.accentSoft,
        "--ficha-accent-deep": classTheme.accentDeep,
        "--ficha-surface": classTheme.surface,
        "--ficha-surface-alt": classTheme.surfaceAlt,
        "--ficha-text": classTheme.text,
        "--ficha-text-muted": classTheme.textMuted,
        "--ficha-line": classTheme.line,
      }}
    >
      <Box sx={{ py: 4, background: "transparent" }}>
        <Box
          sx={{
            maxWidth: 1100,
            mx: "auto",
            px: { xs: 2, md: 3 },
            py: 3,
            "--ficha-accent": classTheme.accent,
            "--ficha-accent-soft": classTheme.accentSoft,
            "--ficha-accent-deep": classTheme.accentDeep,
            "--ficha-surface": classTheme.surface,
            "--ficha-surface-alt": classTheme.surfaceAlt,
            "--ficha-text": classTheme.text,
            "--ficha-text-muted": classTheme.textMuted,
            "--ficha-line": classTheme.line,
            borderRadius: 4,
            border: "1px solid var(--ficha-accent-soft)",
            bgcolor: "rgba(22,15,11,0.88)",
            color: "#f7eddc",
            boxShadow: "0 20px 48px rgba(0,0,0,0.45)",
            backgroundImage:
              "radial-gradient(120% 140% at 0% 0%, var(--ficha-accent-soft) 0%, transparent 45%), radial-gradient(120% 140% at 100% 100%, rgba(131,60,11,0.22) 0%, transparent 55%)",
          }}
        >
          {/* BLOCO A: Banner de Identidade & Retrato (Topo) */}
          <motion.div {...sectionMotion}>
            <FichaIdentityHeader
              ficha={ficha}
              fichaBase={fichaBase}
              subClasse={subClasseSelecionada}
              subRaca={subRacaSelecionada}
              antecedente={ficha.antecedenteDetalhes}
              level={fichaEstado.level}
              xp={fichaEstado.xp}
              portraitUrl={ficha.portraitUrl}
              uploadingPortrait={uploadingPortrait}
              onPortraitUpload={handlePortraitUpload}
              onNameSave={handleNameSave}
              onXpSave={handleXpSave}
              onSubclasseSave={handleSubclasseSave}
              onSubracaSave={handleSubracaSave}
              onLevelUpSave={handleLevelUpSave}
            />
          </motion.div>

          {/* BLOCO B: Combat HUD (Cards de Ação Rápida) */}
          <motion.div {...sectionMotion}>
            <FichaCombatHud
              caState={
                fichaEstado.caDetalhes || {
                  base: fichaEstado.ca,
                  usaEscudo: false,
                  armorId: null,
                  armorNome: "",
                  total: fichaEstado.ca,
                }
              }
              hpState={fichaEstado.hp}
              dexMod={abilityMods.Destreza || 0}
              conMod={abilityMods.Constituição || 0}
              hitDie={hitDie}
              pendingLevels={pendingHpLevels}
              canRollLevelHp={fichaEstado.level >= 2}
              deslocamento={deslocamentoBase}
              profBonus={profBonus}
              passivePerception={passivePerception}
              onArmorChange={handleArmorChange}
              onHpChange={handleHpChange}
            />
          </motion.div>

          {/* BLOCO C: Módulo de Sobrevivência & Recursos */}
          <motion.div {...sectionMotion}>
            <FichaSurvivalResources
              deathSaves={deathSaves}
              hitDie={hitDie}
              level={fichaEstado.level}
              hitDiceSpent={ficha.hitDiceSpent || 0}
              conMod={abilityMods.Constituição || 0}
              hpState={fichaEstado.hp}
              moedas={fichaEstado.riquezaMoedas}
              onChangeDeathSaves={handleDeathSavesChange}
              onChangeHitDiceSpent={handleHitDiceSpentChange}
              onHpChange={handleHpChange}
              onSaveMoedas={handleMoedasChange}
            />
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
              sx={{
                bgcolor: "rgba(0,0,0,0.22)",
                borderRadius: 2,
                p: 0.4,
                border: "1px solid var(--ficha-accent-soft)",
                "& .MuiToggleButton-root": {
                  color: "#f3e6cf",
                  border: "none",
                  fontWeight: 700,
                  "&.Mui-selected": {
                    color: "#2c1a10",
                    bgcolor: "var(--ficha-accent)",
                  },
                },
              }}
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
          <Box
            sx={{
              "& .MuiDialog-paper": {
                borderRadius: 2,
                border: "1px solid var(--ficha-accent-soft)",
              },
            }}
          >
            {activeSide === "origem" ? (
              <FichaOrigemPanel
                ficha={ficha}
                story={ficha.historia || ""}
                onStoryChange={handleStoryChange}
                trainings={ficha.treinamentos || DEFAULT_TRAINING}
                onTrainingsChange={handleTrainingsChange}
                sectionMotion={sectionMotion}
              />
            ) : (
              <FichaEstadoPanel
                userID={userID}
                fichaKey={fichaKey}
                ficha={ficha}
                fichaEstado={fichaEstado}
                abilityMods={abilityMods}
                atributosComBonus={atributosComBonus}
                spellAttr={spellAttr}
                spellcasting={spellcasting}
                onChangeSpellcasting={handleSpellcastingChange}
                profBonus={profBonus}
                classe={fichaBase.classe}
                onFichaChange={setFicha}
                onChangeEquipped={handleEquippedChange}
                onChangeBackpack={handleBackpackChange}
                periciasAtivas={periciasAtivas}
                onChangePericiasAtivas={handlePericiasAtivasChange}
                savingThrowsAtivos={savingThrowsAtivos}
                onChangeSavingThrowsAtivos={handleSavingThrowsAtivosChange}
                habilidadesRaca={[...habilidadesRaca, ...habilidadesSubRaca]}
                classFeaturesProgression={classFeaturesProgression}
                customClassFeatures={customClassFeatures}
                onChangeCustomClassFeatures={handleCustomClassFeaturesChange}
                usosHabilidades={ficha.usosHabilidades || {}}
                onChangeUsosHabilidades={handleUsosHabilidadesChange}
                classeImagens={ficha.DetalhesDaClasse?.imagens || []}
                backgroundUrl={backgrounds[ficha.classe]}
                levelAtual={fichaEstado.level}
                deslocamento={deslocamentoBase}
                tamanho={tamanhoBase}
                deathSaves={deathSaves}
                onChangeDeathSaves={handleDeathSavesChange}
                sectionMotion={sectionMotion}
                loadingEquipped={loadingEquipped}
                loadingBackpack={loadingBackpack}
                onSubclasseSave={handleSubclasseSave}
              />
            )}
          </Box>

          {/* crédito de background (comum às duas páginas) */}
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: "#f0dfc3" }}>
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
