import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Button,
  Stack,
  alpha,
  useTheme,
  FormControlLabel,
  Checkbox,
  Menu,
  MenuItem,
} from "@mui/material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FlareIcon from "@mui/icons-material/Flare";
import ShieldIcon from "@mui/icons-material/Shield";
import FavoriteIcon from "@mui/icons-material/Favorite";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import BoltIcon from "@mui/icons-material/Bolt";

export default function SpellCard({
  spell,
  spellDc = 13,
  spellAttackBonus = 5,
  availableSlotsInCircle = 0,
  availableHigherCircles = [],
  onCast,
  onTogglePrepared,
  onEdit,
  onDelete,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const arcanaColor = isDark ? "#ba68c8" : "#8e24aa";
  const arcanaBorder = isDark ? "rgba(186, 104, 200, 0.3)" : "rgba(142, 36, 170, 0.25)";
  const strokeColor = isDark ? "rgba(229,179,36,0.2)" : "rgba(131,60,11,0.2)";

  const isCantrip = Number(spell.level || 0) === 0;
  const hasSlots = isCantrip || availableSlotsInCircle > 0;

  // Estado do menu de Upcasting (Conjurar em Círculo Superior)
  const [upcastMenuAnchor, setUpcastMenuAnchor] = useState(null);

  const compParts = [];
  if (spell.components?.v) compParts.push("V");
  if (spell.components?.s) compParts.push("S");
  if (spell.components?.m) compParts.push(spell.materialText ? `M (${spell.materialText})` : "M");

  const handleOpenUpcastMenu = (event) => {
    event.stopPropagation();
    setUpcastMenuAnchor(event.currentTarget);
  };

  const handleSelectUpcastCircle = (circleLevel) => {
    setUpcastMenuAnchor(null);
    onCast?.(spell, circleLevel);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: `1.5px solid ${arcanaBorder}`,
        bgcolor: isDark ? "rgba(28, 18, 32, 0.88)" : "rgba(255, 252, 246, 0.94)",
        backdropFilter: "blur(6px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        position: "relative",
        transition: "all 0.18s ease",
        "&:hover": {
          borderColor: arcanaColor,
          boxShadow: isDark
            ? `0 8px 24px ${alpha(arcanaColor, 0.3)}`
            : "0 6px 20px rgba(0,0,0,0.08)",
        },
      }}
    >
      <Box>
        {/* Topo do Card: Nome + Escola + Botões de Ação */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Box sx={{ flex: 1, pr: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Cinzel",
                fontWeight: 900,
                color: isDark ? "#fff" : "#2c1a10",
                lineHeight: 1.15,
              }}
            >
              {spell.name}
            </Typography>
            <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }} flexWrap="wrap">
              {spell.school && (
                <Chip
                  label={spell.school}
                  size="small"
                  sx={{
                    height: 19,
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    bgcolor: alpha(arcanaColor, 0.15),
                    color: arcanaColor,
                    border: `1px solid ${arcanaBorder}`,
                  }}
                />
              )}
              {isCantrip ? (
                <Chip
                  label="Truque (Nvl 0)"
                  size="small"
                  sx={{
                    height: 19,
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    bgcolor: "rgba(76, 175, 80, 0.15)",
                    color: "#4caf50",
                  }}
                />
              ) : (
                <Chip
                  label={`${spell.level}º Círculo`}
                  size="small"
                  sx={{
                    height: 19,
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                  }}
                />
              )}
            </Stack>
          </Box>

          {/* Botões Editar / Deletar */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
            <Tooltip title="Editar Magia">
              <IconButton size="small" onClick={() => onEdit?.(spell)}>
                <EditIcon fontSize="small" sx={{ color: "text.secondary" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Remover Magia">
              <IconButton size="small" onClick={() => onDelete?.(spell.id)}>
                <DeleteOutlineIcon fontSize="small" color="error" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Chips de Propriedades da Magia */}
        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 1.2 }}>
          <Chip
            label={spell.castingTime || "1 Ação"}
            size="small"
            sx={{
              height: 20,
              fontSize: "0.68rem",
              fontWeight: 700,
              bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
            }}
          />
          <Chip
            label={spell.range || "18m"}
            size="small"
            sx={{
              height: 20,
              fontSize: "0.68rem",
              fontWeight: 700,
              bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
            }}
          />
          <Chip
            label={spell.duration || "Instantânea"}
            size="small"
            sx={{
              height: 20,
              fontSize: "0.68rem",
              fontWeight: 700,
              bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
            }}
          />
          {compParts.length > 0 && (
            <Chip
              label={`Comp: ${compParts.join(", ")}`}
              size="small"
              sx={{
                height: 20,
                fontSize: "0.68rem",
                fontWeight: 700,
              }}
            />
          )}
          {spell.concentration && (
            <Chip
              label="Concentração"
              size="small"
              sx={{
                height: 20,
                fontSize: "0.68rem",
                fontWeight: 900,
                bgcolor: "rgba(255, 152, 0, 0.15)",
                color: "#ff9800",
                border: "1px solid rgba(255, 152, 0, 0.4)",
              }}
            />
          )}
          {spell.ritual && (
            <Chip
              label="Ritual"
              size="small"
              sx={{
                height: 20,
                fontSize: "0.68rem",
                fontWeight: 900,
                bgcolor: "rgba(33, 150, 243, 0.15)",
                color: "#2196f3",
                border: "1px solid rgba(33, 150, 243, 0.4)",
              }}
            />
          )}
        </Stack>

        {/* Destaque de Mecânicas D&D 5e (Ataque vs CA, CD de Salvaguarda, Dano/Cura) */}
        {(spell.mechanic || spell.damage || spell.saveType) && (
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: isDark ? "rgba(186, 104, 200, 0.08)" : "rgba(142, 36, 170, 0.06)",
              border: `1px solid ${arcanaBorder}`,
              mb: 1.2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            {spell.mechanic === "attack" && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <ShieldIcon sx={{ color: arcanaColor, fontSize: 16 }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: arcanaColor }}>
                  Ataque: +{spellAttackBonus} vs CA
                </Typography>
              </Box>
            )}

            {spell.mechanic === "save" && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <FlareIcon sx={{ color: arcanaColor, fontSize: 16 }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: arcanaColor }}>
                  CD {spellDc} {spell.saveType || "Destreza"}
                </Typography>
              </Box>
            )}

            {spell.mechanic === "heal" && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <FavoriteIcon sx={{ color: "#4caf50", fontSize: 16 }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: "#4caf50" }}>
                  Cura / Suporte
                </Typography>
              </Box>
            )}

            {spell.damage && (
              <Chip
                label={spell.damage}
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.7rem",
                  fontWeight: 900,
                  bgcolor: "rgba(229, 57, 53, 0.15)",
                  color: "#ef5350",
                  border: "1px solid rgba(229, 57, 53, 0.3)",
                }}
              />
            )}
          </Box>
        )}

        {/* Descrição da Magia */}
        {spell.description && (
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              display: "block",
              mb: 1,
              whiteSpace: "pre-line",
              lineHeight: 1.4,
            }}
          >
            {spell.description}
          </Typography>
        )}

        {spell.higherLevels && (
          <Typography
            variant="caption"
            sx={{
              color: arcanaColor,
              fontWeight: 700,
              display: "block",
              mb: 1,
              fontStyle: "italic",
            }}
          >
            Em Níveis Superiores: {spell.higherLevels}
          </Typography>
        )}
      </Box>

      {/* Rodapé: Checkbox de Preparada & Botões Rápidos de "Conjurar" */}
      <Box
        sx={{
          pt: 1.25,
          borderTop: `1px solid ${strokeColor}`,
          mt: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        {/* Toggle Preparada (para nível 1+) */}
        {!isCantrip ? (
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={!!spell.prepared}
                onChange={() => onTogglePrepared?.(spell.id)}
                sx={{
                  p: 0.4,
                  color: arcanaColor,
                  "&.Mui-checked": { color: arcanaColor },
                }}
              />
            }
            label={
              <Typography variant="caption" sx={{ fontWeight: 800, fontSize: "0.72rem" }}>
                Preparada
              </Typography>
            }
            sx={{ m: 0 }}
          />
        ) : (
          <Typography variant="caption" sx={{ fontWeight: 800, color: "text.secondary" }}>
            Truque (Sem Custo)
          </Typography>
        )}

        {/* Ações de Conjuração */}
        <Stack direction="row" spacing={0.5} alignItems="center">
          {/* Botão de Conjuração Padrão */}
          {isCantrip ? (
            <Button
              size="small"
              variant="contained"
              startIcon={<AutoFixHighIcon />}
              onClick={() => onCast?.(spell, 0)}
              sx={{
                bgcolor: arcanaColor,
                color: "#fff",
                fontWeight: 800,
                fontSize: "0.75rem",
                px: 1.2,
                py: 0.35,
                "&:hover": {
                  bgcolor: arcanaColor,
                  filter: "brightness(0.92)",
                },
              }}
            >
              Lançar Truque
            </Button>
          ) : (
            <Tooltip
              title={
                hasSlots
                  ? `Desconta 1 espaço de ${spell.level}º Círculo`
                  : `Sem espaços de ${spell.level}º Círculo restantes`
              }
            >
              <span>
                <Button
                  size="small"
                  variant="contained"
                  disabled={!hasSlots}
                  startIcon={<BoltIcon />}
                  onClick={() => onCast?.(spell, Number(spell.level || 1))}
                  sx={{
                    bgcolor: arcanaColor,
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: "0.75rem",
                    px: 1.2,
                    py: 0.35,
                    "&:hover": {
                      bgcolor: arcanaColor,
                      filter: "brightness(0.92)",
                    },
                  }}
                >
                  Conjurar ({availableSlotsInCircle})
                </Button>
              </span>
            </Tooltip>
          )}

          {/* Opção de Upcasting (Conjurar em Círculo Superior) */}
          {!isCantrip && availableHigherCircles.length > 0 && (
            <>
              <Tooltip title="Conjurar usando um espaço de círculo superior (Upcast)">
                <IconButton
                  size="small"
                  onClick={handleOpenUpcastMenu}
                  sx={{
                    border: `1px solid ${arcanaBorder}`,
                    color: arcanaColor,
                    p: 0.35,
                    borderRadius: 1.5,
                  }}
                >
                  <KeyboardArrowDownIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={upcastMenuAnchor}
                open={Boolean(upcastMenuAnchor)}
                onClose={() => setUpcastMenuAnchor(null)}
                PaperProps={{
                  sx: {
                    borderRadius: 2,
                    border: `1px solid ${arcanaBorder}`,
                    bgcolor: isDark ? "#1c1410" : "#fffcf6",
                  },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    px: 2,
                    py: 0.5,
                    fontWeight: 800,
                    color: "text.secondary",
                    display: "block",
                  }}
                >
                  Conjurar em Círculo Superior:
                </Typography>
                {availableHigherCircles.map((circleLvl) => (
                  <MenuItem
                    key={`upcast-${circleLvl}`}
                    onClick={() => handleSelectUpcastCircle(circleLvl)}
                    sx={{ fontSize: "0.82rem", fontWeight: 700 }}
                  >
                    ⚡ {circleLvl}º Círculo
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </Stack>
      </Box>
    </Paper>
  );
}
