import React, { useState, memo } from "react";
import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Collapse,
  Stack,
  alpha,
  useTheme,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import BoltIcon from "@mui/icons-material/Bolt";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import { getActionTypeStyle } from "../../Array/HabilidadesDB";

function FeatureCardItem({
  feature,
  currentUses = 0,
  onDeltaUses,
  onOpenDetails,
  onEdit,
  onDelete,
  isCustom = false,
  isUnlocked = true,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [expanded, setExpanded] = useState(false);

  const actionStyle = getActionTypeStyle(feature.tipoAcao);
  const strokeColor = isDark ? "rgba(229,179,36,0.2)" : "rgba(131,60,11,0.2)";
  const cardBg = isDark ? "rgba(30, 22, 18, 0.95)" : "rgba(255, 252, 246, 0.98)";
  const accentColor = theme.palette.secondary.main || "#bf8f00";

  const maxUses = Number(feature.usosMax || 0);
  const hasUsageTracker = maxUses > 0 || feature.temUsos;
  const spentUses = Math.max(0, Math.min(maxUses, Number(currentUses || 0)));
  const remainingUses = Math.max(0, maxUses - spentUses);

  const handleToggleExpand = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setExpanded((prev) => !prev);
  };

  const handleDelta = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onDeltaUses) return;
    // delta > 0 significa gastar uso (+1 no gasto); delta < 0 significa recuperar uso (-1 no gasto)
    const nextSpent = Math.max(0, Math.min(maxUses, spentUses + delta));
    onDeltaUses(feature.id, nextSpent);
  };

  return (
    <Paper
      elevation={0}
      className="cardItem"
      sx={{
        p: 1.75,
        borderRadius: 2.5,
        border: `1px solid ${strokeColor}`,
        bgcolor: cardBg,
        position: "relative",
        opacity: isUnlocked ? 1 : 0.65,
        contentVisibility: "auto",
        containIntrinsicSize: "0 80px",
        contain: "layout style paint",
        transform: "translateZ(0)",
        transition: "border-color 0.12s ease-out, box-shadow 0.12s ease-out",
        "&:hover": {
          borderColor: alpha(actionStyle.color, 0.6),
          boxShadow: isDark
            ? "0 6px 20px rgba(0,0,0,0.35)"
            : "0 4px 16px rgba(0,0,0,0.06)",
        },
      }}
    >
      {/* Topo do Card: Nome e Ações */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Box sx={{ flex: 1, pr: 0.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontFamily: "Cinzel",
                fontWeight: 900,
                color: isDark ? "#fff" : "#2c1a10",
                lineHeight: 1.2,
                cursor: "pointer",
              }}
              onClick={handleToggleExpand}
            >
              {feature.nome}
            </Typography>

            {!isUnlocked && (
              <Tooltip title={`Desbloqueia no nível ${feature.nivel}`}>
                <LockIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              </Tooltip>
            )}
          </Box>

          {/* Badges / Chips de Informação */}
          <Stack direction="row" spacing={0.5} sx={{ mt: 0.6, flexWrap: "wrap", gap: 0.4 }}>
            {/* Status de Posse */}
            {isUnlocked ? (
              <Chip
                icon={<CheckCircleRoundedIcon sx={{ fontSize: "11px !important", color: (isDark ? "#81c784" : "#2e7d32") + " !important" }} />}
                label="Possui"
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.64rem",
                  fontWeight: 800,
                  bgcolor: isDark ? "rgba(46, 125, 50, 0.18)" : "rgba(46, 125, 50, 0.12)",
                  color: isDark ? "#81c784" : "#2e7d32",
                  border: "1px solid rgba(46, 125, 50, 0.35)",
                  px: 0.2,
                }}
              />
            ) : (
              <Chip
                icon={<LockIcon sx={{ fontSize: "10px !important", color: "text.secondary !important" }} />}
                label={`Nvl ${feature.nivel}`}
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.64rem",
                  fontWeight: 700,
                  bgcolor: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)",
                  color: "text.secondary",
                  border: `1px solid ${strokeColor}`,
                  px: 0.2,
                }}
              />
            )}

            {/* Tipo de Ação */}
            <Chip
              label={feature.tipoAcao || "Passiva"}
              size="small"
              sx={{
                height: 20,
                fontSize: "0.68rem",
                fontWeight: 800,
                bgcolor: actionStyle.bg,
                color: actionStyle.color,
                border: `1px solid ${actionStyle.border}`,
              }}
            />

            {/* Recarga */}
            {feature.recarga && feature.recarga !== "Ilimitado" && (
              <Chip
                icon={
                  feature.recarga.includes("Longo") ? (
                    <BedtimeIcon sx={{ fontSize: "13px !important" }} />
                  ) : (
                    <BoltIcon sx={{ fontSize: "13px !important" }} />
                  )
                }
                label={feature.recarga}
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  bgcolor: isDark ? "rgba(255,214,0,0.1)" : "rgba(255,214,0,0.15)",
                  color: isDark ? "#ffd600" : "#b26a00",
                  border: "1px solid rgba(255,214,0,0.3)",
                }}
              />
            )}

            {/* Sub-Origem / Origem */}
            {feature.subOrigem && (
              <Chip
                label={feature.subOrigem}
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  color: "text.secondary",
                  border: `1px solid ${strokeColor}`,
                }}
              />
            )}
          </Stack>
        </Box>

        {/* Botões de Ação no Canto Superior Direito */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
          {onOpenDetails && (
            <Tooltip title="Ver detalhes completos no compêndio">
              <IconButton
                type="button"
                size="small"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onOpenDetails(feature);
                }}
                sx={{ p: 0.4, color: "text.secondary" }}
              >
                <MenuBookIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {isCustom && onEdit && (
            <Tooltip title="Editar Habilidade Livre">
              <IconButton
                type="button"
                size="small"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit(feature);
                }}
                sx={{ p: 0.4, color: "text.secondary" }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {isCustom && onDelete && (
            <Tooltip title="Remover Habilidade">
              <IconButton
                type="button"
                size="small"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(feature.id);
                }}
                sx={{ p: 0.4, color: "error.main" }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          <IconButton
            type="button"
            size="small"
            onClick={handleToggleExpand}
            sx={{ p: 0.4, color: "text.secondary" }}
          >
            {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </IconButton>
        </Box>
      </Box>

      {/* Rastreador de Usos (Se aplicável) */}
      {hasUsageTracker && maxUses > 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 1.25,
            pt: 1,
            borderTop: `1px solid ${strokeColor}`,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 800,
              fontSize: "0.72rem",
              color: remainingUses > 0 ? actionStyle.color : "text.secondary",
            }}
          >
            Usos Disponíveis:{" "}
            <strong>
              {remainingUses} / {maxUses}
            </strong>
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              bgcolor: isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.04)",
              borderRadius: 2,
              p: 0.25,
            }}
          >
            <Tooltip title="Recuperar 1 uso">
              <span>
                <IconButton
                  type="button"
                  size="small"
                  onClick={(e) => handleDelta(e, -1)}
                  disabled={spentUses <= 0}
                  sx={{ p: 0.3, color: "text.secondary" }}
                >
                  <AddIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </span>
            </Tooltip>

            <Typography
              variant="caption"
              sx={{ fontWeight: 900, minWidth: 24, textAlign: "center" }}
            >
              {remainingUses}
            </Typography>

            <Tooltip title="Gastar 1 uso">
              <span>
                <IconButton
                  type="button"
                  size="small"
                  onClick={(e) => handleDelta(e, 1)}
                  disabled={remainingUses <= 0}
                  sx={{ p: 0.3, color: actionStyle.color }}
                >
                  <RemoveIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
      )}

      {/* Descrição Expansível */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box
          sx={{
            mt: 1.5,
            pt: 1.25,
            borderTop: `1px dashed ${strokeColor}`,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: isDark ? "rgba(255,255,255,0.85)" : "rgba(47,35,24,0.9)",
              fontSize: "0.82rem",
              lineHeight: 1.5,
              whiteSpace: "pre-wrap",
            }}
          >
            {feature.descricao}
          </Typography>

          {onOpenDetails && (
            <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="button"
                size="small"
                variant="text"
                startIcon={<MenuBookIcon fontSize="small" />}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onOpenDetails(feature);
                }}
                sx={{
                  fontSize: "0.72rem",
                  color: accentColor,
                  fontWeight: 800,
                  p: 0,
                  minWidth: "auto",
                }}
              >
                Ler no Compêndio
              </Button>
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
}

export default memo(FeatureCardItem);
