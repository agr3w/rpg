import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicio from "pages/Inicio";
import MusicasPage from "pages/musicas";
import LivrosPage from "pages/livros";
import NotePage from "pages/Notes";
import FolderPage from "pages/foldersPage";
import FichaPage from "pages/FichaPage/fichaCompleta";
import FichaCriar from "pages/FichaPage";
import FichaDetalhes from "pages/FichaDetalhes";

function Rout() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/musicas" element={<MusicasPage />} />
          <Route path="/livros" element={<LivrosPage />} />
          <Route path="/anotacoes" element={<NotePage />} />
          <Route path="/folders/:folderId" element={<FolderPage/>} />
          <Route path="/fichas" element={< FichaPage/>} />
          <Route path="/criar-ficha" element={<FichaCriar />} />
          <Route path='/ficha-completa/:nome' element={<FichaDetalhes />} />
        </Routes>
      </Router>
    </>
  );
}

export default Rout;
