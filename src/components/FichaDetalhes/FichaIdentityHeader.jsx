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

import { XP_TABLE, computeLevelFromXp, nextLevelXp } from "Utils/xpTable";

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
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Estado de edição de nome inline
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(fichaBase.nome || "");
  const [savingName, setSavingName] = useState(false);

  // Estado do diálogo de XP
  const [xpDialogOpen, setXpDialogOpen] = useState(false);
  const [xpInput, setXpInput] = useState(String(xp || 0));
  const [savingXp, setSavingXp] = useState(false);

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

  const handleConfirmSaveName = async () => {
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
    } catch (e) {
      console.error("Erro ao salvar nome:", e);
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

  const handleConfirmSaveXp = async () => {
    const parsed = parseInt(xpInput || "0", 10);
    if (Number.isNaN(parsed) || parsed < 0) return;
    setSavingXp(true);
    try {
      if (onXpSave) {
        await onXpSave(parsed);
      }
      setXpDialogOpen(false);
    } catch (e) {
      console.error("Erro ao salvar XP:", e);
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
                size="small"
                color="primary"
                onClick={handleConfirmSaveName}
                disabled={savingName || !nameValue.trim()}
                sx={{ bgcolor: alpha(accentColor, 0.15) }}
              >
                <CheckIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={handleCancelEditName} sx={{ bgcolor: "action.hover" }}>
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
                  size="small"
                  onClick={handleStartEditName}
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
            sx={{
              flexWrap: "wrap",
              justifyContent: { xs: "center", sm: "flex-start" },
              mb: 1.5,
            }}
          >
            {/* Classe & Subclasse */}
            <Chip
              icon={<AccountTreeIcon sx={{ color: `${accentColor} !important` }} />}
              label={
                subClasse
                  ? `${fichaBase.classe || "Aventureiro"} (${subClasse})`
                  : fichaBase.classe || "Aventureiro"
              }
              size="small"
              sx={{
                fontWeight: 700,
                border: `1px solid ${strokeColor}`,
                bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
              }}
            />

            {/* Raça & Sub-raça */}
            <Chip
              icon={<InfoIcon sx={{ color: `${accentColor} !important` }} />}
              label={
                subRaca
                  ? `${fichaBase.raca || "Humano"} (${subRaca})`
                  : fichaBase.raca || "Humano"
              }
              size="small"
              sx={{
                fontWeight: 700,
                border: `1px solid ${strokeColor}`,
                bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
              }}
            />

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
                size="small"
                variant="outlined"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleOpenXpDialog}
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
                    key={amt}
                    size="small"
                    variant="outlined"
                    onClick={() => handleQuickAddXp(amt)}
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
          <Button onClick={() => setXpDialogOpen(false)} sx={{ color: "text.secondary" }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmSaveXp}
            disabled={savingXp}
            sx={{ bgcolor: accentColor, color: "#000", fontWeight: 800, "&:hover": { filter: "brightness(0.95)" } }}
          >
            {savingXp ? "Salvando..." : "Salvar XP"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
