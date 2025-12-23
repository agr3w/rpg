import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";
import { Box, CircularProgress } from "@mui/material";

import AppLayout from "layouts/AppLayout";

// lazy-loaded pages
const Inicio = lazy(() => import("pages/Inicio"));
const BemVindo = lazy(() => import("pages/BemVindo"));
const MusicasPage = lazy(() => import("pages/musicas"));
const LivrosPage = lazy(() => import("pages/livros"));
const NotePage = lazy(() => import("pages/Notes"));
const FolderPage = lazy(() => import("pages/foldersPage"));
const FichaPage = lazy(() => import("pages/FichaCompleta/fichaCompleta"));
const FichaCriar = lazy(() => import("pages/FichaPage"));
const FichaDetalhes = lazy(() => import("pages/FichaDetalhes"));
const Login = lazy(() => import("pages/login"));
const Register = lazy(() => import("pages/Regsiter"));
const MapasPage = lazy(() => import("pages/MapasPage"));

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
            <Route path="/musicas" element={<MusicasPage />} />
            <Route path="/livros" element={<LivrosPage />} />
            <Route path="/anotacoes" element={<NotePage />} />
            <Route path="/folders/:folderId" element={<FolderPage />} />
            <Route path="/fichas" element={<FichaPage />} />
            <Route path="/criar-ficha" element={<FichaCriar />} />
            <Route path="/ficha-completa/:ID" element={<FichaDetalhes />} />
            <Route path="/mapas" element={<MapasPage />} />
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
