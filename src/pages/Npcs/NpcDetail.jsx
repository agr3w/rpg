import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
  Autocomplete,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { auth, database, firebase, storage } from "APIs/firebaseConfig";
import { T_IN } from "config/transitions";
import { motion } from "framer-motion";

const DEFAULT_CAMPAIGN_ID = "default";

function parseTags(raw) {
  return String(raw || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 24);
}

function coerceRelationshipsToArray(v) {
  if (!v) return [];
  if (Array.isArray(v)) {
    return v
      .map((r) => ({
        npcId: r?.npcId || r?.id || "",
        name: r?.name || "",
        relation: r?.relation || "",
      }))
      .filter((r) => r.npcId && r.name);
  }
  // object map: { [npcId]: { npcId, name, relation } }
  return Object.values(v)
    .map((r) => ({
      npcId: r?.npcId || "",
      name: r?.name || "",
      relation: r?.relation || "",
    }))
    .filter((r) => r.npcId && r.name);
}

export default function NpcDetail() {
  const user = auth.currentUser;
  const uid = user?.uid;

  const { npcId } = useParams();
  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get("c") || DEFAULT_CAMPAIGN_ID;

  const [status, setStatus] = useState({ type: "info", msg: "" });
  const [loading, setLoading] = useState(true);
  const [npc, setNpc] = useState(null);

  const npcRef = useMemo(() => {
    if (!uid || !campaignId || !npcId) return null;
    return database.ref(`users/${uid}/campaigns/${campaignId}/npcs/${npcId}`);
  }, [uid, campaignId, npcId]);

  // campos editáveis
  const [name, setName] = useState("");
  const [voice, setVoice] = useState("");
  const [description, setDescription] = useState("");
  const [tagsRaw, setTagsRaw] = useState("");
  const [uploading, setUploading] = useState(false);

  // relacionamentos (link com outros NPCs)
  const [npcOptions, setNpcOptions] = useState([]); // { npcId, name }
  const [relTarget, setRelTarget] = useState(null);
  const [relText, setRelText] = useState("");

  // painel de links: sessões em que apareceu
  const [appearedIn, setAppearedIn] = useState([]); // { sessionId, title, createdAt }

  useEffect(() => {
    if (!npcRef) {
      setLoading(false);
      return;
    }

    const handle = (snap) => {
      const v = snap.val() || null;
      setNpc(v);

      setName(v?.name || "");
      setVoice(v?.voice || "");
      setDescription(v?.description || "");
      setTagsRaw(Array.isArray(v?.tags) ? v.tags.join(", ") : "");

      setLoading(false);
    };

    npcRef.on("value", handle);
    return () => npcRef.off("value", handle);
  }, [npcRef]);

  useEffect(() => {
    if (!uid || !campaignId) return;

    // opções pra relacionamentos (índice da campanha)
    const idxRef = database.ref(`users/${uid}/campaigns/${campaignId}/npcIndex`);
    const onIdx = (snap) => {
      const data = snap.val() || {};
      const arr = Object.values(data)
        .map((x) => ({ npcId: x?.npcId, name: x?.name }))
        .filter((x) => x.npcId && x.name && x.npcId !== npcId)
        .sort((a, b) => String(a.name).localeCompare(String(b.name), "pt-BR"));

      setNpcOptions(arr);
    };
    idxRef.on("value", onIdx);

    return () => idxRef.off("value", onIdx);
  }, [uid, campaignId, npcId]);

  useEffect(() => {
    if (!uid || !campaignId || !npcId) return;

    // “onde apareceu”: varre sessionLogs da campanha e filtra por npcId em npcsSeen
    const logsRef = database.ref(`users/${uid}/campaigns/${campaignId}/sessionLogs`);
    const onLogs = (snap) => {
      const data = snap.val() || {};
      const sessions = Object.values(data);

      const found = [];
      for (const s of sessions) {
        const npcsSeenObj = s?.npcsSeen || {};
        const rows = Object.values(npcsSeenObj);

        const row = rows.find((r) => r?.npcId === npcId);
        if (row) {
          found.push({
            sessionId: s?.id,
            title: s?.title || "Sessão",
            createdAt: s?.createdAt || 0,
            note: row?.note || "", // ✅ add
          });
        }
      }

      found.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
      setAppearedIn(found);
    };

    logsRef.on("value", onLogs);
    return () => logsRef.off("value", onLogs);
  }, [uid, campaignId, npcId]);

  const save = async () => {
    setStatus({ type: "info", msg: "" });
    if (!npcRef) return;

    const payload = {
      name: name.trim(),
      voice: voice.trim(),
      description: description.trim(),
      tags: parseTags(tagsRaw),
      updatedAt: firebase.database.ServerValue.TIMESTAMP,
    };

    try {
      await npcRef.update(payload);
      setStatus({ type: "success", msg: "NPC salvo." });
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || "Erro ao salvar NPC." });
    }
  };

  const uploadImage = async (file) => {
    setStatus({ type: "info", msg: "" });
    if (!uid || !campaignId || !npcId || !npcRef) return;
    if (!file) return;

    setUploading(true);
    try {
      const ref = storage.ref().child(`arquivos/npcs/${uid}/${campaignId}/${npcId}/${file.name}`);
      await ref.put(file);
      const url = await ref.getDownloadURL();

      await npcRef.update({
        imageUrl: url,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });

      setStatus({ type: "success", msg: "Foto do NPC atualizada." });
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || "Erro ao enviar imagem." });
    } finally {
      setUploading(false);
    }
  };

  const addOrUpdateRelationship = async () => {
    setStatus({ type: "info", msg: "" });
    if (!npcRef) return;

    const target = relTarget;
    const relation = String(relText || "").trim();

    if (!target?.npcId || !target?.name) {
      setStatus({ type: "warning", msg: "Selecione um NPC para vincular." });
      return;
    }

    try {
      await npcRef.child(`relationships/${target.npcId}`).set({
        npcId: target.npcId,
        name: target.name,
        relation,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
      });

      setRelTarget(null);
      setRelText("");
      setStatus({ type: "success", msg: "Relacionamento salvo." });
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || "Erro ao salvar relacionamento." });
    }
  };

  const removeRelationship = async (targetNpcId) => {
    setStatus({ type: "info", msg: "" });
    if (!npcRef || !targetNpcId) return;

    try {
      await npcRef.child(`relationships/${targetNpcId}`).remove();
      setStatus({ type: "success", msg: "Relacionamento removido." });
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || "Erro ao remover relacionamento." });
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography sx={{ opacity: 0.8 }}>Carregando NPC…</Typography>
      </Container>
    );
  }

  if (!npc) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">NPC não encontrado.</Alert>
        <Button component={Link} to={`/npcs?c=${encodeURIComponent(campaignId)}`} sx={{ mt: 2 }}>
          Voltar
        </Button>
      </Container>
    );
  }

  const relationships = coerceRelationshipsToArray(npc.relationships).sort((a, b) =>
    String(a.name).localeCompare(String(b.name), "pt-BR")
  );

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { duration: T_IN * 0.18 } }}>
        <Stack spacing={2}>
          <Paper elevation={0} sx={{ p: 2.25, borderRadius: 3, border: "1px solid rgba(0,0,0,0.10)", bgcolor: "rgba(223, 214, 205, 0.92)" }}>
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ gap: 1, flexWrap: "wrap" }}>
                <Typography variant="h5" sx={{ fontWeight: 1000, color: "#2c1a10" }}>
                  NPC — {npc?.name || "—"}
                </Typography>
                <Button component={Link} to={`/npcs?c=${encodeURIComponent(campaignId)}`}>
                  Voltar
                </Button>
              </Stack>

              {npc?.imageUrl ? (
                <Box
                  component="img"
                  src={npc.imageUrl}
                  alt={npc?.name || "NPC"}
                  sx={{ width: "100%", maxHeight: 280, objectFit: "cover", borderRadius: 2, border: "1px solid rgba(0,0,0,0.10)" }}
                />
              ) : (
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  (Sem foto)
                </Typography>
              )}

              <Button variant="outlined" component="label" disabled={uploading} sx={{ width: "fit-content" }}>
                {uploading ? "Enviando..." : "Enviar foto"}
                <input hidden type="file" accept="image/*" onChange={(e) => uploadImage(e.target.files?.[0])} />
              </Button>
            </Stack>
          </Paper>

          {status.msg ? <Alert severity={status.type}>{status.msg}</Alert> : null}

          {/* Painel de links */}
          <Paper elevation={0} sx={{ p: 2.25, borderRadius: 3, border: "1px solid rgba(0,0,0,0.10)" }}>
            <Stack spacing={1.25}>
              <Typography variant="h6" sx={{ fontWeight: 950 }}>
                Links
              </Typography>
              <Divider />

              {/* ✅ lastSeenNote vindo direto do NPC */}
              {npc?.lastSeenNote ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.25,
                    borderRadius: 2,
                    border: "1px dashed rgba(0,0,0,0.18)",
                    bgcolor: "rgba(0,0,0,0.02)",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
                    Última nota rápida
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, whiteSpace: "pre-wrap" }}>
                    {npc.lastSeenNote}
                  </Typography>
                </Paper>
              ) : null}

              <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
                Apareceu em sessões
              </Typography>

              {appearedIn.length === 0 ? (
                <Typography sx={{ opacity: 0.8 }}>Ainda não aparece em nenhuma sessão nesta campanha.</Typography>
              ) : (
                <Stack spacing={1}>
                  {appearedIn.map((s) => (
                    <Paper
                      key={s.sessionId}
                      elevation={0}
                      sx={{
                        p: 1.25,
                        borderRadius: 2,
                        border: "1px solid rgba(0,0,0,0.10)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 900, color: "#2c1a10" }} noWrap>
                          {s.title}
                        </Typography>
                        {s.note ? (
                          <Typography variant="caption" sx={{ opacity: 0.85 }}>
                            Nota: {s.note}
                          </Typography>
                        ) : null}
                      </Stack>

                      <Button
                        size="small"
                        component={Link}
                        to={`/diario/${encodeURIComponent(s.sessionId)}?c=${encodeURIComponent(campaignId)}`}
                      >
                        Abrir sessão
                      </Button>
                    </Paper>
                  ))}
                </Stack>
              )}
            </Stack>
          </Paper>

          {/* Detalhes */}
          <Paper elevation={0} sx={{ p: 2.25, borderRadius: 3, border: "1px solid rgba(0,0,0,0.10)" }}>
            <Stack spacing={1.25}>
              <Typography variant="h6" sx={{ fontWeight: 950 }}>
                Detalhes
              </Typography>
              <Divider />

              <TextField label="Nome" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
              <TextField label="Voz (anotações)" value={voice} onChange={(e) => setVoice(e.target.value)} fullWidth placeholder="Ex.: rouca, sotaque..." />

              <TextField
                label="Tags (separadas por vírgula)"
                value={tagsRaw}
                onChange={(e) => setTagsRaw(e.target.value)}
                fullWidth
                placeholder="Ex.: taverna, aliado, suspeito"
              />

              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                {parseTags(tagsRaw).map((t) => (
                  <Chip key={t} label={t} size="small" />
                ))}
              </Stack>

              <TextField
                label="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                minRows={5}
                placeholder="Aparência, objetivos, segredos..."
              />

              <Button variant="contained" onClick={save} sx={{ fontWeight: 900, width: "fit-content" }}>
                Salvar
              </Button>
            </Stack>
          </Paper>

          {/* Relacionamentos (linka outros NPCs) */}
          <Paper elevation={0} sx={{ p: 2.25, borderRadius: 3, border: "1px solid rgba(0,0,0,0.10)" }}>
            <Stack spacing={1.25}>
              <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ gap: 1, flexWrap: "wrap" }}>
                <Typography variant="h6" sx={{ fontWeight: 950 }}>
                  Relacionamentos
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.75 }}>
                  (link para outro NPC na mesma campanha)
                </Typography>
              </Stack>

              <Divider />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ sm: "center" }}>
                <Autocomplete
                  options={npcOptions}
                  value={relTarget}
                  onChange={(_, v) => setRelTarget(v)}
                  getOptionLabel={(o) => o?.name || ""}
                  renderInput={(params) => <TextField {...params} label="NPC alvo" placeholder="Ex.: Capitão da Guarda" />}
                  sx={{ flex: 2 }}
                />
                <TextField
                  label="Relação"
                  value={relText}
                  onChange={(e) => setRelText(e.target.value)}
                  placeholder="Ex.: inimigo / aliado / devedor..."
                  sx={{ flex: 3 }}
                />
                <Button variant="outlined" onClick={addOrUpdateRelationship}>
                  Vincular
                </Button>
              </Stack>

              {relationships.length === 0 ? (
                <Typography sx={{ opacity: 0.8 }}>Nenhum relacionamento ainda.</Typography>
              ) : (
                <Stack spacing={1}>
                  {relationships.map((r) => (
                    <Box
                      key={r.npcId}
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
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                        <Chip label="NPC" size="small" variant="outlined" />
                        <Typography sx={{ fontWeight: 900, color: "#2c1a10" }} noWrap>
                          {r.name}
                        </Typography>
                        {r.relation ? (
                          <Typography sx={{ opacity: 0.85 }} noWrap>
                            — {r.relation}
                          </Typography>
                        ) : null}
                      </Stack>

                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Tooltip title="Abrir NPC">
                          <IconButton
                            size="small"
                            component={Link}
                            to={`/npcs/${encodeURIComponent(r.npcId)}?c=${encodeURIComponent(campaignId)}`}
                          >
                            <OpenInNewRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Remover vínculo">
                          <IconButton size="small" onClick={() => removeRelationship(r.npcId)}>
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
        </Stack>
      </motion.div>
    </Container>
  );
}