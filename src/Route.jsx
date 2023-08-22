import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicio from "pages/Inicio";
import MusicasPage from "pages/musicas";
import LivrosPage from "pages/livros";
import NotePage from "pages/Notes";
import ViewNotePage from "components/NotesPage/ViewNote";

function Rout() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/musicas" element={<MusicasPage />} />
          <Route path="/livros" element={<LivrosPage />} />
          <Route path="/anotacoes" element={<NotePage />} />
          <Route path="/view-note/:noteId" component={<ViewNotePage />} />
          {/* Rota para a página de visualização */}
        </Routes>
      </Router>
    </>
  );
}

export default Rout;
