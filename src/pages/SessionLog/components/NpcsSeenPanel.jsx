import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Autocomplete,
  Paper,
} from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import PersonSearchIcon from '@mui/icons-material/PersonSearch'; // Ícone temático
import { database, firebase } from "APIs/firebaseConfig";
import { useNavigate } from "react-router-dom";
import RpgSection from "components/RpgSection";
import { RPG_TOKENS } from "theme/rpgTokens";

function normalizeKey(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function NpcsSeenPanel({ uid, campaignId, sessionRef, session, setStatus }) {
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);
  const [npcName, setNpcName] = useState("");
  const [quickNote, setQuickNote] = useState("");

  const npcsSeen = useMemo(() => {
    const obj = session?.npcsSeen || {};
    const arr = Object.values(obj);
    arr.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
    return arr;
  }, [session]);

  useEffect(() => {
    if (!uid || !campaignId) return;

    const idxRef = database.ref(`users/${uid}/campaigns/${campaignId}/npcIndex`);

    const handle = (snap) => {
      const data = snap.val();
      const arr = data ? Object.values(data) : [];
      arr.sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "pt-BR"));
      setOptions(arr.map((x) => x.name).filter(Boolean));
    };

    idxRef.on("value", handle);
    return () => idxRef.off("value", handle);
  }, [uid, campaignId]);

  const addNpc = async () => {
    setStatus?.({ type: "info", msg: "" });
    if (!uid || !campaignId || !sessionRef) return;

    const name = String(npcName || "").trim();
    const note = String(quickNote || "").trim();
    if (!name) {
      setStatus?.({ type: "warning", msg: "Informe o nome do NPC." });
      return;
    }

    const key = normalizeKey(name);
    if (!key) {
      setStatus?.({ type: "warning", msg: "Nome inválido para NPC." });
      return;
    }

    try {
      const idxRef = database.ref(`users/${uid}/campaigns/${campaignId}/npcIndex/${key}`);
      const idxSnap = await idxRef.once("value");
      const idx = idxSnap.val();

      let npcId = idx?.npcId;

      if (!npcId) {
        const npcRef = database.ref(`users/${uid}/campaigns/${campaignId}/npcs`).push();
        npcId = npcRef.key;

        await npcRef.set({
          id: npcId,
          name,
          description: "",
          voice: "",
          tags: [],
          relationships: [],
          imageUrl: "",
          lastSeenNote: note || "",
          lastSeenAt: firebase.database.ServerValue.TIMESTAMP,
          lastSeenSessionId: session?.id || "",
          createdAt: firebase.database.ServerValue.TIMESTAMP,
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
        });

        await idxRef.set({
          key,
          npcId,
          name,
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
        });
      } else {
        await idxRef.update({
          name,
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
        });

        await database.ref(`users/${uid}/campaigns/${campaignId}/npcs/${npcId}`).update({
          lastSeenNote: note || "",
          lastSeenAt: firebase.database.ServerValue.TIMESTAMP,
          lastSeenSessionId: session?.id || "",
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
        });
      }

      const already = npcsSeen.some((n) => n?.npcId && n.npcId === npcId);
      if (already) {
        setNpcName("");
        setQuickNote("");
        setStatus?.({ type: "info", msg: "Esse NPC já está marcado como visto nesta sessão." });
        return;
      }

      const rowRef = sessionRef.child("npcsSeen").push();
      await rowRef.set({
        id: rowRef.key,
        npcId,
        name,
        note: note || "",
        createdAt: firebase.database.ServerValue.TIMESTAMP,
      });

      setNpcName("");
      setQuickNote("");
      setStatus?.({ type: "success", msg: "NPC adicionado à sessão." });
    } catch (e) {
      setStatus?.({ type: "error", msg: e?.message || "Erro ao adicionar NPC." });
    }
  };

  const removeNpc = async (rowId) => {
    setStatus?.({ type: "info", msg: "" });
    if (!sessionRef || !rowId) return;

    try {
      await sessionRef.child(`npcsSeen/${rowId}`).remove();
      setStatus?.({ type: "success", msg: "NPC removido da sessão." });
    } catch (e) {
      setStatus?.({ type: "error", msg: e?.message || "Erro ao remover NPC." });
    }
  };

  const openNpc = (npc) => {
    if (!npc?.npcId) return;
    navigate(`/npcs/${encodeURIComponent(npc.npcId)}?c=${encodeURIComponent(campaignId)}`);
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
        <PersonSearchIcon sx={{ color: "#bf8f00" }} />
        <Typography variant="h6" sx={{ fontFamily: "Cinzel", fontWeight: 800, color: "#2c1a10" }}>
          NPCs Encontrados
        </Typography>
      </Stack>

      <Stack spacing={2}>
        {/* Área de Input Compacta */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Autocomplete
            freeSolo
            options={options}
            value={npcName}
            onInputChange={(_, v) => setNpcName(v)}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Nome do NPC" 
                placeholder="Ex.: Mestre da Taverna" 
                size="small"
                sx={{ bgcolor: "#fff" }}
              />
            )}
          />
          <Stack direction="row" spacing={1}>
            <TextField
              label="Nota rápida"
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
              placeholder='Ex.: "Suspeito..."'
              size="small"
              fullWidth
              sx={{ bgcolor: "#fff" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  addNpc();
                }
              }}
            />
            <Button 
              variant="contained" 
              onClick={addNpc}
              sx={{ bgcolor: "#2c1a10", minWidth: 80 }}
            >
              Add
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ borderColor: "rgba(92, 64, 51, 0.1)" }} />

        {/* Lista de NPCs */}
        {npcsSeen.length === 0 ? (
          <Typography variant="caption" sx={{ textAlign: "center", fontStyle: "italic", opacity: 0.5 }}>
            Ninguém digno de nota apareceu.
          </Typography>
        ) : (
          <Stack spacing={0.5}>
            {npcsSeen.map((n) => (
              <Box
                key={n.id}
                sx={{
                  p: 1,
                  borderRadius: 1,
                  borderBottom: "1px dashed rgba(92, 64, 51, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  "&:last-child": { borderBottom: "none" }
                }}
              >
                <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#2c1a10", lineHeight: 1.2 }}>
                    {n.name || "—"}
                  </Typography>
                  {n.note && (
                    <Typography variant="caption" sx={{ color: "rgba(44, 26, 16, 0.7)", fontStyle: "italic" }}>
                      "{n.note}"
                    </Typography>
                  )}
                </Box>

                <Stack direction="row" spacing={0}>
                  <Tooltip title="Ver Detalhes">
                    <IconButton size="small" onClick={() => openNpc(n)} disabled={!n.npcId} sx={{ color: "#833c0b" }}>
                      <OpenInNewRoundedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Remover">
                    <IconButton size="small" onClick={() => removeNpc(n.id)} sx={{ color: "rgba(44, 26, 16, 0.4)" }}>
                      <DeleteRoundedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}