import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";
import { Box, CircularProgress } from "@mui/material";

import AppLayout from "layouts/AppLayout";
import AudioLayout from "layouts/AudioLayout";
import NotesLayout from "layouts/NotesLayout";
import MapsLayout from "layouts/MapsLayout";

// lazy-loaded pages
const Inicio = lazy(() => import("pages/Inicio"));
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

const AppRoutes = () => {
  const { user: usuarioAutenticado } = useAuth();

  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* ✅ Home separada: HUB quando logado / BemVindo quando não */}
        <Route path="/" element={usuarioAutenticado ? <Inicio /> : <BemVindo />} />
        <Route path="/*" element={usuarioAutenticado ? <Inicio /> : <BemVindo />} />

        {!usuarioAutenticado ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/Registrar-se" element={<Register />} />
          </>
        ) : (
          <>
            {/* 🎵 Taverna / Músicas */}
            <Route element={<AudioLayout />}>
              <Route path="/Taverna-do-Bardo" element={<MusicasPage />} />
            </Route>

            {/* 📚 Biblioteca / Notas / Pastas */}
            <Route element={<NotesLayout />}>
              <Route path="/Biblioteca-Arcana" element={<NotePage />} />
              <Route path="/folders/:folderId" element={<FolderPage />} />
            </Route>

            {/* 🗺️ Mapas / Editor */}
            <Route element={<MapsLayout />}>
              <Route path="/mapas" element={<MapasPage />} />
              <Route path="/mapas/editor/:mapId" element={<MapEditor />} />
            </Route>

            <Route path="/fichas" element={<FichaPage />} />
            <Route path="/criar-ficha" element={<FichaCriar />} />
            <Route path="/ficha-completa/:ID" element={<FichaDetalhes />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/diario" element={<SessionLog />} />
            <Route path="/diario/:sessionId" element={<SessionLogDetail />} />
            <Route path="/npcs" element={<NpcsPage />} />
            <Route path="/npcs/:npcId" element={<NpcDetail />} />
            <Route path="/quests" element={<QuestsPage />} />
            <Route path="/quests/:questId" element={<QuestDetail />} />
            
            {/* ✅ Rota Secreta */}
            <Route path="/master-control" element={<AdminPage />} />
            
            <Route path="/*" element={<Inicio />} />
          </>
        )}
      </Route>
    </Routes>
  );
};

function Rout() {
  const { loading: authLoading } = useAuth();

  const Loader = (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", bgcolor: "#eceff1" }}>
      <CircularProgress size={60} sx={{ color: "#833c0b" }} />
    </Box>
  );

  if (authLoading) return Loader;

  return (
    <div style={{ position: "relative", overflowX: "hidden" }}>
      <Router>
        <Suspense fallback={Loader}>
          <AppRoutes />
        </Suspense>
      </Router>
    </div>
  );
}

export default Rout;
