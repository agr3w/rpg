import React, { useEffect, useMemo, useState } from "react";
import { Alert, Container, Divider, Paper, Stack, TextField, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { auth, database } from "APIs/firebaseConfig";
import { T_IN } from "config/transitions";
import { motion } from "framer-motion";
import NpcCard from "./components/NpcCard"; // ✅ add

const DEFAULT_CAMPAIGN_ID = "default";

export default function NpcsPage() {
  const user = auth.currentUser;
  const uid = user?.uid;

  const [searchParams] = useSearchParams();
  const activeCampaignId = searchParams.get("c") || "all";

  const [status] = useState({ type: "info", msg: "" });
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [q, setQ] = useState("");

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

        const npcs = Object.values(c?.npcs || {})
          .filter((n) => n?.id && n?.name)
          .sort((a, b) => String(a.name).localeCompare(String(b.name), "pt-BR"));

        return { campaignId, name, npcs };
      });

      arr.sort((a, b) => String(a.name).localeCompare(String(b.name), "pt-BR"));
      setCampaigns(arr);
      setLoading(false);
    };

    ref.on("value", handle);
    return () => ref.off("value", handle);
  }, [uid]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();

    const byCampaign =
      activeCampaignId === "all"
        ? campaigns
        : campaigns.filter((c) => c.campaignId === activeCampaignId || (activeCampaignId === "default" && c.campaignId === DEFAULT_CAMPAIGN_ID));

    if (!needle) return byCampaign;

    const hit = (npc) => {
      const name = String(npc?.name || "").toLowerCase();
      const desc = String(npc?.description || "").toLowerCase();
      const note = String(npc?.lastSeenNote || "").toLowerCase();
      const tags = Array.isArray(npc?.tags) ? npc.tags.join(" ").toLowerCase() : "";
      return name.includes(needle) || desc.includes(needle) || note.includes(needle) || tags.includes(needle);
    };

    return byCampaign
      .map((c) => ({ ...c, npcs: c.npcs.filter(hit) }))
      .filter((c) => c.npcs.length > 0);
  }, [campaigns, q, activeCampaignId]);

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { duration: T_IN * 0.18 } }}>
        <Stack spacing={2}>
          <Paper elevation={0} sx={{ p: 2.25, borderRadius: 3, border: "1px solid rgba(0,0,0,0.10)", bgcolor: "rgba(223, 214, 205, 0.92)" }}>
            <Stack spacing={0.75}>
              <Typography variant="h4" sx={{ fontWeight: 1000, color: "#2c1a10" }}>
                NPCs
              </Typography>

              <Typography sx={{ opacity: 0.85, color: "rgba(44,26,16,0.85)" }}>
                Todos os NPCs por campanha (privado do usuário).
              </Typography>

              <TextField
                label="Buscar NPC"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="nome, tag, descrição, nota rápida..."
                fullWidth
                sx={{ mt: 1 }}
              />

              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Dica: filtre por campanha com <code>?c=ID</code> (ou deixe <code>all</code>).
              </Typography>
            </Stack>
          </Paper>

          {status.msg ? <Alert severity={status.type}>{status.msg}</Alert> : null}

          {loading ? (
            <Typography sx={{ opacity: 0.8 }}>Carregando…</Typography>
          ) : filtered.length === 0 ? (
            <Typography sx={{ opacity: 0.85 }}>Nenhum NPC encontrado.</Typography>
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
                        {c.npcs.length} NPC(s)
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
                      {c.npcs.map((npc) => (
                        <NpcCard key={npc.id} uid={uid} campaignId={c.campaignId} npc={npc} />
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