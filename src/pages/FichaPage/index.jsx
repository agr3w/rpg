// FichaPage.js
import React, { useCallback, useMemo, useState, useEffect } from "react";
// import styles from "./fichaPage.module.css";
import { enviarFichaParaDatabase } from "components/FichaPage/FichaDatabase";
import { racas, classes } from "Array/RacaEClasse";
import {
  encontrarItensPorNome,
  getAcolitoCaracteristicasFields,
  getArtesaoCaracteristicasFields,
  getArtistaCaracteristicasFields,
  getIdiomasAntecendete,
  getIdiomasAntecendete1,
  getSubRacasField,
  getSubRacasGnomoField,
} from "Utils/Untils";
import { tendencias } from "Array/Tendencias";
import { antecedentes } from "Array/Antecedentes";
import { idiomasArray } from "Array/Idiomas";
import Etapa1 from "components/FichaPage/Etapa1";
import Etapa2 from "components/FichaPage/Etapa2";
import Etapa4 from "components/FichaPage/Etapa4";
import Etapa5 from "components/FichaPage/Etapa5";
import Etapa6 from "components/FichaPage/Etapa6";
import Etapa7 from "components/FichaPage/Etapa7";
import Etapa8 from "components/FichaPage/Etapa8";
import Etapa9 from "components/FichaPage/Etapa9";
import Etapa10 from "components/FichaPage/Etapa10";
import Etapa3 from "components/FichaPage/Etapa3";
import {
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Grid,
  Box,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link, useNavigate } from "react-router-dom";
import { getClassBackgroundUrl } from "pages/FichaDetalhes/backgounds/classBackgrounds";
import { backgrounds } from "pages/FichaDetalhes/backgounds/arrayLinksBackgrounds"; // ✅ ADICIONAR

/* ADDED: framer-motion imports */
import { AnimatePresence, motion } from "framer-motion";
import { T_IN } from "src/config/transitions";

const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: T_IN * 0.38 } },
};

// Adicionado: configuração de transição para o framer-motion
const pageTransition = {
  type: "spring",
  stiffness: 260,
  damping: 25,
};

