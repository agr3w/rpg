import React, { useMemo, useState } from "react";
import { Box, Button, Chip, Divider, Stack, TextField, Typography, Paper } from "@mui/material";
import { database, firebase } from "APIs/firebaseConfig";
import { computeLevelFromXp } from "Utils/xpTable";
import RpgSection from "components/RpgSection";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

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
          updates[`xpEntries/${e.id}/appliedToFichaAt`] = firebase.database.ServerValue.TIMESTAMP;
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
    <Paper 
      elevation={0}
      sx={{ 
        p: 2, 
        borderRadius: 2, 
        bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "#fdfbf7"), 
        border: (t) => `1px solid ${t.palette.rpg?.stroke || "rgba(92, 64, 51, 0.2)"}`,
        position: "relative"
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <AutoAwesomeIcon sx={{ color: "secondary.main" }} />
        <Typography variant="h6" sx={{ fontFamily: "Cinzel", fontWeight: 800, color: "text.primary" }}>
          Experiência (XP)
        </Typography>
      </Stack>

      <Stack spacing={2}>
        {/* Input Area */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            size="small"
            label="Valor"
            value={xpAmount}
            onChange={(e) => setXpAmount(e.target.value)}
            placeholder="100"
            sx={{ width: 80 }}
            type="number"
          />
          <TextField
            size="small"
            label="Motivo"
            value={xpReason}
            onChange={(e) => setXpReason(e.target.value)}
            placeholder="Derrotar o Dragão..."
            fullWidth
          />
          <Button 
            variant="contained" 
            onClick={addXpEntry}
            sx={{ minWidth: 40, px: 0 }}
          >
            +
          </Button>
        </Box>

        {/* Pending Action */}
        {pendingXpDelta !== 0 && (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 1.5, 
              bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(229, 179, 36, 0.1)" : "rgba(191, 143, 0, 0.1)"), 
              border: (t) => `1px dashed ${t.palette.secondary.main}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "primary.main" }}>
              Total Pendente: {pendingXpDelta > 0 ? `+${pendingXpDelta}` : pendingXpDelta} XP
            </Typography>
            <Button 
              size="small" 
              variant="outlined" 
              onClick={applyPendingXpToFicha}
              disabled={!linkedFichaId}
              sx={{ borderColor: "primary.main", color: "primary.main" }}
            >
              Aplicar
            </Button>
          </Paper>
        )}

        {/* List */}
        <Stack spacing={1} sx={{ maxHeight: 200, overflow: "auto" }}>
          {xpEntries.map((e) => (
            <Box
              key={e.id}
              sx={{
                p: 1,
                borderRadius: 1,
                bgcolor: (t) => (t.palette.mode === "dark" ? (e.appliedToFichaAt ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.06)") : (e.appliedToFichaAt ? "rgba(0,0,0,0.03)" : "#fff")),
                border: (t) => `1px solid ${t.palette.rpg?.stroke || "rgba(0,0,0,0.08)"}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
                  {Number(e.amount) >= 0 ? `+${e.amount}` : e.amount} XP
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {e.reason || "Sem motivo"}
                </Typography>
              </Box>
              {e.appliedToFichaAt && (
                <Chip label="Aplicado" size="small" sx={{ height: 20, fontSize: "0.6rem" }} />
              )}
            </Box>
          ))}
          {xpEntries.length === 0 && (
            <Typography variant="caption" sx={{ textAlign: "center", fontStyle: "italic", opacity: 0.5 }}>
              Nenhum registro de XP.
            </Typography>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}