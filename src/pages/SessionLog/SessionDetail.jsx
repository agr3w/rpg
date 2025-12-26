import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Container, Paper, Stack, Typography } from "@mui/material";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { auth, database, firebase } from "APIs/firebaseConfig";
import { T_IN } from "config/transitions";
import { motion } from "framer-motion";

import SessionHeader from "./components/SessionHeader";
import XpPanel from "./components/XpPanel";
import NpcsSeenPanel from "./components/NpcsSeenPanel";
import QuestsPanel from "./components/QuestsPanel";
import LootPanel from "./components/LootPanel";

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

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography sx={{ opacity: 0.8 }}>Carregando sessão…</Typography>
      </Container>
    );
  }

  if (!session) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">Sessão não encontrada.</Alert>
        <Button component={Link} to={`/diario?c=${encodeURIComponent(campaignId)}`} sx={{ mt: 2 }}>
          Voltar
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0, transition: { duration: T_IN * 0.18 } }}
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

          {status.msg ? (
            <Alert severity={status.type}>{status.msg}</Alert>
          ) : null}

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

          <QuestsPanel
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

          <Paper
            elevation={0}
            sx={{
              p: 2.25,
              borderRadius: 3,
              border: "1px solid rgba(0,0,0,0.10)",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 950, mb: 1 }}>
              Estrutura da sessão (em construção)
            </Typography>
            <Typography sx={{ opacity: 0.8 }}>
              Próximo: tags/filtro/busca e links para anotações/ficha.
            </Typography>
          </Paper>
        </Stack>
      </motion.div>
    </Container>
  );
}