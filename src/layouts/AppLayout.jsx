import React, { useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { Box } from "@mui/material";

import { useAuth } from "contexts/AuthContext";
import { usePreferences } from "contexts/PreferencesContext";
import Nav from "components/nav";
import DragonTransition from "components/DragonTransition";
import RouteBackground from "components/RouteBackground";

import { ELEMENT_VARS, getElementFromPath } from "theme/elementTokens";
import { T_IN, T_OUT } from "../config/transitions";

export default function AppLayout() {
  const { user: usuarioAutenticado } = useAuth();
  const { prefs } = usePreferences();
  const location = useLocation();

  const isMapEditor = location.pathname.startsWith("/mapas/editor/");
  const isAuthRoute = location.pathname === "/login" || location.pathname === "/Registrar-se";

  if (isMapEditor) {
    return (
      <MotionConfig reducedMotion="never">
        <Box sx={{ width: "100vw", height: "100vh", overflow: "hidden", bgcolor: "#0d0f17", position: "fixed", inset: 0, zIndex: 999 }}>
          <Outlet />
        </Box>
      </MotionConfig>
    );
  }

  if (isAuthRoute) {
    return (
      <MotionConfig reducedMotion="never">
        <Box sx={{ width: "100%", minHeight: "100vh", position: "relative", m: 0, p: 0 }}>
          <Outlet />
        </Box>
      </MotionConfig>
    );
  }

  return (
    <MotionConfig reducedMotion="never">
      <Box sx={{ minHeight: "100vh", ...vars, position: "relative" }}>
      {/* ✅ background animado por rota */}
      <RouteBackground forceReduceMotion={Boolean(prefs.reduceMotion)} />

      {usuarioAutenticado ? <Nav /> : null}

      <Box sx={{ position: "relative", overflowX: "hidden", zIndex: 1 }}>
        <AnimatePresence mode="wait" initial={false}>
          {useSimpleTransition ? (
            <Box
              key={location.pathname}
              component={motion.div}
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: T_IN * 0.18, ease: "easeOut" } }}
              exit={{ opacity: 0, y: -6, filter: "blur(2px)", transition: { duration: T_OUT * 0.14, ease: "easeInOut" } }}
              sx={{ position: "relative" }}
            >
              <Outlet />
            </Box>
          ) : (
            <DragonTransition key={location.pathname} location={location}>
              <Outlet />
            </DragonTransition>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  </MotionConfig>
  );
}