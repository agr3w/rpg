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
  Chip,
  Autocomplete,
} from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
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
    <RpgSection title="NPCs vistos" subtitle="Registre quem apareceu e uma nota rápida.">
      <Stack spacing={1.25}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ sm: "center" }}>
          <Autocomplete
            freeSolo
            options={options}
            value={npcName}
            onInputChange={(_, v) => setNpcName(v)}
            renderInput={(params) => (
              <TextField {...params} label="Nome do NPC" placeholder="Ex.: Mestre da Taverna" />
            )}
            sx={{ flex: 1 }}
          />
          <TextField
            label="Nota rápida (opcional)"
            value={quickNote}
            onChange={(e) => setQuickNote(e.target.value)}
            placeholder='Ex.: "parece suspeito"'
            sx={{ flex: 1 }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                addNpc();
              }
            }}
          />
          <Button variant="outlined" onClick={addNpc}>
            Adicionar
          </Button>
        </Stack>

        <Divider />

        {npcsSeen.length === 0 ? (
          <Typography sx={{ opacity: 0.8 }}>Nenhum NPC marcado nesta sessão.</Typography>
        ) : (
          <Stack spacing={1}>
            {npcsSeen.map((n) => (
              <Box
                key={n.id}
                sx={{
                  p: 1.1,
                  borderRadius: 2,
                  border: RPG_TOKENS.border,
                  background: RPG_TOKENS.cardBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                    <Chip label="NPC" size="small" variant="outlined" />
                    <Typography sx={{ fontWeight: 900, color: RPG_TOKENS.ink }} noWrap>
                      {n.name || "—"}
                    </Typography>
                  </Stack>

                  {n.note ? (
                    <Typography variant="caption" sx={{ opacity: 0.85 }}>
                      Nota: {n.note}
                    </Typography>
                  ) : null}
                </Stack>

                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Tooltip title="Abrir detalhes do NPC">
                    <span>
                      <IconButton size="small" onClick={() => openNpc(n)} disabled={!n.npcId}>
                        <OpenInNewRoundedIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>

                  <Tooltip title="Remover da sessão">
                    <IconButton size="small" onClick={() => removeNpc(n.id)}>
                      <DeleteRoundedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Stack>
    </RpgSection>
  );
}