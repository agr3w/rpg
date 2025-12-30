import React, { useEffect, useMemo, useState } from "react";
import {
  Stack,
  Typography,
  Divider,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Paper,
  Box
} from "@mui/material";
import { database, firebase } from "APIs/firebaseConfig";
import RpgSection from "components/RpgSection";
import Inventory2Icon from '@mui/icons-material/Inventory2';

export default function LootPanel({
  uid,
  campaignId,
  sessionRef,
  session,
  fichas = [],
  linkedFichaId,
  setStatus,
}) {
  const [lootList, setLootList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [targetFichaId, setTargetFichaId] = useState(linkedFichaId || "");
  const [itemName, setItemName] = useState("");
  const [qty, setQty] = useState(1);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!sessionRef) {
      setLoading(false);
      return;
    }
    const ref = sessionRef.child("loot");

    const handle = (snap) => {
      const obj = snap.val() || {};
      const arr = Object.values(obj).filter(Boolean);
      arr.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      setLootList(arr);
      setLoading(false);
    };

    ref.on("value", handle);
    return () => ref.off("value", handle);
  }, [sessionRef]);

  useEffect(() => {
    if (linkedFichaId) setTargetFichaId((prev) => prev || linkedFichaId);
  }, [linkedFichaId]);

  const fichasOptions = useMemo(
    () => fichas.map((f) => ({ id: f.id, name: f.nome || f.id })),
    [fichas]
  );

  const fichasById = useMemo(() => {
    const m = {};
    fichas.forEach((f) => {
      if (f?.id) m[f.id] = f;
    });
    return m;
  }, [fichas]);

  const handleAddLoot = async () => {
    if (!uid || !sessionRef || !itemName.trim() || !targetFichaId) return;

    setSaving(true);
    setStatus?.({ type: "info", msg: "" });

    try {
      const baseItem = {
        name: itemName.trim(),
        qty: Number(qty) || 1,
        targetFichaId,
        campaignId,
        sessionId: sessionRef.key,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
      };

      const lootRef = sessionRef.child("loot").push();
      await lootRef.set({
        id: lootRef.key,
        ...baseItem,
      });

      const fichasRef = database.ref(`fichas/${uid}`);
      const snap = await fichasRef.orderByChild("id").equalTo(targetFichaId).once("value");
      const fichasObj = snap.val() || {};
      const key = Object.keys(fichasObj)[0];

      if (!key) throw new Error("Ficha não encontrada para receber o loot.");

      const backpackRef = fichasRef.child(`${key}/inventory/backpack`).push();

      await backpackRef.set({
        id: backpackRef.key,
        ...baseItem,
      });

      setItemName("");
      setQty(1);
      setStatus?.({
        type: "success",
        msg: "Loot adicionado na mochila da ficha.",
      });
    } catch (e) {
      console.error(e);
      setStatus?.({
        type: "error",
        msg: e?.message || "Erro ao adicionar loot.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: "#fdfbf7",
        border: "1px solid rgba(92, 64, 51, 0.2)",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Inventory2Icon sx={{ color: "#bf8f00" }} />
        <Typography variant="h6" sx={{ fontFamily: "Cinzel", fontWeight: 800, color: "#2c1a10" }}>
          Tesouros & Loot
        </Typography>
      </Stack>

      <Stack spacing={2}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Stack direction="row" spacing={1}>
            <TextField
              size="small"
              label="Item"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Espada +1"
              fullWidth
            />
            <TextField
              size="small"
              label="Qtd"
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              sx={{ width: 70 }}
            />
          </Stack>
          
          <Stack direction="row" spacing={1}>
            <FormControl size="small" fullWidth>
              <InputLabel>Destino (Ficha)</InputLabel>
              <Select
                value={targetFichaId}
                label="Destino (Ficha)"
                onChange={(e) => setTargetFichaId(e.target.value)}
              >
                {fichasOptions.map((f) => (
                  <MenuItem key={f.id} value={f.id}>{f.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleAddLoot}
              disabled={!itemName.trim() || !targetFichaId || saving}
              sx={{ bgcolor: "#2c1a10", minWidth: 100 }}
            >
              Salvar
            </Button>
          </Stack>
        </Box>

        <Divider />

        {loading ? (
          <CircularProgress size={20} sx={{ alignSelf: "center" }} />
        ) : lootList.length === 0 ? (
          <Typography variant="caption" sx={{ textAlign: "center", fontStyle: "italic", opacity: 0.5 }}>
            Nenhum tesouro encontrado.
          </Typography>
        ) : (
          <Stack spacing={0.5}>
            {lootList.map((l) => (
              <Box 
                key={l.id} 
                sx={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  p: 0.5, 
                  borderBottom: "1px dashed rgba(0,0,0,0.1)" 
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#2c1a10" }}>
                  {l.qty}x {l.name}
                </Typography>
                <Typography variant="caption" sx={{ color: "#833c0b" }}>
                  → {fichasById[l.targetFichaId]?.nome || "Desconhecido"}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}