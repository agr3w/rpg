import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  alpha,
  useTheme,
  FormControlLabel,
  Switch,
} from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import ShieldIcon from "@mui/icons-material/Shield";
import CheckroomIcon from "@mui/icons-material/Checkroom";

const RARITIES = [
  { id: "comum", label: "Comum", color: "#9e9e9e", border: "rgba(158, 158, 158, 0.4)" },
  { id: "incomum", label: "Incomum", color: "#4caf50", border: "rgba(76, 175, 80, 0.45)" },
  { id: "raro", label: "Raro", color: "#2196f3", border: "rgba(33, 150, 243, 0.45)" },
  { id: "muito_raro", label: "Muito Raro", color: "#ab47bc", border: "rgba(171, 71, 188, 0.5)" },
  { id: "lendario", label: "Lendário / Artefato", color: "#ffd700", border: "rgba(255, 215, 0, 0.6)" },
];

export default function FichaBackpackPanel({
  backpack = {},
  onChangeBackpack,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Identidade Âmbar/Couro D&D
  const itemColor = isDark ? "#ffd54f" : "#b26a00";
  const itemBorder = isDark ? "rgba(255, 213, 79, 0.25)" : "rgba(178, 106, 0, 0.25)";
  const strokeColor = isDark ? "rgba(229,179,36,0.2)" : "rgba(131,60,11,0.2)";
  const cardBg = isDark ? "rgba(28, 20, 14, 0.88)" : "rgba(255, 252, 246, 0.94)";

  const itemsList = useMemo(() => {
    return Object.entries(backpack || {})
      .filter(([_, item]) => Boolean(item))
      .map(([id, item]) => ({ id, ...item }))
      .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  }, [backpack]);

  // Peso total calculado
  const totalWeight = useMemo(() => {
    return itemsList.reduce((acc, item) => {
      const q = Math.max(0, Number(item.qty || 1));
      const w = Math.max(0, parseFloat(String(item.weight || 0).replace(",", ".")) || 0);
      return acc + (q * w);
    }, 0);
  }, [itemsList]);

  // Modal de Criação / Edição
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [itemForm, setItemForm] = useState({
    name: "",
    qty: 1,
    weight: 0,
    rarity: "comum",
    equipped: false,
    notes: "",
  });

  const handleOpenAddModal = () => {
    setEditingId(null);
    setItemForm({
      name: "",
      qty: 1,
      weight: 0,
      rarity: "comum",
      equipped: false,
      notes: "",
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingId(item.id);
    setItemForm({
      name: item.name || "",
      qty: Math.max(1, Number(item.qty || 1)),
      weight: item.weight || 0,
      rarity: item.rarity || "comum",
      equipped: !!item.equipped,
      notes: item.notes || "",
    });
    setModalOpen(true);
  };

  const handleSaveItem = () => {
    const name = itemForm.name.trim();
    if (!name) return;

    const id = editingId || `item_${Date.now()}`;
    const nextBackpack = {
      ...(backpack || {}),
      [id]: {
        id,
        name,
        qty: Math.max(0, Number(itemForm.qty || 1)),
        weight: parseFloat(String(itemForm.weight || 0).replace(",", ".")) || 0,
        rarity: itemForm.rarity || "comum",
        equipped: itemForm.equipped,
        notes: itemForm.notes,
        createdAt: editingId ? (backpack?.[editingId]?.createdAt || Date.now()) : Date.now(),
      },
    };

    onChangeBackpack?.(nextBackpack);
    setModalOpen(false);
  };

  const handleDeleteItem = (id) => {
    const next = { ...(backpack || {}) };
    delete next[id];
    onChangeBackpack?.(next);
  };

  // Ajuste rápido de quantidade (+ / -) sem abrir modal
  const handleDeltaQty = (id, delta) => {
    const current = backpack?.[id];
    if (!current) return;
    const currentQty = Number(current.qty || 1);
    const nextQty = Math.max(0, currentQty + delta);

    if (nextQty === 0 && delta < 0) {
      // Se diminuir de 1 para 0, permite manter 0 ou deletar
      onChangeBackpack?.({
        ...(backpack || {}),
        [id]: {
          ...current,
          qty: 0,
        },
      });
      return;
    }

    onChangeBackpack?.({
      ...(backpack || {}),
      [id]: {
        ...current,
        qty: nextQty,
      },
    });
  };

  // Toggle rápido de Equipado
  const handleToggleEquipped = (id) => {
    const current = backpack?.[id];
    if (!current) return;
    onChangeBackpack?.({
      ...(backpack || {}),
      [id]: {
        ...current,
        equipped: !current.equipped,
      },
    });
  };

  return (
    <Box>
      {/* Barra de Ação Superior */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <Inventory2Icon sx={{ color: itemColor, fontSize: 24 }} />
          <Typography variant="h6" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: isDark ? "#fff" : "#2c1a10" }}>
            Mochila & Equipamentos Gerais
          </Typography>
          <Chip
            icon={<FitnessCenterIcon sx={{ fontSize: "15px !important" }} />}
            label={`Peso Total: ${totalWeight.toFixed(1)} kg`}
            size="small"
            sx={{ fontWeight: 800, fontSize: "0.72rem", bgcolor: alpha(itemColor, 0.15), color: itemColor, border: `1px solid ${itemBorder}` }}
          />
        </Box>

        <Button
          size="small"
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleOpenAddModal}
          sx={{
            bgcolor: itemColor,
            color: "#000",
            fontWeight: 900,
            fontSize: "0.78rem",
            px: 1.5,
            py: 0.5,
            "&:hover": { filter: "brightness(0.92)", bgcolor: itemColor },
          }}
        >
          Novo Item
        </Button>
      </Box>

      {/* Lista de Itens */}
      {itemsList.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            border: `1px dashed ${strokeColor}`,
            bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
          }}
        >
          <Inventory2Icon sx={{ fontSize: 44, color: "text.secondary", opacity: 0.4, mb: 1 }} />
          <Typography variant="body1" sx={{ fontWeight: 800, color: "text.secondary" }}>
            Sua mochila está vazia.
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 2 }}>
            Adicione poções, pergaminhos, itens de exploração e tesouros.
          </Typography>
          <Button
            size="small"
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleOpenAddModal}
            sx={{ borderColor: itemColor, color: itemColor, fontWeight: 800 }}
          >
            Adicionar Primeiro Item
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={1.5}>
          {itemsList.map((item) => {
            const rarityInfo = RARITIES.find((r) => r.id === item.rarity) || RARITIES[0];
            const itemWeight = Math.max(0, parseFloat(String(item.weight || 0).replace(",", ".")) || 0);
            const lotWeight = itemWeight * Number(item.qty || 1);

            return (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.75,
                    borderRadius: 2.5,
                    border: `1.5px solid ${rarityInfo.border}`,
                    bgcolor: cardBg,
                    backdropFilter: "blur(6px)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                    position: "relative",
                    transition: "all 0.18s ease",
                    boxShadow: item.rarity === "lendario" ? `0 0 12px ${alpha(rarityInfo.color, 0.25)}` : "none",
                    "&:hover": {
                      boxShadow: `0 6px 20px ${alpha(rarityInfo.color, 0.25)}`,
                      borderColor: rarityInfo.color,
                    },
                  }}
                >
                  <Box>
                    {/* Topo do Card: Nome + Badges */}
                    <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 0.75 }}>
                      <Box sx={{ flex: 1, pr: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: isDark ? "#fff" : "#2c1a10", lineHeight: 1.15 }}>
                          {item.name}
                        </Typography>
                        <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                          <Chip
                            label={rarityInfo.label}
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: "0.65rem",
                              fontWeight: 800,
                              bgcolor: alpha(rarityInfo.color, 0.15),
                              color: rarityInfo.color,
                              border: `1px solid ${rarityInfo.border}`,
                            }}
                          />
                          {item.equipped && (
                            <Chip
                              icon={<CheckroomIcon sx={{ fontSize: "14px !important", color: "#4caf50 !important" }} />}
                              label="Equipado"
                              size="small"
                              sx={{ height: 18, fontSize: "0.65rem", fontWeight: 800, bgcolor: "rgba(76, 175, 80, 0.15)", color: "#4caf50" }}
                            />
                          )}
                        </Stack>
                      </Box>

                      {/* Botões de Ação */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
                        <Tooltip title="Editar Item">
                          <IconButton size="small" onClick={() => handleOpenEditModal(item)}>
                            <EditIcon fontSize="small" sx={{ color: "text.secondary" }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Remover Item">
                          <IconButton size="small" onClick={() => handleDeleteItem(item.id)}>
                            <DeleteOutlineIcon fontSize="small" color="error" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    {/* Descrição / Notas */}
                    {item.notes && (
                      <Typography variant="caption" sx={{ color: "text.secondary", display: "block", my: 0.75, whiteSpace: "pre-line" }}>
                        {item.notes}
                      </Typography>
                    )}
                  </Box>

                  {/* Rodapé: Controle Rápido de Quantidade & Peso */}
                  <Box sx={{ pt: 1, borderTop: `1px solid ${strokeColor}`, mt: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      {/* Controle de Quantidade [-] Qtd [+] */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, bgcolor: isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.04)", borderRadius: 2, p: 0.25 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleDeltaQty(item.id, -1)}
                          sx={{ p: 0.3, color: "text.secondary" }}
                        >
                          <RemoveIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        <Typography variant="body2" sx={{ fontWeight: 900, minWidth: 28, textAlign: "center" }}>
                          {item.qty || 0}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleDeltaQty(item.id, 1)}
                          sx={{ p: 0.3, color: itemColor }}
                        >
                          <AddIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>

                      {/* Peso e Toggle Equipado */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {itemWeight > 0 && (
                          <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
                            {lotWeight > 0 ? `${lotWeight.toFixed(1)} kg` : `${itemWeight} kg`}
                          </Typography>
                        )}

                        <Tooltip title={item.equipped ? "Item equipado" : "Equipar item"}>
                          <IconButton
                            size="small"
                            onClick={() => handleToggleEquipped(item.id)}
                            sx={{
                              color: item.equipped ? "#4caf50" : "text.secondary",
                              bgcolor: item.equipped ? "rgba(76, 175, 80, 0.1)" : "transparent",
                            }}
                          >
                            <ShieldIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Modal de Criação / Edição de Item */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: `1px solid ${itemBorder}`,
            bgcolor: isDark ? "#1c1410" : "#fffcf6",
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: "Cinzel", fontWeight: 900, color: itemColor }}>
          {editingId ? "Editar Item da Mochila" : "Novo Item na Mochila"}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Nome do Item"
              placeholder="ex: Poção de Cura, Corda de Seda (15m), Tocha"
              value={itemForm.name}
              onChange={(e) => setItemForm((p) => ({ ...p, name: e.target.value }))}
              fullWidth
              size="small"
              autoFocus
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Quantidade"
                  type="number"
                  value={itemForm.qty}
                  onChange={(e) => setItemForm((p) => ({ ...p, qty: Math.max(0, parseInt(e.target.value, 10) || 0) }))}
                  fullWidth
                  size="small"
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Peso Unitário (kg)"
                  type="number"
                  value={itemForm.weight}
                  onChange={(e) => setItemForm((p) => ({ ...p, weight: e.target.value }))}
                  fullWidth
                  size="small"
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </Grid>
            </Grid>

            <TextField
              select
              label="Raridade"
              value={itemForm.rarity}
              onChange={(e) => setItemForm((p) => ({ ...p, rarity: e.target.value }))}
              fullWidth
              size="small"
            >
              {RARITIES.map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: r.color }} />
                    <span>{r.label}</span>
                  </Box>
                </MenuItem>
              ))}
            </TextField>

            <FormControlLabel
              control={
                <Switch
                  checked={itemForm.equipped}
                  onChange={(e) => setItemForm((p) => ({ ...p, equipped: e.target.checked }))}
                  color="primary"
                />
              }
              label={<Typography variant="body2" sx={{ fontWeight: 800 }}>Item Equipado / Em Uso</Typography>}
            />

            <TextField
              label="Descrição / Propriedades"
              placeholder="Descreva o efeito, bônus mágicos ou detalhes do item."
              value={itemForm.notes}
              onChange={(e) => setItemForm((p) => ({ ...p, notes: e.target.value }))}
              fullWidth
              multiline
              minRows={2}
              size="small"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setModalOpen(false)} sx={{ color: "text.secondary" }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveItem}
            disabled={!itemForm.name.trim()}
            sx={{ bgcolor: itemColor, color: "#000", fontWeight: 900, "&:hover": { bgcolor: itemColor, filter: "brightness(0.92)" } }}
          >
            Salvar Item
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
