import React, { useEffect, useMemo, useState } from "react";
import { Alert, Box, Container, Divider, Paper, Stack, TextField, Typography, Chip } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { auth } from "APIs/firebaseConfig";
import { T_IN } from "config/transitions";
import { motion } from "framer-motion";
import NpcCard from "./components/NpcCard";
import { useCampaigns } from "hooks/useCampaigns";
import { useDebounce } from "hooks/useDebounce";

const DEFAULT_CAMPAIGN_ID = "default";

export default function NpcsPage() {
  const user = auth.currentUser;
  const uid = user?.uid;

  const [searchParams] = useSearchParams();
  const activeCampaignId = searchParams.get("c") || "all";
  const campaignMode = searchParams.get("m") === "shared" ? "shared" : "legacy";

  const [status] = useState({ type: "info", msg: "" });
  const { campaigns, loading } = useCampaigns(uid, campaignMode, activeCampaignId);
  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 200);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const filtered = useMemo(() => {
    const needle = debouncedQ.trim().toLowerCase();

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
      .map((c) => ({ ...c, npcs: (c?.npcs || []).filter(hit) }))
      .filter((c) => c.npcs.length > 0);
  }, [campaigns, debouncedQ, activeCampaignId]);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { duration: T_IN * 0.18 } }}>
        <Stack spacing={2}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 3,
              border: "1px solid rgba(191,143,0,0.35)",
              bgcolor: "rgba(32, 18, 12, 0.78)",
              color: "#f7eddc",
              backgroundImage:
                "radial-gradient(120% 140% at 0% 0%, rgba(191,143,0,0.18) 0%, transparent 45%), radial-gradient(130% 160% at 100% 100%, rgba(131,60,11,0.25) 0%, transparent 52%)",
              backdropFilter: "blur(4px)",
            }}
          >
            <Stack spacing={0.75}>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <Typography variant="h4" sx={{ fontWeight: 1000, color: "#ffcf70", fontFamily: "Cinzel" }}>
                  Retratos de NPCs
                </Typography>
                <Chip size="small" label="Arquivo da campanha" sx={{ bgcolor: "rgba(191,143,0,0.2)", color: "#ffe1a4", border: "1px solid rgba(191,143,0,0.45)" }} />
              </Stack>

              <Typography sx={{ opacity: 0.9, color: "rgba(255, 236, 203, 0.95)" }}>
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
                  "& .MuiOutlinedInput-root": { bgcolor: "rgba(255,255,255,0.9)" },
                }}
              />

              <Typography variant="caption" sx={{ opacity: 0.85 }}>
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
            <Stack spacing={2} component={motion.div} variants={containerVariants} initial="hidden" animate="show">
              {filtered.map((c) => (
                <Paper
                  key={c.campaignId}
                  component={motion.div}
                  variants={itemVariants}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    border: "1px solid rgba(191,143,0,0.25)",
                    bgcolor: "rgba(255, 248, 233, 0.95)",
                    boxShadow: "0 16px 30px rgba(0,0,0,0.18)",
                  }}
                >
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ gap: 1, flexWrap: "wrap" }}>
                      <Typography variant="h6" sx={{ fontWeight: 950, fontFamily: "Cinzel", color: "#482712" }}>
                        {c.name}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.75, fontWeight: 700 }}>
                        {c.npcs.length} NPC(s)
                      </Typography>
                    </Stack>

                    <Divider />

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
              ))}
            </Stack>
          )}
        </Stack>
      </motion.div>
    </Container>
  );
}