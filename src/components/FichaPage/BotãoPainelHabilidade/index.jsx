import React, { useState } from "react";
import { Button, Modal, Box, Typography } from "@mui/material";

export default function BotaoPainelHabilidade({ imagens }) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < imagens.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <>
      <Button variant="contained" color="secondary" onClick={handleOpen}>
        Ver habilidades
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            // width: 550,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">
             {currentIndex + 1} / {imagens.length}
          </Typography>
          <img src={imagens[currentIndex]} alt="Imagem" />
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              Anterior
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ ml: 2 }}
              onClick={handleNext}
              disabled={currentIndex === imagens.length - 1}
            >
              Próximo
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
