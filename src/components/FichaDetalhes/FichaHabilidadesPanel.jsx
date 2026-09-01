import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Stack,
  Button,
  Chip,
  alpha,
  useTheme,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PsychologyIcon from "@mui/icons-material/Psychology";
import SecurityIcon from "@mui/icons-material/Security";

import FeatureCardItem from "./FeatureCardItem";
import FeaturesCompendiumModal from "./FeaturesCompendiumModal";
import AddFeatureModal from "./AddFeatureModal";
import {
  getHabilidadesPersonagem,
  calcularUsosMaximos,
  getCompendioCompleto,
} from "../../Array/HabilidadesDB";

export default function FichaHabilidadesPanel({
  ficha = {},
  racaNome = "",
  subRacaNome = "",
  classeNome = "",
  levelAtual = 1,
  habilidadesRaca = [],
  classFeaturesProgression = [],
  customClassFeatures = [],
  onChangeCustomClassFeatures,
  usosHabilidades = {},
  onChangeUsosHabilidades,
  abilityMods = {},
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const strokeColor = isDark ? "rgba(229,179,36,0.22)" : "rgba(131,60,11,0.22)";
  const cardBg = isDark ? "rgba(24, 17, 13, 0.85)" : "rgba(255, 252, 246, 0.92)";
  const accentColor = theme.palette.secondary.main || "#bf8f00";

  // Estados dos Modais
  const [compendiumOpen, setCompendiumOpen] = useState(false);
  const [compendiumFocusId, setCompendiumFocusId] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingCustomFeature, setEditingCustomFeature] = useState(null);

  // 1. Objeto unificado com dados da ficha para cálculos dinâmicos
  const fichaCompleta = useMemo(() => {
    return {
      ...ficha,
      raca: racaNome || ficha?.raca || "Raça",
      subraca: subRacaNome || ficha?.subraca || ficha?.DetalhesDaRaça?.SubRaca || "",
      classe: classeNome || ficha?.classe || "Classe",
      subclasse: ficha?.subclasse || "",
      nivel: Number(levelAtual || ficha?.nivel || ficha?.level || 1),
      atributos: ficha?.atributos || abilityMods || {},
      habilidadesLivres: ficha?.habilidadesLivres || customClassFeatures || [],
    };
  }, [ficha, racaNome, subRacaNome, classeNome, levelAtual, abilityMods, customClassFeatures]);

  // 2. Obtenção das habilidades automáticas do personagem (desbloqueadas para o nível atual)
  const todasHabilidadesAuto = useMemo(() => {
    const list = getHabilidadesPersonagem(fichaCompleta);
    return list.map((h) => {
      const calcMax = calcularUsosMaximos(h, fichaCompleta);
      return {
        ...h,
        usosMax: calcMax !== null ? calcMax : h.usosMax,
        temUsos: calcMax !== null || Boolean(h.usosMax),
        desbloqueado: true,
      };
    });
  }, [fichaCompleta]);

  // 3. Coluna 1 — Traços Raciais
  const habilidadesRaciais = useMemo(() => {
    return todasHabilidadesAuto.filter(
      (h) => h.categoria === "raca" || h.categoria === "subraca" || h.origem === "raca"
    );
  }, [todasHabilidadesAuto]);

  // 4. Coluna 2 — Recursos de Classe & Talentos / Habilidades Livres
  const habilidadesClasseELivres = useMemo(() => {
    const deClasse = todasHabilidadesAuto.filter(
      (h) => h.categoria === "classe" || h.categoria === "subclasse" || h.origem === "classe"
    );
    const livres = (fichaCompleta.habilidadesLivres || []).map((h) => {
      const calcMax = calcularUsosMaximos(h, fichaCompleta);
      return {
        ...h,
        categoria: "livre",
        origem: "livre",
        subOrigem: h.subOrigem || h.vinculo || "Talento / Livre",
        nivel: Number(h.nivel || h.level || 1),
        usosMax: calcMax !== null ? calcMax : h.usosMax || null,
        temUsos: calcMax !== null || Boolean(h.usosMax),
        desbloqueado: true,
      };
    });
    return [...deClasse, ...livres];
  }, [todasHabilidadesAuto, fichaCompleta]);

  // 5. Lista unificada completa para o Compêndio
  const allFeaturesForCompendium = useMemo(() => {
    const list = getCompendioCompleto(fichaCompleta);
    return list.map((h) => {
      const calcMax = calcularUsosMaximos(h, fichaCompleta);
      const isUnlocked =
        h.categoria === "raca" ||
        h.categoria === "subraca" ||
        h.categoria === "livre" ||
        Number(h.nivel || 1) <= fichaCompleta.nivel;
      return {
        ...h,
        usosMax: calcMax !== null ? calcMax : h.usosMax,
        temUsos: calcMax !== null || Boolean(h.usosMax),
        desbloqueado: isUnlocked,
      };
    });
  }, [fichaCompleta]);

  // Manipulação de Usos de Habilidades
  const handleDeltaUses = (featureId, nextSpent) => {
    const nextUsos = {
      ...(usosHabilidades || {}),
      [featureId]: nextSpent,
    };
    onChangeUsosHabilidades?.(nextUsos);
  };

  // Abrir Compêndio com foco em uma habilidade específica
  const handleOpenFeatureInCompendium = (feature) => {
    setCompendiumFocusId(feature?.id || null);
    setCompendiumOpen(true);
  };

  // Salvar Habilidade Livre (Nova ou Edição)
  const handleSaveCustomFeature = (savedFeature) => {
    const currentList = fichaCompleta.habilidadesLivres || [];
    const isEditing = currentList.some((f) => f.id === savedFeature.id);
    let nextList;
    if (isEditing) {
      nextList = currentList.map((f) => (f.id === savedFeature.id ? savedFeature : f));
    } else {
      nextList = [...currentList, savedFeature];
    }
    onChangeCustomClassFeatures?.(nextList);
    setEditingCustomFeature(null);
  };

  // Remover Habilidade Livre
  const handleDeleteCustomFeature = (featureId) => {
    const currentList = fichaCompleta.habilidadesLivres || [];
    const nextList = currentList.filter((f) => f.id !== featureId);
    onChangeCustomClassFeatures?.(nextList);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 3,
        border: `1px solid ${strokeColor}`,
        bgcolor: cardBg,
        backdropFilter: "blur(8px)",
        boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.4)" : "0 8px 24px rgba(0,0,0,0.06)",
        mb: 3,
      }}
    >
      {/* Topo do Painel de Habilidades */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={1.5}
        sx={{ mb: 2.5 }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AutoAwesomeIcon sx={{ color: accentColor, fontSize: 24 }} />
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Cinzel",
              fontWeight: 900,
              color: isDark ? "#fff" : "#2c1a10",
              lineHeight: 1.1,
            }}
          >
            Habilidades & Características
          </Typography>
        </Box>

        {/* Botões de Ação Superior */}
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Button
            type="button"
            size="small"
            variant="contained"
            startIcon={<MenuBookIcon />}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCompendiumFocusId(null);
              setCompendiumOpen(true);
            }}
            sx={{
              fontFamily: "Cinzel",
              fontWeight: 800,
              fontSize: "0.78rem",
              bgcolor: accentColor,
              color: "#000",
              "&:hover": { filter: "brightness(0.95)", bgcolor: accentColor },
            }}
          >
            Compêndio / Ver Todas
          </Button>

          <Button
            type="button"
            size="small"
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setEditingCustomFeature(null);
              setAddModalOpen(true);
            }}
            sx={{
              fontFamily: "Cinzel",
              fontWeight: 800,
              fontSize: "0.78rem",
              borderColor: strokeColor,
              color: accentColor,
              "&:hover": { borderColor: accentColor, bgcolor: alpha(accentColor, 0.1) },
            }}
          >
            Habilidade Livre
          </Button>
        </Stack>
      </Stack>

      {/* Grid Principal de 2 Colunas */}
      <Grid container spacing={2.5}>
        {/* COLUNA 1: TRAÇOS RACIAIS */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <PsychologyIcon sx={{ fontSize: 18, color: isDark ? "#ffd700" : "#833c0b" }} />
              <Typography
                variant="caption"
                sx={{
                  fontFamily: "Cinzel",
                  fontWeight: 900,
                  fontSize: "0.85rem",
                  color: isDark ? "#ffd700" : "#833c0b",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Traços Raciais ({fichaCompleta.raca})
              </Typography>
            </Box>
            <Chip
              label={`${habilidadesRaciais.length} ${habilidadesRaciais.length === 1 ? "traço" : "traços"}`}
              size="small"
              sx={{
                height: 19,
                fontSize: "0.68rem",
                fontWeight: 800,
                border: `1px solid ${strokeColor}`,
              }}
            />
          </Box>

          {habilidadesRaciais.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: 2,
                border: `1px dashed ${strokeColor}`,
                bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
              }}
            >
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Nenhum traço racial registrado para {fichaCompleta.raca}.
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={1.25}>
              {habilidadesRaciais.map((trait) => (
                <FeatureCardItem
                  key={trait.id}
                  feature={trait}
                  currentUses={usosHabilidades?.[trait.id] || 0}
                  onDeltaUses={handleDeltaUses}
                  onOpenDetails={handleOpenFeatureInCompendium}
                />
              ))}
            </Stack>
          )}
        </Grid>

        {/* COLUNA 2: RECURSOS DE CLASSE & TALENTOS */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <SecurityIcon sx={{ fontSize: 18, color: isDark ? "#ff9800" : "#d84315" }} />
              <Typography
                variant="caption"
                sx={{
                  fontFamily: "Cinzel",
                  fontWeight: 900,
                  fontSize: "0.85rem",
                  color: isDark ? "#ff9800" : "#d84315",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Recursos de Classe & Talentos ({fichaCompleta.classe} - Nível {fichaCompleta.nivel})
              </Typography>
            </Box>
            <Chip
              label={`${habilidadesClasseELivres.length} ${habilidadesClasseELivres.length === 1 ? "recurso" : "recursos"}`}
              size="small"
              sx={{
                height: 19,
                fontSize: "0.68rem",
                fontWeight: 800,
                border: `1px solid ${strokeColor}`,
              }}
            />
          </Box>

          {habilidadesClasseELivres.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: 2,
                border: `1px dashed ${strokeColor}`,
                bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
              }}
            >
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Nenhum recurso de classe disponível para o nível {fichaCompleta.nivel}.
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={1.25}>
              {habilidadesClasseELivres.map((feat) => (
                <FeatureCardItem
                  key={feat.id}
                  feature={feat}
                  currentUses={usosHabilidades?.[feat.id] || 0}
                  onDeltaUses={handleDeltaUses}
                  onOpenDetails={handleOpenFeatureInCompendium}
                  onEdit={
                    feat.categoria === "livre"
                      ? (f) => {
                          setEditingCustomFeature(f);
                          setAddModalOpen(true);
                        }
                      : undefined
                  }
                  onDelete={feat.categoria === "livre" ? handleDeleteCustomFeature : undefined}
                  isCustom={feat.categoria === "livre"}
                />
              ))}
            </Stack>
          )}
        </Grid>
      </Grid>

      {/* Modal de Compêndio de Habilidades */}
      <FeaturesCompendiumModal
        open={compendiumOpen}
        onClose={() => setCompendiumOpen(false)}
        features={allFeaturesForCompendium}
        initialSelectedId={compendiumFocusId}
        racaNome={fichaCompleta.raca}
        classeNome={fichaCompleta.classe}
        level={fichaCompleta.nivel}
        usosHabilidades={usosHabilidades}
        onDeltaUses={handleDeltaUses}
      />

      {/* Modal de Cadastro / Edição de Habilidade Livre */}
      <AddFeatureModal
        open={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setEditingCustomFeature(null);
        }}
        onSave={handleSaveCustomFeature}
        editingFeature={editingCustomFeature}
      />
    </Paper>
  );
}
