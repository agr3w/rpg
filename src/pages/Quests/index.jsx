import React, { useMemo, useState } from "react";
import {
  Container,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  Autocomplete,
  Chip,
  Box,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Alert,
  Divider,
} from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";
import { auth, database, firebase } from "APIs/firebaseConfig";
import { motion } from "framer-motion";
import QuestCard from "./components/QuestCard";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { useCampaigns } from "hooks/useCampaigns";
import { useDebounce } from "hooks/useDebounce";
import { normalizeKey, parseTags } from "Utils/textHelpers";
import { buildCampaignQuery, getCampaignBasePath } from "service/campaignPath";

const DEFAULT_CAMPAIGN_ID = "default";

const STATUS_OPTIONS = [
  { value: "all", label: "Todas as Situações" },
  { value: "ativa", label: "Em Andamento (Ativas)" },
  { value: "pendente", label: "Não Iniciadas (Pendentes)" },
  { value: "concluida", label: "Finalizadas (Concluídas)" },
];

export default function QuestsPage() {
  const user = auth.currentUser;
  const uid = user?.uid;
  const [searchParams] = useSearchParams();
  const activeCampaignId = searchParams.get("c") || "all";
  const campaignMode = searchParams.get("m") === "shared" ? "shared" : "legacy";

  const { campaigns = [], loading } = useCampaigns(uid, campaignMode, activeCampaignId);

  // Estados de busca e filtros
  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 200);
  const [statusFilter, setStatusFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState([]);
  const [statusMsg, setStatusMsg] = useState({ type: "info", msg: "" });

  // Estados do Modal de Criação
  const [openModal, setOpenModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCampaignId, setNewCampaignId] = useState(
    activeCampaignId !== "all" ? activeCampaignId : DEFAULT_CAMPAIGN_ID
  );
  const [newStatus, setNewStatus] = useState("ativa");
  const [newDescription, setNewDescription] = useState("");
  const [newTagsRaw, setNewTagsRaw] = useState("");
  const [saving, setSaving] = useState(false);

  // Extração segura de tags
  const tagOptions = useMemo(() => {
    const set = new Set();
    (campaigns || []).forEach((c) => {
      (c?.quests || []).forEach((qt) => {
        (Array.isArray(qt?.tags) ? qt.tags : []).forEach((t) => {
          if (t) set.add(String(t));
        });
      });
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [campaigns]);

  // Filtragem segura de campanhas e quests
  const filtered = useMemo(() => {
    const needle = debouncedQ.trim().toLowerCase();
    const tagsNeed = new Set(tagFilter.map((t) => String(t).toLowerCase()));

    const byCampaign =
      activeCampaignId === "all"
        ? campaigns || []
        : (campaigns || []).filter(
            (c) =>
              c.campaignId === activeCampaignId ||
              (activeCampaignId === "default" && c.campaignId === DEFAULT_CAMPAIGN_ID)
          );

    const hitText = (quest) => {
      if (!needle) return true;
      const title = String(quest?.title || "").toLowerCase();
      const desc = String(quest?.description || "").toLowerCase();
      const note = String(quest?.lastSeenNote || "").toLowerCase();
      const tags = Array.isArray(quest?.tags) ? quest.tags.join(" ").toLowerCase() : "";
      return title.includes(needle) || desc.includes(needle) || note.includes(needle) || tags.includes(needle);
    };

    const hitStatus = (quest) =>
      statusFilter === "all" ? true : String(quest?.currentStatus || quest?.status || "pendente") === statusFilter;

    const hitTags = (quest) => {
      if (!tagsNeed.size) return true;
      const tags = new Set((Array.isArray(quest?.tags) ? quest.tags : []).map((t) => String(t).toLowerCase()));
      for (const t of tagsNeed) if (!tags.has(t)) return false;
      return true;
    };

    return byCampaign
      .map((c) => ({
        ...c,
        quests: (c?.quests || []).filter((qt) => hitText(qt) && hitStatus(qt) && hitTags(qt)),
      }))
      .filter((c) => Array.isArray(c?.quests) && c.quests.length > 0);
  }, [campaigns, debouncedQ, activeCampaignId, statusFilter, tagFilter]);

  // Criar nova Quest
  const handleCreateQuest = async () => {
    if (!uid || !newTitle.trim()) {
      setStatusMsg({ type: "warning", msg: "O título da quest é obrigatório." });
      return;
    }

    setSaving(true);
    setStatusMsg({ type: "info", msg: "" });

    try {
      const targetCampId = newCampaignId || DEFAULT_CAMPAIGN_ID;
      const targetCampaign = (campaigns || []).find((c) => c.campaignId === targetCampId);
      const targetMode = targetCampId === DEFAULT_CAMPAIGN_ID ? "legacy" : (targetCampaign?.mode || campaignMode || "legacy");
      const basePath = getCampaignBasePath({ uid, campaignId: targetCampId, mode: targetMode });
      const key = normalizeKey(newTitle);

      const questRef = database.ref(`${basePath}/quests`).push();
      const questId = questRef.key;

      const payload = {
        id: questId,
        indexKey: key,
        title: newTitle.trim(),
        description: newDescription.trim(),
        tags: parseTags(newTagsRaw),
        currentStatus: newStatus,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      };

      await questRef.set(payload);
      await database.ref(`${basePath}/questIndex/${key}`).set({
        key,
        questId,
        title: newTitle.trim(),
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });

      setOpenModal(false);
      setNewTitle("");
      setNewDescription("");
      setNewTagsRaw("");
      setNewStatus("ativa");
      setStatusMsg({ type: "success", msg: "Contrato de Quest registrado com sucesso!" });
    } catch (e) {
      setStatusMsg({ type: "error", msg: e?.message || "Erro ao registrar Quest." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
        <Stack spacing={3}>
          {statusMsg.msg && (
            <Alert severity={statusMsg.type} onClose={() => setStatusMsg({ type: "info", msg: "" })}>
              {statusMsg.msg}
            </Alert>
          )}

          {/* Header & Filtros */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 3,
              border: (t) => `1px solid ${t.palette.rpg?.stroke || "rgba(191,143,0,0.35)"}`,
              bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(32, 18, 12, 0.78)"),
              color: (t) => (t.palette.mode === "dark" ? "text.primary" : "#f7eddc"),
              backdropFilter: "blur(4px)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: 4, bgcolor: "secondary.main" }} />

            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1.5}>
                <Box>
                  <Typography variant="h4" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: "secondary.main" }}>
                    Contratos & Quests
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: "Cinzel", color: "text.secondary", mt: 0.5 }}>
                    Painel de missões e ganchos narrativos sincronizados com o Diário de Campanha.
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<AddRoundedIcon />}
                  onClick={() => {
                    setNewCampaignId(activeCampaignId !== "all" ? activeCampaignId : DEFAULT_CAMPAIGN_ID);
                    setOpenModal(true);
                  }}
                  sx={{
                    fontFamily: "Cinzel",
                    fontWeight: 800,
                    bgcolor: "secondary.main",
                    color: "#2c1a10",
                    "&:hover": { bgcolor: "secondary.dark" },
                  }}
                >
                  Nova Quest
                </Button>
              </Stack>

              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  size="small"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Buscar nos registros..."
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "primary.main" }} />
                      </InputAdornment>
                    ),
                    sx: {
                      bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.9)"),
                      fontFamily: "Cinzel",
                    },
                  }}
                />
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  size="small"
                  sx={{
                    minWidth: 200,
                    bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.9)"),
                    fontFamily: "Cinzel",
                  }}
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterListIcon sx={{ color: "primary.main", fontSize: 20 }} />
                    </InputAdornment>
                  }
                >
                  {STATUS_OPTIONS.map((s) => (
                    <MenuItem key={s.value} value={s.value}>
                      {s.label}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>

              <Autocomplete
                multiple
                size="small"
                options={tagOptions}
                value={tagFilter}
                onChange={(_, v) => setTagFilter(v)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={tagFilter.length ? "" : "Filtrar por tags..."}
                    sx={{
                      "& .MuiInputBase-root": {
                        bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.9)"),
                      },
                    }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      key={option}
                      label={option}
                      size="small"
                      {...getTagProps({ index })}
                      sx={{
                        bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(229,179,36,0.15)" : "#e0d0b0"),
                        color: "text.primary",
                        fontWeight: 700,
                        fontFamily: "Cinzel",
                      }}
                    />
                  ))
                }
              />
            </Stack>
          </Paper>

          {/* Listagem de Campanhas e Quests */}
          {loading ? (
            <Typography sx={{ textAlign: "center", mt: 4, fontStyle: "italic", color: "text.secondary" }}>
              Consultando os pergaminhos...
            </Typography>
          ) : filtered.length === 0 ? (
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.03)"),
                border: (t) => `1px solid ${t.palette.rpg?.stroke || "rgba(0,0,0,0.1)"}`,
              }}
            >
              <Typography sx={{ fontFamily: "Cinzel", color: "text.secondary" }}>
                Nenhuma missão encontrada com estes critérios.
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={3}>
              {filtered.map((c) => {
                const isDefault = c.campaignId === "default";
                const campaignTitle = c.name && c.name !== "default" ? c.name : "Diário de Campanha";
                const questCount = (c.quests || []).length;
                const sessionLogUrl = `/session-log?${buildCampaignQuery({ campaignId: c.campaignId, mode: c.mode || campaignMode })}`;

                return (
                  <Paper
                    key={c.campaignId}
                    elevation={0}
                    sx={{
                      p: { xs: 2, md: 3 },
                      borderRadius: 3,
                      border: (t) => `1px solid ${t.palette.rpg?.stroke || "rgba(191,143,0,0.25)"}`,
                      bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 248, 233, 0.95)"),
                      boxShadow: (t) => (t.palette.mode === "dark" ? "0 8px 24px rgba(0,0,0,0.4)" : "0 16px 30px rgba(0,0,0,0.18)"),
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <Stack spacing={2}>
                      {/* Header da Categoria / Diário de Campanha */}
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        gap={1.5}
                        flexWrap="wrap"
                      >
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 2,
                              display: "grid",
                              placeItems: "center",
                              bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(229,179,36,0.12)" : "rgba(131,60,11,0.08)"),
                              border: (t) => `1px solid ${t.palette.rpg?.stroke || "rgba(191,143,0,0.3)"}`,
                              color: "secondary.main",
                            }}
                          >
                            <HistoryEduIcon fontSize="small" />
                          </Box>

                          <Box>
                            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                              <Typography
                                variant="h5"
                                sx={{
                                  fontFamily: "Cinzel",
                                  fontWeight: 900,
                                  color: "text.primary",
                                  letterSpacing: 0.5,
                                }}
                              >
                                {campaignTitle}
                              </Typography>
                              <Chip
                                size="small"
                                label={`${questCount} ${questCount === 1 ? "Contrato" : "Contratos"}`}
                                sx={{
                                  height: 22,
                                  fontFamily: "Cinzel",
                                  fontWeight: 700,
                                  bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(229,179,36,0.15)" : "rgba(191,143,0,0.15)"),
                                  color: "secondary.main",
                                  border: (t) => `1px solid ${t.palette.rpg?.stroke || "rgba(191,143,0,0.3)"}`,
                                }}
                              />
                            </Stack>
                            <Typography variant="caption" sx={{ color: "text.secondary", fontFamily: "Cinzel" }}>
                              {isDefault ? "Diário de Campanha (Principal)" : "Diário de Campanha Vinculado"}
                            </Typography>
                          </Box>
                        </Stack>

                        {/* Ação rápida para abrir o Diário de Campanha */}
                        <Button
                          component={Link}
                          to={sessionLogUrl}
                          size="small"
                          variant="outlined"
                          startIcon={<BookmarkBorderIcon />}
                          sx={{
                            fontFamily: "Cinzel",
                            fontWeight: 700,
                            fontSize: "0.78rem",
                            borderColor: (t) => t.palette.rpg?.stroke || "rgba(191,143,0,0.3)",
                            color: "secondary.main",
                            "&:hover": {
                              borderColor: "secondary.main",
                              bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(229,179,36,0.08)" : "rgba(191,143,0,0.08)"),
                            },
                          }}
                        >
                          Abrir Diário de Campanha
                        </Button>
                      </Stack>

                      <Divider sx={{ borderColor: (t) => t.palette.rpg?.stroke || "rgba(0,0,0,0.1)" }} />

                      {/* Grid de Quests */}
                      <Box
                        sx={{
                          display: "grid",
                          gap: 2,
                          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                        }}
                      >
                        {(c.quests || []).map((qt) => (
                          <QuestCard
                            key={qt.id}
                            uid={uid}
                            campaignId={c.campaignId}
                            campaignMode={c.mode || campaignMode}
                            quest={qt}
                          />
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

      {/* Modal: Nova Quest */}
      <Dialog
        open={openModal}
        onClose={() => !saving && setOpenModal(false)}
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
            borderBottom: (t) => `1px solid ${t.palette.rpg?.stroke || "rgba(92,64,51,0.2)"}`,
          }}
        >
          Novo Contrato de Missão
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={2.5}>
            <TextField
              label="Título da Quest *"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              fullWidth
              autoFocus
              placeholder="Ex: O Segredo da Cripta Esquecida"
              variant="outlined"
              sx={{
                "& .MuiInputBase-root": {
                  bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.5)"),
                },
              }}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ fontFamily: "Cinzel" }}>Campanha / Diário</InputLabel>
                <Select
                  value={newCampaignId}
                  label="Campanha / Diário"
                  onChange={(e) => setNewCampaignId(e.target.value)}
                  sx={{ fontFamily: "Cinzel" }}
                >
                  <MenuItem value="default">Geral / Sem Campanha</MenuItem>
                  {(campaigns || [])
                    .filter((c) => c.campaignId !== "default")
                    .map((c) => (
                      <MenuItem key={c.campaignId} value={c.campaignId}>
                        {c.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small" sx={{ minWidth: 140 }}>
                <InputLabel sx={{ fontFamily: "Cinzel" }}>Situação</InputLabel>
                <Select
                  value={newStatus}
                  label="Situação"
                  onChange={(e) => setNewStatus(e.target.value)}
                  sx={{ fontFamily: "Cinzel" }}
                >
                  <MenuItem value="ativa">Ativa</MenuItem>
                  <MenuItem value="pendente">Pendente</MenuItem>
                  <MenuItem value="concluida">Concluída</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <TextField
              label="Tags (separadas por vírgula)"
              value={newTagsRaw}
              onChange={(e) => setNewTagsRaw(e.target.value)}
              fullWidth
              placeholder="principal, boss, dungeon, investigacao"
              size="small"
              sx={{
                "& .MuiInputBase-root": {
                  bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.5)"),
                },
              }}
            />

            <TextField
              label="Descrição / Detalhes do Contrato"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              fullWidth
              multiline
              minRows={4}
              placeholder="Descreva o cliente, as recompensas e o objetivo principal..."
              sx={{
                "& .MuiInputBase-root": {
                  bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.3)"),
                  fontFamily: "'Merriweather', serif",
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            p: 2,
            borderTop: (t) => `1px solid ${t.palette.rpg?.stroke || "rgba(92,64,51,0.2)"}`,
            bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(92,64,51,0.05)"),
          }}
        >
          <Button onClick={() => setOpenModal(false)} disabled={saving} sx={{ color: "text.secondary" }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateQuest}
            disabled={saving}
            sx={{
              fontFamily: "Cinzel",
              fontWeight: 800,
            }}
          >
            {saving ? "Registrando..." : "Registrar Quest"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}