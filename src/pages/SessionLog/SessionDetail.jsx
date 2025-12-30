import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Chip, Container, Stack, Typography, Box } from "@mui/material";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { auth, database, firebase } from "APIs/firebaseConfig";
import { T_IN } from "config/transitions";
import { motion } from "framer-motion";

import SessionHeader from "./components/SessionHeader";
import XpPanel from "./components/XpPanel";
import NpcsSeenPanel from "./components/NpcsSeenPanel";
import QuestsPanel from "./components/QuestsPanel";
import LootPanel from "./components/LootPanel";

import RpgSection from "./components/RpgSection";

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
        <Typography sx={{ opacity: 0.8 }}>Carregando sessão…</Typography>
      </Container>
    );
  }

  if (!session) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">Sessão não encontrada.</Alert>
        <Button component={Link} to={`/diario?c=${encodeURIComponent(campaignId)}`} sx={{ mt: 2 }}>
          Voltar
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
        <Stack spacing={2}>
          <RpgSection
            title="Visão geral"
            subtitle="Um resumo rápido do que você registrou nesta sessão."
            actions={
              <Button component={Link} to={`/diario?c=${encodeURIComponent(campaignId)}`}>
                Voltar
              </Button>
            }
          >
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
              <Chip
                label={`XP pendente total: ${overview.pendingXp >= 0 ? `+${overview.pendingXp}` : overview.pendingXp}`}
                variant="outlined"
              />
              <Chip label={`NPCs vistos: ${overview.npcsCount}`} variant="outlined" />
              <Chip label={`Quests tocadas: ${overview.questsCount}`} variant="outlined" />
              <Chip label={`Loot adicionado: ${overview.lootCount}`} variant="outlined" />
              <Chip
                label={linkedFichaId ? "Ficha vinculada: OK" : "Ficha vinculada: nenhuma"}
                color={linkedFichaId ? "success" : "default"}
                variant="outlined"
              />
            </Stack>
          </RpgSection>

          {status.msg ? <Alert severity={status.type}>{status.msg}</Alert> : null}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.35fr 1fr" },
              gap: 2,
              alignItems: "start",
            }}
          >
            <Stack spacing={2}>
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

            <Stack spacing={2}>
              <XpPanel
                uid={uid}
                linkedFichaId={linkedFichaId}
                sessionRef={sessionRef}
                session={session}
                setStatus={setStatus}
              />

              <NpcsSeenPanel
                uid={uid}
                campaignId={campaignId}
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
            </Stack>
          </Box>
        </Stack>
      </motion.div>
    </Container>
  );
}