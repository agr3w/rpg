import React, { useState } from "react";
import { 
  Card, 
  CardActionArea, 
  CardContent, 
  Typography, 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  IconButton, 
  Tooltip,
  Divider
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useNoteContext } from "APIs/NoteContext"; // Importando o contexto
import BurnConfirmation from "components/BurnConfirmation"; // Importe o novo componente

// Ícones
import DescriptionIcon from "@mui/icons-material/Description";
import LinkIcon from "@mui/icons-material/Link";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const NoteCard = ({ note }) => {
  const { deleteNote, updateNote } = useNoteContext(); // Assumindo que updateNote existe no contexto
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Novo estado para controlar o modal de confirmação
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Estados locais para edição
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content || "");
  const [editUrl, setEditUrl] = useState(note.url || "");

  const isText = note.type === "text";

  // --- HANDLERS ---

  const handleOpen = () => {
    setOpen(true);
    setIsEditing(false); // Sempre abre em modo leitura
    // Reseta os estados de edição para o valor atual
    setEditTitle(note.title);
    setEditContent(note.content || "");
    setEditUrl(note.url || "");
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
  };

  const handleSave = async () => {
    const updatedNote = {
      ...note,
      title: editTitle,
      content: isText ? editContent : null,
      url: !isText ? editUrl : null,
      updatedAt: new Date().toISOString()
    };

    // Chama a função de update do contexto (se não existir, precisaremos criar)
    if (updateNote) {
      await updateNote(note.id, updatedNote);
    } else {
      console.warn("Função updateNote não encontrada no contexto!");
    }
    setIsEditing(false);
  };

  // Substituir o handleDelete antigo por este fluxo:
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true); // Abre o modal personalizado
  };

  const handleConfirmDelete = async () => {
    await deleteNote(note.id);
    setDeleteDialogOpen(false);
    handleClose(); // Fecha o modal de leitura também
  };

  return (
    <>
      {/* --- CARD NA MESA (THUMBNAIL) --- */}
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          transition: "all 0.15s ease",
          bgcolor: (t) => (t.palette.mode === "dark" ? "#1e1814" : "#fffaf0"),
          backgroundImage: (t) => t.palette.rpg?.paperBg || "none",
          border: (t) => `1px solid ${t.palette.rpg?.stroke || "rgba(131, 60, 11, 0.3)"}`,
          boxShadow: (t) => (t.palette.mode === "dark" ? "0 4px 12px rgba(0,0,0,0.5)" : "2px 4px 8px rgba(0,0,0,0.1)"),
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: (t) => (t.palette.mode === "dark" ? "0 8px 20px rgba(0,0,0,0.7)" : "4px 8px 12px rgba(0,0,0,0.2)"),
            borderColor: "secondary.main",
          },
        }}
      >
        <CardActionArea 
          onClick={handleOpen} 
          sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', height: "100%" }}
        >
          <CardContent sx={{ width: '100%', p: 2 }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              {isText ? (
                <DescriptionIcon sx={{ color: "primary.main" }} fontSize="small" />
              ) : (
                <LinkIcon color="secondary" fontSize="small" />
              )}
              <Typography variant="subtitle1" sx={{ fontFamily: "Cinzel", fontWeight: 700, lineHeight: 1.2, color: "text.primary" }}>
                {note.title}
              </Typography>
            </Box>

            {isText && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontFamily: '"Crimson Text", serif',
                  fontSize: "1rem",
                  display: "-webkit-box",
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  fontStyle: "italic",
                  opacity: 0.85
                }}
              >
                "{note.content}"
              </Typography>
            )}
            
            {!isText && (
               <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>
                 Link externo: {new URL(note.url).hostname}
               </Typography>
            )}
          </CardContent>
        </CardActionArea>
        
        {/* Decoração de "Prego" */}
        <Box 
          sx={{
            position: 'absolute',
            top: 6,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: (t) => (t.palette.mode === "dark" ? "#833c0b" : "#5c4033"),
            boxShadow: '0 1px 2px rgba(0,0,0,0.5)'
          }}
        />
      </Card>

      {/* --- MODAL DE LEITURA / EDIÇÃO --- */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            bgcolor: "background.paper",
            backgroundImage: (t) => t.palette.rpg?.paperBg || "none",
            border: (t) => `2px solid ${t.palette.rpg?.stroke || "#833c0b"}`,
            borderRadius: 2,
            minHeight: "400px"
          }
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: (t) => `1px solid ${t.palette.rpg?.stroke || "rgba(0,0,0,0.1)"}`, pb: 1 }}>
          {isEditing ? (
            <TextField 
              fullWidth 
              value={editTitle} 
              onChange={(e) => setEditTitle(e.target.value)} 
              variant="standard"
              placeholder="Título"
              InputProps={{ style: { fontFamily: "Cinzel", fontSize: "1.5rem", fontWeight: "bold", color: "inherit" } }}
            />
          ) : (
            <Typography variant="h5" sx={{ fontFamily: "Cinzel", fontWeight: "bold", color: "primary.main" }}>
              {note.title}
            </Typography>
          )}
          
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          {isEditing ? (
            // --- MODO EDIÇÃO ---
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              {isText ? (
                <TextField
                  multiline
                  minRows={10}
                  fullWidth
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  variant="outlined"
                  sx={{ bgcolor: "rgba(0,0,0,0.03)" }}
                  inputProps={{ style: { fontFamily: '"Crimson Text", serif', fontSize: "1.2rem" } }}
                />
              ) : (
                <TextField
                  fullWidth
                  label="URL do Link"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  variant="outlined"
                />
              )}
            </Box>
          ) : (
            // --- MODO LEITURA ---
            <Box>
              {isText ? (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontFamily: '"Crimson Text", serif', 
                    fontSize: "1.3rem", 
                    lineHeight: 1.6, 
                    whiteSpace: "pre-wrap",
                    color: "#2e1e14"
                  }}
                >
                  {note.content}
                </Typography>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body1" sx={{ mb: 2, fontStyle: "italic" }}>
                    Este pergaminho leva a um local distante:
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    href={note.url} 
                    target="_blank"
                    startIcon={<OpenInNewIcon />}
                    sx={{ fontFamily: "Cinzel", fontWeight: "bold" }}
                  >
                    Abrir Link Externo
                  </Button>
                  <Typography variant="caption" display="block" sx={{ mt: 2, color: "text.secondary" }}>
                    {note.url}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 2, bgcolor: "rgba(0,0,0,0.02)" }}>
          {isEditing ? (
            <>
              <Button onClick={() => setIsEditing(false)} color="inherit" sx={{ fontFamily: "Cinzel" }}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSave} 
                variant="contained" 
                startIcon={<SaveIcon />}
                sx={{ bgcolor: "#833c0b", color: "#fff", fontFamily: "Cinzel", "&:hover": { bgcolor: "#a04d14" } }}
              >
                Salvar Alterações
              </Button>
            </>
          ) : (
            <>
              <Tooltip title="Queimar Nota">
                <Button 
                  onClick={handleDeleteClick} // Alterado aqui
                  color="error" 
                  startIcon={<DeleteForeverIcon />}
                  sx={{ mr: "auto", fontFamily: "Cinzel" }}
                >
                  Excluir
                </Button>
              </Tooltip>
              
              <Button 
                onClick={() => setIsEditing(true)} 
                variant="outlined" 
                startIcon={<EditIcon />}
                sx={{ borderColor: "#833c0b", color: "#833c0b", fontFamily: "Cinzel" }}
              >
                Reescrever
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Adicione o componente de confirmação no final */}
      <BurnConfirmation 
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Queimar Anotação?"
        description={`Você está prestes a destruir "${note.title}". Este conhecimento será perdido nas chamas.`}
      />
    </>
  );
};

export default NoteCard;
