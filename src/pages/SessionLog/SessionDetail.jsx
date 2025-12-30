import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Chip, Container, Stack, Typography, Box, Paper } from "@mui/material";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { auth, database, firebase } from "APIs/firebaseConfig";
import { T_IN } from "config/transitions";
import { motion } from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import SessionHeader from "./components/SessionHeader";
import XpPanel from "./components/XpPanel";
import NpcsSeenPanel from "./components/NpcsSeenPanel";
import QuestsPanel from "./components/QuestsPanel";
import LootPanel from "./components/LootPanel";

import RpgSection from "components/RpgSection";

const DEFAULT_CAMPAIGN_ID = "default";

export default function SessionLogDetail() {
  const user = auth.currentUser;
  const uid = user?.uid;

  const { sessionId } = useParams();
  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get("c") || DEFAULT_CAMPAIGN_ID;

  const [status, setStatus] = useState({ type: "info", msg: "" });
  const [loading, setLoading] = useState(true);

  const [session, setSession] = useState(null);

  const baseRef = useMemo(() => {
    if (!uid || !campaignId || !sessionId) return null;
    return database.ref(`users/${uid}/campaigns/${campaignId}`);
  }, [uid, campaignId, sessionId]);

  const sessionRef = useMemo(() => {
    if (!baseRef) return null;
    return baseRef.child(`sessionLogs/${sessionId}`);
  }, [baseRef, sessionId]);

  const [fichas, setFichas] = useState([]);
  const [linkedFichaId, setLinkedFichaId] = useState("");

  useEffect(() => {
    if (!uid || !sessionRef) {
      setLoading(false);
      return;
    }

    const handle = (snap) => {
      setSession(snap.val() || null);
      setLoading(false);
    };

    sessionRef.on("value", handle);

    const fichasRef = database.ref(`fichas/${uid}`);
    const handleFichas = (snap) => {
      const data = snap.val();
      const arr = data ? Object.values(data) : [];
      arr.sort((a, b) => String(a.nome || "").localeCompare(String(b.nome || ""), "pt-BR"));
      setFichas(arr);
    };
    fichasRef.on("value", handleFichas);

    const metaRef = database.ref(`users/${uid}/campaigns/${campaignId}/meta`);
    const handleMeta = (snap) => {
      const v = snap.val();
      setLinkedFichaId(v?.linkedFichaId || "");
    };
    metaRef.on("value", handleMeta);

    return () => {
      sessionRef.off("value", handle);
      fichasRef.off("value", handleFichas);
      metaRef.off("value", handleMeta);
    };
  }, [uid, sessionRef, campaignId]);

  const updateSession = async (patch) => {
    if (!sessionRef) return;
    await sessionRef.update({
      ...patch,
      updatedAt: firebase.database.ServerValue.TIMESTAMP,
    });
  };

  const saveLinkedFicha = async (newId) => {
    setStatus({ type: "info", msg: "" });
    if (!uid) return;
    try {
      await database.ref(`users/${uid}/campaigns/${campaignId}/meta`).update({
        linkedFichaId: newId || "",
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });
      setStatus({ type: "success", msg: "Ficha da campanha vinculada." });
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || "Erro ao vincular ficha." });
    }
  };

  const overview = useMemo(() => {
    const xpEntries = session?.xpEntries ? Object.values(session.xpEntries) : [];
    const pendingXp = xpEntries
      .filter((e) => e && !e.appliedToFichaAt)
      .reduce((acc, e) => acc + Number(e.amount || 0), 0);

    const npcsCount = session?.npcsSeen ? Object.keys(session.npcsSeen).length : 0;
    const questsCount = session?.quests ? Object.keys(session.quests).length : 0;
    const lootCount = session?.loot ? Object.keys(session.loot).length : 0;

    return { pendingXp, npcsCount, questsCount, lootCount };
  }, [session]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography sx={{ opacity: 0.8, fontFamily: "Cinzel" }}>Consultando os arquivos...</Typography>
      </Container>
    );
  }

  if (!session) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">Sessão não encontrada nos registros.</Alert>
        <Button component={Link} to={`/diario?c=${encodeURIComponent(campaignId)}`} sx={{ mt: 2 }}>
          Voltar ao Grimório
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0, transition: { duration: T_IN * 0.18 } }}
      >
        <Stack spacing={3}>
          {/* Header de Navegação */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Button 
              component={Link} 
              to={`/diario?c=${encodeURIComponent(campaignId)}`}
              startIcon={<ArrowBackIcon />}
              sx={{ color: "#5c4033", fontFamily: "Cinzel", fontWeight: 700 }}
            >
              Voltar ao Diário
            </Button>
          </Box>

          {/* Resumo Rápido (Estilo Faixa de Papel) */}
          <Paper 
            elevation={0}
            sx={{
              p: 2,
              bgcolor: "#fffbf0",
              border: "1px solid rgba(92, 64, 51, 0.2)",
              borderLeft: "4px solid #bf8f00",
              borderRadius: 1
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
              <Typography variant="subtitle2" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: "#2c1a10" }}>
                RESUMO DA SESSÃO:
              </Typography>
              <Chip
                label={`XP Pendente: ${overview.pendingXp >= 0 ? `+${overview.pendingXp}` : overview.pendingXp}`}
                size="small"
                sx={{ bgcolor: "rgba(191, 143, 0, 0.15)", color: "#58180D", fontWeight: 700, border: "1px solid rgba(191, 143, 0, 0.3)" }}
              />
              <Chip label={`NPCs: ${overview.npcsCount}`} size="small" variant="outlined" sx={{ borderColor: "rgba(92, 64, 51, 0.3)" }} />
              <Chip label={`Quests: ${overview.questsCount}`} size="small" variant="outlined" sx={{ borderColor: "rgba(92, 64, 51, 0.3)" }} />
              <Chip label={`Loot: ${overview.lootCount}`} size="small" variant="outlined" sx={{ borderColor: "rgba(92, 64, 51, 0.3)" }} />
              
              <Box sx={{ flexGrow: 1 }} />
              
              <Chip
                label={linkedFichaId ? "Vínculo Ativo" : "Sem Vínculo"}
                size="small"
                sx={{ 
                  bgcolor: linkedFichaId ? "#e8f5e9" : "#ffebee", 
                  color: linkedFichaId ? "#1b5e20" : "#c62828",
                  fontWeight: 700,
                  fontFamily: "Cinzel"
                }}
              />
            </Stack>
          </Paper>

          {status.msg ? <Alert severity={status.type} sx={{ borderRadius: 2 }}>{status.msg}</Alert> : null}

          {/* Grid Principal */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.5fr 1fr" },
              gap: 3,
              alignItems: "start",
            }}
          >
            {/* Coluna Esquerda: Narrativa e Quests */}
            <Stack spacing={3}>
              <SessionHeader
                uid={uid}
                campaignId={campaignId}
                session={session}
                fichas={fichas}
                linkedFichaId={linkedFichaId}
                onLinkedFichaChange={saveLinkedFicha}
                onUpdateSession={updateSession}
              />

              <QuestsPanel
                uid={uid}
                campaignId={campaignId}
                sessionRef={sessionRef}
                session={session}
                setStatus={setStatus}
              />
            </Stack>

            {/* Coluna Direita: Mecânicas (XP, Loot, NPCs) */}
            <Stack spacing={3}>
              <XpPanel
                uid={uid}
                linkedFichaId={linkedFichaId}
                sessionRef={sessionRef}
                session={session}
                setStatus={setStatus}
              />

              <LootPanel
                uid={uid}
                campaignId={campaignId}
                sessionRef={sessionRef}
                session={session}
                fichas={fichas}
                linkedFichaId={linkedFichaId}
                setStatus={setStatus}
              />

              <NpcsSeenPanel
                uid={uid}
                campaignId={campaignId}
                sessionRef={sessionRef}
                session={session}
                setStatus={setStatus}
              />
            </Stack>
          </Box>
        </Stack>
      </motion.div>
    </Container>
  );
}