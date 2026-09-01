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
  IconButton,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PsychologyIcon from "@mui/icons-material/Psychology";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import { SUBRACAS_POR_RACA } from "../../Array/RegrasSubclasses";
import { HABILIDADES_RACIAIS, normalizeString } from "../../Array/HabilidadesDB";

export default function SelectSubracaModal({
  open,
  onClose,
  racaNome = "",
  currentSubraca = "",
  onSelectSubraca,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const strokeColor = isDark ? "rgba(229,179,36,0.22)" : "rgba(131,60,11,0.22)";
  const accentColor = theme.palette.secondary.main || "#bf8f00";

  // Obter opções disponíveis para a raça
  const matchingRace = Object.keys(SUBRACAS_POR_RACA).find(
    (r) => r.toLowerCase() === (racaNome || "").toLowerCase()
  );
  const opcoes = matchingRace ? SUBRACAS_POR_RACA[matchingRace] : [];

  const [selectedSubraca, setSelectedSubraca] = useState(
    currentSubraca || (opcoes.length > 0 ? opcoes[0] : "")
  );

  React.useEffect(() => {
    if (open) {
      setSelectedSubraca(currentSubraca || (opcoes.length > 0 ? opcoes[0] : ""));
    }
  }, [open, currentSubraca, opcoes]);

  // Traços concedidos pela sub-raça selecionada
  const subTraits = React.useMemo(() => {
    if (!selectedSubraca) return [];
    const subNorm = normalizeString(selectedSubraca);
    return HABILIDADES_RACIAIS.filter((h) => {
      const v = normalizeString(h.vinculo);
      return (
        (v === subNorm || subNorm.includes(v) || v.includes(subNorm)) &&
        h.categoria === "subraca"
      );
    });
  }, [selectedSubraca]);

  const handleConfirm = () => {
    if (!selectedSubraca) return;
    onSelectSubraca?.(selectedSubraca);
    onClose?.();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
          <PsychologyIcon sx={{ color: accentColor, fontSize: 24 }} />
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Cinzel",
              fontWeight: 900,
              color: isDark ? "#fff" : "#2c1a10",
              lineHeight: 1.1,
            }}
          >
            Escolha sua Sub-raça ({racaNome || "Raça"})
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
          Selecione a linhagem ou variante da sua raça. Cada sub-raça concede atributos e traços raciais únicos.
        </Typography>

        <Grid container spacing={2}>
          {opcoes.map((subr) => {
            const isSelected = subr.toLowerCase() === (selectedSubraca || "").toLowerCase();
            return (
              <Grid item xs={12} key={subr}>
                <Paper
                  elevation={0}
                  onClick={() => setSelectedSubraca(subr)}
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
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontFamily: "Cinzel",
                        fontWeight: 900,
                        color: isSelected ? accentColor : isDark ? "#fff" : "#2c1a10",
                      }}
                    >
                      {subr}
                    </Typography>
                    {isSelected && (
                      <CheckCircleRoundedIcon sx={{ color: accentColor, fontSize: 20 }} />
                    )}
                  </Box>
                  <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                    Sub-raça de {racaNome}
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        {/* Traços Concedidos */}
        {selectedSubraca && subTraits.length > 0 && (
          <Box sx={{ mt: 3, pt: 2, borderTop: `1px dashed ${strokeColor}` }}>
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
                Traços Raciais: {selectedSubraca}
              </Typography>
            </Box>

            <Stack spacing={1}>
              {subTraits.map((trait) => (
                <Paper
                  key={trait.id}
                  elevation={0}
                  sx={{
                    p: 1.25,
                    borderRadius: 2,
                    border: `1px solid ${strokeColor}`,
                    bgcolor: isDark ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.02)",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontFamily: "Cinzel",
                      fontWeight: 800,
                      color: isDark ? "#fff" : "#2c1a10",
                      fontSize: "0.85rem",
                      mb: 0.5,
                    }}
                  >
                    {trait.nome}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.78rem", color: "text.secondary" }}>
                    {trait.descricao}
                  </Typography>
                </Paper>
              ))}
            </Stack>
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
          disabled={!selectedSubraca}
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
