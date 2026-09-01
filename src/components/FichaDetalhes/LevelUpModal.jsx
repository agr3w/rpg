import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  IconButton,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stepper,
  Step,
  StepLabel,
  StepButton,
  alpha,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CasinoIcon from "@mui/icons-material/Casino";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import BoltIcon from "@mui/icons-material/Bolt";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import { HABILIDADES_CLASSES, normalizeString } from "../../Array/HabilidadesDB";
import { DADO_VIDA_POR_CLASSE, classeTemASI, getEscolhasClasseNivel } from "../../Array/RegrasLevelUp";
import { SUBCLASSES_POR_CLASSE } from "../../Array/RegrasSubclasses";

export default function LevelUpModal({
  open,
  onClose,
  ficha,
  fromLevel = 1,
  toLevel = 2,
  targetXp = null,
  onConfirmLevelUp,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const strokeColor = isDark ? "rgba(229,179,36,0.22)" : "rgba(131,60,11,0.22)";
  const accentColor = theme.palette.secondary.main || "#bf8f00";

  const classe = ficha?.classe || ficha?.class || "Guerreiro";
  const infoDadoVida = DADO_VIDA_POR_CLASSE[classe] || { dado: 8, media: 5 };
  const subracaStr = String(ficha?.subraca || ficha?.subRaca || "").toLowerCase();
  const bonusRacialHp = subracaStr.includes("colina") ? 1 : 0;

  // Lista de níveis a evoluir em sequência (ex: [4, 5])
  const levelsList = useMemo(() => {
    const start = Math.max(1, Number(fromLevel || 1));
    const end = Math.min(20, Math.max(start + 1, Number(toLevel || start + 1)));
    const list = [];
    for (let lvl = start + 1; lvl <= end; lvl++) {
      list.push(lvl);
    }
    return list.length > 0 ? list : [start + 1];
  }, [fromLevel, toLevel]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Estado de cada nível (HP, ASI, Subclasse)
  const [stepsData, setStepsData] = useState({});
  const [subclasseGlobal, setSubclasseGlobal] = useState(ficha?.subclasse || ficha?.subClasse || "");
  const [rolandoDado, setRolandoDado] = useState(false);

  // Inicializa dados de cada etapa quando o modal abre
  useEffect(() => {
    if (open) {
      setCurrentStepIndex(0);
      setSubclasseGlobal(ficha?.subclasse || ficha?.subClasse || "");

      const initialData = {};
      levelsList.forEach((lvl) => {
        initialData[lvl] = {
          metodoVida: "media",
          vidaRolada: null,
          modoASI: "maisDois",
          asiAtributo1: "forca",
          asiAtributo2: "destreza",
        };
      });
      setStepsData(initialData);
    }
  }, [open, levelsList, ficha]);

  const currentLevel = levelsList[currentStepIndex] || levelsList[0] || 2;
  const currentStepData = stepsData[currentLevel] || {
    metodoVida: "media",
    vidaRolada: null,
    modoASI: "maisDois",
    asiAtributo1: "forca",
    asiAtributo2: "destreza",
  };

  // Modificador de Constituição atual da ficha
  const conValor = Number(ficha?.atributos?.constituicao || ficha?.constituicao || 10);
  const modCon = Math.floor((conValor - 10) / 2);

  // Cálculo de ganho de HP para o nível atual
  const valorDadoCurrent =
    currentStepData.metodoVida === "media"
      ? infoDadoVida.media
      : currentStepData.vidaRolada || infoDadoVida.media;
  const ganhoHpCurrent = Math.max(1, valorDadoCurrent + modCon + bonusRacialHp);

  // Verifica se o nível atual tem ASI
  const temASICurrent = classeTemASI(classe, currentLevel);

  // Escolhas pendentes para o nível atual
  const escolhasCurrent = getEscolhasClasseNivel(classe, currentLevel, {
    ...ficha,
    subclasse: subclasseGlobal,
  });

  // Habilidades desbloqueadas no nível atual
  const habilidadesCurrent = useMemo(() => {
    const cNorm = normalizeString(classe);
    const subNorm = normalizeString(subclasseGlobal);

    return HABILIDADES_CLASSES.filter((h) => {
      const v = normalizeString(h.vinculo);
      const cMatch = (v === cNorm || v.includes(cNorm) || cNorm.includes(v)) && (h.categoria === "classe" || h.categoria === "estilo_luta");
      const subMatch =
        subclasseGlobal &&
        (v === subNorm || v.includes(subNorm) || subNorm.includes(v)) &&
        h.categoria === "subclasse";

      return Number(h.nivel) === currentLevel && (cMatch || subMatch);
    });
  }, [classe, subclasseGlobal, currentLevel]);

  // Atualizar campo específico do step atual
  const updateStepData = (field, value) => {
    setStepsData((prev) => ({
      ...prev,
      [currentLevel]: {
        ...(prev[currentLevel] || {}),
        [field]: value,
      },
    }));
  };

  // Rolar dado de vida
  const handleRolarVida = () => {
    setRolandoDado(true);
    setTimeout(() => {
      const rolagem = Math.floor(Math.random() * infoDadoVida.dado) + 1;
      updateStepData("vidaRolada", rolagem);
      setRolandoDado(false);
    }, 400);
  };

  // Navegação do Stepper
  const handleNext = () => {
    if (currentStepIndex < levelsList.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleFinalizar();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  // Finalizar e aplicar evolução completa
  const handleFinalizar = () => {
    let totalHpGanho = 0;
    const atributosAtualizados = { ...(ficha?.atributos || {}) };

    levelsList.forEach((lvl) => {
      const data = stepsData[lvl] || {};
      const dadoVal = data.metodoVida === "media" ? infoDadoVida.media : data.vidaRolada || infoDadoVida.media;
      const hpLvl = Math.max(1, dadoVal + modCon + bonusRacialHp);
      totalHpGanho += hpLvl;

      if (classeTemASI(classe, lvl)) {
        if (data.modoASI === "maisDois") {
          const attr = data.asiAtributo1 || "forca";
          atributosAtualizados[attr] = Math.min(20, (Number(atributosAtualizados[attr]) || 10) + 2);
        } else {
          const a1 = data.asiAtributo1 || "forca";
          const a2 = data.asiAtributo2 || "destreza";
          atributosAtualizados[a1] = Math.min(20, (Number(atributosAtualizados[a1]) || 10) + 1);
          atributosAtualizados[a2] = Math.min(20, (Number(atributosAtualizados[a2]) || 10) + 1);
        }
      }
    });

    const finalNivel = levelsList[levelsList.length - 1] || toLevel;
    const oldHpMax = Number(ficha?.hp?.max || ficha?.vidaMax || ficha?.pvMax || 10);
    const oldHpAtual = Number(ficha?.hp?.atual || ficha?.vidaAtual || ficha?.pvAtual || oldHpMax);

    const payloadAtualizacao = {
      nivel: finalNivel,
      level: finalNivel,
      vidaMax: oldHpMax + totalHpGanho,
      vidaAtual: oldHpAtual + totalHpGanho,
      atributos: atributosAtualizados,
      subclasse: subclasseGlobal || ficha?.subclasse || "",
      xp: targetXp !== null ? targetXp : (ficha?.xp ?? ficha?.XP ?? 0),
    };

    onConfirmLevelUp?.(payloadAtualizacao);
    onClose?.();
  };

  const totalSteps = levelsList.length;
  const isLastStep = currentStepIndex === totalSteps - 1;

  // Validação para habilitar botão de prosseguir
  const requerSubclasseAgora = escolhasCurrent.some((e) => e.tipo === "subclasse");
  const podeAvancar = !requerSubclasseAgora || Boolean(subclasseGlobal);

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: `1px solid ${strokeColor}`,
          bgcolor: isDark ? "#18110c" : "#fffcf6",
          backgroundImage: "none",
          boxShadow: isDark
            ? "0 24px 60px rgba(0,0,0,0.85), 0 0 30px rgba(191,143,0,0.15)"
            : "0 18px 45px rgba(0,0,0,0.15), 0 0 20px rgba(191,143,0,0.12)",
        },
      }}
    >
      {/* HEADER DO MODAL */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${strokeColor}`,
          pb: 1.5,
          pt: 2,
          px: { xs: 2, md: 3 },
          bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: alpha(accentColor, 0.15),
              border: `1px solid ${accentColor}`,
              color: accentColor,
            }}
          >
            <TrendingUpIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Cinzel",
                fontWeight: 800,
                color: accentColor,
                lineHeight: 1.1,
              }}
            >
              Subida de Nível: {ficha?.nome || "Personagem"}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {classe} • Evoluindo do Nível {fromLevel} para o Nível {toLevel}
            </Typography>
          </Box>
        </Stack>

        <IconButton onClick={onClose} size="small" sx={{ color: "text.secondary" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
        {/* STEPPER MULTI-NÍVEL (SE SUBIR MAIS DE 1 NÍVEL) */}
        {totalSteps > 1 && (
          <Box sx={{ mb: 3 }}>
            <Stepper nonLinear activeStep={currentStepIndex}>
              {levelsList.map((lvl, index) => (
                <Step key={lvl} completed={index < currentStepIndex}>
                  <StepButton onClick={() => setCurrentStepIndex(index)}>
                    <StepLabel
                      StepIconProps={{
                        sx: {
                          "&.Mui-active": { color: accentColor },
                          "&.Mui-completed": { color: accentColor },
                        },
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: "Cinzel",
                          fontWeight: index === currentStepIndex ? 800 : 600,
                          color: index === currentStepIndex ? accentColor : "text.secondary",
                        }}
                      >
                        Nível {lvl}
                      </Typography>
                    </StepLabel>
                  </StepButton>
                </Step>
              ))}
            </Stepper>
          </Box>
        )}

        {/* INDICADOR DO NÍVEL ATUAL SENDO CONFIGURADO */}
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            mb: 2.5,
            borderRadius: 2,
            border: `1px solid ${strokeColor}`,
            bgcolor: isDark ? "rgba(229,179,36,0.08)" : "rgba(191,143,0,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Chip
              label={`NÍVEL ${currentLevel}`}
              size="small"
              sx={{
                bgcolor: accentColor,
                color: "#000",
                fontWeight: 900,
                fontFamily: "Cinzel",
              }}
            />
            <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
              {totalSteps > 1
                ? `Etapa ${currentStepIndex + 1} de ${totalSteps}: Configurando Nível ${currentLevel}`
                : `Configurando progressão do ${currentLevel}º Nível`}
            </Typography>
          </Stack>
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
            Dado de Vida: d{infoDadoVida.dado}
          </Typography>
        </Paper>

        <Stack spacing={2.5}>
          {/* SEÇÃO 1: PONTOS DE VIDA (HP) */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: `1px solid ${strokeColor}`,
              bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
              <FavoriteIcon sx={{ color: "#ef4444", fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ fontFamily: "Cinzel", fontWeight: 800, color: accentColor }}>
                Pontos de Vida (Dado de Vida d{infoDadoVida.dado})
              </Typography>
            </Stack>

            <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant={currentStepData.metodoVida === "media" ? "contained" : "outlined"}
                  onClick={() => updateStepData("metodoVida", "media")}
                  sx={{
                    py: 1,
                    fontWeight: 700,
                    bgcolor: currentStepData.metodoVida === "media" ? accentColor : "transparent",
                    color: currentStepData.metodoVida === "media" ? "#000" : "text.primary",
                    borderColor: strokeColor,
                    "&:hover": {
                      borderColor: accentColor,
                      bgcolor: currentStepData.metodoVida === "media" ? alpha(accentColor, 0.9) : alpha(accentColor, 0.08),
                    },
                  }}
                >
                  Média Fixa (+{infoDadoVida.media})
                </Button>
              </Grid>

              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant={currentStepData.metodoVida === "rolagem" ? "contained" : "outlined"}
                  onClick={() => {
                    updateStepData("metodoVida", "rolagem");
                    if (!currentStepData.vidaRolada) handleRolarVida();
                  }}
                  startIcon={<CasinoIcon />}
                  sx={{
                    py: 1,
                    fontWeight: 700,
                    bgcolor: currentStepData.metodoVida === "rolagem" ? accentColor : "transparent",
                    color: currentStepData.metodoVida === "rolagem" ? "#000" : "text.primary",
                    borderColor: strokeColor,
                    "&:hover": {
                      borderColor: accentColor,
                      bgcolor: currentStepData.metodoVida === "rolagem" ? alpha(accentColor, 0.9) : alpha(accentColor, 0.08),
                    },
                  }}
                >
                  Rolar Dado (d{infoDadoVida.dado})
                </Button>
              </Grid>
            </Grid>

            {currentStepData.metodoVida === "rolagem" && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 1.25,
                  mb: 1.5,
                  borderRadius: 1.5,
                  bgcolor: isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.04)",
                  border: `1px dashed ${strokeColor}`,
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleRolarVida}
                  disabled={rolandoDado}
                  startIcon={<CasinoIcon />}
                  sx={{ borderColor: accentColor, color: accentColor, fontWeight: 700 }}
                >
                  {rolandoDado ? "Rolando..." : `Rolar 1d${infoDadoVida.dado}`}
                </Button>
                {currentStepData.vidaRolada !== null && (
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    Resultado Rolado: <strong style={{ color: accentColor, fontSize: "1.1rem" }}>{currentStepData.vidaRolada}</strong>
                  </Typography>
                )}
              </Box>
            )}

            {/* CÁLCULO VISUAL DO GANHO DE PV */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1.25,
                borderRadius: 1.5,
                bgcolor: isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.06)",
                fontSize: "0.85rem",
                color: "text.secondary",
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <span>+ {valorDadoCurrent} (Dado)</span>
                <span>+ {modCon} (Mod. CON)</span>
                {bonusRacialHp > 0 && <span>+ 1 (Anão da Colina)</span>}
              </Stack>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#16a34a" }}>
                = +{ganhoHpCurrent} PV Máximos
              </Typography>
            </Box>
          </Paper>

          {/* SEÇÃO 2: ESCOLHA DE SUBCLASSE (SE DESBLOQUEAR NESTE NÍVEL) */}
          {escolhasCurrent.some((e) => e.tipo === "subclasse") && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                border: `1px solid ${accentColor}`,
                bgcolor: isDark ? "rgba(229,179,36,0.04)" : "rgba(191,143,0,0.04)",
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                <WorkspacePremiumIcon sx={{ color: accentColor, fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ fontFamily: "Cinzel", fontWeight: 800, color: accentColor }}>
                  Especialização: Escolha seu Arquétipo / Subclasse
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 1.5 }}>
                Sua classe desbloqueia a especialização de arquétipo neste nível.
              </Typography>

              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: "text.secondary" }}>Subclasse / Arquétipo</InputLabel>
                <Select
                  value={subclasseGlobal}
                  label="Subclasse / Arquétipo"
                  onChange={(e) => setSubclasseGlobal(e.target.value)}
                  sx={{
                    bgcolor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.8)",
                  }}
                >
                  <MenuItem value="">
                    <em>-- Selecione sua Subclasse --</em>
                  </MenuItem>
                  {(SUBCLASSES_POR_CLASSE[classe] || []).map((sub) => (
                    <MenuItem key={sub} value={sub}>
                      {sub}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Paper>
          )}

          {/* SEÇÃO 3: INCREMENTO DE ATRIBUTO (ASI) */}
          {temASICurrent && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                border: `1px solid ${strokeColor}`,
                bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                <BoltIcon sx={{ color: accentColor, fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ fontFamily: "Cinzel", fontWeight: 800, color: accentColor }}>
                  Incremento no Valor de Habilidade (ASI)
                </Typography>
              </Stack>

              <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant={currentStepData.modoASI === "maisDois" ? "contained" : "outlined"}
                    onClick={() => updateStepData("modoASI", "maisDois")}
                    sx={{
                      py: 0.8,
                      fontWeight: 700,
                      bgcolor: currentStepData.modoASI === "maisDois" ? accentColor : "transparent",
                      color: currentStepData.modoASI === "maisDois" ? "#000" : "text.primary",
                      borderColor: strokeColor,
                      "&:hover": { borderColor: accentColor },
                    }}
                  >
                    +2 em 1 Atributo
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant={currentStepData.modoASI === "doisDeUm" ? "contained" : "outlined"}
                    onClick={() => updateStepData("modoASI", "doisDeUm")}
                    sx={{
                      py: 0.8,
                      fontWeight: 700,
                      bgcolor: currentStepData.modoASI === "doisDeUm" ? accentColor : "transparent",
                      color: currentStepData.modoASI === "doisDeUm" ? "#000" : "text.primary",
                      borderColor: strokeColor,
                      "&:hover": { borderColor: accentColor },
                    }}
                  >
                    +1 em 2 Atributos
                  </Button>
                </Grid>
              </Grid>

              {currentStepData.modoASI === "maisDois" ? (
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ color: "text.secondary" }}>Aumentar em +2</InputLabel>
                  <Select
                    value={currentStepData.asiAtributo1}
                    label="Aumentar em +2"
                    onChange={(e) => updateStepData("asiAtributo1", e.target.value)}
                  >
                    <MenuItem value="forca">Força (Atual: {ficha?.atributos?.forca || 10})</MenuItem>
                    <MenuItem value="destreza">Destreza (Atual: {ficha?.atributos?.destreza || 10})</MenuItem>
                    <MenuItem value="constituicao">Constituição (Atual: {ficha?.atributos?.constituicao || 10})</MenuItem>
                    <MenuItem value="inteligencia">Inteligência (Atual: {ficha?.atributos?.inteligencia || 10})</MenuItem>
                    <MenuItem value="sabedoria">Sabedoria (Atual: {ficha?.atributos?.sabedoria || 10})</MenuItem>
                    <MenuItem value="carisma">Carisma (Atual: {ficha?.atributos?.carisma || 10})</MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <Grid container spacing={1.5}>
                  <Grid item xs={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ color: "text.secondary" }}>Primeiro (+1)</InputLabel>
                      <Select
                        value={currentStepData.asiAtributo1}
                        label="Primeiro (+1)"
                        onChange={(e) => updateStepData("asiAtributo1", e.target.value)}
                      >
                        <MenuItem value="forca">Força</MenuItem>
                        <MenuItem value="destreza">Destreza</MenuItem>
                        <MenuItem value="constituicao">Constituição</MenuItem>
                        <MenuItem value="inteligencia">Inteligência</MenuItem>
                        <MenuItem value="sabedoria">Sabedoria</MenuItem>
                        <MenuItem value="carisma">Carisma</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ color: "text.secondary" }}>Segundo (+1)</InputLabel>
                      <Select
                        value={currentStepData.asiAtributo2}
                        label="Segundo (+1)"
                        onChange={(e) => updateStepData("asiAtributo2", e.target.value)}
                      >
                        <MenuItem value="destreza">Destreza</MenuItem>
                        <MenuItem value="forca">Força</MenuItem>
                        <MenuItem value="constituicao">Constituição</MenuItem>
                        <MenuItem value="inteligencia">Inteligência</MenuItem>
                        <MenuItem value="sabedoria">Sabedoria</MenuItem>
                        <MenuItem value="carisma">Carisma</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              )}
            </Paper>
          )}

          {/* SEÇÃO 4: CARACTERÍSTICAS DO NÍVEL ATUAL */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: `1px solid ${strokeColor}`,
              bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
              <AutoAwesomeIcon sx={{ color: accentColor, fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ fontFamily: "Cinzel", fontWeight: 800, color: accentColor }}>
                Recursos Desbloqueados no {currentLevel}º Nível
              </Typography>
            </Stack>

            {habilidadesCurrent.length > 0 ? (
              <Stack spacing={1}>
                {habilidadesCurrent.map((hab) => (
                  <Paper
                    key={hab.id}
                    elevation={0}
                    sx={{
                      p: 1.25,
                      borderRadius: 1.5,
                      borderLeft: `3px solid ${accentColor}`,
                      bgcolor: isDark ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.03)",
                      borderTop: `1px solid ${strokeColor}`,
                      borderRight: `1px solid ${strokeColor}`,
                      borderBottom: `1px solid ${strokeColor}`,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: "text.primary" }}>
                        {hab.nome}
                      </Typography>
                      <Chip
                        label={hab.tipoAcao || "Passiva"}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          bgcolor: alpha(accentColor, 0.15),
                          color: accentColor,
                        }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", lineHeight: 1.4, display: "block" }}>
                      {hab.descricao}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Novos espaços de magia e bônus passivos de classe concedidos automaticamente para o {currentLevel}º nível.
              </Typography>
            )}
          </Paper>
        </Stack>
      </DialogContent>

      {/* FOOTER DO MODAL COM NAVEGAÇÃO DE ETAPAS */}
      <DialogActions
        sx={{
          p: 2,
          px: 3,
          borderTop: `1px solid ${strokeColor}`,
          bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={currentStepIndex > 0 ? handleBack : onClose}
          startIcon={currentStepIndex > 0 ? <ArrowBackIcon /> : null}
          sx={{ color: "text.secondary" }}
        >
          {currentStepIndex > 0 ? "Nível Anterior" : "Cancelar"}
        </Button>

        <Button
          variant="contained"
          onClick={handleNext}
          disabled={!podeAvancar}
          endIcon={!isLastStep ? <ArrowForwardIcon /> : <CheckCircleRoundedIcon />}
          sx={{
            bgcolor: accentColor,
            color: "#000",
            fontWeight: 800,
            fontFamily: "Cinzel",
            px: 3,
            "&:hover": { bgcolor: "#ffd700", filter: "brightness(0.95)" },
          }}
        >
          {!isLastStep
            ? `Avançar para Nível ${levelsList[currentStepIndex + 1]}`
            : `Finalizar e Evoluir para Nível ${toLevel}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
