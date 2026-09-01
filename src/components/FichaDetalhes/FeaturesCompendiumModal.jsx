import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Stack,
  Chip,
  Paper,
  Divider,
  alpha,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import BoltIcon from "@mui/icons-material/Bolt";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LockIcon from "@mui/icons-material/Lock";

import { getActionTypeStyle } from "../../data/dnd5eFeatures";

export default function FeaturesCompendiumModal({
  open,
  onClose,
  features = [],
  initialSelectedId = null,
  racaNome = "",
  classeNome = "",
  level = 1,
  usosHabilidades = {},
  onDeltaUses,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const strokeColor = isDark ? "rgba(229,179,36,0.22)" : "rgba(131,60,11,0.22)";
  const accentColor = theme.palette.secondary.main || "#bf8f00";

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryTab, setCategoryTab] = useState("todas");
  const [selectedId, setSelectedId] = useState(null);
  const prevOpenRef = useRef(false);

  // Helper para verificar se o personagem possui / desbloqueou a habilidade
  const isFeatureUnlocked = (feat) => {
    if (!feat) return false;
    if (feat.origem === "raca" || feat.origem === "talento" || feat.origem === "livre") return true;
    if (feat.desbloqueado !== undefined) return Boolean(feat.desbloqueado);
    const featLvl = Number(feat.nivel || 1);
    return featLvl <= Number(level || 1);
  };

  // Inicializa o item selecionado APENAS ao abrir o modal
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      if (initialSelectedId) {
        setSelectedId(initialSelectedId);
      } else if (features.length > 0) {
        setSelectedId(features[0]?.id || null);
      }
      setSearchTerm("");
    } else if (open && initialSelectedId && initialSelectedId !== selectedId) {
      setSelectedId(initialSelectedId);
    }
    prevOpenRef.current = open;
  }, [open, initialSelectedId]);

  // Filtra as habilidades por categoria e texto
  const filteredFeatures = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return features.filter((feat) => {
      // Filtro de Categoria
      if (categoryTab === "raca" && feat.origem !== "raca") return false;
      if (categoryTab === "classe" && feat.origem !== "classe") return false;
      if (categoryTab === "livres" && feat.origem !== "talento" && feat.origem !== "livre") return false;

      // Filtro de Busca
      if (term) {
        const matchName = String(feat.nome || feat.name || "").toLowerCase().includes(term);
        const matchDesc = String(feat.descricao || feat.description || "").toLowerCase().includes(term);
        const matchSub = String(feat.subOrigem || "").toLowerCase().includes(term);
        return matchName || matchDesc || matchSub;
      }
      return true;
    });
  }, [features, categoryTab, searchTerm]);

  // Se o item selecionado não estiver na lista filtrada, apenas ajusta se ele deixou de existir
  useEffect(() => {
    if (filteredFeatures.length > 0) {
      const exists = filteredFeatures.some((f) => f.id === selectedId);
      if (!exists && selectedId !== null) {
        setSelectedId(filteredFeatures[0]?.id || null);
      }
    }
  }, [filteredFeatures, selectedId]);

  const selectedFeature = useMemo(() => {
    return features.find((f) => f.id === selectedId) || filteredFeatures[0] || null;
  }, [features, filteredFeatures, selectedId]);

  // Navegação anterior / próximo
  const currentIndex = filteredFeatures.findIndex((f) => f.id === selectedId);
  const handlePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentIndex > 0) {
      setSelectedId(filteredFeatures[currentIndex - 1].id);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentIndex < filteredFeatures.length - 1) {
      setSelectedId(filteredFeatures[currentIndex + 1].id);
    }
  };

  const selectedActionStyle = getActionTypeStyle(selectedFeature?.tipoAcao);
  const isSelectedUnlocked = isFeatureUnlocked(selectedFeature);
  const maxUses = Number(selectedFeature?.usosMax || 0);
  const hasUsageTracker = maxUses > 0 || selectedFeature?.temUsos;
  const spentUses = Math.max(0, Math.min(maxUses, Number(usosHabilidades?.[selectedFeature?.id] || 0)));
  const remainingUses = Math.max(0, maxUses - spentUses);

  const handleDelta = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onDeltaUses || !selectedFeature) return;
    const nextSpent = Math.max(0, Math.min(maxUses, spentUses + delta));
    onDeltaUses(selectedFeature.id, nextSpent);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: `1px solid ${strokeColor}`,
          bgcolor: isDark ? "#16100c" : "#fffcf6",
          height: { xs: "90vh", md: "80vh" },
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Topo do Modal */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
          borderBottom: `1px solid ${strokeColor}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <MenuBookIcon sx={{ color: accentColor, fontSize: 26 }} />
          <Box>
            <Typography variant="h6" sx={{ fontFamily: "Cinzel", fontWeight: 900, lineHeight: 1.1 }}>
              Compêndio de Habilidades & Características
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {racaNome} • {classeNome} (Nível {level})
            </Typography>
          </Box>
        </Box>

        <IconButton
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose?.();
          }}
          sx={{ color: "text.secondary" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Conteúdo em Duas Colunas (Sidebar + Reader) */}
      <DialogContent sx={{ p: 0, display: "flex", flex: 1, overflow: "hidden", flexDirection: { xs: "column", md: "row" } }}>
        {/* COLUNA ESQUERDA: LISTA & BUSCA */}
        <Box
          sx={{
            width: { xs: "100%", md: 360 },
            borderRight: { md: `1px solid ${strokeColor}` },
            borderBottom: { xs: `1px solid ${strokeColor}`, md: "none" },
            display: "flex",
            flexDirection: "column",
            bgcolor: isDark ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.02)",
          }}
        >
          {/* Campo de Busca */}
          <Box sx={{ p: 1.5, pb: 1 }}>
            <TextField
              size="small"
              placeholder="Buscar habilidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Abas de Categoria */}
          <Tabs
            value={categoryTab}
            onChange={(_, val) => setCategoryTab(val)}
            variant="fullWidth"
            sx={{
              minHeight: 38,
              borderBottom: `1px solid ${strokeColor}`,
              "& .MuiTab-root": {
                fontFamily: "Cinzel",
                fontWeight: 800,
                fontSize: "0.74rem",
                minHeight: 38,
                py: 0.5,
              },
            }}
          >
            <Tab label="Todas" value="todas" />
            <Tab label="Raça" value="raca" />
            <Tab label="Classe" value="classe" />
            <Tab label="Talentos" value="livres" />
          </Tabs>

          {/* Lista de Itens */}
          <Box sx={{ flex: 1, overflowY: "auto", p: 1.25, display: "flex", flexDirection: "column", gap: 0.75 }}>
            {filteredFeatures.length === 0 ? (
              <Box sx={{ py: 6, textAlign: "center" }}>
                <AutoAwesomeIcon sx={{ fontSize: 36, color: "text.secondary", opacity: 0.4, mb: 1 }} />
                <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 700 }}>
                  Nenhuma habilidade encontrada.
                </Typography>
              </Box>
            ) : (
              filteredFeatures.map((feat) => {
                const isSelected = feat.id === selectedId;
                const actStyle = getActionTypeStyle(feat.tipoAcao);
                const isUnlocked = isFeatureUnlocked(feat);

                return (
                  <Paper
                    key={feat.id}
                    elevation={0}
                    onClick={() => setSelectedId(feat.id)}
                    sx={{
                      p: 1.25,
                      borderRadius: 2,
                      cursor: "pointer",
                      border: `1.5px solid ${isSelected ? accentColor : strokeColor}`,
                      borderLeft: isUnlocked
                        ? `3.5px solid ${isDark ? "#81c784" : "#2e7d32"}`
                        : `3.5px solid ${isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)"}`,
                      opacity: isUnlocked ? 1 : 0.72,
                      bgcolor: isSelected
                        ? alpha(accentColor, isDark ? 0.15 : 0.08)
                        : isDark
                        ? "rgba(255,255,255,0.02)"
                        : "rgba(255,255,255,0.6)",
                      boxShadow: isSelected ? `0 2px 10px ${alpha(accentColor, 0.25)}` : "none",
                      transition: "all 0.15s ease",
                      "&:hover": {
                        borderColor: accentColor,
                        opacity: 1,
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontFamily: "Cinzel",
                          fontWeight: 900,
                          color: isSelected ? accentColor : isDark ? "#fff" : "#2c1a10",
                          lineHeight: 1.2,
                        }}
                      >
                        {feat.nome || feat.name}
                      </Typography>

                      <Chip
                        label={feat.tipoAcao || "Passiva"}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: "0.62rem",
                          fontWeight: 800,
                          bgcolor: actStyle.bg,
                          color: actStyle.color,
                          border: `1px solid ${actStyle.border}`,
                        }}
                      />
                    </Box>

                    <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.6, flexWrap: "wrap", gap: 0.4 }}>
                      {/* Indicativo Sutil de Posse / Desbloqueio */}
                      {isUnlocked ? (
                        <Chip
                          icon={<CheckCircleRoundedIcon sx={{ fontSize: "11px !important", color: (isDark ? "#81c784" : "#2e7d32") + " !important" }} />}
                          label="Possui"
                          size="small"
                          sx={{
                            height: 17,
                            fontSize: "0.6rem",
                            fontWeight: 800,
                            bgcolor: isDark ? "rgba(46, 125, 50, 0.18)" : "rgba(46, 125, 50, 0.12)",
                            color: isDark ? "#81c784" : "#2e7d32",
                            border: "1px solid rgba(46, 125, 50, 0.3)",
                            px: 0.2,
                          }}
                        />
                      ) : (
                        <Chip
                          icon={<LockIcon sx={{ fontSize: "10px !important", color: "text.secondary !important" }} />}
                          label={`Nvl ${feat.nivel}`}
                          size="small"
                          sx={{
                            height: 17,
                            fontSize: "0.6rem",
                            fontWeight: 700,
                            bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                            color: "text.secondary",
                            border: `1px solid ${strokeColor}`,
                            px: 0.2,
                          }}
                        />
                      )}

                      <Typography variant="caption" sx={{ fontSize: "0.68rem", color: "text.secondary" }}>
                        {feat.origem === "raca"
                          ? "Traço Racial"
                          : feat.origem === "classe"
                          ? "Recurso de Classe"
                          : "Talento / Livre"}
                      </Typography>
                    </Stack>
                  </Paper>
                );
              })
            )}
          </Box>
        </Box>

        {/* COLUNA DIREITA: PAINEL DE LEITURA (READER) */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", p: { xs: 2, md: 3.5 } }}>
          {selectedFeature ? (
            <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
              {/* Cabeçalho da Habilidade */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: "Cinzel",
                    fontWeight: 900,
                    color: isDark ? "#fff" : "#2c1a10",
                    mb: 1,
                    lineHeight: 1.15,
                  }}
                >
                  {selectedFeature.nome || selectedFeature.name}
                </Typography>

                {/* Badges Principais com Indicador de Posse */}
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
                  {/* Status de Posse / Desbloqueio */}
                  {isSelectedUnlocked ? (
                    <Chip
                      icon={<CheckCircleRoundedIcon sx={{ fontSize: "14px !important", color: (isDark ? "#81c784" : "#2e7d32") + " !important" }} />}
                      label="Habilidade Adquirida (Ativa)"
                      sx={{
                        fontWeight: 800,
                        fontSize: "0.74rem",
                        bgcolor: isDark ? "rgba(46, 125, 50, 0.18)" : "rgba(46, 125, 50, 0.12)",
                        color: isDark ? "#81c784" : "#2e7d32",
                        border: "1.5px solid rgba(46, 125, 50, 0.4)",
                      }}
                    />
                  ) : (
                    <Chip
                      icon={<LockIcon sx={{ fontSize: "14px !important", color: (isDark ? "#ffd54f" : "#b26a00") + " !important" }} />}
                      label={`Bloqueada (Desbloqueia no Nível ${selectedFeature.nivel})`}
                      sx={{
                        fontWeight: 800,
                        fontSize: "0.74rem",
                        bgcolor: isDark ? "rgba(255, 214, 0, 0.12)" : "rgba(255, 214, 0, 0.15)",
                        color: isDark ? "#ffd54f" : "#b26a00",
                        border: "1.5px solid rgba(255, 214, 0, 0.4)",
                      }}
                    />
                  )}

                  <Chip
                    label={selectedFeature.tipoAcao || "Passiva"}
                    sx={{
                      fontWeight: 800,
                      bgcolor: selectedActionStyle.bg,
                      color: selectedActionStyle.color,
                      border: `1.5px solid ${selectedActionStyle.border}`,
                    }}
                  />

                  {selectedFeature.recarga && selectedFeature.recarga !== "Ilimitado" && (
                    <Chip
                      icon={
                        selectedFeature.recarga.includes("Longo") ? (
                          <BedtimeIcon sx={{ fontSize: "14px !important" }} />
                        ) : (
                          <BoltIcon sx={{ fontSize: "14px !important" }} />
                        )
                      }
                      label={`Recarga: ${selectedFeature.recarga}`}
                      sx={{
                        fontWeight: 800,
                        bgcolor: isDark ? "rgba(255,214,0,0.12)" : "rgba(255,214,0,0.18)",
                        color: isDark ? "#ffd600" : "#b26a00",
                        border: "1px solid rgba(255,214,0,0.35)",
                      }}
                    />
                  )}

                  <Chip
                    label={
                      selectedFeature.subOrigem
                        ? `${selectedFeature.subOrigem}`
                        : selectedFeature.origem === "raca"
                        ? "Traço Racial"
                        : selectedFeature.origem === "classe"
                        ? "Recurso de Classe"
                        : "Talento / Livre"
                    }
                    sx={{
                      fontWeight: 700,
                      color: "text.secondary",
                      border: `1px solid ${strokeColor}`,
                    }}
                  />
                </Stack>

                {/* Banner de Aviso caso a habilidade ainda não tenha sido desbloqueada */}
                {!isSelectedUnlocked && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.25,
                      mb: 2,
                      borderRadius: 2,
                      bgcolor: isDark ? "rgba(255, 214, 0, 0.06)" : "rgba(255, 214, 0, 0.08)",
                      border: "1px dashed rgba(255, 214, 0, 0.35)",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <LockIcon sx={{ fontSize: 18, color: isDark ? "#ffd54f" : "#b26a00" }} />
                    <Typography variant="caption" sx={{ fontWeight: 700, color: isDark ? "#ffe082" : "#8d4f00" }}>
                      Esta característica será adquirida quando o personagem atingir o <strong>Nível {selectedFeature.nivel}</strong> de {classeNome || "Classe"} (Nível atual: {level}).
                    </Typography>
                  </Paper>
                )}
                
                {/* Rastreador de Usos (Se Aplicável) */}
                {hasUsageTracker && maxUses > 0 && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      borderRadius: 2.5,
                      border: `1.5px solid ${selectedActionStyle.border}`,
                      bgcolor: isDark ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.03)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: "text.secondary", display: "block" }}>
                        RASTREADOR DE USOS / CARGAS
                      </Typography>
                      <Typography variant="h6" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: selectedActionStyle.color }}>
                        {remainingUses} de {maxUses} restantes
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Button
                        type="button"
                        size="small"
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={(e) => handleDelta(e, -1)}
                        disabled={spentUses <= 0}
                        sx={{ borderColor: strokeColor, fontWeight: 800 }}
                      >
                        Recuperar
                      </Button>
                      <Button
                        type="button"
                        size="small"
                        variant="contained"
                        startIcon={<RemoveIcon />}
                        onClick={(e) => handleDelta(e, 1)}
                        disabled={remainingUses <= 0}
                        sx={{
                          bgcolor: selectedActionStyle.color,
                          color: "#fff",
                          fontWeight: 800,
                          "&:hover": { bgcolor: selectedActionStyle.color, filter: "brightness(0.9)" },
                        }}
                      >
                        Gastar Uso
                      </Button>
                    </Box>
                  </Paper>
                )}
              </Box>

              <Divider sx={{ mb: 2.5, borderColor: strokeColor }} />

              {/* Texto Completo da Regra */}
              <Box sx={{ flex: 1, pr: 1 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "0.98rem",
                    lineHeight: 1.7,
                    color: isDark ? "#f0e6d6" : "#2f2318",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {selectedFeature.descricao || selectedFeature.description || "Nenhuma descrição fornecida."}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box sx={{ py: 12, textAlign: "center" }}>
              <Typography variant="h6" sx={{ color: "text.secondary", fontFamily: "Cinzel" }}>
                Selecione uma habilidade na lista lateral para ler os detalhes completos.
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      {/* Rodapé com Navegação */}
      <DialogActions sx={{ p: 2, px: 3, justifyContent: "space-between", borderTop: `1px solid ${strokeColor}` }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            type="button"
            size="small"
            onClick={handlePrev}
            disabled={currentIndex <= 0}
            sx={{ border: `1px solid ${strokeColor}` }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <Typography variant="caption" sx={{ fontWeight: 800, color: "text.secondary" }}>
            {currentIndex + 1} de {filteredFeatures.length}
          </Typography>
          <IconButton
            type="button"
            size="small"
            onClick={handleNext}
            disabled={currentIndex >= filteredFeatures.length - 1}
            sx={{ border: `1px solid ${strokeColor}` }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </Box>

        <Button
          type="button"
          variant="contained"
          onClick={onClose}
          sx={{
            bgcolor: accentColor,
            color: "#000",
            fontWeight: 800,
            "&:hover": { filter: "brightness(0.95)" },
          }}
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
