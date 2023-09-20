import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicio from "pages/Inicio";
import MusicasPage from "pages/musicas";
import LivrosPage from "pages/livros";
import NotePage from "pages/Notes";
import FolderPage from "pages/foldersPage";
import FichaPage from "pages/FichaCompleta/fichaCompleta";
import FichaCriar from "pages/FichaPage";
import FichaDetalhes from "pages/FichaDetalhes";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Login from "pages/login";
import Register from "pages/Regsiter";

function Rout() {
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    // Verificar o estado de autenticação do usuário
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // O usuário está autenticado
        setUsuarioAutenticado(user);
      } else {
        // O usuário não está autenticado
        setUsuarioAutenticado(null);
      }
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/*" element={<Inicio />} /> {/* Página 404 */}
        {!usuarioAutenticado && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/Registrar-se" element={<Register />} />
          </>
        )}
        {usuarioAutenticado && (
          <>
            <Route path="/musicas" element={<MusicasPage />} />
            <Route path="/livros" element={<LivrosPage />} />
            <Route path="/anotacoes" element={<NotePage />} />
            <Route path="/folders/:folderId" element={<FolderPage />} />
            <Route path="/fichas" element={<FichaPage />} />
            <Route path="/criar-ficha" element={<FichaCriar />} />
            <Route path="/ficha-completa/:ID" element={<FichaDetalhes />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default Rout;
