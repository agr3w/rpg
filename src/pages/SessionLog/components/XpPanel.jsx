import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { database, firebase } from "APIs/firebaseConfig";
import { computeLevelFromXp } from "Utils/xpTable";

export default function XpPanel({ uid, linkedFichaId, sessionRef, session, setStatus }) {
  const [xpAmount, setXpAmount] = useState("");
  const [xpReason, setXpReason] = useState("");

  const xpEntries = useMemo(() => {
    const obj = session?.xpEntries || {};
    const arr = Object.values(obj);
    arr.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
    return arr;
  }, [session]);

  const pendingXpDelta = useMemo(() => {
    return xpEntries
      .filter((e) => !e.appliedToFichaAt)
      .reduce((acc, e) => acc + Number(e.amount || 0), 0);
  }, [xpEntries]);

  const addXpEntry = async () => {
    setStatus?.({ type: "info", msg: "" });
    if (!sessionRef) return;

    const amount = Number(String(xpAmount).replace(/[^\d-]/g, ""));
    if (!Number.isFinite(amount)) {
      setStatus?.({ type: "warning", msg: "XP inválido." });
      return;
    }

    const reason = String(xpReason || "").trim();

    try {
      const ref = sessionRef.child("xpEntries").push();
      await ref.set({
        id: ref.key,
        amount,
        reason: reason || "",
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        appliedToFichaAt: null,
      });

      setXpAmount("");
      setXpReason("");
      setStatus?.({ type: "success", msg: "Entrada de XP adicionada." });
    } catch (e) {
      setStatus?.({ type: "error", msg: e?.message || "Erro ao adicionar XP." });
    }
  };

  const applyPendingXpToFicha = async () => {
    setStatus?.({ type: "info", msg: "" });
    if (!uid) return;

    if (!linkedFichaId) {
      setStatus?.({
        type: "warning",
        msg: "Vincule uma ficha à campanha antes de aplicar XP.",
      });
      return;
    }
    if (!sessionRef) return;

    const delta = pendingXpDelta;
    if (!delta) {
      setStatus?.({ type: "info", msg: "Nenhum XP pendente para aplicar." });
      return;
    }

    try {
      const fichaRef = database.ref(`fichas/${uid}/${linkedFichaId}`);
      const fichaSnap = await fichaRef.once("value");
      const ficha = fichaSnap.val();

      const currentXp = Number(ficha?.xp ?? ficha?.XP ?? 0);
      const newXp = Math.max(0, currentXp + delta);
      const newLevel = computeLevelFromXp(newXp);

      await fichaRef.update({
        xp: newXp,
        level: newLevel,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });

      const updates = {};
      (session?.xpEntries ? Object.values(session.xpEntries) : [])
        .filter((e) => e && !e.appliedToFichaAt)
        .forEach((e) => {
          updates[`xpEntries/${e.id}/appliedToFichaAt`] =
            firebase.database.ServerValue.TIMESTAMP;
        });

      await sessionRef.update(updates);

      setStatus?.({
        type: "success",
        msg: `XP aplicado na ficha: ${delta >= 0 ? `+${delta}` : delta}.`,
      });
    } catch (e) {
      setStatus?.({
        type: "error",
        msg: e?.message || "Erro ao aplicar XP na ficha.",
      });
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 2.25, borderRadius: 3, border: "1px solid rgba(0,0,0,0.10)" }}>
      <Stack spacing={1.25}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ gap: 1, flexWrap: "wrap" }}>
          <Typography variant="h6" sx={{ fontWeight: 950 }}>
            XP
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label={`Pendente: ${pendingXpDelta >= 0 ? `+${pendingXpDelta}` : pendingXpDelta}`} />
            <Button
              variant="contained"
              onClick={applyPendingXpToFicha}
              disabled={!pendingXpDelta || !linkedFichaId}
            >
              Aplicar XP na ficha
            </Button>
          </Stack>
        </Stack>

        <Divider />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
          <TextField
            label="XP"
            value={xpAmount}
            onChange={(e) => setXpAmount(e.target.value)}
            placeholder="100"
            sx={{ flex: 1 }}
          />
          <TextField
            label="Por quê?"
            value={xpReason}
            onChange={(e) => setXpReason(e.target.value)}
            placeholder="Matar 2 goblins, completar quest..."
            sx={{ flex: 3 }}
          />
          <Button variant="outlined" onClick={addXpEntry}>
            Adicionar
          </Button>
        </Stack>

        <Stack spacing={1}>
          {xpEntries.length === 0 ? (
            <Typography sx={{ opacity: 0.8 }}>Nenhuma entrada de XP.</Typography>
          ) : (
            xpEntries.map((e) => (
              <Box
                key={e.id}
                sx={{
                  p: 1.25,
                  borderRadius: 2,
                  border: "1px solid rgba(0,0,0,0.10)",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <Typography sx={{ fontWeight: 900 }}>
                  {Number(e.amount) >= 0 ? `+${e.amount}` : e.amount} XP
                </Typography>
                <Typography sx={{ opacity: 0.9 }}>{e.reason || "(sem motivo)"}</Typography>
                <Chip
                  size="small"
                  label={e.appliedToFichaAt ? "Aplicado" : "Pendente"}
                  color={e.appliedToFichaAt ? "success" : "default"}
                  variant="outlined"
                />
              </Box>
            ))
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}