import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicio from "pages/Inicio";
import MusicasPage from "pages/musicas";

function Rout() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/musicas" element={<MusicasPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default Rout;
