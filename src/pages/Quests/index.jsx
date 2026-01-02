import React, { useEffect, useMemo, useState } from "react";
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
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { auth, database } from "APIs/firebaseConfig";
import { T_IN } from "config/transitions";
import { motion } from "framer-motion";
import QuestCard from "./components/QuestCard";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";

const DEFAULT_CAMPAIGN_ID = "default";

// --- Estilos D&D ---
const DND_THEME = {
  paperBg: "linear-gradient(135deg, #fffbf0 0%, #f3eacb 100%)",
  ink: "#2c1a10",
  gold: "#bf8f00",
};

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

  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState([]);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    const ref = database.ref(`users/${uid}/campaigns`);
    const handle = (snap) => {
      const data = snap.val() || {};
      const arr = Object.entries(data).map(([campaignId, c]) => {
        const name = c?.meta?.name || campaignId;

        const quests = Object.values(c?.quests || {})
          .filter((x) => x?.id && x?.title)
          .sort((a, b) => String(a.title).localeCompare(String(b.title), "pt-BR"));

        return { campaignId, name, quests };
      });

      arr.sort((a, b) => String(a.name).localeCompare(String(b.name), "pt-BR"));
      setCampaigns(arr);
      setLoading(false);
    };

    ref.on("value", handle);
    return () => ref.off("value", handle);
  }, [uid]);

  const tagOptions = useMemo(() => {
    const set = new Set();
    campaigns.forEach((c) => {
      c.quests.forEach((qt) => {
        (Array.isArray(qt?.tags) ? qt.tags : []).forEach((t) => set.add(String(t)));
      });
    });
    return Array.from(set).filter(Boolean).sort((a, b) => String(a).localeCompare(String(b), "pt-BR"));
  }, [campaigns]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const tagsNeed = new Set(tagFilter.map((t) => String(t).toLowerCase()));

    const byCampaign =
      activeCampaignId === "all"
        ? campaigns
        : campaigns.filter((c) => c.campaignId === activeCampaignId || (activeCampaignId === "default" && c.campaignId === DEFAULT_CAMPAIGN_ID));

    const hitText = (quest) => {
      if (!needle) return true;
      const title = String(quest?.title || "").toLowerCase();
      const desc = String(quest?.description || "").toLowerCase();
      const note = String(quest?.lastSeenNote || "").toLowerCase();
      const tags = Array.isArray(quest?.tags) ? quest.tags.join(" ").toLowerCase() : "";
      return title.includes(needle) || desc.includes(needle) || note.includes(needle) || tags.includes(needle);
    };

    const hitStatus = (quest) => (statusFilter === "all" ? true : String(quest?.currentStatus || "pendente") === statusFilter);

    const hitTags = (quest) => {
      if (!tagsNeed.size) return true;
      const tags = new Set((Array.isArray(quest?.tags) ? quest.tags : []).map((t) => String(t).toLowerCase()));
      for (const t of tagsNeed) if (!tags.has(t)) return false;
      return true;
    };

    return byCampaign
      .map((c) => ({
        ...c,
        quests: c.quests.filter((qt) => hitText(qt) && hitStatus(qt) && hitTags(qt)),
      }))
      .filter((c) => c.quests.length > 0);
  }, [campaigns, q, activeCampaignId, statusFilter, tagFilter]);

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { duration: T_IN * 0.18 } }}>
        <Stack spacing={3}>
          {/* Header & Filtros (Estilo Índice de Livro) */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid rgba(92, 64, 51, 0.3)",
              background: DND_THEME.paperBg,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Detalhe decorativo */}
            <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: 4, bgcolor: DND_THEME.gold }} />

            <Stack spacing={2}>
              <Box>
                <Typography variant="h4" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: DND_THEME.ink }}>
                  Mural de Missões
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: "Cinzel", color: "rgba(44,26,16,0.7)", mt: 0.5 }}>
                  O registro de contratos, destinos e lendas a serem desbravadas.
                </Typography>
              </Box>

              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  size="small"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Buscar nos registros..."
                  fullWidth
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#833c0b" }} /></InputAdornment>,
                    sx: { bgcolor: "rgba(255,255,255,0.5)", fontFamily: "Cinzel" },
                  }}
                />

                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  size="small"
                  sx={{ minWidth: 200, bgcolor: "rgba(255,255,255,0.5)", fontFamily: "Cinzel" }}
                  startAdornment={<InputAdornment position="start"><FilterListIcon sx={{ color: "#833c0b", fontSize: 20 }} /></InputAdornment>}
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
                    sx={{ "& .MuiInputBase-root": { bgcolor: "rgba(255,255,255,0.5)" } }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      size="small"
                      {...getTagProps({ index })}
                      sx={{ bgcolor: "#e0d0b0", color: "#2c1a10", fontWeight: 700, fontFamily: "Cinzel" }}
                    />
                  ))
                }
              />
            </Stack>
          </Paper>

          {loading ? (
            <Typography sx={{ textAlign: "center", mt: 4, fontStyle: "italic", color: "rgba(255,255,255,0.5)" }}>
              Consultando os pergaminhos...
            </Typography>
          ) : filtered.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: "center", bgcolor: "rgba(0,0,0,0.2)", color: "#fff" }}>
              <Typography sx={{ fontFamily: "Cinzel" }}>Nenhuma missão encontrada com estes critérios.</Typography>
            </Paper>
          ) : (
            <Stack spacing={4}>
              {filtered.map((c) => (
                <Box key={c.campaignId}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2, ml: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: DND_THEME.gold, mr: 1.5 }} />
                    <Typography variant="h5" sx={{ fontFamily: "Cinzel", fontWeight: 800, color: "#fff", letterSpacing: 1 }}>
                      {c.name}
                    </Typography>
                    <Typography variant="caption" sx={{ ml: 2, color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.2)", px: 1, borderRadius: 1 }}>
                      {c.quests.length}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "grid",
                      gap: 2,
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    }}
                  >
                    {c.quests.map((qt) => (
                      <QuestCard key={qt.id} uid={uid} campaignId={c.campaignId} quest={qt} />
                    ))}
                  </Box>
                </Box>
              ))}
            </Stack>
          )}
        </Stack>
      </motion.div>
    </Container>
  );
}