import React, { useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Box } from "@mui/material";

import { useAuth } from "contexts/AuthContext";
import Nav from "components/nav";
import DragonTransition from "components/DragonTransition";

import { ELEMENT_VARS, getElementFromPath } from "theme/elementTokens";

export default function AppLayout() {
  const { user: usuarioAutenticado } = useAuth();
  const location = useLocation();

  const element = useMemo(() => getElementFromPath(location.pathname), [location.pathname]);
  const vars = ELEMENT_VARS[element] || ELEMENT_VARS.void;

  return (
    <Box sx={{ minHeight: "100vh", ...vars }}>
      {usuarioAutenticado ? <Nav /> : null}

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