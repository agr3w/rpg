import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { getElementFromPath } from "theme/elementTokens";
import { getRouteBackgroundUrl } from "theme/routeBackgrounds";

export default function RouteBackground({ forceReduceMotion = false }) {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  const element = useMemo(() => getElementFromPath(location.pathname), [location.pathname]);

  // ✅ prioridade: rota -> elemento
  const bgUrl = useMemo(() => getRouteBackgroundUrl(location.pathname), [location.pathname]);

  const noAnim = Boolean(forceReduceMotion || prefersReducedMotion);

  // Overlay “D&D”: vignette + contraste + leve textura via gradientes
  const overlay = `
    radial-gradient(120% 80% at 50% 0%, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 62%, rgba(0,0,0,0.70) 100%),
    linear-gradient(180deg, rgba(0,0,0,0.28), rgba(0,0,0,0.52))
  `;

  return (
    <motion.div
      key={`${location.pathname}:${bgUrl || element}`}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",

        backgroundColor: "var(--rpg-surface)",
        backgroundImage: bgUrl ? `${overlay}, url(${bgUrl})` : overlay,
        backgroundRepeat: "no-repeat",
        backgroundSize: bgUrl ? "cover" : "160% 160%",
        backgroundPosition: "center",

        // dá “impacto” sem deixar ilegível
        filter: bgUrl ? "saturate(1.1) contrast(1.05)" : "none",
        opacity: 1,
        willChange: noAnim ? "auto" : "transform",
      }}
      animate={
        noAnim
          ? { scale: 1, x: 0, y: 0 }
          : { scale: [1.03, 1.07, 1.03], x: [0, 10, 0], y: [0, -8, 0] }
      }
      transition={noAnim ? { duration: 0 } : { duration: 18, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}