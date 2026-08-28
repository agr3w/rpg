import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { auth } from "APIs/firebaseConfig";
import { motion } from "framer-motion";
import { T_IN } from "config/transitions";
import { buildCampaignQuery } from "service/campaignPath";
import { useNpcDetail } from "hooks/useNpcDetail";
import { parseTags } from "Utils/textHelpers";

const DEFAULT_CAMPAIGN_ID = "default";

export default function NpcDetail() {
  const user = auth.currentUser;
  const uid = user?.uid;

  const { npcId } = useParams();
  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get("c") || DEFAULT_CAMPAIGN_ID;
  const campaignMode = searchParams.get("m") === "shared" ? "shared" : "legacy";

  const [status, setStatus] = useState({ type: "info", msg: "" });

  const {
    npc,
    npcOptions,
    appearedIn,
    relationships,
    loading,
    uploading,
    saveNpc,
    uploadAvatar,
    addRelationship: addRelationshipAction,
    removeRelationship: removeRelationshipAction,
  } = useNpcDetail(uid, campaignId, campaignMode, npcId);

  const [name, setName] = useState("");
  const [faction, setFaction] = useState("");
  const [roleInScene, setRoleInScene] = useState("");
  const [attitude, setAttitude] = useState("");
  const [dangerLevel, setDangerLevel] = useState("");
  const [location, setLocation] = useState("");
  const [voice, setVoice] = useState("");
  const [mannerism, setMannerism] = useState("");
  const [objective, setObjective] = useState("");
  const [secret, setSecret] = useState("");
  const [hook, setHook] = useState("");
  const [lastSeenNote, setLastSeenNote] = useState("");
  const [description, setDescription] = useState("");
  const [tagsRaw, setTagsRaw] = useState("");

  const [relTarget, setRelTarget] = useState(null);
  const [relText, setRelText] = useState("");

  useEffect(() => {
    if (npc) {
      setName(npc?.name || "");
      setFaction(npc?.faction || "");
      setRoleInScene(npc?.roleInScene || "");
      setAttitude(npc?.attitude || "");
      setDangerLevel(npc?.dangerLevel || "");
      setLocation(npc?.location || "");
      setVoice(npc?.voice || "");
      setMannerism(npc?.mannerism || "");
      setObjective(npc?.objective || npc?.goal || "");
      setSecret(npc?.secret || "");
      setHook(npc?.hook || "");
      setLastSeenNote(npc?.lastSeenNote || "");
      setDescription(npc?.description || "");
      setTagsRaw(Array.isArray(npc?.tags) ? npc.tags.join(", ") : "");
    }
  }, [npc]);

  const uploadImage = async (file) => {
    setStatus({ type: "info", msg: "" });
    if (!file) return;

    try {
      await uploadAvatar(file);
      setStatus({ type: "success", msg: "Retrato atualizado." });
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || "Erro ao enviar imagem." });
    }
  };

  const save = async () => {
    setStatus({ type: "info", msg: "" });

    try {
      await saveNpc({
        name,
        faction,
        roleInScene,
        attitude,
        dangerLevel,
        location,
        voice,
        mannerism,
        objective,
        secret,
        hook,
        lastSeenNote,
        description,
        tagsRaw,
      });
      setStatus({ type: "success", msg: "Ficha de NPC salva." });
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || "Erro ao salvar NPC." });
    }
  };

  const addOrUpdateRelationship = async () => {
    setStatus({ type: "info", msg: "" });

    const target = relTarget;
    const relation = String(relText || "").trim();

    if (!target?.npcId || !target?.name) {
      setStatus({ type: "warning", msg: "Selecione um NPC para vincular." });
      return;
    }

    try {
      await addRelationshipAction(target, relation);
      setRelTarget(null);
      setRelText("");
      setStatus({ type: "success", msg: "Relacionamento salvo." });
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || "Erro ao salvar relacionamento." });
    }
  };

  const removeRelationship = async (targetNpcId) => {
    setStatus({ type: "info", msg: "" });
    if (!targetNpcId) return;

    try {
      await removeRelationshipAction(targetNpcId);
      setStatus({ type: "success", msg: "Relacionamento removido." });
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || "Erro ao remover relacionamento." });
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography sx={{ opacity: 0.8 }}>Carregando NPC…</Typography>
      </Container>
    );
  }

  if (!npc) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">NPC não encontrado.</Alert>
        <Button
          component={Link}
          to={`/npcs?${buildCampaignQuery({ campaignId, mode: campaignMode })}`}
          sx={{ mt: 2 }}
        >
          Voltar
        </Button>
      </Container>
    );
  }

  const query = buildCampaignQuery({ campaignId, mode: campaignMode });

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { duration: T_IN * 0.2 } }}
      >
        <Stack spacing={2.2}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 3,
              border: "1px solid rgba(191,143,0,0.38)",
              bgcolor: "rgba(33,18,11,0.82)",
              color: "#f7eddc",
              backgroundImage:
                "radial-gradient(120% 140% at 0% 0%, rgba(191,143,0,0.18) 0%, transparent 46%), radial-gradient(130% 160% at 100% 100%, rgba(131,60,11,0.24) 0%, transparent 56%)",
            }}
          >
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
              <Button
                startIcon={<ArrowBackRoundedIcon />}
                component={Link}
                to={`/npcs?${query}`}
                sx={{ alignSelf: "flex-start", color: "#ffdf9e" }}
              >
                Voltar
              </Button>

              <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center" sx={{ flex: 1 }}>
                <Box
                  sx={{
                    width: 132,
                    height: 132,
                    borderRadius: "50%",
                    border: "3px solid rgba(191,143,0,0.66)",
                    boxShadow: "0 0 0 4px rgba(131,60,11,0.35)",
                    overflow: "hidden",
                    bgcolor: "rgba(255,255,255,0.08)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  {npc?.imageUrl ? (
                    <Box component="img" src={npc.imageUrl} alt={npc?.name || "NPC"} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <Typography sx={{ fontSize: 42, fontWeight: 1000 }}>{(npc?.name || "?").slice(0, 1).toUpperCase()}</Typography>
                  )}
                </Box>

                <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="h4" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: "#ffd37d" }}>
                    {npc?.name || "NPC"}
                  </Typography>

                  <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap>
                    {attitude ? <Chip size="small" label={`Atitude: ${attitude}`} sx={{ bgcolor: "rgba(191,143,0,0.2)", color: "#ffe7b8" }} /> : null}
                    {faction ? <Chip size="small" label={`Facção: ${faction}`} sx={{ bgcolor: "rgba(255,255,255,0.12)", color: "#fff2d3" }} /> : null}
                    {dangerLevel ? <Chip size="small" label={`Ameaça: ${dangerLevel}`} sx={{ bgcolor: "rgba(131,60,11,0.4)", color: "#ffdeb7" }} /> : null}
                  </Stack>

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Button variant="outlined" component="label" disabled={uploading} sx={{ color: "#ffdf9e", borderColor: "rgba(255,223,158,0.45)" }}>
                      {uploading ? "Enviando retrato..." : "Atualizar retrato"}
                      <input hidden type="file" accept="image/*" onChange={(e) => uploadImage(e.target.files?.[0])} />
                    </Button>
                    <Button variant="contained" startIcon={<SaveRoundedIcon />} onClick={save} sx={{ bgcolor: "secondary.main", color: "#2c1a10", fontWeight: 900 }}>
                      Salvar NPC
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Paper>

          {status.msg ? <Alert severity={status.type}>{status.msg}</Alert> : null}

          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", lg: "1.15fr 0.85fr" } }}>
            <Paper elevation={0} sx={{ p: 2.2, borderRadius: 3, border: (t) => `1px solid ${t.palette.rpg?.stroke || "rgba(0,0,0,0.1)"}`, bgcolor: "background.paper" }}>
              <Stack spacing={1.2}>
                <Typography variant="h6" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: "primary.main" }}>
                  Ficha de sessão
                </Typography>
                <Divider sx={{ borderColor: (t) => t.palette.rpg?.stroke || "rgba(0,0,0,0.1)" }} />

                <Box sx={{ display: "grid", gap: 1.2, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
                  <TextField label="Nome" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
                  <TextField label="Função em cena" value={roleInScene} onChange={(e) => setRoleInScene(e.target.value)} fullWidth placeholder="mercador, espião, capitão..." />
                  <TextField label="Facção" value={faction} onChange={(e) => setFaction(e.target.value)} fullWidth />
                  <TextField label="Último local" value={location} onChange={(e) => setLocation(e.target.value)} fullWidth />
                  <TextField label="Atitude" value={attitude} onChange={(e) => setAttitude(e.target.value)} fullWidth placeholder="hostil, neutro, cordial..." />
                  <TextField label="Nível de ameaça" value={dangerLevel} onChange={(e) => setDangerLevel(e.target.value)} fullWidth placeholder="baixa, média, alta" />
                </Box>

                <TextField label="Voz/trejeito" value={voice} onChange={(e) => setVoice(e.target.value)} fullWidth placeholder="sotaque, ritmo, vícios de fala" />
                <TextField label="Maneirismo" value={mannerism} onChange={(e) => setMannerism(e.target.value)} fullWidth placeholder="gestos marcantes, tiques" />
                <TextField label="Objetivo atual" value={objective} onChange={(e) => setObjective(e.target.value)} fullWidth placeholder="o que esse NPC quer agora" />
                <TextField label="Segredo relevante" value={secret} onChange={(e) => setSecret(e.target.value)} fullWidth placeholder="informação para revelar em momento certo" />
                <TextField label="Gancho de cena" value={hook} onChange={(e) => setHook(e.target.value)} fullWidth placeholder="como puxar esse NPC para a sessão" />
                <TextField label="Última nota rápida" value={lastSeenNote} onChange={(e) => setLastSeenNote(e.target.value)} fullWidth multiline minRows={2} />
                <TextField label="Descrição completa" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline minRows={5} placeholder="aparência, histórico curto, nuances" />

                <TextField label="Tags" value={tagsRaw} onChange={(e) => setTagsRaw(e.target.value)} fullWidth placeholder="aliado, taverna, culto..." />
                <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap>
                  {parseTags(tagsRaw).map((t) => (
                    <Chip key={t} label={t} size="small" variant="outlined" />
                  ))}
                </Stack>
              </Stack>
            </Paper>

            <Stack spacing={2}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: (t) => `1px solid ${t.palette.rpg?.stroke || "rgba(0,0,0,0.1)"}`, bgcolor: "background.paper" }}>
                <Stack spacing={1}>
                  <Typography variant="h6" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: "primary.main" }}>
                    Apareceu em sessões
                  </Typography>
                  <Divider sx={{ borderColor: (t) => t.palette.rpg?.stroke || "rgba(0,0,0,0.1)" }} />
                  {appearedIn.length === 0 ? (
                    <Typography sx={{ opacity: 0.75, color: "text.secondary" }}>Ainda não citado nas sessões desta campanha.</Typography>
                  ) : (
                    appearedIn.map((s) => (
                      <Paper key={s.sessionId} elevation={0} sx={{ p: 1.1, borderRadius: 2, border: (t) => `1px solid ${t.palette.rpg?.stroke || "rgba(0,0,0,0.1)"}`, bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)") }}>
                        <Stack spacing={0.6}>
                          <Typography sx={{ fontWeight: 900, color: "text.primary" }}>{s.title}</Typography>
                          {s.note ? <Typography variant="caption" sx={{ color: "text.secondary" }}>Nota: {s.note}</Typography> : null}
                          <Button size="small" component={Link} to={`/diario/${encodeURIComponent(s.sessionId)}?${query}`} sx={{ width: "fit-content" }}>
                            Abrir sessão
                          </Button>
                        </Stack>
                      </Paper>
                    ))
                  )}
                </Stack>
              </Paper>

              <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: (t) => `1px solid ${t.palette.rpg?.stroke || "rgba(0,0,0,0.1)"}`, bgcolor: "background.paper" }}>
                <Stack spacing={1}>
                  <Typography variant="h6" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: "primary.main" }}>
                    Relacionamentos
                  </Typography>
                  <Divider sx={{ borderColor: (t) => t.palette.rpg?.stroke || "rgba(0,0,0,0.1)" }} />

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                    <Autocomplete
                      options={npcOptions}
                      value={relTarget}
                      onChange={(_, v) => setRelTarget(v)}
                      getOptionLabel={(o) => o?.name || ""}
                      renderInput={(params) => <TextField {...params} label="NPC alvo" />}
                      sx={{ flex: 2 }}
                    />
                    <TextField label="Relação" value={relText} onChange={(e) => setRelText(e.target.value)} sx={{ flex: 3 }} />
                    <Button variant="outlined" onClick={addOrUpdateRelationship}>Vincular</Button>
                  </Stack>

                  {relationships.length === 0 ? (
                    <Typography sx={{ opacity: 0.75 }}>Sem relacionamentos cadastrados.</Typography>
                  ) : (
                    <Stack spacing={0.7}>
                      {relationships.map((r) => (
                        <Box key={r.npcId} sx={{ p: 1, borderRadius: 2, border: "1px solid rgba(0,0,0,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
                          <Stack direction="row" spacing={0.8} alignItems="center" sx={{ minWidth: 0 }}>
                            <Chip size="small" label="NPC" variant="outlined" />
                            <Typography noWrap sx={{ fontWeight: 900 }}>{r.name}</Typography>
                            {r.relation ? <Typography noWrap sx={{ opacity: 0.85 }}>— {r.relation}</Typography> : null}
                          </Stack>
                          <Stack direction="row" spacing={0.3}>
                            <Tooltip title="Abrir NPC">
                              <IconButton size="small" component={Link} to={`/npcs/${encodeURIComponent(r.npcId)}?${query}`}>
                                <OpenInNewRoundedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Remover">
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
          </Box>
        </Stack>
      </motion.div>
    </Container>
  );
}
