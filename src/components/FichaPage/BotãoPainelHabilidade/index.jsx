import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function BotaoPainelHabilidade({ imagens = [] }) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (open) setCurrentIndex(0); // resetar ao abrir
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, currentIndex, imagens]);

  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const next = () => setCurrentIndex((i) => Math.min(imagens.length - 1, i + 1));

  const handleOpen = () => {
    if (!imagens || imagens.length === 0) return setOpen(true); // permitir abrir mesmo sem imagens (mostra mensagem)
    setOpen(true);
  };

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleOpen}
        aria-haspopup="dialog"
        aria-label="Abrir painel de habilidades"
      >
        Ver habilidades
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        aria-labelledby="painel-habilidades-title"
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography id="painel-habilidades-title">Habilidades</Typography>
          <IconButton aria-label="Fechar" onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          {(!imagens || imagens.length === 0) ? (
            <Box sx={{ py: 6 }}>
              <Typography color="text.secondary">Nenhuma imagem disponível.</Typography>
            </Box>
          ) : (
            <>
              <Typography variant="caption" color="text.secondary">
                {currentIndex + 1} / {imagens.length}
              </Typography>

              <Box
                component="img"
                src={imagens[currentIndex]}
                alt={`Habilidade ${currentIndex + 1}`}
                sx={{
                  width: "100%",
                  maxWidth: 900,
                  maxHeight: "60vh",
                  objectFit: "contain",
                  borderRadius: 1,
                  boxShadow: 3,
                }}
              />
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", px: 3 }}>
          <Box>
            <IconButton
              onClick={prev}
              disabled={currentIndex === 0 || imagens.length === 0}
              aria-label="Anterior"
            >
              <ArrowBackIosNewIcon />
            </IconButton>
            <IconButton
              onClick={next}
              disabled={currentIndex >= imagens.length - 1 || imagens.length === 0}
              aria-label="Próximo"
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>

          <Button onClick={() => setOpen(false)} color="primary" aria-label="Fechar painel">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
