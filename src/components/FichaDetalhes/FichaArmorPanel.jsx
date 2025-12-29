//// filepath: src/components/FichaDetalhes/FichaArmorPanel.jsx
import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItemButton,
  ListItemText,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import ARMADURAS from "Array/Armaduras";

const EMPTY = {
  base: 10,
  usaEscudo: false,
  bonusTexto: "",
  armorId: null,
  armorNome: "",
  total: 10,
  propriedades: [],
};

// helper para achar armadura
const getArmorById = (id) =>
  ARMADURAS.find((a) => a.id === id) || null;

// calcula a CA base a partir da armadura + mod de Des
const computeCaBaseFromArmor = (armor, dexMod) => {
  if (!armor) return 10 + dexMod;

  // sem armadura
  if (armor.id === "nenhuma") {
    return 10 + dexMod;
  }

  // se usa modificador de Destreza
  if (armor.usaModDes) {
    const mod =
      typeof armor.limiteModDes === "number"
        ? Math.min(dexMod, armor.limiteModDes)
        : dexMod;
    return armor.caBase + mod;
  }

  // armaduras pesadas não usam (nem penalizam) Destreza
  return armor.caBase;
};

export default function FichaArmorPanel({ value, onSave, dexMod = 0 }) {
  const original = value || EMPTY;

  const [state, setState] = useState({
    ...EMPTY,
    ...original,
    base:
      typeof original.base === "number"
        ? original.base
        : typeof original.total === "number"
        ? original.total
        : 10,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [propInput, setPropInput] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    if (!value) {
      setState(EMPTY);
      setPropInput("");
      setEditingIndex(null);
      return;
    }

    setState((prev) => {
      const armor = getArmorById(value.armorId);
      const autoBase = armor
        ? computeCaBaseFromArmor(armor, dexMod)
        : prev.base ?? 10;

      return {
        ...prev,
        ...value,
        propriedades: value.propriedades || [],
        base:
          typeof value.base === "number"
            ? value.base
            : typeof value.total === "number"
            ? value.total
            : autoBase,
      };
    });
  }, [value, dexMod]);

  const handleBaseChange = (e) => {
    const onlyDigits = e.target.value.replace(/[^\d]/g, "");
    setState((prev) => ({
      ...prev,
      base: onlyDigits === "" ? "" : Number(onlyDigits),
    }));
  };

  const handleShieldToggle = (e) => {
    const checked = e.target.checked;
    setState((prev) => ({ ...prev, usaEscudo: checked }));
  };

  const handleArmorSelect = (armor) => {
    const armorData = getArmorById(armor.id) || armor;
    const newBase = computeCaBaseFromArmor(armorData, dexMod);

    setState((prev) => ({
      ...prev,
      armorId: armorData.id,
      armorNome: armorData.nome,
      base: newBase,
    }));
    setModalOpen(false);
  };

  // propriedades / bônus extras
  const handlePropAddOrUpdate = () => {
    const texto = propInput.trim();
    if (!texto) return;

    setState((prev) => {
      const list = [...(prev.propriedades || [])];
      if (editingIndex != null) {
        list[editingIndex] = texto;
      } else {
        list.push(texto);
      }
      return { ...prev, propriedades: list };
    });

    setPropInput("");
    setEditingIndex(null);
  };

  const handlePropEdit = (index) => {
    const prop = state.propriedades?.[index];
    if (!prop) return;
    setPropInput(prop);
    setEditingIndex(index);
  };

  const handlePropDelete = (index) => {
    setState((prev) => ({
      ...prev,
      propriedades: (prev.propriedades || []).filter((_, i) => i !== index),
    }));
    if (editingIndex === index) {
      setPropInput("");
      setEditingIndex(null);
    }
  };

  const baseCa = state.base === "" ? 0 : Number(state.base || 0);
  const totalCa = baseCa + (state.usaEscudo ? 2 : 0);

  const normalizedOriginal = {
    ...EMPTY,
    ...original,
    propriedades: original.propriedades || [],
    base:
      typeof original.base === "number"
        ? original.base
        : typeof original.total === "number"
        ? original.total
        : 10,
  };

  const changed =
    normalizedOriginal.base !== baseCa ||
    !!normalizedOriginal.usaEscudo !== !!state.usaEscudo ||
    (normalizedOriginal.bonusTexto || "") !== (state.bonusTexto || "") ||
    (normalizedOriginal.armorId || null) !== (state.armorId || null) ||
    JSON.stringify(normalizedOriginal.propriedades || []) !==
      JSON.stringify(state.propriedades || []);

  const handleSave = () => {
    const safe = {
      base: baseCa,
      usaEscudo: !!state.usaEscudo,
      bonusTexto: state.bonusTexto || "",
      armorId: state.armorId || null,
      armorNome: state.armorNome || "",
      total: totalCa,
      propriedades: state.propriedades || [],
    };
    onSave?.(safe);
  };

  const selectedArmor =
    ARMADURAS.find((a) => a.id === state.armorId) ||
    ARMADURAS.find((a) => a.id === "nenhuma") ||
    null;

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          textAlign: "center",
          borderWidth: 2,
          borderStyle: "solid",
          borderColor: state.usaEscudo ? "primary.main" : "divider",
          bgcolor: state.usaEscudo
            ? "rgba(25, 118, 210, 0.08)"
            : "background.paper",
          transition: "background-color 0.2s, border-color 0.2s",
        }}
      >
        <Typography variant="subtitle2">Classe de Armadura</Typography>

        {/* CA total em destaque */}
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" sx={{ opacity: 0.75 }}>
            CA Total
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1 }}>
            {totalCa}
          </Typography>
        </Box>

        {/* Campo de base da CA */}
        <Box
          sx={{
            mt: 1.5,
            display: "flex",
            justifyContent: "center",
            gap: 1,
            alignItems: "center",
          }}
        >
          <TextField
            label="CA base"
            size="small"
            type="number"
            value={state.base}
            onChange={handleBaseChange}
            inputProps={{ min: 0 }}
          />
        </Box>

        {/* Escudo */}
        <Box
          sx={{
            mt: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
          }}
        >
          <Checkbox
            size="small"
            checked={!!state.usaEscudo}
            onChange={handleShieldToggle}
          />
          <Typography variant="caption">
            Usando escudo? (+2 CA)
          </Typography>
        </Box>

        {/* Armadura selecionada + botão para trocar */}
        <Divider sx={{ my: 1 }} />

        <Box sx={{ mb: 1 }}>
          <Typography variant="caption" sx={{ display: "block", mb: 0.5 }}>
            Armadura
          </Typography>

          {selectedArmor ? (
            <>
              <Chip
                label={`${selectedArmor.nome} (${selectedArmor.categoria})`}
                size="small"
                sx={{ mb: 0.5 }}
              />
              <Typography
                variant="caption"
                sx={{ display: "block", opacity: 0.8 }}
              >
                CA: {selectedArmor.caFormula} | Força:{" "}
                {selectedArmor.forcaMin ?? "—"} | Furtividade:{" "}
                {selectedArmor.furtividade} | Peso: {selectedArmor.peso}
              </Typography>
              <Typography
                variant="caption"
                sx={{ display: "block", mt: 0.25, opacity: 0.8 }}
              >
                {selectedArmor.descricao}
              </Typography>
            </>
          ) : (
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Nenhuma armadura selecionada
            </Typography>
          )}

          <Box sx={{ mt: 0.75 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setModalOpen(true)}
            >
              Escolher armadura
            </Button>
          </Box>
        </Box>

        {/* Propriedades extras (lista) */}
        <Divider sx={{ my: 1 }} />

        <Typography variant="caption" sx={{ display: "block", mb: 0.5 }}>
          Propriedades / bônus de itens
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            mb: 1,
          }}
        >
          <TextField
            label={
              editingIndex != null ? "Editar propriedade" : "Nova propriedade"
            }
            size="small"
            value={propInput}
            onChange={(e) => setPropInput(e.target.value)}
            fullWidth
          />
          <Button
            size="small"
            variant="contained"
            onClick={handlePropAddOrUpdate}
          >
            {editingIndex != null ? "Atualizar" : "Adicionar"}
          </Button>
        </Box>

        <Box sx={{ maxHeight: 100, overflowY: "auto" }}>
          {(state.propriedades || []).map((prop, index) => (
            <Box
              key={`${prop}-${index}`}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mb: 0.5,
              }}
            >
              <Chip label={prop} size="small" />
              <IconButton
                size="small"
                onClick={() => handlePropEdit(index)}
              >
                <EditIcon fontSize="inherit" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handlePropDelete(index)}
              >
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </Box>
          ))}

          {(!state.propriedades || state.propriedades.length === 0) && (
            <Typography variant="caption" sx={{ opacity: 0.6 }}>
              Nenhuma propriedade adicionada ainda.
            </Typography>
          )}
        </Box>

        {/* Observações livres (opcional, se quiser manter) */}
        {/* 
        <TextField
          label="Anotações extras"
          size="small"
          value={state.bonusTexto}
          onChange={(e) =>
            setState((prev) => ({ ...prev, bonusTexto: e.target.value }))
          }
          fullWidth
          multiline
          minRows={1}
          sx={{ mt: 1 }}
        />
        */}

        {/* Botão salvar */}
        <Box sx={{ mt: 1.5 }}>
          <Button
            size="small"
            variant="contained"
            onClick={handleSave}
            disabled={!changed}
          >
            Salvar
          </Button>
        </Box>
      </Paper>

      {/* Modal de seleção de armadura */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Selecionar Armadura</DialogTitle>
        <DialogContent dividers>
          <List dense>
            {ARMADURAS.filter((a) => a.categoria !== "Escudo").map((armor) => (
              <ListItemButton
                key={armor.id}
                selected={armor.id === state.armorId}
                onClick={() => handleArmorSelect(armor)}
              >
                <ListItemText
                  primary={`${armor.nome} (${armor.categoria})`}
                  secondary={`${armor.caFormula} • Força: ${
                    armor.forcaMin ?? "—"
                  } • Furtividade: ${armor.furtividade} • Peso: ${
                    armor.peso
                  }`}
                />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}