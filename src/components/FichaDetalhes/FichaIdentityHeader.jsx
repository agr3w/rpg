import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  Stack,
  IconButton,
  TextField,
  Button,
  LinearProgress,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  alpha,
  useTheme,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import InfoIcon from "@mui/icons-material/Info";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BoltIcon from "@mui/icons-material/Bolt";
import PsychologyIcon from "@mui/icons-material/Psychology";

import { XP_TABLE, computeLevelFromXp, nextLevelXp } from "Utils/xpTable";
import { checarPendenciasSubclasse, checarPendenciasSubraca } from "../../Array/RegrasSubclasses";
import SelectSubclasseModal from "./SelectSubclasseModal";
import SelectSubracaModal from "./SelectSubracaModal";

export default function FichaIdentityHeader({
  ficha,
  fichaBase = {},
  subClasse = null,
  subRaca = null,
  antecedente = null,
  level = 1,
  xp = 0,
  portraitUrl = "",
  uploadingPortrait = false,
  onPortraitUpload,
  onNameSave,
  onXpSave,
  onSubclasseSave,
  onSubracaSave,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Estado de edição de nome inline
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(fichaBase.nome || "");
  const [savingName, setSavingName] = useState(false);

  // Estado dos modais de Subclasse e Sub-raça
  const [subclasseModalOpen, setSubclasseModalOpen] = useState(false);
  const [subracaModalOpen, setSubracaModalOpen] = useState(false);

  // Estado do diálogo de XP
  const [xpDialogOpen, setXpDialogOpen] = useState(false);
  const [xpInput, setXpInput] = useState(String(xp || 0));
  const [savingXp, setSavingXp] = useState(false);

  // Validação de pendências de Subclasse e Sub-raça
  const fichaStatus = useMemo(() => {
    return {
      classe: fichaBase.classe || ficha?.classe || "",
      subclasse: subClasse || fichaBase.subclasse || ficha?.subclasse || "",
      raca: fichaBase.raca || ficha?.raca || "",
      subraca: subRaca || fichaBase.subraca || ficha?.subraca || "",
      nivel: Number(level || ficha?.level || 1),
    };
  }, [fichaBase, ficha, subClasse, subRaca, level]);

  const subclasseInfo = useMemo(() => checarPendenciasSubclasse(fichaStatus), [fichaStatus]);
  const subracaInfo = useMemo(() => checarPendenciasSubraca(fichaStatus), [fichaStatus]);

  const antecedenteNome =
    typeof antecedente === "string"
      ? antecedente
      : antecedente?.nome || antecedente?.antecedenteNome || "Viajante";

  // Cálculos de XP e nível
  const currentXp = Number(xp || 0);
  const currentLvl = Number(level || computeLevelFromXp(currentXp) || 1);
  const baseLvlXp = XP_TABLE[currentLvl] ?? 0;
  const nextLvlXp = nextLevelXp(currentLvl);
  const xpNeededForNext = Math.max(0, nextLvlXp - currentXp);

  const xpProgress = useMemo(() => {
    if (currentLvl >= 20) return 100;
    const denom = nextLvlXp - baseLvlXp || 1;
    const val = ((currentXp - baseLvlXp) / denom) * 100;
    return Math.max(0, Math.min(100, val));
  }, [currentLvl, currentXp, baseLvlXp, nextLvlXp]);

  const handleStartEditName = () => {
    setNameValue(fichaBase.nome || "");
    setIsEditingName(true);
  };

  const handleCancelEditName = () => {
    setNameValue(fichaBase.nome || "");
    setIsEditingName(false);
  };

  const handleConfirmSaveName = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const trimmed = nameValue.trim();
    if (!trimmed || trimmed === fichaBase.nome) {
      setIsEditingName(false);
      return;
    }
    setSavingName(true);
    try {
      if (onNameSave) {
        await onNameSave(trimmed);
      }
      setIsEditingName(false);
    } catch (err) {
      console.error("Erro ao salvar nome:", err);
    } finally {
      setSavingName(false);
    }
  };

  const handleOpenXpDialog = () => {
    setXpInput(String(currentXp));
    setXpDialogOpen(true);
  };

  const handleQuickAddXp = (amount) => {
    const next = Math.max(0, Number(xpInput || 0) + amount);
    setXpInput(String(next));
  };

  const handleConfirmSaveXp = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const parsed = parseInt(xpInput || "0", 10);
    if (Number.isNaN(parsed) || parsed < 0) return;
    setSavingXp(true);
    try {
      if (onXpSave) {
        await onXpSave(parsed);
      }
      setXpDialogOpen(false);
    } catch (err) {
      console.error("Erro ao salvar XP:", err);
    } finally {
      setSavingXp(false);
    }
  };

  const strokeColor = isDark ? "rgba(229,179,36,0.25)" : "rgba(131,60,11,0.25)";
  const accentColor = theme.palette.secondary.main;

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 2.5 },
        borderRadius: 3,
        border: `1px solid ${strokeColor}`,
        bgcolor: isDark ? "rgba(28, 20, 16, 0.85)" : "rgba(255, 252, 246, 0.92)",
        backdropFilter: "blur(8px)",
        boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.4)" : "0 8px 24px rgba(0,0,0,0.08)",
        mb: 2.5,
        position: "relative",
      }}
    >
      {/* Linha Superior: Retrato + Informações de Identidade */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "center", sm: "flex-start" },
          gap: 2.5,
        }}
      >
        {/* Retrato (96x96) */}
        <Box sx={{ position: "relative", flexShrink: 0 }}>
          <input
            id="identity-portrait-input"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={onPortraitUpload}
          />
          <Tooltip title="Clique para alterar o retrato">
            <label htmlFor="identity-portrait-input" style={{ cursor: "pointer" }}>
              <Box
                sx={{
                  position: "relative",
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  border: `3px solid ${accentColor}`,
                  boxShadow: `0 0 16px ${alpha(accentColor, 0.35)}`,
                  overflow: "hidden",
                  transition: "all 0.2s ease",
                  "&:hover .portrait-overlay": {
                    opacity: 1,
                  },
                }}
              >
                <Avatar
                  src={portraitUrl || ""}
                  alt={fichaBase.nome || "Personagem"}
                  sx={{
                    width: "100%",
                    height: "100%",
                    bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                    color: accentColor,
                    fontSize: "2.2rem",
                    fontFamily: "Cinzel",
                    fontWeight: 800,
                  }}
                >
                  {!portraitUrl && (fichaBase.nome?.charAt(0)?.toUpperCase() || "?")}
                </Avatar>

                {/* Overlay de Hover com Câmera */}
                <Box
                  className="portrait-overlay"
                  sx={{
                    position: "absolute",
                    inset: 0,
                    bgcolor: "rgba(0,0,0,0.6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: uploadingPortrait ? 1 : 0,
                    transition: "opacity 0.2s ease",
                  }}
                >
                  {uploadingPortrait ? (
                    <CircularProgress size={28} sx={{ color: accentColor }} />
                  ) : (
                    <PhotoCameraIcon sx={{ color: "#fff", fontSize: 28 }} />
                  )}
                </Box>
              </Box>
            </label>
          </Tooltip>
        </Box>

        {/* Informações de Identidade (Direita) */}
        <Box sx={{ flex: 1, width: "100%", textAlign: { xs: "center", sm: "left" } }}>
          {/* Nome com Edição Inline */}
          {isEditingName ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, maxWidth: 460, mx: { xs: "auto", sm: 0 } }}>
              <TextField
                size="small"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                autoFocus
                fullWidth
                variant="outlined"
                placeholder="Nome do personagem"
                sx={{
                  "& .MuiInputBase-input": {
                    fontFamily: "Cinzel",
                    fontWeight: 800,
                    fontSize: "1.2rem",
                  },
                }}
              />
              <IconButton
                type="button"
                size="small"
                color="primary"
                onClick={handleConfirmSaveName}
                disabled={savingName || !nameValue.trim()}
                sx={{ bgcolor: alpha(accentColor, 0.15) }}
              >
                <CheckIcon fontSize="small" />
              </IconButton>
              <IconButton
                type="button"
                size="small"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCancelEditName();
                }}
                sx={{ bgcolor: "action.hover" }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "center", sm: "flex-start" },
                gap: 1,
                mb: 0.75,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontFamily: "Cinzel",
                  fontWeight: 900,
                  color: isDark ? "#fff" : "#2c1a10",
                  textShadow: isDark ? "0 2px 8px rgba(0,0,0,0.5)" : "none",
                  lineHeight: 1.15,
                }}
              >
                {fichaBase.nome || "Herói Sem Nome"}
              </Typography>
              <Tooltip title="Editar nome">
                <IconButton
                  type="button"
                  size="small"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleStartEditName();
                  }}
                  sx={{
                    opacity: 0.65,
                    "&:hover": { opacity: 1, color: accentColor },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )}

          {/* Chips de Classe, Raça, Antecedente e Nível */}
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            alignItems="center"
            sx={{
              flexWrap: "wrap",
              justifyContent: { xs: "center", sm: "flex-start" },
              mb: 1.5,
            }}
          >
            {/* Classe & Subclasse */}
            <Tooltip title={subclasseInfo.opcoesDisponiveis.length > 0 ? "Clique para gerenciar Subclasse" : ""}>
              <Chip
                icon={<AccountTreeIcon sx={{ color: `${accentColor} !important` }} />}
                label={
                  subClasse
                    ? `${fichaBase.classe || "Aventureiro"} (${subClasse})`
                    : fichaBase.classe || "Aventureiro"
                }
                size="small"
                onClick={subclasseInfo.opcoesDisponiveis.length > 0 ? () => setSubclasseModalOpen(true) : undefined}
                clickable={subclasseInfo.opcoesDisponiveis.length > 0}
                sx={{
                  fontWeight: 700,
                  border: `1px solid ${strokeColor}`,
                  bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                  cursor: subclasseInfo.opcoesDisponiveis.length > 0 ? "pointer" : "default",
                  "&:hover": subclasseInfo.opcoesDisponiveis.length > 0 ? { borderColor: accentColor } : {},
                }}
              />
            </Tooltip>

            {/* Badge Pulsante de Subclasse Pendente */}
            {subclasseInfo.pendente && (
              <Tooltip title={`Sua classe desbloqueia subclasse no nível ${subclasseInfo.nivelRequerido}. Clique para escolher!`}>
                <Chip
                  icon={<BoltIcon sx={{ color: "#000 !important" }} />}
                  label="Escolha sua Subclasse!"
                  onClick={() => setSubclasseModalOpen(true)}
                  size="small"
                  clickable
                  sx={{
                    fontWeight: 900,
                    fontFamily: "Cinzel",
                    bgcolor: "#ffd700",
                    color: "#000",
                    border: "1.5px solid #ffb300",
                    boxShadow: "0 0 10px rgba(255, 215, 0, 0.6)",
                    cursor: "pointer",
                    animation: "pulse 2s infinite ease-in-out",
                    "@keyframes pulse": {
                      "0%": { transform: "scale(1)", boxShadow: "0 0 4px rgba(255, 215, 0, 0.4)" },
                      "50%": { transform: "scale(1.04)", boxShadow: "0 0 14px rgba(255, 215, 0, 0.8)" },
                      "100%": { transform: "scale(1)", boxShadow: "0 0 4px rgba(255, 215, 0, 0.4)" },
                    },
                    "&:hover": { bgcolor: "#ffca28" },
                  }}
                />
              </Tooltip>
            )}

            {/* Raça & Sub-raça */}
            <Tooltip title={subracaInfo.opcoesDisponiveis.length > 0 ? "Clique para gerenciar Sub-raça" : ""}>
              <Chip
                icon={<InfoIcon sx={{ color: `${accentColor} !important` }} />}
                label={
                  subRaca
                    ? `${fichaBase.raca || "Humano"} (${subRaca})`
                    : fichaBase.raca || "Humano"
                }
                size="small"
                onClick={subracaInfo.opcoesDisponiveis.length > 0 ? () => setSubracaModalOpen(true) : undefined}
                clickable={subracaInfo.opcoesDisponiveis.length > 0}
                sx={{
                  fontWeight: 700,
                  border: `1px solid ${strokeColor}`,
                  bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                  cursor: subracaInfo.opcoesDisponiveis.length > 0 ? "pointer" : "default",
                  "&:hover": subracaInfo.opcoesDisponiveis.length > 0 ? { borderColor: accentColor } : {},
                }}
              />
            </Tooltip>

            {/* Badge de Sub-raça Pendente */}
            {subracaInfo.pendente && (
              <Tooltip title="Esta raça possui sub-raças disponíveis. Clique para selecionar!">
                <Chip
                  icon={<PsychologyIcon sx={{ color: "#fff !important", fontSize: "14px !important" }} />}
                  label="Escolher Sub-raça"
                  onClick={() => setSubracaModalOpen(true)}
                  size="small"
                  clickable
                  sx={{
                    fontWeight: 800,
                    fontFamily: "Cinzel",
                    bgcolor: isDark ? "rgba(186, 104, 200, 0.3)" : "rgba(142, 36, 170, 0.2)",
                    color: isDark ? "#ce93d8" : "#6a1b9a",
                    border: `1px solid ${isDark ? "#ba68c8" : "#8e24aa"}`,
                    cursor: "pointer",
                  }}
                />
              </Tooltip>
            )}

            {/* Antecedente */}
            <Chip
              icon={<AutoStoriesIcon sx={{ color: `${accentColor} !important` }} />}
              label={`Antecedente: ${antecedenteNome}`}
              size="small"
              sx={{
                fontWeight: 600,
                border: `1px solid ${strokeColor}`,
                bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
              }}
            />

            {/* Nível Badge */}
            <Chip
              label={`Nível ${currentLvl}`}
              size="small"
              sx={{
                fontWeight: 900,
                fontFamily: "Cinzel",
                color: "#000",
                bgcolor: accentColor,
                boxShadow: `0 2px 8px ${alpha(accentColor, 0.4)}`,
              }}
            />
          </Stack>
        </Box>
      </Box>

      {/* Barra de Progresso de XP Integrada no Rodapé */}
      <Box
        sx={{
          mt: 2,
          pt: 1.5,
          borderTop: `1px solid ${strokeColor}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
            mb: 0.75,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: "text.secondary" }}>
              EXPERIÊNCIA (XP):
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 900, fontFamily: "Cinzel", color: accentColor }}>
              {currentXp.toLocaleString()} XP
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              / {nextLvlXp.toLocaleString()} XP
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
              {currentLvl >= 20 ? "Nível Máximo Alcançado" : `${xpNeededForNext.toLocaleString()} XP para Nível ${currentLvl + 1}`}
            </Typography>
            <Tooltip title="Gerenciar XP">
              <Button
                type="button"
                size="small"
                variant="outlined"
                startIcon={<AddCircleOutlineIcon />}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleOpenXpDialog();
                }}
                sx={{
                  py: 0.2,
                  px: 1,
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  borderColor: strokeColor,
                  color: accentColor,
                  "&:hover": {
                    borderColor: accentColor,
                    bgcolor: alpha(accentColor, 0.1),
                  },
                }}
              >
                Ajustar XP
              </Button>
            </Tooltip>
          </Box>
        </Box>

        <LinearProgress
          variant="determinate"
          value={xpProgress}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
            "& .MuiLinearProgress-bar": {
              borderRadius: 4,
              backgroundImage: `linear-gradient(90deg, ${alpha(accentColor, 0.7)}, ${accentColor})`,
              boxShadow: `0 0 10px ${alpha(accentColor, 0.5)}`,
            },
          }}
        />
      </Box>

      {/* Modal / Diálogo de Ajuste de XP */}
      <Dialog
        open={xpDialogOpen}
        onClose={() => setXpDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: `1px solid ${strokeColor}`,
            bgcolor: isDark ? "#1c1410" : "#fffcf6",
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: "Cinzel", fontWeight: 900 }}>
          Gerenciar Experiência (XP)
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="XP Total Atual"
              type="number"
              value={xpInput}
              onChange={(e) => setXpInput(e.target.value.replace(/[^\d]/g, ""))}
              fullWidth
              size="small"
            />

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", display: "block", mb: 1 }}>
                Adicionar XP Rápido:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {[50, 100, 250, 500, 1000].map((amt) => (
                  <Button
                    type="button"
                    key={amt}
                    size="small"
                    variant="outlined"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleQuickAddXp(amt);
                    }}
                    sx={{ borderColor: strokeColor, fontWeight: 800 }}
                  >
                    +{amt}
                  </Button>
                ))}
              </Stack>
            </Box>

            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                border: `1px solid ${strokeColor}`,
              }}
            >
              <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                Nível Resultante:{" "}
                <strong style={{ color: accentColor }}>
                  Nível {computeLevelFromXp(Number(xpInput || 0))}
                </strong>
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button type="button" onClick={() => setXpDialogOpen(false)} sx={{ color: "text.secondary" }}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="contained"
            onClick={handleConfirmSaveXp}
            disabled={savingXp}
            sx={{ bgcolor: accentColor, color: "#000", fontWeight: 800, "&:hover": { filter: "brightness(0.95)" } }}
          >
            {savingXp ? "Salvando..." : "Salvar XP"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Seleção de Subclasse */}
      <SelectSubclasseModal
        open={subclasseModalOpen}
        onClose={() => setSubclasseModalOpen(false)}
        classeNome={fichaBase.classe || ficha?.classe || ""}
        currentSubclasse={subClasse || fichaBase.subclasse || ficha?.subclasse || ""}
        onSelectSubclasse={(newSub) => onSubclasseSave?.(newSub)}
        level={currentLvl}
      />

      {/* Modal de Seleção de Sub-raça */}
      <SelectSubracaModal
        open={subracaModalOpen}
        onClose={() => setSubracaModalOpen(false)}
        racaNome={fichaBase.raca || ficha?.raca || ""}
        currentSubraca={subRaca || fichaBase.subraca || ficha?.subraca || ""}
        onSelectSubraca={(newSubRaca) => onSubracaSave?.(newSubRaca)}
      />
    </Paper>
  );
}
