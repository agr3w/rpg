import React, { useState } from "react";
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
  alpha,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import BoltIcon from "@mui/icons-material/Bolt";

import { SUBCLASSES_POR_CLASSE } from "../../Array/RegrasSubclasses";
import { HABILIDADES_CLASSES, normalizeString, getActionTypeStyle } from "../../Array/HabilidadesDB";

export default function SelectSubclasseModal({
  open,
  onClose,
  classeNome = "",
  currentSubclasse = "",
  onSelectSubclasse,
  level = 1,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const strokeColor = isDark ? "rgba(229,179,36,0.22)" : "rgba(131,60,11,0.22)";
  const accentColor = theme.palette.secondary.main || "#bf8f00";

  // Obter opções disponíveis para a classe
  const matchingClass = Object.keys(SUBCLASSES_POR_CLASSE).find(
    (c) => c.toLowerCase() === (classeNome || "").toLowerCase()
  );
  const opcoes = matchingClass ? SUBCLASSES_POR_CLASSE[matchingClass] : [];

  const [selectedSubclasse, setSelectedSubclasse] = useState(
    currentSubclasse || (opcoes.length > 0 ? opcoes[0] : "")
  );

  // Sincroniza seleção inicial quando o modal abre
  React.useEffect(() => {
    if (open) {
      setSelectedSubclasse(currentSubclasse || (opcoes.length > 0 ? opcoes[0] : ""));
    }
  }, [open, currentSubclasse, opcoes]);

  // Habilidades concedidas pela subclasse selecionada
  const subFeatures = React.useMemo(() => {
    if (!selectedSubclasse) return [];
    const subNorm = normalizeString(selectedSubclasse);
    return HABILIDADES_CLASSES.filter((h) => {
      const v = normalizeString(h.vinculo);
      return (
        (v === subNorm || subNorm.includes(v) || v.includes(subNorm)) &&
        h.categoria === "subclasse"
      );
    }).sort((a, b) => Number(a.nivel || 1) - Number(b.nivel || 1));
  }, [selectedSubclasse]);

  const handleConfirm = () => {
    if (!selectedSubclasse) return;
    onSelectSubclasse?.(selectedSubclasse);
    onClose?.();
  };

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
        },
      }}
    >
      {/* Topo do Modal */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${strokeColor}`,
          pb: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AccountTreeIcon sx={{ color: accentColor, fontSize: 24 }} />
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Cinzel",
              fontWeight: 900,
              color: isDark ? "#fff" : "#2c1a10",
              lineHeight: 1.1,
            }}
          >
            Escolha sua Subclasse ({classeNome || "Classe"})
          </Typography>
        </Box>
        <IconButton
          type="button"
          onClick={onClose}
          size="small"
          sx={{ color: "text.secondary" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Conteúdo */}
      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2.5 }}>
          Selecione o arquétipo/especialização do seu personagem. Cada subclasse confere recursos únicos ao longo da sua progressão (Nível 1 ao 20).
        </Typography>

        <Grid container spacing={2}>
          {/* Opções de Subclasse */}
          {opcoes.map((subc) => {
            const isSelected = subc.toLowerCase() === (selectedSubclasse || "").toLowerCase();
            return (
              <Grid item xs={12} sm={6} key={subc}>
                <Paper
                  elevation={0}
                  onClick={() => setSelectedSubclasse(subc)}
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    cursor: "pointer",
                    border: `1.5px solid ${isSelected ? accentColor : strokeColor}`,
                    bgcolor: isSelected
                      ? alpha(accentColor, isDark ? 0.15 : 0.08)
                      : isDark
                      ? "rgba(255,255,255,0.02)"
                      : "rgba(0,0,0,0.02)",
                    boxShadow: isSelected ? `0 4px 16px ${alpha(accentColor, 0.25)}` : "none",
                    transition: "all 0.18s ease",
                    "&:hover": {
                      borderColor: accentColor,
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontFamily: "Cinzel",
                        fontWeight: 900,
                        color: isSelected ? accentColor : isDark ? "#fff" : "#2c1a10",
                      }}
                    >
                      {subc}
                    </Typography>
                    {isSelected && (
                      <CheckCircleRoundedIcon sx={{ color: accentColor, fontSize: 20 }} />
                    )}
                  </Box>
                  <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                    Arquétipo de {classeNome}
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        {/* Recursos Concedidos pela Subclasse Selecionada */}
        {selectedSubclasse && (
          <Box sx={{ mt: 3, pt: 2.5, borderTop: `1px dashed ${strokeColor}` }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
              <AutoAwesomeIcon sx={{ color: accentColor, fontSize: 18 }} />
              <Typography
                variant="subtitle2"
                sx={{
                  fontFamily: "Cinzel",
                  fontWeight: 900,
                  color: isDark ? "#fff" : "#2c1a10",
                }}
              >
                Progressão de Recursos: {selectedSubclasse}
              </Typography>
            </Box>

            {subFeatures.length === 0 ? (
              <Typography variant="caption" sx={{ color: "text.secondary", fontStyle: "italic" }}>
                Nenhuma habilidade específica cadastrada no momento para este arquétipo.
              </Typography>
            ) : (
              <Stack spacing={1.25}>
                {subFeatures.map((feat) => {
                  const actStyle = getActionTypeStyle(feat.tipoAcao);
                  const isUnlockedNow = Number(feat.nivel || 1) <= Number(level || 1);

                  return (
                    <Paper
                      key={feat.id}
                      elevation={0}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        border: `1px solid ${strokeColor}`,
                        bgcolor: isDark ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.02)",
                        opacity: isUnlockedNow ? 1 : 0.75,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, mb: 0.5 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontFamily: "Cinzel",
                            fontWeight: 800,
                            color: isDark ? "#fff" : "#2c1a10",
                            fontSize: "0.88rem",
                          }}
                        >
                          {feat.nome}
                        </Typography>
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <Chip
                            label={`Nível ${feat.nivel}`}
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: "0.62rem",
                              fontWeight: 800,
                              bgcolor: isUnlockedNow
                                ? isDark
                                  ? "rgba(46, 125, 50, 0.2)"
                                  : "rgba(46, 125, 50, 0.12)"
                                : undefined,
                              color: isUnlockedNow ? (isDark ? "#81c784" : "#2e7d32") : undefined,
                            }}
                          />
                          <Chip
                            label={feat.tipoAcao || "Passiva"}
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: "0.62rem",
                              fontWeight: 800,
                              bgcolor: actStyle.bg,
                              color: actStyle.color,
                            }}
                          />
                        </Stack>
                      </Box>
                      <Typography variant="body2" sx={{ fontSize: "0.78rem", color: "text.secondary", lineHeight: 1.4 }}>
                        {feat.descricao}
                      </Typography>
                    </Paper>
                  );
                })}
              </Stack>
            )}
          </Box>
        )}
      </DialogContent>

      {/* Ações */}
      <DialogActions sx={{ p: 2, borderTop: `1px solid ${strokeColor}` }}>
        <Button type="button" onClick={onClose} sx={{ color: "text.secondary", fontFamily: "Cinzel" }}>
          Cancelar
        </Button>
        <Button
          type="button"
          variant="contained"
          onClick={handleConfirm}
          disabled={!selectedSubclasse}
          sx={{
            bgcolor: accentColor,
            color: "#000",
            fontFamily: "Cinzel",
            fontWeight: 800,
            "&:hover": { bgcolor: accentColor, filter: "brightness(0.92)" },
          }}
        >
          Confirmar Escolha
        </Button>
      </DialogActions>
    </Dialog>
  );
}
