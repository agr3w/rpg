import React, { useState } from "react";
import { Card, CardActionArea, Typography, IconButton, Box, Tooltip } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Link as RouterLink } from "react-router-dom";
import { deleteArrayFolder } from "../folderDelete";
import BurnConfirmation from "components/BurnConfirmation"; // Importe o novo componente

const FoldersCard = ({ folder }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    await deleteArrayFolder(folder.id);
    setDeleteDialogOpen(false);
    // O contexto deve atualizar a lista automaticamente se estiver configurado corretamente,
    // caso contrário, window.location.reload() pode ser necessário temporariamente.
  };

  return (
    <>
      <Card
        sx={{
          bgcolor: "#3e2723",
          color: "#e0cda8",
          border: "1px solid #5d4037",
          boxShadow: "0 4px 6px rgba(0,0,0,0.5)",
          position: "relative",
          overflow: "visible",
          transition: "transform 0.2s",
          "&:hover": {
            transform: "translateX(5px)",
            borderColor: "#bf8f00",
          },
          "&::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "4px",
            bgcolor: "#bf8f00",
            borderRadius: "4px 0 0 4px"
          }
        }}
      >
        <CardActionArea 
          component={RouterLink} 
          to={`/folders/${folder.id}`}
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}
        >
          <Box display="flex" alignItems="center" gap={2} overflow="hidden">
            <FolderIcon sx={{ color: "#bf8f00", fontSize: 30 }} />
            <Box>
              <Typography 
                variant="subtitle1" 
                noWrap 
                sx={{ 
                  fontFamily: "Cinzel", 
                  fontWeight: 700, 
                  lineHeight: 1.2,
                  color: "#833c0b"
                }}
              >
                {folder?.name || "Sem Nome"}
              </Typography>
              <Typography variant="caption" sx={{ color: "#2c1a10" }}>
                Abrir Gaveta
              </Typography>
            </Box>
          </Box>

          <Tooltip title="Queimar Gaveta">
            <IconButton 
              onClick={handleDeleteClick}
              size="small"
              sx={{ 
                color: "#2c1a1086",
                "&:hover": { color: "#ff5252", bgcolor: "rgba(255,0,0,0.1)" }
              }}
            >
              <DeleteForeverIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </CardActionArea>
      </Card>

      <BurnConfirmation 
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Destruir Gaveta?"
        description={`Você está prestes a destruir a gaveta "${folder.name}".`}
        isFolder={true} // Ativa o aviso extra de conteúdo interno
      />
    </>
  );
};

export default FoldersCard;
