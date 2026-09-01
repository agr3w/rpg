import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
  Stack,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const ORIGIN_OPTIONS = [
  { value: "livre", label: "Habilidade Livre / Personalizada" },
  { value: "talento", label: "Talento (Feat)" },
  { value: "classe", label: "Recurso de Classe" },
  { value: "raca", label: "Traço Racial" },
];

const ACTION_OPTIONS = [
  { value: "Passiva", label: "Passiva (Sem Custo de Ação)" },
  { value: "1 Ação", label: "1 Ação (Padrão de Combate)" },
  { value: "Ação Bônus", label: "Ação Bônus" },
  { value: "Reação", label: "Reação" },
  { value: "Especial", label: "Especial / Fora de Combate" },
];

const RECHARGE_OPTIONS = [
  { value: "Ilimitado", label: "Ilimitado / À Vontade" },
  { value: "Descanso Curto", label: "Descanso Curto" },
  { value: "Descanso Longo", label: "Descanso Longo" },
  { value: "Descanso Curto ou Longo", label: "Descanso Curto ou Longo" },
  { value: "Cargas", label: "Cargas Diárias" },
];

export default function AddFeatureModal({
  open,
  onClose,
  onSave,
  editingFeature = null,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const strokeColor = isDark ? "rgba(229,179,36,0.22)" : "rgba(131,60,11,0.22)";
  const accentColor = theme.palette.secondary.main || "#bf8f00";

  const [form, setForm] = useState({
    nome: "",
    origem: "livre",
    subOrigem: "",
    nivel: 1,
    tipoAcao: "Passiva",
    recarga: "Ilimitado",
    temUsos: false,
    usosMax: 1,
    descricao: "",
  });

  useEffect(() => {
    if (editingFeature) {
      setForm({
        nome: editingFeature.nome || editingFeature.name || "",
        origem: editingFeature.origem || "livre",
        subOrigem: editingFeature.subOrigem || "",
        nivel: Math.max(0, Number(editingFeature.nivel || editingFeature.level || 1)),
        tipoAcao: editingFeature.tipoAcao || "Passiva",
        recarga: editingFeature.recarga || "Ilimitado",
        temUsos: Boolean(editingFeature.temUsos || Number(editingFeature.usosMax || 0) > 0),
        usosMax: Math.max(1, Number(editingFeature.usosMax || 1)),
        descricao: editingFeature.descricao || editingFeature.description || "",
      });
    } else {
      setForm({
        nome: "",
        origem: "livre",
        subOrigem: "",
        nivel: 1,
        tipoAcao: "Passiva",
        recarga: "Ilimitado",
        temUsos: false,
        usosMax: 1,
        descricao: "",
      });
    }
  }, [editingFeature, open]);

  const handleConfirmSave = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const nome = form.nome.trim();
    if (!nome) return;

    onSave?.({
      ...(editingFeature || {}),
      id: editingFeature?.id || `custom_feat_${Date.now()}`,
      nome,
      name: nome,
      origem: form.origem,
      subOrigem: form.subOrigem.trim(),
      nivel: Number(form.nivel || 1),
      level: Number(form.nivel || 1),
      tipoAcao: form.tipoAcao,
      recarga: form.recarga,
      temUsos: form.temUsos,
      usosMax: form.temUsos ? Number(form.usosMax || 1) : 0,
      descricao: form.descricao.trim(),
      description: form.descricao.trim(),
      createdAt: editingFeature?.createdAt || Date.now(),
    });
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
          bgcolor: isDark ? "#1c1410" : "#fffcf6",
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, fontFamily: "Cinzel", fontWeight: 900 }}>
        <AutoAwesomeIcon sx={{ color: accentColor }} />
        {editingFeature ? "Editar Habilidade / Talento" : "Nova Habilidade / Talento"}
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            label="Nome da Habilidade / Talento"
            placeholder="ex: Mestre de Armas Grandes, Liderança Inspiradora, Bênção da Floresta"
            value={form.nome}
            onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))}
            fullWidth
            size="small"
            autoFocus
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Categoria / Origem"
                value={form.origem}
                onChange={(e) => setForm((p) => ({ ...p, origem: e.target.value }))}
                fullWidth
                size="small"
              >
                {ORIGIN_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Sub-Origem / Detalhe"
                placeholder="ex: Talento de Nível 4, Dádiva, Guilda"
                value={form.subOrigem}
                onChange={(e) => setForm((p) => ({ ...p, subOrigem: e.target.value }))}
                fullWidth
                size="small"
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Nível Mínimo"
                type="number"
                value={form.nivel}
                onChange={(e) => setForm((p) => ({ ...p, nivel: Math.max(0, parseInt(e.target.value, 10) || 0) }))}
                fullWidth
                size="small"
                inputProps={{ min: 0, max: 20 }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="Tipo de Ação"
                value={form.tipoAcao}
                onChange={(e) => setForm((p) => ({ ...p, tipoAcao: e.target.value }))}
                fullWidth
                size="small"
              >
                {ACTION_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="Recarga"
                value={form.recarga}
                onChange={(e) => setForm((p) => ({ ...p, recarga: e.target.value }))}
                fullWidth
                size="small"
              >
                {RECHARGE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          {/* Rastreador de Usos Toggle */}
          <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${strokeColor}` }}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.temUsos}
                  onChange={(e) => setForm((p) => ({ ...p, temUsos: e.target.checked }))}
                  color="secondary"
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  Ativar Rastreador de Usos / Cargas Limitadas
                </Typography>
              }
            />

            {form.temUsos && (
              <Box sx={{ mt: 1.5, maxWidth: 220 }}>
                <TextField
                  label="Quantidade Máxima de Usos"
                  type="number"
                  value={form.usosMax}
                  onChange={(e) => setForm((p) => ({ ...p, usosMax: Math.max(1, parseInt(e.target.value, 10) || 1) }))}
                  fullWidth
                  size="small"
                  inputProps={{ min: 1 }}
                />
              </Box>
            )}
          </Box>

          <TextField
            label="Descrição Completa das Regras e Efeitos"
            placeholder="Descreva o efeito exato, bônus mecânicos, dados rolados, CD de salvaguarda e regras aplicáveis."
            value={form.descricao}
            onChange={(e) => setForm((p) => ({ ...p, descricao: e.target.value }))}
            fullWidth
            multiline
            minRows={4}
            size="small"
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button type="button" onClick={onClose} sx={{ color: "text.secondary" }}>
          Cancelar
        </Button>
        <Button
          type="button"
          variant="contained"
          onClick={handleConfirmSave}
          disabled={!form.nome.trim()}
          sx={{
            bgcolor: accentColor,
            color: "#000",
            fontWeight: 800,
            "&:hover": { filter: "brightness(0.95)" },
          }}
        >
          {editingFeature ? "Salvar Alterações" : "Cadastrar Habilidade"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
