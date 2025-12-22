import React, { useState, useRef, useEffect } from "react";
import { Box, Paper, Typography, Button, Stack } from "@mui/material";
import { motion } from "framer-motion";
import { calcularRiquezaInicialPorClasse } from "Utils/DiceRoller";

export default function Etapa9({
  classeSelecionada,
  onRiquezaInicialCalculada = () => {},
  riquezaInicial,
  setRiquezaInicial = () => {},
}) {
  // garante que o valor exibido nunca seja 0 (começa em 1)
  const [animando, setAnimando] = useState(false);
  const [displayValue, setDisplayValue] = useState(
    typeof riquezaInicial === "number" && riquezaInicial > 0 ? riquezaInicial : 1
  );
  const [clickedOnce, setClickedOnce] = useState(false); // só pode clicar uma vez
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
    // previne múltiplos cliques
    if (animando || clickedOnce) return;

    setClickedOnce(true);

    const classKey = classKeyFromProp(classeSelecionada);

    // debug: conferir o que está chegando
    console.debug("[Etapa9] classeSelecionada:", classeSelecionada);
    console.debug("[Etapa9] classKey:", classKey);

    if (!classKey) {
      const fallback = 1;
      console.warn("[Etapa9] classKey inválido — usando fallback", fallback);
      setDisplayValue(fallback);
      setRiquezaInicial(fallback);
      onRiquezaInicialCalculada(fallback);
      return;
    }

    // tenta calcular e normalizar o resultado
    let computed = calcularRiquezaInicialPorClasse(classKey);
    console.debug("[Etapa9] raw computed from calcularRiquezaInicialPorClasse:", computed);

    // se retornar string numérica, converte
    if (typeof computed === "string" && /^\s*\d+\s*$/.test(computed)) {
      computed = Number(computed);
      console.debug("[Etapa9] parsed string computed ->", computed);
    }

    // se ainda inválido, tenta pegar um valor direto da definição da classe (se existir)
    if (typeof computed !== "number" || !Number.isFinite(computed)) {
      const altFromClass =
        (classeSelecionada && (classeSelecionada.riquezaInicial || classeSelecionada.initialGold)) ||
        null;
      if (typeof altFromClass === "number" && Number.isFinite(altFromClass)) {
        computed = altFromClass;
        console.debug("[Etapa9] usando riqueza definida na classe ->", computed);
      } else {
        computed = 1; // fallback seguro
        console.error(
          "[Etapa9] calcularRiquezaInicialPorClasse retornou inválido e classe não forneceu fallback. Usando 1."
        );
      }
    }

    const target = Math.max(1, Math.round(computed)); // nunca menor que 1

    setAnimando(true);

    // animação (mantida igual)
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
    <Paper
      elevation={6}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 2,
        maxWidth: 520,
        width: "100%",
        mx: "auto",
        bgcolor: "background.paper",
      }}
    >
      <Stack spacing={2} alignItems="center">
        <Typography variant="h5" align="center" sx={{ fontWeight: 700 }}>
          Riqueza Inicial
        </Typography>

        <Box sx={{ textAlign: "center" }}>
          <motion.div
            key={displayValue}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {Math.max(1, displayValue)} PO
            </Typography>
          </motion.div>
          <Typography variant="caption" color="text.secondary">
            Valor estimado de peças de ouro
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={calcularRiquezaInicial}
          disabled={animando || clickedOnce}
          sx={{
            px: 3,
            py: 1,
            borderRadius: 3,
            "&:disabled": { opacity: 0.6, cursor: "not-allowed" },
          }}
        >
          {clickedOnce ? (animando ? "Calculando..." : "Calculado") : "Calcular Riqueza"}
        </Button>
      </Stack>
    </Paper>
  );
}
