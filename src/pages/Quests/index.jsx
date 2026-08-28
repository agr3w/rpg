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
import { auth } from "APIs/firebaseConfig";
import { T_IN } from "config/transitions";
import { motion } from "framer-motion";
import QuestCard from "./components/QuestCard";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useQuests } from "hooks/useQuests";
import { useDebounce } from "hooks/useDebounce";

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
  const campaignId = searchParams.get("c") || DEFAULT_CAMPAIGN_ID;
  const campaignMode = searchParams.get("m") === "shared" ? "shared" : "legacy";

  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 200);
  const [statusFilter, setStatusFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState([]);

  const { campaigns, loading } = useQuests(uid, campaignMode, campaignId);

  const tagOptions = useMemo(() => {
    const set = new Set();
    campaigns.forEach((c) => {
      c.quests.forEach((qt) => {
        (Array.isArray(qt.tags) ? qt.tags : []).forEach((t) => set.add(String(t)));
      });
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [campaigns]);

  const filtered = useMemo(() => {
    const needle = debouncedQ.trim().toLowerCase();
    const tagsNeed = new Set(tagFilter.map((t) => String(t).toLowerCase()));

    return campaigns
      .map((c) => {
        const matchingQuests = c.quests.filter((qt) => {
          const matchText =
            !needle ||
            String(qt.title || "").toLowerCase().includes(needle) ||
            String(qt.description || "").toLowerCase().includes(needle);

          const matchStatus = statusFilter === "all" || qt.status === statusFilter;

          const qtTags = new Set((Array.isArray(qt.tags) ? qt.tags : []).map((t) => String(t).toLowerCase()));
          const matchTags =
            tagsNeed.size === 0 || Array.from(tagsNeed).every((t) => qtTags.has(t));

          return matchText && matchStatus && matchTags;
        });

        return { ...c, quests: matchingQuests };
      })
      .filter((c) => c.quests.length > 0);
  }, [campaigns, debouncedQ, statusFilter, tagFilter]);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
        <Stack spacing={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
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
              <Box>
                <Typography variant="h4" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: "secondary.main" }}>
                  Contratos & Quests
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: "Cinzel", color: "text.secondary", mt: 0.5 }}>
                  Painel das missões ativas, pendentes e concluídas com foco narrativo para sessão.
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
                    startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "primary.main" }} /></InputAdornment>,
                    sx: { bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.9)"), fontFamily: "Cinzel" },
                  }}
                />

                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  size="small"
                  sx={{ minWidth: 200, bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.9)"), fontFamily: "Cinzel" }}
                  startAdornment={<InputAdornment position="start"><FilterListIcon sx={{ color: "primary.main", fontSize: 20 }} /></InputAdornment>}
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
                    sx={{ "& .MuiInputBase-root": { bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.9)") } }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      key={option}
                      label={option}
                      size="small"
                      {...getTagProps({ index })}
                      sx={{ bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(229,179,36,0.15)" : "#e0d0b0"), color: "text.primary", fontWeight: 700, fontFamily: "Cinzel" }}
                    />
                  ))
                }
              />
            </Stack>
          </Paper>

          {loading ? (
            <Typography sx={{ textAlign: "center", mt: 4, fontStyle: "italic", color: "text.secondary" }}>
              Consultando os pergaminhos...
            </Typography>
          ) : filtered.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: "center", bgcolor: "rgba(0,0,0,0.2)", color: "text.primary" }}>
              <Typography sx={{ fontFamily: "Cinzel" }}>Nenhuma missão encontrada com estes critérios.</Typography>
            </Paper>
          ) : (
            <Stack spacing={4}>
              {filtered.map((c) => (
                <Box key={c.campaignId}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2, ml: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "secondary.main", mr: 1.5 }} />
                    <Typography variant="h5" sx={{ fontFamily: "Cinzel", fontWeight: 800, color: "text.primary", letterSpacing: 1 }}>
                      {c.name}
                    </Typography>
                    <Typography variant="caption" sx={{ ml: 2, color: "text.secondary", border: (t) => `1px solid ${t.palette.rpg?.stroke || "rgba(255,255,255,0.2)"}`, px: 1, borderRadius: 1 }}>
                      {c.quests.length}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "grid",
                      gap: 2,
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                    }}
                  >
                    {c.quests.map((qt) => (
                      <QuestCard key={qt.id} uid={uid} campaignId={c.campaignId} campaignMode={campaignMode} quest={qt} />
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