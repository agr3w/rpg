import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AddLinkRoundedIcon from "@mui/icons-material/AddLinkRounded";
import { database, firebase } from "APIs/firebaseConfig";

function normalizeKey(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const STATUS = [
  { value: "ativa", label: "Ativa" },
  { value: "pendente", label: "Pendente" },
  { value: "concluida", label: "Concluída" },
];

function statusColor(status) {
  switch (status) {
    case "concluida":
      return "success";
    case "ativa":
      return "warning";
    default:
      return "default";
  }
}

function pushQuestTimelineEvent({ uid, campaignId, questId, session, type, status, note }) {
  if (!uid || !campaignId || !questId) return Promise.resolve();
  const timelineRef = database.ref(`users/${uid}/campaigns/${campaignId}/quests/${questId}/timeline`).push();
  const eventId = timelineRef.key;

  return timelineRef.set({
    id: eventId,
    type: type || "update",
    questId,
    sessionId: session?.id || "",
    sessionTitle: session?.title || "",
    status: status || "",
    note: note || "",
    occurredAt: firebase.database.ServerValue.TIMESTAMP,
    createdAt: firebase.database.ServerValue.TIMESTAMP,
  });
}

export default function QuestsPanel({ uid, campaignId, sessionRef, session, setStatus }) {
  const [options, setOptions] = useState([]); // array de strings (títulos)
  const [questTitle, setQuestTitle] = useState("");
  const [questNote, setQuestNote] = useState("");
  const [questStatus, setQuestStatus] = useState("ativa");
  const [followOpen, setFollowOpen] = useState(false);
  const [followQuest, setFollowQuest] = useState(null);
  const [followTitle, setFollowTitle] = useState("");
  const [followNote, setFollowNote] = useState("");

  const questsInSession = useMemo(() => {
    const obj = session?.quests || {};
    const arr = Object.values(obj);
    arr.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
    return arr;
  }, [session]);

  useEffect(() => {
    if (!uid || !campaignId) return;

    const idxRef = database.ref(`users/${uid}/campaigns/${campaignId}/questIndex`);
    const handle = (snap) => {
      const data = snap.val() || {};
      const arr = Object.values(data)
        .map((x) => x?.title)
        .filter(Boolean)
        .sort((a, b) => String(a).localeCompare(String(b), "pt-BR"));
      setOptions(arr);
    };

    idxRef.on("value", handle);
    return () => idxRef.off("value", handle);
  }, [uid, campaignId]);

  const addQuest = async () => {
    setStatus?.({ type: "info", msg: "" });
    if (!uid || !campaignId || !sessionRef) return;

    const title = String(questTitle || "").trim();
    const note = String(questNote || "").trim();
    const status = String(questStatus || "ativa");

    if (!title) {
      setStatus?.({ type: "warning", msg: "Informe o título da quest." });
      return;
    }

    const key = normalizeKey(title);
    if (!key) {
      setStatus?.({ type: "warning", msg: "Título inválido para quest." });
      return;
    }

    try {
      // 1) resolve / cria quest master
      const idxRef = database.ref(`users/${uid}/campaigns/${campaignId}/questIndex/${key}`);
      const idxSnap = await idxRef.once("value");
      const idx = idxSnap.val();

      let questId = idx?.questId;

      if (!questId) {
        const questRef = database.ref(`users/${uid}/campaigns/${campaignId}/quests`).push();
        questId = questRef.key;

        await questRef.set({
          id: questId,
          indexKey: key, // ✅ add (pra manter o questIndex consistente no editar)
          title,
          description: "",
          tags: [],
          currentStatus: status,
          lastSeenNote: note || "",
          lastSeenAt: firebase.database.ServerValue.TIMESTAMP,
          lastSeenSessionId: session?.id || "",
          createdAt: firebase.database.ServerValue.TIMESTAMP,
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
        });

        await idxRef.set({
          key,
          questId,
          title,
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
        });
      } else {
        // mantém índice atualizado + “última vez visto”
        await idxRef.update({
          title,
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
        });

        await database.ref(`users/${uid}/campaigns/${campaignId}/quests/${questId}`).update({
          title,
          currentStatus: status,
          lastSeenNote: note || "",
          lastSeenAt: firebase.database.ServerValue.TIMESTAMP,
          lastSeenSessionId: session?.id || "",
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
        });
      }

      // 2) evita duplicar na sessão por questId
      const already = questsInSession.some((q) => q?.questId && q.questId === questId);
      if (already) {
        setQuestTitle("");
        setQuestNote("");
        setQuestStatus("ativa");
        setStatus?.({ type: "info", msg: "Essa quest já está registrada nesta sessão." });
        return;
      }

      // 3) grava no log da sessão (snapshot/registro da sessão)
      const rowRef = sessionRef.child("quests").push();
      await rowRef.set({
        id: rowRef.key,
        questId,
        title,
        status,
        note: note || "",
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });

      // ✅ Depois de ter questId garantido:
      await pushQuestTimelineEvent({
        uid,
        campaignId,
        questId,
        session,
        type: "seen",
        status,
        note,
      });

      setQuestTitle("");
      setQuestNote("");
      setQuestStatus("ativa");
      setStatus?.({ type: "success", msg: "Quest adicionada na sessão." });
    } catch (e) {
      setStatus?.({ type: "error", msg: e?.message || "Erro ao adicionar quest." });
    }
  };

  const removeQuestFromSession = async (rowId) => {
    setStatus?.({ type: "info", msg: "" });
    if (!sessionRef || !rowId) return;

    try {
      await sessionRef.child(`quests/${rowId}`).remove();
      setStatus?.({ type: "success", msg: "Quest removida da sessão." });
    } catch (e) {
      setStatus?.({ type: "error", msg: e?.message || "Erro ao remover quest." });
    }
  };

  const updateQuestStatus = async (row, newStatus) => {
    setStatus?.({ type: "info", msg: "" });
    if (!uid || !campaignId || !sessionRef || !row?.id) return;

    try {
      // atualiza o registro da sessão
      await sessionRef.child(`quests/${row.id}`).update({
        status: newStatus,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });

      // atualiza a quest master também (status global da campanha)
      if (row?.questId) {
        await database.ref(`users/${uid}/campaigns/${campaignId}/quests/${row.questId}`).update({
          currentStatus: newStatus,
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
        });
      }

      // ✅ cria evento na timeline
      await pushQuestTimelineEvent({
        uid,
        campaignId,
        questId: row?.questId,
        session,
        type: "status",
        status: newStatus,
        note: row?.note || "",
      });
    } catch (e) {
      setStatus?.({ type: "error", msg: e?.message || "Erro ao atualizar status da quest." });
    }
  };

  const markConcluded = async (row) => {
    setStatus?.({ type: "info", msg: "" });
    if (!uid || !campaignId || !sessionRef || !row?.id) return;

    try {
      await sessionRef.child(`quests/${row.id}`).update({
        status: "concluida",
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });

      if (row?.questId) {
        await database.ref(`users/${uid}/campaigns/${campaignId}/quests/${row.questId}`).update({
          currentStatus: "concluida",
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
        });
      }

      // ✅ cria evento na timeline
      await pushQuestTimelineEvent({
        uid,
        campaignId,
        questId: row?.questId,
        session,
        type: "concluded",
        status: "concluida",
        note: row?.note || "",
      });

      setStatus?.({ type: "success", msg: "Quest marcada como concluída." });
    } catch (e) {
      setStatus?.({ type: "error", msg: e?.message || "Erro ao concluir quest." });
    }
  };

  const openFollowUpDialog = (row) => {
    setFollowQuest(row);
    setFollowTitle(`Follow-up: ${row?.title || "Quest"}`);
    setFollowNote(row?.note || "");
    setFollowOpen(true);
  };

  const createFollowUp = async () => {
    setStatus?.({ type: "info", msg: "" });
    if (!uid || !campaignId || !followQuest?.questId) return;

    const t = String(followTitle || "").trim();
    const n = String(followNote || "").trim();

    if (!t) {
      setStatus?.({ type: "warning", msg: "Informe o título do follow-up." });
      return;
    }

    try {
      const hookRef = database.ref(`users/${uid}/campaigns/${campaignId}/hooks`).push();
      const hookId = hookRef.key;

      await hookRef.set({
        id: hookId,
        title: t,
        note: n || "",
        status: "ativo",
        sourceQuestId: followQuest.questId,
        createdFromSessionId: session?.id || "",
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });

      await database.ref(`users/${uid}/campaigns/${campaignId}/quests/${followQuest.questId}/followUps/${hookId}`).set(true);

      setFollowOpen(false);
      setFollowQuest(null);
      setFollowTitle("");
      setFollowNote("");
      setStatus?.({ type: "success", msg: "Follow-up criado (hook)." });
    } catch (e) {
      setStatus?.({ type: "error", msg: e?.message || "Erro ao criar follow-up." });
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 2.25, borderRadius: 3, border: "1px solid rgba(0,0,0,0.10)" }}>
      <Stack spacing={1.25}>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ gap: 1, flexWrap: "wrap" }}>
          <Typography variant="h6" sx={{ fontWeight: 950 }}>
            Quests
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.75 }}>
            (Em breve: página de quests + links completos)
          </Typography>
        </Stack>

        <Divider />

        <Stack direction={{ xs: "column", md: "row" }} spacing={1} alignItems={{ md: "center" }}>
          <Autocomplete
            freeSolo
            options={options}
            value={questTitle}
            onInputChange={(_, v) => setQuestTitle(v)}
            renderInput={(params) => <TextField {...params} label="Título da quest" placeholder="Ex.: Investigar o sumiço na taverna" />}
            sx={{ flex: 2 }}
          />

          <Select
            value={questStatus}
            onChange={(e) => setQuestStatus(e.target.value)}
            size="small"
            sx={{ minWidth: 160, flex: { xs: "unset", md: 0 } }}
          >
            {STATUS.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </Select>

          <TextField
            label="Nota (opcional)"
            value={questNote}
            onChange={(e) => setQuestNote(e.target.value)}
            placeholder='Ex.: "o taverneiro mentiu"'
            sx={{ flex: 2 }}
          />

          <Button variant="outlined" onClick={addQuest}>
            Adicionar
          </Button>
        </Stack>

        {questsInSession.length === 0 ? (
          <Typography sx={{ opacity: 0.8 }}>Nenhuma quest registrada nesta sessão.</Typography>
        ) : (
          <Stack spacing={1}>
            {questsInSession.map((q) => (
              <Box
                key={q.id}
                sx={{
                  p: 1.1,
                  borderRadius: 2,
                  border: "1px solid rgba(0,0,0,0.10)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                    <Chip label="Quest" size="small" variant="outlined" />
                    <Chip
                      label={STATUS.find((s) => s.value === q.status)?.label || "Pendente"}
                      size="small"
                      color={statusColor(q.status)}
                      variant="outlined"
                    />
                    <Typography sx={{ fontWeight: 900, color: "#2c1a10" }} noWrap>
                      {q.title || "—"}
                    </Typography>
                  </Stack>

                  {q.note ? (
                    <Typography variant="caption" sx={{ opacity: 0.85 }}>
                      Nota: {q.note}
                    </Typography>
                  ) : null}
                </Stack>

                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Select
                    value={q.status || "pendente"}
                    onChange={(e) => updateQuestStatus(q, e.target.value)}
                    size="small"
                    sx={{ height: 32 }}
                  >
                    {STATUS.map((s) => (
                      <MenuItem key={s.value} value={s.value}>
                        {s.label}
                      </MenuItem>
                    ))}
                  </Select>

                  <Tooltip title="Marcar concluída">
                    <span>
                      <IconButton size="small" onClick={() => markConcluded(q)} disabled={q.status === "concluida"}>
                        <CheckCircleRoundedIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>

                  <Tooltip title="Criar follow-up (hook)">
                    <IconButton size="small" onClick={() => openFollowUpDialog(q)} disabled={!q.questId}>
                      <AddLinkRoundedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Abrir (em breve)">
                    <span>
                      <IconButton size="small" disabled>
                        <OpenInNewRoundedIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>

                  <Tooltip title="Remover da sessão">
                    <IconButton size="small" onClick={() => removeQuestFromSession(q.id)}>
                      <DeleteRoundedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Stack>

      <Dialog open={followOpen} onClose={() => setFollowOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Criar follow-up (hook)</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1.25} sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              Quest: <strong>{followQuest?.title || "—"}</strong>
            </Typography>
            <TextField label="Título do hook" value={followTitle} onChange={(e) => setFollowTitle(e.target.value)} fullWidth />
            <TextField
              label="Nota (opcional)"
              value={followNote}
              onChange={(e) => setFollowNote(e.target.value)}
              fullWidth
              multiline
              minRows={3}
              placeholder="Próximo passo, pista, NPC envolvido..."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFollowOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={createFollowUp} sx={{ fontWeight: 900 }}>
            Criar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}