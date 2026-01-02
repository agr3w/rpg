// NoteAddGlobal.jsx

import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Tabs,
  Tab,
  Box
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SaveIcon from '@mui/icons-material/Save';
import { useNoteContext } from "APIs/NoteContext";

const NoteAddGlobal = () => {
  const { addNote } = useNoteContext();
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0); // 0 = Link, 1 = Texto

  // Estados do formulário
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [textContent, setTextContent] = useState("");

  // Validação em tempo real
  const isValid = useMemo(() => {
    const hasTitle = title.trim().length > 0;
    
    if (tabValue === 0) {
      // Aba Link: Precisa de Título e URL
      return hasTitle && url.trim().length > 0;
    } else {
      // Aba Texto: Precisa de Título e Conteúdo
      return hasTitle && textContent.trim().length > 0;
    }
  }, [title, url, textContent, tabValue]);

  const handleSave = async () => {
    if (!isValid) return;

    const newNote = {
      title: title.trim(),
      createdAt: new Date().toISOString(),
      type: tabValue === 0 ? "link" : "text",
      url: tabValue === 0 ? url.trim() : null,
      content: tabValue === 1 ? textContent : null,
    };

    await addNote(newNote);
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setUrl("");
    setTextContent("");
    setTabValue(0);
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => setOpen(true)}
        sx={{
          bgcolor: "#833c0b", // Cor temática (Madeira/Couro)
          color: "#fff",
          fontFamily: "Cinzel",
          fontWeight: "bold",
          boxShadow: 3,
          "&:hover": { bgcolor: "#a04d14" },
        }}
      >
        Nova Nota
      </Button>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundImage: "none",
            bgcolor: "#fdfbf7", // Papel claro
            border: "2px solid #833c0b",
            borderRadius: 2
          }
        }}
      >
        <DialogTitle sx={{ fontFamily: "Cinzel", fontWeight: "bold", borderBottom: "1px solid rgba(131, 60, 11, 0.2)", color: "#833c0b" }}>
          Adicionar ao Grimório
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Título da Nota"
              variant="outlined"
              fullWidth
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              InputLabelProps={{ sx: { fontFamily: "Cinzel" } }}
            />

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={(e, v) => setTabValue(v)} 
                textColor="inherit"
                indicatorColor="primary"
                sx={{ 
                  "& .MuiTab-root": { fontFamily: "Cinzel", fontWeight: "bold", color: "#833c0b" },
                  "& .Mui-selected": { color: "#bf8f00 !important" },
                  "& .MuiTabs-indicator": { backgroundColor: "#bf8f00" }
                }}
              >
                <Tab label="Link / Arquivo" />
                <Tab label="Texto Rápido" />
              </Tabs>
            </Box>

            {tabValue === 0 ? (
              <TextField
                label="URL do Arquivo (PDF/Drive)"
                variant="outlined"
                fullWidth
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                helperText="Cole o link do Google Drive ou arquivo externo."
              />
            ) : (
              <TextField
                label="Conteúdo da Nota"
                multiline
                rows={6}
                variant="outlined"
                fullWidth
                required
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Escreva suas anotações aqui..."
                sx={{
                  bgcolor: "rgba(0,0,0,0.03)",
                }}
                inputProps={{
                  style: { fontFamily: '"Crimson Text", serif', fontSize: "1.1rem" }
                }}
              />
            )}
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, borderTop: "1px solid rgba(0,0,0,0.1)" }}>
          <Button 
            onClick={handleClose} 
            sx={{ color: "#5d4037", fontFamily: "Cinzel" }}
          >
            Cancelar
          </Button>
          
          <Button 
            onClick={handleSave} 
            variant="contained" 
            disabled={!isValid} // Bloqueia se não for válido
            startIcon={<SaveIcon />}
            sx={{
              bgcolor: "#833c0b",
              color: "#fff",
              fontFamily: "Cinzel",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#a04d14" },
              "&.Mui-disabled": { 
                bgcolor: "rgba(0,0,0,0.12)", 
                color: "rgba(0,0,0,0.26)" 
              }
            }}
          >
            Salvar Nota
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NoteAddGlobal;
