import React, { useState, useRef, useEffect } from "react";
import { Box, Paper, Typography, Button, Stack } from "@mui/material";
import { motion } from "framer-motion";
import { calcularRiquezaInicialPorClasse } from "Utils/DiceRoller";
import LayoutFicha from "components/FichaLayout/LayoutFicha"; // ✅ Usando LayoutFicha

export default function Etapa9({
  classeSelecionada,
  onRiquezaInicialCalculada = () => {},
  riquezaInicial,
  setRiquezaInicial = () => {},
}) {
  const [animando, setAnimando] = useState(false);
  const [displayValue, setDisplayValue] = useState(
    typeof riquezaInicial === "number" && riquezaInicial > 0 ? riquezaInicial : 1
  );
  const [clickedOnce, setClickedOnce] = useState(false);
  const timeoutRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    setDisplayValue(typeof riquezaInicial === "number" && riquezaInicial > 0 ? riquezaInicial : 1);
  }, [riquezaInicial]);

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const limparRefs = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      limparRefs();
    };
  }, []);

  const classKeyFromProp = (c) => {
    if (!c) return "";
    if (typeof c === "string") return c;
    if (typeof c === "object" && c.nome) return c.nome;
    return String(c);
  };

  const calcularRiquezaInicial = () => {
    if (animando || clickedOnce) return;
    setClickedOnce(true);
    const classKey = classKeyFromProp(classeSelecionada);

    if (!classKey) {
      const fallback = 1;
      setDisplayValue(fallback);
      setRiquezaInicial(fallback);
      onRiquezaInicialCalculada(fallback);
      return;
    }

    let computed = calcularRiquezaInicialPorClasse(classKey);
    if (typeof computed === "string" && /^\s*\d+\s*$/.test(computed)) {
      computed = Number(computed);
    }

    if (typeof computed !== "number" || !Number.isFinite(computed)) {
      const altFromClass =
        (classeSelecionada && (classeSelecionada.riquezaInicial || classeSelecionada.initialGold)) ||
        null;
      if (typeof altFromClass === "number" && Number.isFinite(altFromClass)) {
        computed = altFromClass;
      } else {
        computed = 1;
      }
    }

    const target = Math.max(1, Math.round(computed));
    setAnimando(true);

    const flickerDuration = 700;
    const flickerInterval = 70;
    const start = performance.now();

    const flickerLoop = () => {
      const now = performance.now();
      if (now - start < flickerDuration) {
        setDisplayValue(Math.floor(Math.random() * Math.max(1, target + 40)));
        timeoutRef.current = setTimeout(flickerLoop, flickerInterval);
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        const from = displayValue || 1;
        const duration = 700;
        const t0 = performance.now();

        const step = () => {
          const t = Math.min(1, (performance.now() - t0) / duration);
          const eased = easeOutCubic(t);
          const current = Math.round(from + (target - from) * eased);
          setDisplayValue(current);
          if (t < 1) {
            rafRef.current = requestAnimationFrame(step);
          } else {
            limparRefs();
            setAnimando(false);
            setRiquezaInicial(target);
            onRiquezaInicialCalculada(target);
          }
        };
        rafRef.current = requestAnimationFrame(step);
      }
    };
    flickerLoop();
  };

  return (
    <LayoutFicha title="Riqueza Inicial">
      <Stack spacing={4} alignItems="center" sx={{ py: 2 }}>
        <Typography variant="body1" sx={{ color: "#3d2b1f", textAlign: "center", fontStyle: "italic" }}>
          "O destino sorri para você? Role os dados para definir seu ouro inicial."
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: "50%", // Círculo
            width: 200,
            height: 200,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "rgba(255, 215, 0, 0.1)", // Dourado bem claro
            border: "4px double #bf8f00", // Borda dupla dourada
            boxShadow: "0 0 20px rgba(191, 143, 0, 0.2)",
          }}
        >
          <motion.div
            key={displayValue}
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Typography variant="h2" sx={{ fontWeight: 900, fontFamily: "Cinzel", color: "#b8860b" }}>
              {Math.max(1, displayValue)}
            </Typography>
          </motion.div>
          <Typography variant="overline" sx={{ color: "#833c0b", fontWeight: 700, mt: -1 }}>
            Peças de Ouro
          </Typography>
        </Paper>

        <Button
          variant="contained"
          onClick={calcularRiquezaInicial}
          disabled={animando || clickedOnce}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 4,
            bgcolor: "#833c0b",
            fontFamily: "Cinzel",
            fontWeight: 700,
            fontSize: "1.1rem",
            boxShadow: "0 4px 12px rgba(131, 60, 11, 0.4)",
            "&:hover": { bgcolor: "#5e2b08" },
            "&:disabled": { bgcolor: "rgba(131, 60, 11, 0.5)" },
          }}
        >
          {clickedOnce ? (animando ? "Rolando..." : "Ouro Definido") : "Rolar Riqueza"}
        </Button>
      </Stack>
    </LayoutFicha>
  );
}
