import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Box } from "@mui/material";

import { useAuth } from "contexts/AuthContext";
import Nav from "components/nav";
import DragonTransition from "components/DragonTransition";

export default function AppLayout() {
  const { user: usuarioAutenticado } = useAuth();
  const location = useLocation();

  return (
    <Box sx={{ minHeight: "100vh" }}>
      {/* Nav fica montado (não desmonta a cada troca de rota) */}
      {usuarioAutenticado ? <Nav /> : null}

      {/* Transição aplicada somente no "conteúdo" das rotas */}
      <Box sx={{ position: "relative", overflowX: "hidden" }}>
        <AnimatePresence mode="wait" initial={false}>
          <DragonTransition key={location.pathname} location={location}>
            <Outlet />
          </DragonTransition>
        </AnimatePresence>
      </Box>
    </Box>
  );
}