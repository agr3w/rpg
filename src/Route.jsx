import React, { useEffect, useState, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth } from "APIs/firebaseConfig";
import { Box, CircularProgress } from "@mui/material";

// lazy-loaded pages
const Inicio = lazy(() => import("pages/Inicio"));
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

function Rout() {
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null);

  useEffect(() => {
    // usar o auth (compat) exportado em src/APIs/firebaseConfig.js
    const unsub = auth.onAuthStateChanged((user) => {
      setUsuarioAutenticado(user || null);
    });

    return () => unsub();
  }, []);

  const Loader = (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Router>
      <Suspense fallback={Loader}>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/*" element={<Inicio />} /> {/* Página 404 fallback */}

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
        </Routes>
      </Suspense>
    </Router>
  );
}

export default Rout;
