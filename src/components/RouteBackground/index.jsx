import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { getElementFromPath } from "theme/elementTokens";
import { pickBackgroundUrl } from "theme/routeBackgrounds";

export default function RouteBackground({ forceReduceMotion = false }) {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  const element = useMemo(() => getElementFromPath(location.pathname), [location.pathname]);

  const bgUrl = useMemo(
    () => pickBackgroundUrl({ element, pathname: location.pathname }),
    [element, location.pathname]
  );

  const noAnim = Boolean(forceReduceMotion || prefersReducedMotion);

  // Overlay para manter legibilidade (puxa as vars do seu tema/elemento)
  const overlay = `
    radial-gradient(120% 90% at 50% 0%, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0) 60%),
    linear-gradient(180deg, rgba(0,0,0,0.30), rgba(0,0,0,0.05))
  `;

  return (
    <motion.div
      key={`${element}:${bgUrl || "none"}`}
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

        // dá um “ar de camada” sem blur pesado
        opacity: 0.9,
        transformOrigin: "center",
        willChange: noAnim ? "auto" : "transform",
      }}
      animate={
        noAnim
          ? { scale: 1, x: 0, y: 0 }
          : { scale: [1.02, 1.06, 1.02], x: [0, 8, 0], y: [0, -6, 0] }
      }
      transition={
        noAnim
          ? { duration: 0 }
          : { duration: 18, repeat: Infinity, ease: "easeInOut" }
      }
    />
  );
}