import React, { useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { getElementFromPath } from "theme/elementTokens";
import { T_IN, T_OUT } from "../../config/transitions";

// --- CONFIGURAÇÃO DOS ELEMENTOS ---
const ELEMENTS = {
  parchment: {
    colors: ["#1a1410", "#cdbb9c", "#f3ead6"], // sombra, couro/papel, papel claro
    filter: "url(#paper-filter)",
    type: "parchment",
  },
  fire: {
    colors: ["#2a0505", "#b32d00", "#ffcc00"],
    filter: "url(#fire-filter)",
    type: "fire",
  },
  lightning: {
    colors: ["#06061a", "#0044cc", "#ccffff"],
    filter: "url(#electric-filter)",
    type: "lightning",
  },
  poison: {
    colors: ["#061a06", "#228b22", "#adff2f"],
    filter: "url(#goo-filter)",
    type: "poison",
  },
  ice: {
    colors: ["#08131f", "#4da6ff", "#ffffff"],
    filter: "url(#ice-filter)",
    type: "ice",
  },
  void: {
    colors: ["#07020b", "#4B0082", "#9370DB"],
    filter: "none",
    type: "void",
  },
};

// Mapeamento de Rotas para Elementos
const ROUTE_TO_ELEMENT = {
  "/": "parchment", // ✅ exclusivo do Início
  "/fichas": "fire",
  "/criar-ficha": "fire",
  "/livros": "lightning",
  "/mapas": "poison",
  "/anotacoes": "ice",
  "/musicas": "void",
};

function pickElementKey(pathname) {
  return getElementFromPath(pathname);
}

const DragonTransition = ({ children, location: locationProp }) => {
  const hookLocation = useLocation();
  const location = locationProp || hookLocation;

  const prefersReducedMotion = useReducedMotion();

  const elementKey = useMemo(
    () => pickElementKey(location.pathname),
    [location.pathname]
  );
  const config = ELEMENTS[elementKey];

  // Variants: entra COBRINDO e anima para FORA (revela). Ao sair volta para COBRIR.
  const overlayVariants = {
    parchment: {
      initial: { y: "0%", rotate: 0, scaleY: 1, transformOrigin: "top" },
      animate: {
        y: "-115%",
        rotate: -0.4,
        transition: { duration: T_IN * 1.15, ease: [0.2, 0.9, 0.2, 1] },
      },
      exit: {
        y: "0%",
        rotate: 0.2,
        transition: { duration: T_OUT * 1.1, ease: [0.2, 0.95, 0.2, 1] },
      },
    },

    fire: {
      initial: { y: "0%" },
      animate: { y: "-115%", transition: { duration: T_IN, ease: [0.2, 0.9, 0.2, 1] } },
      exit: { y: "0%", transition: { duration: T_OUT, ease: [0.2, 0.95, 0.2, 1] } },
    },

    poison: {
      initial: { y: "0%" },
      animate: { y: "115%", transition: { duration: T_IN, ease: [0.2, 0.9, 0.2, 1] } },
      exit: { y: "0%", transition: { duration: T_OUT, ease: [0.2, 0.95, 0.2, 1] } },
    },

    lightning: {
      initial: { x: "0%", skewX: -7 },
      animate: { x: "130%", skewX: 7, transition: { duration: T_IN * 0.7, ease: "easeOut" } },
      exit: { x: "0%", skewX: -7, transition: { duration: T_OUT * 0.65, ease: "easeInOut" } },
    },

    ice: {
      initial: { clipPath: "circle(160% at 50% 50%)" },
      animate: { clipPath: "circle(0% at 50% 50%)", transition: { duration: T_IN * 1.1, ease: "easeInOut" } },
      exit: { clipPath: "circle(160% at 50% 50%)", transition: { duration: T_OUT * 1.1, ease: "easeInOut" } },
    },

    void: {
      initial: { x: "0%" },
      animate: { x: "115%", transition: { duration: T_IN, ease: "easeInOut" } },
      exit: { x: "0%", transition: { duration: T_OUT, ease: "easeInOut" } },
    },
  };

  const v = overlayVariants[config.type] || overlayVariants.void;

  // --- NOVO: animação do conteúdo (para ficar “biblioteca”, coeso e suave) ---
  const contentVariants = {
    initial: prefersReducedMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 10, filter: "blur(6px)" },

    animate: prefersReducedMotion
      ? { opacity: 1, transition: { duration: T_IN * 0.18 } }
      : {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: {
            duration: T_IN * 0.44,
            ease: [0.22, 1, 0.36, 1],
            delay: T_OUT * 0.13,
          },
        },

    exit: prefersReducedMotion
      ? { opacity: 0, transition: { duration: T_OUT * 0.14 } }
      : {
          opacity: 0,
          y: -6,
          filter: "blur(4px)",
          transition: { duration: T_OUT * 0.3, ease: "easeInOut" },
        },
  };

  // Texturas orgânicas por elemento (gradientes + movimento de background)
  const textureStyle = (() => {
    switch (config.type) {
      case "parchment":
        return {
          backgroundImage: `
            radial-gradient(140% 85% at 50% 12%, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 62%),
            radial-gradient(110% 70% at 50% 100%, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0) 58%),
            repeating-linear-gradient(90deg,
              rgba(0,0,0,0.00) 0px,
              rgba(0,0,0,0.00) 16px,
              rgba(0,0,0,0.035) 17px,
              rgba(0,0,0,0.00) 22px
            ),
            linear-gradient(180deg, ${config.colors[2]}, ${config.colors[1]})
          `,
          backgroundSize: "140% 140%",
        };
      case "fire":
        return {
          backgroundImage: `
            radial-gradient(60% 50% at 50% 90%, rgba(255, 204, 0, 0.95) 0%, rgba(255, 204, 0, 0) 60%),
            radial-gradient(40% 45% at 35% 95%, rgba(255, 120, 0, 0.9) 0%, rgba(255, 120, 0, 0) 65%),
            radial-gradient(40% 45% at 65% 95%, rgba(255, 70, 0, 0.9) 0%, rgba(255, 70, 0, 0) 65%),
            linear-gradient(0deg, ${config.colors[1]}, ${config.colors[2]})
          `,
          backgroundSize: "120% 120%",
        };
      case "poison":
        return {
          backgroundImage: `
            radial-gradient(40% 35% at 30% 15%, rgba(173,255,47,0.65) 0%, rgba(173,255,47,0) 60%),
            radial-gradient(50% 45% at 70% 10%, rgba(34,139,34,0.75) 0%, rgba(34,139,34,0) 60%),
            linear-gradient(180deg, ${config.colors[2]}, ${config.colors[1]}, ${config.colors[0]})
          `,
          backgroundSize: "140% 140%",
        };
      case "lightning":
        return {
          backgroundImage: `
            repeating-linear-gradient(135deg,
              rgba(204,255,255,0.00) 0px,
              rgba(204,255,255,0.00) 18px,
              rgba(204,255,255,0.22) 19px,
              rgba(204,255,255,0.00) 22px
            ),
            linear-gradient(90deg, ${config.colors[1]}, ${config.colors[2]})
          `,
          backgroundSize: "140% 140%",
          boxShadow: "0 0 70px rgba(204,255,255,0.55)",
        };
      case "ice":
        return {
          backgroundImage: `
            linear-gradient(135deg, rgba(255,255,255,0.35), rgba(77,166,255,0.15)),
            repeating-linear-gradient(45deg, rgba(255,255,255,0.00) 0px, rgba(255,255,255,0.00) 14px, rgba(255,255,255,0.18) 15px, rgba(255,255,255,0.00) 18px),
            linear-gradient(180deg, ${config.colors[1]}, ${config.colors[2]})
          `,
          backgroundSize: "160% 160%",
        };
      case "void":
      default:
        return {
          backgroundImage: `
            radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 60%),
            radial-gradient(1px 1px at 70% 60%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 60%),
            radial-gradient(2px 2px at 40% 80%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 60%),
            linear-gradient(90deg, ${config.colors[1]}, ${config.colors[2]})
          `,
          backgroundSize: "120% 120%",
        };
    }
  })();

  return (
    <>
      {/* Filtros SVG (com animação para deixar vivo) */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          {/* ✅ Pergaminho: grão de papel + leve deslocamento (bem leve) */}
          <filter id="paper-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="7" result="n">
              <animate attributeName="baseFrequency" dur="6s" values="0.85;0.95;0.88" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="n" scale="1.8" />
          </filter>

          {/* 🔥 fogo: anima mais lenta (menos "tremedeira") */}
          <filter id="fire-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="2" result="noise">
              <animate
                attributeName="baseFrequency"
                dur="2.2s"
                values="0.012;0.026;0.015"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="22" xChannelSelector="R" yChannelSelector="G" />
          </filter>

          {/* ☠ veneno: mais lento e “viscoso” */}
          <filter id="goo-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8"
              result="goo"
            />
            <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="2" seed="3" result="noise">
              <animate
                attributeName="baseFrequency"
                dur="3.2s"
                values="0.007;0.013;0.010"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="goo" in2="noise" scale="8" />
          </filter>

          {/* ⚡ elétrico: menos frenético */}
          <filter id="electric-filter">
            <feTurbulence type="turbulence" baseFrequency="0.9" numOctaves="1" seed="5" result="noise">
              <animate
                attributeName="baseFrequency"
                dur="0.7s"
                values="0.65;1.05;0.80;1.10;0.75"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
          </filter>

          {/* ❄ gelo: ok manter */}
          <filter id="ice-filter">
            <feGaussianBlur stdDeviation="1.2" result="b" />
            <feColorMatrix
              in="b"
              type="matrix"
              values="1 0 0 0 0  0 1.05 0 0 0  0 0 1.15 0 0  0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>

      {/* Conteúdo da Página (agora com animação por rota, bem mais suave) */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          variants={contentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ position: "relative", zIndex: 1, willChange: "opacity, transform, filter" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* --- Somente UMA transição elemental por vez --- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={elementKey}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={v}
          style={{ position: "fixed", inset: 0, zIndex: 9998, pointerEvents: "none", willChange: "transform, clip-path" }}
        >
          <div style={{ position: "absolute", inset: 0, backgroundColor: config.colors[0], zIndex: 0 }} />

          <motion.div
            aria-hidden
            animate={{
              backgroundPosition:
                config.type === "fire"
                  ? ["50% 110%", "55% 90%", "45% 105%"]
                  : config.type === "poison"
                    ? ["50% 0%", "55% 15%", "45% 5%"]
                    : config.type === "parchment"
                      ? ["50% 50%", "51% 49%", "49% 51%"] // ✅ quase parado (mais “calmo”)
                      : ["50% 50%", "55% 45%", "45% 55%"],
            }}
            transition={{
              backgroundPosition: {
                duration:
                  config.type === "lightning"
                    ? T_IN * 1.25
                    : config.type === "parchment"
                      ? T_IN * 8.4
                      : T_IN * 3.2,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              filter: config.filter,
              ...textureStyle,
              willChange: "filter, background-position",
              opacity: 0.98,
            }}
          />

          {/* ✅ Detalhe “selo” exclusivo do Início (D&D vibe) */}
          {config.type === "parchment" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{
                opacity: 0.28,
                scale: 1,
                y: 0,
                transition: { duration: T_IN * 0.5, ease: "easeOut", delay: T_OUT * 0.07 },
              }}
              exit={{ opacity: 0, scale: 0.98, transition: { duration: T_OUT * 0.25 } }}
              style={{
                position: "absolute",
                right: 36,
                bottom: 28,
                width: 140,
                height: 140,
                borderRadius: "999px",
                background:
                  "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.35), rgba(0,0,0,0.0) 55%), linear-gradient(135deg, rgba(120,15,20,0.95), rgba(70,8,12,0.95))",
                boxShadow: "0 18px 35px rgba(0,0,0,0.35)",
                mixBlendMode: "multiply",
              }}
            />
          )}

          {/* Flash do RAIO mais “controlado” */}
          {config.type === "lightning" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.55, 0, 0.25, 0], transition: { duration: T_IN * 0.58 } }}
              exit={{ opacity: [0, 0.35, 0], transition: { duration: T_OUT * 0.55 } }}
              style={{
                position: "absolute",
                inset: 0,
                background: "white",
                zIndex: 2,
                pointerEvents: "none",
                mixBlendMode: "screen",
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default DragonTransition;