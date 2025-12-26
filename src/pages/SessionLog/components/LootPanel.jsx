import React, { useEffect, useMemo, useState } from "react";
import firebase from "firebase/compat/app";
import {
  Paper,
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
} from "@mui/material";
import { database } from "APIs/firebaseConfig";

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

      // 1) registra na sessão (histórico de loot)
      const lootRef = sessionRef.child("loot").push();
      await lootRef.set({
        id: lootRef.key,
        ...baseItem,
      });

      // 2) joga direto na mochila da ficha vinculada
      const fichasRef = database.ref(`fichas/${uid}`);
      const snap = await fichasRef
        .orderByChild("id")
        .equalTo(targetFichaId)
        .once("value");
      const fichasObj = snap.val() || {};
      const key = Object.keys(fichasObj)[0];

      if (!key) throw new Error("Ficha não encontrada para receber o loot.");

      const backpackRef = fichasRef
        .child(`${key}/inventory/backpack`)
        .push();

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
        p: 2.25,
        borderRadius: 3,
        border: "1px solid rgba(0,0,0,0.10)",
      }}
    >
      <Stack spacing={1.25}>
        <Typography variant="h6" sx={{ fontWeight: 950 }}>
          Loot
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.75 }}>
          Adicione recompensas desta sessão direto na mochila da ficha
          vinculada.
        </Typography>

        <Divider />

        {/* Form de criação */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1}
          alignItems={{ md: "flex-end" }}
        >
          <TextField
            label="Item"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Ex.: Espada longa +1"
            sx={{ flex: 2 }}
          />

          <TextField
            label="Qtd."
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            sx={{ width: 110 }}
            inputProps={{ min: 1 }}
          />

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="loot-ficha-label">Ficha</InputLabel>
            <Select
              labelId="loot-ficha-label"
              label="Ficha"
              value={targetFichaId}
              onChange={(e) => setTargetFichaId(e.target.value)}
            >
              {fichasOptions.map((f) => (
                <MenuItem key={f.id} value={f.id}>
                  {f.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={handleAddLoot}
            disabled={!itemName.trim() || !targetFichaId || saving}
            sx={{ fontWeight: 900, whiteSpace: "nowrap" }}
          >
            {saving ? "Salvando…" : "Adicionar loot"}
          </Button>
        </Stack>

        <Divider />

        {/* Lista de loot desta sessão */}
        {loading ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <CircularProgress size={18} />
            <Typography sx={{ opacity: 0.8 }}>
              Carregando loot…
            </Typography>
          </Stack>
        ) : lootList.length === 0 ? (
          <Typography sx={{ opacity: 0.8 }}>
            Nenhum loot registrado nesta sessão.
          </Typography>
        ) : (
          <Stack spacing={0.5}>
            {lootList.map((l) => (
              <Typography key={l.id} variant="body2" sx={{ opacity: 0.9 }}>
                {`${l.qty || 1}× ${l.name}`} —{" "}
                {fichasById[l.targetFichaId]?.nome || l.targetFichaId}
              </Typography>
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}