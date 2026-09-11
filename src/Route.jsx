import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { useAuth } from "contexts/AuthContext";
import { auth } from "APIs/firebaseConfig";
import { Box, CircularProgress } from "@mui/material";

import AppLayout from "layouts/AppLayout";
import AudioLayout from "layouts/AudioLayout";
import NotesLayout from "layouts/NotesLayout";
import MapsLayout from "layouts/MapsLayout";

// lazy-loaded pages
const Inicio = lazy(() => import("pages/Inicio"));
const LandingPage = lazy(() => import("pages/LandingPage"));
const BemVindo = lazy(() => import("pages/BemVindo"));
const MusicasPage = lazy(() => import("pages/musicas"));
const NotePage = lazy(() => import("pages/Notes"));
const FolderPage = lazy(() => import("pages/foldersPage"));
const FichaPage = lazy(() => import("pages/FichaCompleta/fichaCompleta"));
const FichaCriar = lazy(() => import("pages/FichaPage"));
const FichaDetalhes = lazy(() => import("pages/FichaDetalhes"));
const Login = lazy(() => import("pages/login"));
const Register = lazy(() => import("pages/Regsiter"));
const MapasPage = lazy(() => import("pages/MapasPage"));
const Perfil = lazy(() => import("pages/ProfilePage"));
const SessionLog = lazy(() => import("pages/SessionLog"));
const SessionLogDetail = lazy(() => import("pages/SessionLog/SessionDetail"));
const NpcsPage = lazy(() => import("pages/Npcs"));
const NpcDetail = lazy(() => import("pages/Npcs/NpcDetail"));
const QuestsPage = lazy(() => import("pages/Quests"));
const QuestDetail = lazy(() => import("pages/Quests/QuestDetail"));
const MapEditor = lazy(() => import("pages/MapEditor"));
const AdminPage = lazy(() => import("pages/Admin"));
const PlayerSessionView = lazy(() => import("views/PlayerSessionView"));

// Carregamento ultraleve com visual temático
export const FallbackScreen = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      width: "100vw",
      backgroundColor: "#0d0907",
      color: "#c9a26b",
      fontFamily: "Georgia, Cinzel, serif"
    }}
  >
    <div
      style={{
        width: "44px",
        height: "44px",
        border: "3px solid #3d2817",
        borderTopColor: "#bf8f00",
        borderRadius: "50%",
        animation: "grimorioSpin 0.8s linear infinite",
        marginBottom: "1.2rem"
      }}
    />
    <style>{`@keyframes grimorioSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    <span style={{ letterSpacing: "2px", fontSize: "0.85rem", fontWeight: 700 }}>
      CARREGANDO GRIMÓRIO...
    </span>
  </div>
);

export function RotaProtegida({ children }) {
  const { user, loading } = useAuth();
  const currentUser = user || auth.currentUser;

  if (loading) {
    return <FallbackScreen />;
  }

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export function RotaAdmin({ children, isAdmin }) {
  const { user, loading } = useAuth();
  const currentUser = user || auth.currentUser;

  if (loading) {
    return <FallbackScreen />;
  }

  if (!currentUser || !isAdmin) {
    return <Navigate to="/inicio" replace />;
  }

  return children;
}

const AppRoutes = () => {
  const { user: usuarioAutenticado } = useAuth();

  const MY_ADMIN_UID =
    import.meta.env?.VITE_REACT_APP_ADMIN_UID ||
    import.meta.env?.VITE_ADMIN_UID ||
    "hKYEhI9JIEPOS2RSON7tsviLzjV2";
  const isAdmin = (usuarioAutenticado?.uid || auth.currentUser?.uid) === MY_ADMIN_UID;

  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* 🗺️ Rota de Sessão VTT dos Jogadores (Pública ou com Senha) */}
        <Route path="/sessao/:sessionId" element={<PlayerSessionView />} />

        {/* 🌟 Vitrine Pública da Plataforma (Landing Page) */}
        <Route path="/landing" element={<LandingPage />} />

        {/* ✅ Home dinâmica: HUB (/inicio) quando logado / Landing Page quando visitante */}
        <Route path="/" element={usuarioAutenticado ? <Navigate to="/inicio" replace /> : <LandingPage />} />

        {!usuarioAutenticado ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/Registrar-se" element={<Register />} />
            <Route path="/register" element={<Register />} />
            <Route path="/*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            {/* Se já estiver autenticado, redireciona tentativas de login/registro para /inicio */}
            <Route path="/login" element={<Navigate to="/inicio" replace />} />
            <Route path="/Registrar-se" element={<Navigate to="/inicio" replace />} />
            <Route path="/register" element={<Navigate to="/inicio" replace />} />

            <Route path="/inicio" element={<RotaProtegida><Inicio /></RotaProtegida>} />
            {/* 🎵 Taverna / Músicas */}
            <Route element={<AudioLayout />}>
              <Route path="/Taverna-do-Bardo" element={<RotaProtegida><MusicasPage /></RotaProtegida>} />
            </Route>

            {/* 📚 Biblioteca / Notas / Pastas */}
            <Route element={<NotesLayout />}>
              <Route path="/Biblioteca-Arcana" element={<RotaProtegida><NotePage /></RotaProtegida>} />
              <Route path="/folders/:folderId" element={<RotaProtegida><FolderPage /></RotaProtegida>} />
            </Route>

            {/* 🗺️ Mapas / Editor */}
            <Route element={<MapsLayout />}>
              <Route path="/mapas" element={<RotaProtegida><MapasPage /></RotaProtegida>} />
              <Route path="/mapas/editor/:mapId" element={<RotaProtegida><MapEditor /></RotaProtegida>} />
            </Route>

            <Route path="/fichas" element={<RotaProtegida><FichaPage /></RotaProtegida>} />
            <Route path="/criar-ficha" element={<RotaProtegida><FichaCriar /></RotaProtegida>} />
            <Route path="/ficha-completa/:ID" element={<RotaProtegida><FichaDetalhes /></RotaProtegida>} />
            <Route path="/perfil" element={<RotaProtegida><Perfil /></RotaProtegida>} />
            <Route path="/diario" element={<RotaProtegida><SessionLog /></RotaProtegida>} />
            <Route path="/diario/:sessionId" element={<RotaProtegida><SessionLogDetail /></RotaProtegida>} />
            <Route path="/npcs" element={<RotaProtegida><NpcsPage /></RotaProtegida>} />
            <Route path="/npcs/:npcId" element={<RotaProtegida><NpcDetail /></RotaProtegida>} />
            <Route path="/quests" element={<RotaProtegida><QuestsPage /></RotaProtegida>} />
            <Route path="/quests/:questId" element={<RotaProtegida><QuestDetail /></RotaProtegida>} />
            
            {/* ✅ Rota Secreta */}
            <Route path="/master-control" element={<RotaAdmin isAdmin={isAdmin}><AdminPage /></RotaAdmin>} />
            
            <Route path="/home" element={<Navigate to="/inicio" replace />} />
            <Route path="/*" element={<Inicio />} />
          </>
        )}
      </Route>
    </Routes>
  );
};

function Rout() {
  const { loading: authLoading } = useAuth();

  if (authLoading) return <FallbackScreen />;

  return (
    <div style={{ position: "relative", overflowX: "hidden" }}>
      <MotionConfig reducedMotion="never">
        <Router>
          <Suspense fallback={<FallbackScreen />}>
            <AppRoutes />
          </Suspense>
        </Router>
      </MotionConfig>
    </div>
  );
}

export default Rout;
