// NotePage.js
import React from "react";
import { Container, Typography, Box, Grid, Paper, Divider, Alert } from "@mui/material";
import { useNoteContext } from "APIs/NoteContext";
import { useFolderContext } from "APIs/FolderContext";
import { alpha } from "@mui/material/styles";

// Componentes
import NoteCard from "components/NotesPage/NoteCard";
import FoldersCard from "components/NotesPage/folderCard";
import NoteAddGlobal from "components/NotesPage/NoteAddGlobal";
import { FolderAdd } from "components/NotesPage/folderAdd";

// Ícones
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import EditNoteIcon from '@mui/icons-material/EditNote';

const NotePage = () => {
  const { notes, addNote } = useNoteContext();
  const { folders } = useFolderContext();

  return (
    <Box sx={{ minHeight: "100vh", pb: 8 }}>
      {/* --- CABEÇALHO IMERSIVO --- */}
      <Box 
        sx={{ 
          bgcolor: "#1a0f0a", 
          color: "#dcbfa6", 
          py: 4, 
          borderBottom: "4px solid #833c0b",
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("https://www.transparenttextures.com/patterns/wood-pattern.png")`
        }}
      >
        <Container maxWidth="xl">
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <AutoStoriesIcon sx={{ fontSize: 40, color: "#bf8f00" }} />
            <Typography variant="h3" sx={{ fontFamily: "Cinzel", fontWeight: "bold", color: "#fff" }}>
              Biblioteca Arcana
            </Typography>
          </Box>
          
          <Alert 
            severity="info" 
            icon={false}
            sx={{ 
              bgcolor: "rgba(191, 143, 0, 0.1)", 
              color: "#e0cda8", 
              border: "1px solid rgba(191, 143, 0, 0.3)",
              maxWidth: "800px"
            }}
          >
            <Typography variant="body1" sx={{ fontFamily: "Cinzel", fontWeight: 600, color: "#833c0b", mb: 1 }}>
              Bem-vindo à sua mesa de estudos.
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5, color: "#2c1a10" }}>
              • Use as <strong>Gavetas (Esquerda)</strong> para organizar pastas com arquivos pesados, PDFs e links externos.
              <br />
              • Use a <strong>Mesa (Direita)</strong> para escrever notas rápidas, rascunhos e lembretes que precisam estar sempre à mão.
            </Typography>
          </Alert>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          
          {/* --- COLUNA DA ESQUERDA: PASTAS (ARQUIVOS) --- */}
          <Grid item xs={12} md={4} lg={3}>
            <Paper 
              elevation={6}
              sx={{ 
                p: 3, 
                height: "100%", 
                bgcolor: "#2e1e14", // Madeira escura
                color: "#e0cda8",
                borderRadius: 4,
                border: "1px solid #5d4037",
                backgroundImage: `url("https://www.transparenttextures.com/patterns/wood-pattern.png")`
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Inventory2Icon />
                  <Typography variant="h5" sx={{ fontFamily: "Cinzel", fontWeight: 700 }}>
                    Gavetas
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="caption" display="block" sx={{ mb: 3, opacity: 0.7, fontStyle: "italic" }}>
                Organize seus grimórios e documentos externos aqui.
              </Typography>

              <Box mb={3}>
                <FolderAdd />
              </Box>

              <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 3 }} />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {folders.map((folder) => (
                  <FoldersCard key={folder.id} folder={folder} />
                ))}
                {folders.length === 0 && (
                  <Typography variant="body2" align="center" sx={{ opacity: 0.5, py: 4 }}>
                    Nenhuma gaveta construída ainda.
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* --- COLUNA DA DIREITA: NOTAS (MESA) --- */}
          <Grid item xs={12} md={8} lg={9}>
            <Paper 
              elevation={3}
              sx={{ 
                p: 4, 
                minHeight: "60vh",
                bgcolor: "#fdfbf7", // Papel claro
                backgroundImage: `linear-gradient(135deg, ${alpha("#dcbfa6", 0.1)} 0%, transparent 100%)`,
                borderRadius: 2,
                border: "1px solid rgba(0,0,0,0.08)",
                position: "relative"
              }}
            >
              {/* Efeito de "Folhas empilhadas" visual */}
              <Box sx={{ position: "absolute", top: -10, left: 20, right: 20, height: 10, bgcolor: "#f4ede3", borderRadius: "8px 8px 0 0", zIndex: -1, border: "1px solid rgba(0,0,0,0.05)" }} />

              <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <EditNoteIcon color="primary" sx={{ fontSize: 32 }} />
                  <Typography variant="h4" sx={{ fontFamily: "Cinzel", fontWeight: 700, color: "primary.main" }}>
                    Mesa de Anotações
                  </Typography>
                </Box>
                <NoteAddGlobal onNoteAdded={addNote} />
              </Box>

              <Divider sx={{ mb: 4 }} />

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                    lg: "repeat(3, minmax(0, 1fr))",
                  },
                  gap: 3,
                }}
              >
                {notes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </Box>

              {notes.length === 0 && (
                <Box sx={{ textAlign: "center", py: 10, opacity: 0.6 }}>
                  <Typography variant="h6" sx={{ fontFamily: "Cinzel" }}>
                    Sua mesa está limpa.
                  </Typography>
                  <Typography variant="body2">
                    Clique em "Nova Nota" para começar a escrever.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
};

export default NotePage;
