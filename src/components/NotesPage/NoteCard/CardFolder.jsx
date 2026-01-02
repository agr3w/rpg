import React, { useState } from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  IconButton,
  Tooltip
} from "@mui/material";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DownloadIcon from '@mui/icons-material/Download';

import { deleteArrayNoteFromFolder, deleteNoteFolder } from "../NoteDelete";
import BurnConfirmation from "components/BurnConfirmation";
import ArcaneAlert from "components/ArcaneAlert"; // Importe o alerta

const NoteCardFolder = ({ note, folderId }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Estados para o Alerta
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  // Determina o ícone baseado na extensão (se houver no título ou tipo)
  const getIcon = () => {
    const title = note.title?.toLowerCase() || "";
    if (title.includes("pdf")) return <PictureAsPdfIcon sx={{ fontSize: 40, color: "#d32f2f" }} />;
    if (title.includes("png") || title.includes("jpg")) return <ImageIcon sx={{ fontSize: 40, color: "#bf8f00" }} />;
    return <InsertDriveFileIcon sx={{ fontSize: 40, color: "#5d4037" }} />;
  };

  const handleOpenLink = () => {
    window.open(note.url, "_blank");
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Impede abrir o arquivo ao clicar em deletar
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteNoteFolder(note); // Agora usa a função corrigida
      await deleteArrayNoteFromFolder(folderId, note.id);
      
      setDeleteDialogOpen(false);
      
      // Mostra o alerta de fogo
      setAlertSeverity("burn");
      setAlertMessage("O documento virou cinzas.");
      setAlertOpen(true);

      // Pequeno delay para o usuário ver o alerta antes de recarregar (opcional)
      setTimeout(() => {
         window.location.reload();
      }, 1500);

    } catch (error) {
      console.error("Erro ao queimar documento:", error);
      setDeleteDialogOpen(false);
      
      setAlertSeverity("error");
      setAlertMessage("O fogo falhou. O documento resiste.");
      setAlertOpen(true);
    }
  };

  return (
    <>
      <Card
        sx={{
          height: "100%",
          bgcolor: "#fdfbf7", // Papel claro
          backgroundImage: `linear-gradient(to bottom right, rgba(0,0,0,0.02), rgba(0,0,0,0.1))`,
          border: "1px solid #dcbfa6",
          position: "relative",
          overflow: "visible",
          transition: "all 0.3s ease",
          boxShadow: "2px 4px 6px rgba(0,0,0,0.2)",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "4px 8px 12px rgba(0,0,0,0.3)",
            borderColor: "#bf8f00",
          }
        }}
      >
        {/* Selo de Cera (Visual) */}
        <Box
          sx={{
            position: "absolute",
            top: -10,
            right: 10,
            width: 24,
            height: 24,
            bgcolor: "#833c0b",
            borderRadius: "50%",
            boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
            border: "2px solid #a04d14",
            zIndex: 2
          }}
        />

        <CardActionArea
          onClick={handleOpenLink}
          sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "space-between", p: 2 }}
        >
          <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mb: 2, opacity: 0.8 }}>
            {getIcon()}
          </Box>

          <CardContent sx={{ p: 0, width: "100%" }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontFamily: "Cinzel",
                fontWeight: "bold",
                lineHeight: 1.2,
                color: "#2e1e14",
                mb: 0.5,
                wordBreak: "break-word"
              }}
            >
              {note.title}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <DownloadIcon fontSize="inherit" /> Clique para abrir
            </Typography>
          </CardContent>
        </CardActionArea>

        {/* Botão de Deletar Absoluto no canto inferior direito */}
        <Tooltip title="Queimar Documento">
          <IconButton
            onClick={handleDeleteClick}
            size="small"
            sx={{
              position: "absolute",
              bottom: 5,
              right: 5,
              color: "rgba(0,0,0,0.2)",
              "&:hover": { color: "#d32f2f", bgcolor: "rgba(211, 47, 47, 0.1)" }
            }}
          >
            <DeleteForeverIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Card>

      <BurnConfirmation
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Queimar Documento?"
        description={`Você está prestes a destruir o arquivo "${note.title}".`}
      />

      {/* Adicione o ArcaneAlert no final */}
      <ArcaneAlert 
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        severity={alertSeverity}
        message={alertMessage}
      />
    </>
  );
};

export default NoteCardFolder;
