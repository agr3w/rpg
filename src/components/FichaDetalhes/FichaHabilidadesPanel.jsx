import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Stack,
  Button,
  Chip,
  Divider,
  alpha,
  useTheme,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PsychologyIcon from "@mui/icons-material/Psychology";
import SecurityIcon from "@mui/icons-material/Security";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

import FeatureCardItem from "./FeatureCardItem";
import FeaturesCompendiumModal from "./FeaturesCompendiumModal";
import AddFeatureModal from "./AddFeatureModal";
import {
  getRacialTraitsForRace,
  getClassFeaturesForClass,
} from "../../data/dnd5eFeatures";

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

  // 1. Obtenção estruturada dos Traços Raciais
  const racialTraits = useMemo(() => {
    return getRacialTraitsForRace(
      racaNome || ficha?.raca || "Raça",
      subRacaNome || ficha?.DetalhesDaRaça?.SubRaca || "",
      habilidadesRaca
    );
  }, [racaNome, subRacaNome, ficha, habilidadesRaca]);

  // 2. Obtenção estruturada dos Recursos de Classe (desbloqueados no nível atual)
  const classFeatures = useMemo(() => {
    return getClassFeaturesForClass(
      classeNome || ficha?.classe || "Classe",
      levelAtual || ficha?.level || 1,
      classFeaturesProgression,
      abilityMods
    );
  }, [classeNome, levelAtual, ficha, classFeaturesProgression, abilityMods]);

  // Filtra apenas os desbloqueados para o painel principal
  const unlockedClassFeatures = useMemo(() => {
    return classFeatures.filter((f) => f.desbloqueado);
  }, [classFeatures]);

  // 3. Obtenção estruturada das Habilidades Livres / Talentos
  const formattedCustomFeatures = useMemo(() => {
    return (customClassFeatures || []).map((f) => ({
      id: f.id || `custom_${f.name}`,
      nome: f.nome || f.name || "Habilidade Livre",
      origem: f.origem || "livre",
      subOrigem: f.subOrigem || "Talento / Livre",
      nivel: Number(f.nivel || f.level || 1),
      tipoAcao: f.tipoAcao || "Passiva",
      recarga: f.recarga || "Ilimitado",
      temUsos: Boolean(f.temUsos || Number(f.usosMax || 0) > 0),
      usosMax: Number(f.usosMax || 0),
      descricao: f.descricao || f.description || "",
    }));
  }, [customClassFeatures]);

  // Lista unificada para o Compêndio
  const allFeaturesForCompendium = useMemo(() => {
    return [...racialTraits, ...classFeatures, ...formattedCustomFeatures];
  }, [racialTraits, classFeatures, formattedCustomFeatures]);

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
    const isEditing = (customClassFeatures || []).some((f) => f.id === savedFeature.id);
    let nextList;
    if (isEditing) {
      nextList = (customClassFeatures || []).map((f) =>
        f.id === savedFeature.id ? savedFeature : f
      );
    } else {
      nextList = [...(customClassFeatures || []), savedFeature];
    }
    onChangeCustomClassFeatures?.(nextList);
    setEditingCustomFeature(null);
  };

  // Remover Habilidade Livre
  const handleDeleteCustomFeature = (featureId) => {
    const nextList = (customClassFeatures || []).filter((f) => f.id !== featureId);
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
                Traços Raciais ({racaNome || ficha?.raca || "Raça"})
              </Typography>
            </Box>
            <Chip
              label={`${racialTraits.length} ${racialTraits.length === 1 ? "traço" : "traços"}`}
              size="small"
              sx={{
                height: 19,
                fontSize: "0.68rem",
                fontWeight: 800,
                border: `1px solid ${strokeColor}`,
              }}
            />
          </Box>

          {racialTraits.length === 0 ? (
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
                Nenhum traço racial registrado.
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={1.25}>
              {racialTraits.map((trait) => (
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

        {/* COLUNA 2: RECURSOS DE CLASSE */}
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
                Recursos de Classe ({classeNome || ficha?.classe || "Classe"} - Nível {levelAtual})
              </Typography>
            </Box>
            <Chip
              label={`${unlockedClassFeatures.length} ${unlockedClassFeatures.length === 1 ? "recurso" : "recursos"}`}
              size="small"
              sx={{
                height: 19,
                fontSize: "0.68rem",
                fontWeight: 800,
                border: `1px solid ${strokeColor}`,
              }}
            />
          </Box>

          {unlockedClassFeatures.length === 0 ? (
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
                Nenhum recurso de classe disponível para o nível {levelAtual}.
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={1.25}>
              {unlockedClassFeatures.map((feat) => (
                <FeatureCardItem
                  key={feat.id}
                  feature={feat}
                  currentUses={usosHabilidades?.[feat.id] || 0}
                  onDeltaUses={handleDeltaUses}
                  onOpenDetails={handleOpenFeatureInCompendium}
                />
              ))}
            </Stack>
          )}
        </Grid>
      </Grid>

      {/* SEÇÃO 3: TALENTOS E HABILIDADES LIVRES (Se houver) */}
      {formattedCustomFeatures.length > 0 && (
        <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${strokeColor}` }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <AutoAwesomeIcon sx={{ fontSize: 18, color: isDark ? "#ba68c8" : "#8e24aa" }} />
              <Typography
                variant="caption"
                sx={{
                  fontFamily: "Cinzel",
                  fontWeight: 900,
                  fontSize: "0.85rem",
                  color: isDark ? "#ba68c8" : "#8e24aa",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Talentos & Habilidades Livres Criadas pelo Jogador
              </Typography>
            </Box>
            <Chip
              label={`${formattedCustomFeatures.length} ${formattedCustomFeatures.length === 1 ? "habilidade" : "habilidades"}`}
              size="small"
              sx={{
                height: 19,
                fontSize: "0.68rem",
                fontWeight: 800,
                border: `1px solid ${strokeColor}`,
              }}
            />
          </Box>

          <Grid container spacing={1.5}>
            {formattedCustomFeatures.map((feat) => (
              <Grid item xs={12} md={6} key={feat.id}>
                <FeatureCardItem
                  feature={feat}
                  currentUses={usosHabilidades?.[feat.id] || 0}
                  onDeltaUses={handleDeltaUses}
                  onOpenDetails={handleOpenFeatureInCompendium}
                  onEdit={(f) => {
                    setEditingCustomFeature(f);
                    setAddModalOpen(true);
                  }}
                  onDelete={handleDeleteCustomFeature}
                  isCustom={true}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Modal de Compêndio de Habilidades */}
      <FeaturesCompendiumModal
        open={compendiumOpen}
        onClose={() => setCompendiumOpen(false)}
        features={allFeaturesForCompendium}
        initialSelectedId={compendiumFocusId}
        racaNome={racaNome || ficha?.raca || "Raça"}
        classeNome={classeNome || ficha?.classe || "Classe"}
        level={levelAtual}
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
