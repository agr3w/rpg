import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Container,
  Divider,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  Autocomplete,
  Chip,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { auth, database } from "APIs/firebaseConfig";
import { T_IN } from "config/transitions";
import { motion } from "framer-motion";
import QuestCard from "./components/QuestCard";

const DEFAULT_CAMPAIGN_ID = "default";

const STATUS_OPTIONS = [
  { value: "all", label: "Todas" },
  { value: "ativa", label: "Ativas" },
  { value: "pendente", label: "Pendentes" },
  { value: "concluida", label: "Concluídas" },
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
        <Stack spacing={2}>
          <Paper elevation={0} sx={{ p: 2.25, borderRadius: 3, border: "1px solid rgba(0,0,0,0.10)", bgcolor: "rgba(223, 214, 205, 0.92)" }}>
            <Stack spacing={0.75}>
              <Typography variant="h4" sx={{ fontWeight: 1000, color: "#2c1a10" }}>
                Quests
              </Typography>

              <Typography sx={{ opacity: 0.85, color: "rgba(44,26,16,0.85)" }}>
                Quests por campanha, com status e links para sessões.
              </Typography>

              <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
                <TextField
                  label="Buscar"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="título, tags, descrição, nota rápida..."
                  fullWidth
                />

                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} size="small" sx={{ minWidth: 180 }}>
                  {STATUS_OPTIONS.map((s) => (
                    <MenuItem key={s.value} value={s.value}>
                      {s.label}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>

              <Autocomplete
                multiple
                options={tagOptions}
                value={tagFilter}
                onChange={(_, v) => setTagFilter(v)}
                renderInput={(params) => <TextField {...params} label="Filtrar por tags" placeholder="Selecione tags" />}
              />

              {tagFilter.length ? (
                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                  {tagFilter.map((t) => (
                    <Chip key={t} label={t} onDelete={() => setTagFilter((arr) => arr.filter((x) => x !== t))} />
                  ))}
                </Stack>
              ) : null}

              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Dica: filtre por campanha com <code>?c=ID</code> (ou deixe <code>all</code>).
              </Typography>
            </Stack>
          </Paper>

          {loading ? (
            <Typography sx={{ opacity: 0.8 }}>Carregando…</Typography>
          ) : filtered.length === 0 ? (
            <Typography sx={{ opacity: 0.85 }}>Nenhuma quest encontrada.</Typography>
          ) : (
            <Stack spacing={2}>
              {filtered.map((c) => (
                <Paper key={c.campaignId} elevation={0} sx={{ p: 2, borderRadius: 3, border: "1px solid rgba(0,0,0,0.10)" }}>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ gap: 1, flexWrap: "wrap" }}>
                      <Typography variant="h6" sx={{ fontWeight: 950 }}>
                        {c.name}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.75 }}>
                        {c.quests.length} quest(s)
                      </Typography>
                    </Stack>

                    <Divider />

                    <Stack
                      sx={{
                        display: "grid",
                        gap: 1.25,
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      }}
                    >
                      {c.quests.map((qt) => (
                        <QuestCard key={qt.id} uid={uid} campaignId={c.campaignId} quest={qt} />
                      ))}
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}
        </Stack>
      </motion.div>
    </Container>
  );
}