const FichaCriar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [nome, setNome] = useState("");
  const [raca, setRaca] = useState("");
  const [SubRaca, setSubRaca] = useState("");
  const [classe, setClasse] = useState("");
  const [tendencia, setTendencia] = useState("");
  const [idiomaDoAntecedente, setIdiomaAntecedente] = useState("");
  const [idiomaDoAntecendente2, setIdiomaAntecendente2] = useState("");
  const [IdiomaAltoElfo, setIdiomaAltoElfoSelecioando] = useState(""); // Estado para armazenar o idioma do Alto Elfo

  const [etapa, setEtapa] = useState(1);
  const [itensDaRaca, setItensDaRaca] = useState([]);
  const [itensDaClasse, setItensDaClasse] = useState([]);
  const [itensDaTendencia, setItensDaTendencia] = useState([]);
  const [itensDaAntecedencia, setItensAntecedencia] = useState([]);
  const [antecedente, setAntecedente] = useState("");
  const [antecedenteSelecionado, setAntecedenteSelecionado] = useState(null);
  const [detalhesSubRaca, setDetalhesSubRaca] = useState(null);
  const [tracoPersonalidadeSelecionado, setTracoPersonalidadeSelecionado] =
    useState("");
  const [idealSelecionado, setIdealSelecionado] = useState("");
  const [defeitoSelecionado, setDefeitoSelecionado] = useState("");
  const [vinculoSelecionado, setVinculoSelecionado] = useState("");

  // Antecedente detalhe
  const [CarcDosAntecedentes1, setCarcDosAntecedents1] = useState("");
  const [CarcDosAntecedentes2, setCarcDosAntecedentes2] = useState("");
  const [CarcDosAntecedentes3, setCarcDosAntecedents3] = useState("");

  const [riquezaInicial, setRiquezaInicial] = useState(0);

  const [idiomaRacaSelecionado, setIdiomaRacaSelecionado] = useState("");
  const [idiomaRacaSelecionado2, setIdiomaRacaSelecionado2] = useState("");

  const [equipamentosClasseSelecionada1, setEquipamentoClasseSelecionado1] =
    useState("");
  const [equipamentosClasseSelecionada2, setEquipamentoClasseSelecionado2] =
    useState("");
  const [equipamentosClasseSelecionada3, setEquipamentoClasseSelecionado3] =
    useState("");

  const [equipamentosClasseSelecionada4, setEquipamentoClasseSelecionado4] =
    useState("");

  const [periciasClasseSelecionadas, setPericiasSelecionadas] = useState([]);

  const [exibirPainelHabilidades, setExibirPainelHabilidades] = useState("");

  const [valoresHabilidade, setValoresHabilidade] = useState({
    Força: "",
    Destreza: "",
    Constituição: "",
    Inteligência: "",
    Sabedoria: "",
    Carisma: "",
  });

  const [Engenhocas, setEngenhocas] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const navigate = useNavigate();

  const racasOptions = racas.map((r) => r.nome);
  const classesOptions = classes.map((c) => c.nome);
  const TendenciasOptions = tendencias.map((t) => t.nome); // ✅ faltava
  const idiomaOption = idiomasArray; // ✅ faltava (ou idiomasArray.map(i => i))

  // ✅ racaSelecionada (usada em SubRacasOptions e effects)
  const racaSelecionada = useMemo(
    () => racas.find((r) => r.nome === raca) || null,
    [raca]
  );

  // ✅  ainda precisa disso p/ Etapa4 e para montar Classesinfo no salvar
  const classeSelecioanda = useMemo(
    () => classes.find((c) => c.nome === classe) || null,
    [classe]
  );

  // ✅ background agora vem da pasta local backgounds
  const bgUrl = useMemo(() => getClassBackgroundUrl(classe), [classe]);

  const SubRacasOptions = useMemo(() => {
    if (!racaSelecionada?.SubRacas?.length) return [];
    return racaSelecionada.SubRacas.map((sr) => sr.subRacaNome);
  }, [racaSelecionada]);

  // ✅ validação mínima por etapa (não vem do MUI!)
  const checkRequiredFields = useCallback(() => {
    const has = (v) => String(v || "").trim().length > 0;

    switch (etapa) {
      case 1:
        return has(nome);
      case 2:
        return has(raca);
      case 3:
        // só exige SubRaca se houver opções
        return SubRacasOptions.length ? has(SubRaca) : true;
      case 4:
        return has(classe);
      case 5:
        return has(tendencia);
      case 6:
        return has(antecedente);
      default:
        return true;
    }
  }, [etapa, nome, raca, SubRacasOptions.length, SubRaca, classe, tendencia, antecedente]);

  const handlePrevious = () => {
    if (etapa > 1) {
      setEtapa(etapa - 1);
    }
  };

  const handleNext = () => {
    // se estiver na etapa 6 mantém comportamento anterior para popular antecedenteSelecionado
    if (etapa === 6 && antecedente !== "") {
      const antecedenteEncontrado = antecedentes.find((a) => a.nome === antecedente);
      if (antecedenteEncontrado) setAntecedenteSelecionado(antecedenteEncontrado);
    }

    if (checkRequiredFields()) {
      if (etapa < 11) setEtapa(etapa + 1);
    } else {
      alert("Por favor, preencha todos os campos obrigatórios antes de prosseguir.");
    }
  };

  const handleRiquezaInicialCalculada = (riqueza) => {
    setRiquezaInicial(riqueza);
  };

  const classKeyFromProp = (c) => {
    if (!c) return "";
    if (typeof c === "string") return c;
    if (typeof c === "object" && c.nome) return c.nome;
    return String(c);
  };

  const handleConcluir = async () => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      // SubRacas
      const SubRacasField = getSubRacasField(
        SubRaca,
        IdiomaAltoElfo,
        detalhesSubRaca
      );
      const SubRacaGnomoField = getSubRacasGnomoField(SubRaca, Engenhocas);

      // Antecedentes
      const ArtesaoField = getArtesaoCaracteristicasFields(
        antecedente,
        CarcDosAntecedentes1,
        CarcDosAntecedentes2,
        idiomaDoAntecedente
      );
      const AcolitoField = getAcolitoCaracteristicasFields(
        antecedente,
        antecedenteSelecionado,
        idiomaDoAntecedente,
        idiomaDoAntecendente2
      );
      const ArtistaField = getArtistaCaracteristicasFields(
        antecedente,
        CarcDosAntecedentes3,
        antecedenteSelecionado
      );

      const IdiomasAntecedente = getIdiomasAntecendete(
        antecedente,
        idiomaDoAntecedente
      );
      const IdiomasAntecedente1 = getIdiomasAntecendete1(
        antecedente,
        idiomaDoAntecedente,
        idiomaDoAntecendente2
      );

      // RacasParaMandar
      const RacasInfo = {
        Idiomas: { idiomaRacaSelecionado, idiomaRacaSelecionado2 },
        Atributos: valoresHabilidade,
        SubRacasInfo: { ...SubRacasField, SubRacaGnomoField },
      };

      // ClassesParaMandar
      const Classesinfo = {
        imagens: classeSelecioanda?.imagens || [],
        Equipamentos: {
          equipamentosClasseSelecionada1,
          equipamentosClasseSelecionada2,
          equipamentosClasseSelecionada3,
          equipamentosClasseSelecionada4,
          equipamentoObgt: classeSelecioanda?.equipamentos?.equipamentoObgt,
        },
        periciasClasseSelecionadas,
      };

      const itensSelecionados = {
        tracoPersonalidade: tracoPersonalidadeSelecionado,
        ideal: idealSelecionado,
        defeito: defeitoSelecionado,
        vinculo: vinculoSelecionado,
        antecedente: antecedente,
        caracteristicas: {
          ...ArtesaoField,
          ...AcolitoField,
          ...ArtistaField,
          ...IdiomasAntecedente1,
          ...IdiomasAntecedente,
          CaracteristicasSugeridas:
            antecedenteSelecionado?.CaracteristicaDoAntecedente
              ?.caracteristicasSugeridas,
        },
      };

      // Envio para DB
      const res = await enviarFichaParaDatabase(
        nome,
        raca,
        classe,
        tendencia,
        itensSelecionados,
        riquezaInicial,
        RacasInfo,
        Classesinfo
      );

      if (res && res.success) {
        setSubmitSuccess(true);
        // pequena espera visual antes de redirecionar
        setTimeout(() => navigate("/fichas"), 900);
      } else {
        throw new Error("Resposta inválida do servidor.");
      }
    } catch (err) {
      console.error("Erro ao enviar ficha:", err);
      setSubmitError(err.message || "Erro ao enviar ficha.");
    } finally {
      setSubmitting(false);
    }
  };

  /* --- Summary small component --- */
  const SummaryCard = () => (
    <Paper elevation={6} sx={{ p: 3, borderRadius: 2, maxWidth: 880, mx: "auto" }}>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
        <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
          {nome ? nome.charAt(0).toUpperCase() : "?"}
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {nome || "Sem nome"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Resumo rápido do personagem
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <List dense>
            <ListItem>
              <ListItemText primary="Raça" secondary={raca || "—"} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Sub-Raça" secondary={SubRaca || "—"} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Classe" secondary={classe || "—"} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Tendência" secondary={tendencia || "—"} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Antecedente" secondary={antecedente || "—"} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Riqueza Inicial" secondary={`${riquezaInicial} PO`} />
            </ListItem>
          </List>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Atributos (base escolhidos)
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
            {Object.entries(valoresHabilidade).map(([k, v]) => (
              <Chip
                key={k}
                label={`${k}: ${v || "—"}`}
                color="default"
                size="small"
              />
            ))}
          </Box>

          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle2" sx={{ mt: 1 }}>
            Equipamentos & Perícias
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
            <Chip label={equipamentosClasseSelecionada1 || "—"} size="small" />
            <Chip label={equipamentosClasseSelecionada2 || "—"} size="small" />
            <Chip label={equipamentosClasseSelecionada3 || "—"} size="small" />
            <Chip label={equipamentosClasseSelecionada4 || "—"} size="small" />
          </Box>

          <Box sx={{ mt: 1 }}>
            {periciasClasseSelecionadas.length ? (
              periciasClasseSelecionadas.map((p) => (
                <Chip key={p} label={p} size="small" sx={{ mr: 0.5, mt: 0.5 }} />
              ))
            ) : (
              <Typography variant="caption" color="text.secondary">Nenhuma perícia selecionada</Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );

  /* Add these animation configs (local to component) */
  const steps = [
    "Nome",
    "Raça",
    "Sub-Raça",
    "Classe",
    "Tendência",
    "Antecedente",
    "Detalhes",
    "Traços",
    "Riqueza",
    "Atributos",
  ];

  const TOTAL_STEPS = 11; // 1..11 (11 = resumo)
  const progressValue = useMemo(() => {
    // etapa 1 => ~0%, etapa 11 => 100%
    const clamped = Math.min(Math.max(etapa, 1), TOTAL_STEPS);
    return ((clamped - 1) / (TOTAL_STEPS - 1)) * 100;
  }, [etapa]);

  // ✅ Atualiza detalhes/traits ao trocar raça + reseta dependências
  useEffect(() => {
    if (!raca) {
      setItensDaRaca([]);
      setIdiomaRacaSelecionado("");
      setIdiomaRacaSelecionado2("");
      setSubRaca("");
      setDetalhesSubRaca(null);
      setIdiomaAltoElfoSelecioando("");
      setEngenhocas("");
      return;
    }

    // ✅ pega direto do modelo real da raça (campo "habilidades")
    const habilidades = racaSelecionada?.habilidades || [];
    setItensDaRaca(Array.isArray(habilidades) ? habilidades : []);

    // reset para evitar warning do MUI “out-of-range value”
    setIdiomaRacaSelecionado("");
    setIdiomaRacaSelecionado2("");
    setSubRaca("");
    setDetalhesSubRaca(null);
    setIdiomaAltoElfoSelecioando("");
    setEngenhocas("");
  }, [raca, racaSelecionada]);

  // ✅ Evita “out-of-range value” quando a raça muda e o Select fica com valor antigo
  useEffect(() => {
    const opts = racaSelecionada?.idiomaRaca || [];
    if (idiomaRacaSelecionado && !opts.includes(idiomaRacaSelecionado)) {
      setIdiomaRacaSelecionado("");
    }
  }, [racaSelecionada, idiomaRacaSelecionado]);

  useEffect(() => {
    if (idiomaRacaSelecionado2 && !idiomaOption.includes(idiomaRacaSelecionado2)) {
      setIdiomaRacaSelecionado2("");
    }
  }, [idiomaOption, idiomaRacaSelecionado2]);

  // ✅ handler: agora também atualiza detalhesSubRaca (antes só resetava)
  const handleSubRacaChange = useCallback(
    (eOrValue) => {
      const value =
        typeof eOrValue === "string" ? eOrValue : eOrValue?.target?.value;

      setSubRaca(value || "");

      const found =
        racaSelecionada?.SubRacas?.find((sr) => sr.subRacaNome === value) || null;
      setDetalhesSubRaca(found);

      setIdiomaAltoElfoSelecioando("");
      setEngenhocas("");
    },
    [racaSelecionada]
  );

  // ✅ tendência selecionada (para ler descrição/campos)
  const tendenciaSelecionada = useMemo(
    () => tendencias.find((t) => t.nome === tendencia) || null,
    [tendencia]
  );

  // ✅ Ao trocar a tendência, atualiza descrição/itens exibidos na Etapa5
  useEffect(() => {
    if (!tendencia) {
      setItensDaTendencia([]);
      return;
    }

    // Preferência: descrição textual (quando existir)
    const desc =
      tendenciaSelecionada?.descricao ??
      tendenciaSelecionada?.Descricao ??
      tendenciaSelecionada?.descricaoTendencia ??
      tendenciaSelecionada?.descricaoDaTendencia ??
      "";

    if (typeof desc === "string" && desc.trim()) {
      setItensDaTendencia([desc.trim()]);
      return;
    }

    // Fallback: tenta pegar um array de itens
    const itens =
      tendenciaSelecionada?.itens ??
      tendenciaSelecionada?.Itens ??
      tendenciaSelecionada?.habilidades ??
      [];

    setItensDaTendencia(Array.isArray(itens) ? itens : []);
  }, [tendencia, tendenciaSelecionada]);

  // ✅ antecedente selecionado (derivado)
  const antecedenteEncontrado = useMemo(
    () => antecedentes.find((a) => a.nome === antecedente) || null,
    [antecedente]
  );

  // ✅ Ao trocar o antecedente, atualiza detalhes exibidos na Etapa6
  useEffect(() => {
    setAntecedenteSelecionado(antecedenteEncontrado);

    if (!antecedenteEncontrado) {
      setItensAntecedencia([]);
      setIdiomaAntecedente("");
      setIdiomaAntecendente2("");
      return;
    }

    // monta um “resumo” para o card da Etapa6 (flexível com chaves diferentes)
    const parts = [];

    const pushIf = (label, value) => {
      if (!value) return;
      if (Array.isArray(value)) {
        const clean = value.filter(Boolean).map(String);
        if (clean.length) parts.push(`${label}: ${clean.join(", ")}`);
        return;
      }
      if (typeof value === "string" && value.trim()) parts.push(`${label}: ${value.trim()}`);
    };

    // comuns em backgrounds
    pushIf("Proficiências", antecedenteEncontrado.proficiencias ?? antecedenteEncontrado.Proficiencias);
    pushIf("Equipamentos", antecedenteEncontrado.equipamentos ?? antecedenteEncontrado.Equipamentos);
    pushIf("Idiomas", antecedenteEncontrado.idiomas ?? antecedenteEncontrado.Idiomas);

    // seu modelo atual usa esse bloco (você já referencia em outras funções)
    const car = antecedenteEncontrado.CaracteristicaDoAntecedente;
    pushIf("Característica", car?.CaracteristicaTexto1);
    pushIf("Sugestões", car?.caracteristicasSugeridas);

    // fallback: descrição geral
    pushIf(
      "Descrição",
      antecedenteEncontrado.descricao ??
        antecedenteEncontrado.Descricao ??
        antecedenteEncontrado.texto ??
        antecedenteEncontrado.Texto
    );

    setItensAntecedencia(parts.length ? parts : ["Nenhuma informação disponível."]);
  }, [antecedenteEncontrado]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: { xs: 1.5, sm: 2.5 },
        py: { xs: 2, md: 3 },

        // ✅ overlay + (opcional) imagem da classe
        backgroundImage: bgUrl
          ? `
            radial-gradient(120% 90% at 15% 0%, rgba(255,204,0,0.08) 0%, rgba(0,0,0,0.00) 55%),
            radial-gradient(120% 90% at 85% 110%, rgba(255,70,0,0.07) 0%, rgba(0,0,0,0.00) 58%),
            linear-gradient(180deg, rgba(8,6,6,0.72), rgba(8,6,6,0.35) 35%, rgba(8,6,6,0.55)),
            url("${bgUrl}")
          `
          : `
            radial-gradient(120% 90% at 15% 0%, rgba(255,204,0,0.08) 0%, rgba(0,0,0,0.00) 55%),
            radial-gradient(120% 90% at 85% 110%, rgba(255,70,0,0.07) 0%, rgba(0,0,0,0.00) 58%),
            linear-gradient(180deg, rgba(12,10,10,0.35), rgba(0,0,0,0.00) 40%),
            linear-gradient(180deg, rgba(24,18,16,0.20), rgba(0,0,0,0.00))
          `,
        backgroundSize: bgUrl ? "auto, auto, auto, cover" : "auto",
        backgroundPosition: bgUrl ? "center, center, center, center" : "center",
        backgroundRepeat: bgUrl ? "no-repeat, no-repeat, no-repeat, no-repeat" : "no-repeat",
      }}
    >
      <Box sx={{ maxWidth: 1100, mx: "auto" }}>
        <Paper elevation={4} sx={{ p: 2, mb: 2, backgroundColor: "background.paper" }}>
          <Typography variant="h6" align="center" gutterBottom>
            Criar Ficha
          </Typography>

          {/* ✅ Mobile: compacto e legível */}
          {isMobile ? (
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                <Typography variant="body2" sx={{ fontWeight: 900 }}>
                  Etapa {etapa} de {TOTAL_STEPS}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.75 }}>
                  {etapa <= 10 ? steps[etapa - 1] : "Resumo"}
                </Typography>
              </Stack>
              <LinearProgress variant="determinate" value={progressValue} />
            </Stack>
          ) : (
            <Stepper activeStep={Math.max(0, etapa - 1)} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}
        </Paper>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={etapa}
            layout
            style={{ width: "100%" }}
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
          >
            {etapa === 1 && <Etapa1 nome={nome} setNome={setNome} />}
            {etapa === 2 && (
              <Etapa2
                raca={raca}
                setRaca={setRaca}
                racasOptions={racasOptions}
                itensDaRaca={itensDaRaca}
                racaSelecionada={racaSelecionada}
                idiomaRacaSelecionado={idiomaRacaSelecionado}
                setIdiomaRacaSelecionado={setIdiomaRacaSelecionado}
                idiomaRacaSelecionado2={idiomaRacaSelecionado2}
                setIdiomaRacaSelecionado2={setIdiomaRacaSelecionado2}
                idiomaOption={idiomaOption}
              />
            )}
            {etapa === 3 && (
              <Etapa3
                raca={raca}
                racaSelecionada={racaSelecionada}
                SubRacasOptions={SubRacasOptions}
                SubRaca={SubRaca}
                detalhesSubRaca={detalhesSubRaca}
                idiomaOption={idiomaOption}
                setIdiomaAltoElfoSelecioando={setIdiomaAltoElfoSelecioando}
                IdiomaAltoElfo={IdiomaAltoElfo}
                handleSubRacaChange={handleSubRacaChange}
                Engenhocas={Engenhocas}
                setEngenhocas={setEngenhocas}
              />
            )}
            {etapa === 4 && (
              <Etapa4
                classe={classe}
                setClasse={setClasse}
                classesOptions={classesOptions}
                itensDaClasse={itensDaClasse}
                equipamentosClasseSelecionada1={equipamentosClasseSelecionada1}
                setEquipamentoClasseSelecionado1={setEquipamentoClasseSelecionado1}
                equipamentosClasseSelecionada2={equipamentosClasseSelecionada2}
                setEquipamentoClasseSelecionado2={setEquipamentoClasseSelecionado2}
                equipamentosClasseSelecionada3={equipamentosClasseSelecionada3}
                setEquipamentoClasseSelecionado3={setEquipamentoClasseSelecionado3}
                equipamentosClasseSelecionada4={equipamentosClasseSelecionada4}
                setEquipamentoClasseSelecionado4={setEquipamentoClasseSelecionado4}
                classeSelecioanda={classeSelecioanda}
                periciasClasseSelecionadas={periciasClasseSelecionadas}
                setPericiasSelecionadas={setPericiasSelecionadas}
                setExibirPainelHabilidades={setExibirPainelHabilidades}
                exibirPainelHabilidades={exibirPainelHabilidades}
              />
            )}
            {etapa === 5 && (
              <Etapa5
                tendencia={tendencia}
                setTendencia={setTendencia}
                TendenciasOptions={TendenciasOptions}
                itensDaTendencia={itensDaTendencia}
              />
            )}
            {etapa === 6 && (
              <Etapa6
                antecedente={antecedente}
                setAntecedente={setAntecedente}
                antecedentesOptions={antecedentes.map((a) => a.nome)}
                itensDaAntecedencia={itensDaAntecedencia}
                idiomaDoAntecedente={idiomaDoAntecedente}
                idiomaDoAntecendente2={idiomaDoAntecendente2}
                setIdiomaAntecedente={setIdiomaAntecedente}
                setIdiomaAntecendente2={setIdiomaAntecendente2}
                idiomaOption={idiomaOption}
              />
            )}
            {etapa === 7 && antecedenteSelecionado && (
              <Etapa7
                antecedente={antecedente}
                antecedenteSelecionado={antecedenteSelecionado}
                CarcDosAntecedentes1={CarcDosAntecedentes1}
                setCarcDosAntecedents1={setCarcDosAntecedents1}
                CarcDosAntecedentes2={CarcDosAntecedentes2}
                setCarcDosAntecedentes2={setCarcDosAntecedentes2}
                CarcDosAntecedentes3={CarcDosAntecedentes3}
                setCarcDosAntecedents3={setCarcDosAntecedents3}
              />
            )}
            {etapa === 8 && (
              <Etapa8
                tracoPersonalidade={antecedenteSelecionado?.tracoPersonalidade || []}
                ideal={antecedenteSelecionado?.ideal || []}
                defeito={antecedenteSelecionado?.defeito || []}
                vinculo={antecedenteSelecionado?.vinculo || []}
                tracoPersonalidadeSelecionado={tracoPersonalidadeSelecionado}
                idealSelecionado={idealSelecionado}
                defeitoSelecionado={defeitoSelecionado}
                vinculoSelecionado={vinculoSelecionado}
                onSelecionarTracoPersonalidade={(e) => setTracoPersonalidadeSelecionado(e.target.value)}
                setTracoPersonalidadeSelecionado={setTracoPersonalidadeSelecionado}
                onSelecionarIdeal={(e) => setIdealSelecionado(e.target.value)}
                onSelecionarDefeito={(e) => setDefeitoSelecionado(e.target.value)}
                onSelecionarVinculo={(e) => setVinculoSelecionado(e.target.value)}
              />
            )}
            {etapa === 9 && (
              <Etapa9
                riquezaInicial={riquezaInicial}
                setRiquezaInicial={setRiquezaInicial}
                classeSelecionada={classe}
                onRiquezaInicialCalculada={handleRiquezaInicialCalculada}
              />
            )}
            {etapa === 10 && (
              <Etapa10
                racaSelecionada={racaSelecionada}
                valoresHabilidade={valoresHabilidade}
                setValoresHabilidade={setValoresHabilidade}
                SubRaca={SubRaca}
                detalhesSubRaca={detalhesSubRaca}
              />
            )}
            {etapa === 11 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
                <SummaryCard />
                <Box sx={{ mt: 2, display: "flex", gap: 2, justifyContent: "center" }}>
                  <Button variant="outlined" color="secondary" onClick={() => setEtapa(10)}>
                    Voltar e editar
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleConcluir}
                    disabled={submitting || submitSuccess}
                    startIcon={submitting ? <CircularProgress size={18} /> : null}
                  >
                    {submitSuccess ? "Concluído" : submitting ? "Enviando..." : "Concluir e Salvar"}
                  </Button>
                </Box>

                {submitError && (
                  <Typography color="error" sx={{ mt: 2 }} align="center">
                    {submitError}
                  </Typography>
                )}

                {submitSuccess && (
                  <Typography color="success.main" sx={{ mt: 2 }} align="center">
                    Ficha criada com sucesso — redirecionando...
                  </Typography>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* botões */}
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              {etapa > 1 && etapa <= 10 ? (
                <Button variant="contained" color="secondary" onClick={handlePrevious}>
                  Etapa Anterior
                </Button>
              ) : null}
            </Grid>
            <Grid item>
              {etapa < 11 ? (
                <Button variant="contained" color="primary" onClick={handleNext} disabled={!checkRequiredFields()}>
                  Próxima Etapa
                </Button>
              ) : null}
            </Grid>
          </Grid>
        </Box>

        {/* crédito do background (sem CSS) */}
        <Typography sx={{ mt: 3, textAlign: "center", opacity: 0.75 }}>
          BackGround Art By:{" "}
          {backgrounds?.[classe] ? (
            <a
              href={backgrounds[classe]}
              target="_blank"
              rel="noreferrer"
              style={{ color: "inherit", textDecoration: "underline" }}
            >
              {backgrounds[classe]}
            </a>
          ) : (
            "—"
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default FichaCriar;
