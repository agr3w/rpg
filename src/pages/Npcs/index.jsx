import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";
import { auth, database, firebase } from "APIs/firebaseConfig";
import { T_IN } from "config/transitions";
import { motion } from "framer-motion";
import NpcCard from "./components/NpcCard";
import { useCampaigns } from "hooks/useCampaigns";
import { useDebounce } from "hooks/useDebounce";
import { buildCampaignQuery, getCampaignBasePath } from "service/campaignPath";
import { normalizeKey } from "Utils/textHelpers";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

const DEFAULT_CAMPAIGN_ID = "default";

export default function NpcsPage() {
  const user = auth.currentUser;
  const uid = user?.uid;

  const [searchParams] = useSearchParams();
  const activeCampaignId = searchParams.get("c") || "all";
  const campaignMode = searchParams.get("m") === "shared" ? "shared" : "legacy";

  const [status, setStatus] = useState({ type: "info", msg: "" });
  const { campaigns, loading } = useCampaigns(uid, campaignMode, activeCampaignId);
  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 200);

  // Modal Novo NPC
  const [openNewNpc, setOpenNewNpc] = useState(false);
  const [newNpcName, setNewNpcName] = useState("");
  const [newNpcCampaignId, setNewNpcCampaignId] = useState(
    activeCampaignId !== "all" ? activeCampaignId : "default"
  );
  const [newNpcRole, setNewNpcRole] = useState("");
  const [newNpcAttitude, setNewNpcAttitude] = useState("Neutro");
  const [newNpcNote, setNewNpcNote] = useState("");
  const [savingNpc, setSavingNpc] = useState(false);

  const campaignOptions = useMemo(() => {
    const opts = [{ id: "default", name: "Geral / Sem Campanha", mode: "legacy" }];
    campaigns.forEach((c) => {
      if (c.campaignId && c.campaignId !== "default") {
        opts.push({
          id: c.campaignId,
          name: c.name || c.campaignId,
          mode: c.mode || campaignMode || "legacy",
        });
      }
    });
    return opts;
  }, [campaigns, campaignMode]);

  const handleCreateNpc = async () => {
    if (!uid) {
      setStatus({ type: "error", msg: "Usuário não autenticado." });
      return;
    }
    const name = newNpcName.trim();
    if (!name) {
      setStatus({ type: "warning", msg: "Informe o nome do NPC." });
      return;
    }

    const key = normalizeKey(name);
    if (!key) {
      setStatus({ type: "warning", msg: "Nome inválido para NPC." });
      return;
    }

    setSavingNpc(true);
    try {
      const selectedOpt =
        campaignOptions.find((o) => o.id === newNpcCampaignId) || campaignOptions[0];
      const targetCampaignId = selectedOpt.id;
      const targetMode = selectedOpt.mode || "legacy";
      const campaignBasePath = getCampaignBasePath({
        uid,
        campaignId: targetCampaignId,
        mode: targetMode,
      });

      const npcRef = database.ref(`${campaignBasePath}/npcs`).push();
      const npcId = npcRef.key;

      const newNpcData = {
        id: npcId,
        name,
        roleInScene: newNpcRole.trim(),
        attitude: newNpcAttitude,
        lastSeenNote: newNpcNote.trim(),
        description: "",
        voice: "",
        tags: [],
        relationships: [],
        imageUrl: "",
        lastSeenAt: firebase.database.ServerValue.TIMESTAMP,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      };

      await npcRef.set(newNpcData);

      const idxRef = database.ref(`${campaignBasePath}/npcIndex/${key}`);
      await idxRef.set({
        key,
        npcId,
        name,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });

      setOpenNewNpc(false);
      setNewNpcName("");
      setNewNpcRole("");
      setNewNpcNote("");
      setNewNpcAttitude("Neutro");
      setStatus({ type: "success", msg: `NPC "${name}" criado com sucesso!` });
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || "Erro ao criar NPC." });
    } finally {
      setSavingNpc(false);
    }
  };

  const filtered = useMemo(() => {
    const needle = debouncedQ.trim().toLowerCase();

    const byCampaign =
      activeCampaignId === "all"
        ? campaigns
        : campaigns.filter(
            (c) =>
              c.campaignId === activeCampaignId ||
              (activeCampaignId === "default" && c.campaignId === DEFAULT_CAMPAIGN_ID)
          );

    if (!needle) return byCampaign;

    const hit = (npc) => {
      const name = String(npc?.name || "").toLowerCase();
      const desc = String(npc?.description || "").toLowerCase();
      const note = String(npc?.lastSeenNote || "").toLowerCase();
      const tags = Array.isArray(npc?.tags) ? npc.tags.join(" ").toLowerCase() : "";
      return (
        name.includes(needle) ||
        desc.includes(needle) ||
        note.includes(needle) ||
        tags.includes(needle)
      );
    };

    return byCampaign
      .map((c) => ({ ...c, npcs: (c?.npcs || []).filter(hit) }))
      .filter((c) => c.npcs.length > 0);
  }, [campaigns, debouncedQ, activeCampaignId]);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
        <Stack spacing={2}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 3,
              border: (t) => `1px solid ${t.palette.rpg?.stroke || "rgba(191,143,0,0.35)"}`,
              bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(32, 18, 12, 0.78)"),
              color: (t) => (t.palette.mode === "dark" ? "text.primary" : "#f7eddc"),
              backdropFilter: "blur(4px)",
            }}
          >
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1.5}>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                  <Typography variant="h4" sx={{ fontWeight: 1000, color: "secondary.main", fontFamily: "Cinzel" }}>
                    Retratos de NPCs
                  </Typography>
                  <Chip
                    size="small"
                    label="Arquivo da campanha"
                    sx={{
                      bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(229,179,36,0.15)" : "rgba(191,143,0,0.2)"),
                      color: (t) => (t.palette.mode === "dark" ? "secondary.main" : "#ffe1a4"),
                      border: (t) => `1px solid ${t.palette.rpg?.stroke || "rgba(191,143,0,0.45)"}`,
                    }}
                  />
                </Stack>

                <Button
                  variant="contained"
                  startIcon={<AddRoundedIcon />}
                  onClick={() => {
                    setNewNpcCampaignId(activeCampaignId !== "all" ? activeCampaignId : "default");
                    setOpenNewNpc(true);
                  }}
                  sx={{
                    fontFamily: "Cinzel",
                    fontWeight: 800,
                    bgcolor: "secondary.main",
                    color: "#2c1a10",
                    "&:hover": { bgcolor: "secondary.dark" },
                  }}
                >
                  Novo NPC
                </Button>
              </Stack>

              <Typography sx={{ opacity: 0.9, color: "text.secondary" }}>
                Galeria dos personagens encontrados na jornada. Abra um retrato para ver voz, objetivo, atitude, segredo e notas práticas de sessão.
              </Typography>

              <TextField
                label="Buscar NPC"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="nome, facção, objetivo, nota rápida..."
                fullWidth
                sx={{
                  mt: 1,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.9)"),
                  },
                }}
              />

              <Typography variant="caption" sx={{ opacity: 0.85, color: "text.secondary" }}>
                Dica: filtre por campanha com <code>?c=ID</code> (ou deixe <code>all</code>).
              </Typography>
            </Stack>
          </Paper>

          {status.msg ? <Alert severity={status.type} onClose={() => setStatus({ ...status, msg: "" })}>{status.msg}</Alert> : null}

          {loading ? (
            <Typography sx={{ opacity: 0.8, color: "text.secondary" }}>Carregando…</Typography>
          ) : filtered.length === 0 ? (
            <Typography sx={{ opacity: 0.85, color: "text.secondary" }}>Nenhum NPC encontrado.</Typography>
          ) : (
            <Stack spacing={2}>
              {filtered.map((c) => {
                const sessionLogUrl = `/session-log?${buildCampaignQuery({ campaignId: c.campaignId, mode: c.mode || campaignMode })}`;
                return (
                  <Paper
                    key={c.campaignId}
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      border: (t) => `1px solid ${t.palette.rpg?.stroke || "rgba(191,143,0,0.25)"}`,
                      bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 248, 233, 0.95)"),
                      boxShadow: (t) => (t.palette.mode === "dark" ? "0 8px 24px rgba(0,0,0,0.4)" : "0 16px 30px rgba(0,0,0,0.18)"),
                    }}
                  >
                    <Stack spacing={1.5}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ gap: 1, flexWrap: "wrap" }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="h6" sx={{ fontWeight: 950, fontFamily: "Cinzel", color: "text.primary" }}>
                            {c.name}
                          </Typography>
                          <Chip
                            size="small"
                            label={`${c.npcs.length} NPC(s)`}
                            sx={{
                              height: 20,
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              fontFamily: "Cinzel",
                              bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(229,179,36,0.12)" : "rgba(191,143,0,0.15)"),
                              color: "secondary.main",
                              border: (t) => `1px solid ${t.palette.rpg?.stroke || "rgba(191,143,0,0.3)"}`,
                            }}
                          />
                        </Stack>

                        <Button
                          component={Link}
                          to={sessionLogUrl}
                          size="small"
                          variant="outlined"
                          startIcon={<BookmarkBorderIcon />}
                          sx={{
                            fontFamily: "Cinzel",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            borderColor: (t) => t.palette.rpg?.stroke || "rgba(191,143,0,0.3)",
                            color: "secondary.main",
                            "&:hover": {
                              borderColor: "secondary.main",
                              bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(229,179,36,0.08)" : "rgba(191,143,0,0.08)"),
                            },
                          }}
                        >
                          Abrir Diário
                        </Button>
                      </Stack>

                      <Divider sx={{ borderColor: (t) => t.palette.rpg?.stroke || "rgba(0,0,0,0.1)" }} />

                      <Box
                        sx={{
                          display: "grid",
                          gap: 2,
                          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                        }}
                      >
                        {c.npcs.map((npc) => (
                          <NpcCard key={npc.id} uid={uid} campaignId={c.campaignId} campaignMode={campaignMode} npc={npc} />
                        ))}
                      </Box>
                    </Stack>
                  </Paper>
                );
              })}
            </Stack>
          )}
        </Stack>
      </motion.div>

      {/* Modal: Novo NPC */}
      <Dialog
        open={openNewNpc}
        onClose={() => !savingNpc && setOpenNewNpc(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "background.paper",
            backgroundImage: (t) => t.palette.rpg?.paperBg || "none",
            border: (t) => `2px solid ${t.palette.rpg?.stroke || "#5c4033"}`,
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "Cinzel",
            fontWeight: 900,
            color: "primary.main",
            borderBottom: (t) => `1px solid ${t.palette.rpg?.stroke || "rgba(0,0,0,0.1)"}`,
          }}
        >
          Novo NPC
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={2.5}>
            <TextField
              label="Nome do NPC *"
              value={newNpcName}
              onChange={(e) => setNewNpcName(e.target.value)}
              fullWidth
              autoFocus
              placeholder="Ex: Alistair, o Ferreiro"
              sx={{
                "& .MuiInputBase-root": {
                  bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.5)"),
                },
              }}
            />

            <FormControl fullWidth size="small">
              <InputLabel sx={{ fontFamily: "Cinzel" }}>Campanha / Destino</InputLabel>
              <Select
                value={newNpcCampaignId}
                label="Campanha / Destino"
                onChange={(e) => setNewNpcCampaignId(e.target.value)}
                sx={{ fontFamily: "Cinzel" }}
              >
                {campaignOptions.map((opt) => (
                  <MenuItem key={opt.id} value={opt.id}>
                    {opt.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Função em Cena / Ocupação"
                value={newNpcRole}
                onChange={(e) => setNewNpcRole(e.target.value)}
                fullWidth
                size="small"
                placeholder="Ex: Taverneiro, Espião, Nobre"
                sx={{
                  "& .MuiInputBase-root": {
                    bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.5)"),
                  },
                }}
              />

              <FormControl fullWidth size="small">
                <InputLabel sx={{ fontFamily: "Cinzel" }}>Atitude Inicial</InputLabel>
                <Select
                  value={newNpcAttitude}
                  label="Atitude Inicial"
                  onChange={(e) => setNewNpcAttitude(e.target.value)}
                  sx={{ fontFamily: "Cinzel" }}
                >
                  {["Cordial", "Neutro", "Hostil", "Misterioso", "Aliado", "Antagonista"].map((att) => (
                    <MenuItem key={att} value={att}>
                      {att}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <TextField
              label="Nota Rápida / Gancho"
              value={newNpcNote}
              onChange={(e) => setNewNpcNote(e.target.value)}
              fullWidth
              multiline
              minRows={2}
              placeholder="Ex: Encontrado na taverna sussurrando sobre o culto..."
              sx={{
                "& .MuiInputBase-root": {
                  bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.5)"),
                },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            p: 2,
            borderTop: (t) => `1px solid ${t.palette.rpg?.stroke || "rgba(0,0,0,0.1)"}`,
            bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(92,64,51,0.05)"),
          }}
        >
          <Button onClick={() => setOpenNewNpc(false)} disabled={savingNpc} sx={{ color: "text.secondary" }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateNpc}
            disabled={savingNpc}
            sx={{
              fontFamily: "Cinzel",
              fontWeight: 800,
            }}
          >
            {savingNpc ? "Criando..." : "Criar NPC"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}