import React from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { useFolderContext } from "APIs/FolderContext";
import { Container, Box, Typography, Breadcrumbs, Link, Paper, Grid, Divider } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import AutoStoriesIcon from '@mui/icons-material/AutoStories'; // Ícone de biblioteca

import NoteCardFolder from "components/NotesPage/NoteCard/CardFolder";
import NoteAdd from "components/NotesPage/NoteAdd";

const FolderPage = () => {
  const { folderId } = useParams();
  const { folders } = useFolderContext();
  const folder = folders.find((f) => f.id === folderId);

  if (!folder) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h4" sx={{ fontFamily: "Cinzel", color: "#833c0b", mb: 2 }}>
          A Gaveta está emperrada...
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Não conseguimos encontrar esta pasta. Talvez ela tenha sido destruída ou movida.
        </Typography>
        <Link component={RouterLink} to="/anotacoes" sx={{ fontFamily: "Cinzel", fontWeight: "bold", color: "#bf8f00" }}>
          Voltar para a Biblioteca
        </Link>
      </Container>
    );
  }

  const notesArray = Object.values(folder.notes || {});

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#1a0f0a", // Madeira muito escura (fundo da gaveta)
        backgroundImage: `url("https://www.transparenttextures.com/patterns/wood-pattern.png")`,
        pb: 8,
        pt: 4
      }}
    >
      <Container maxWidth="lg">
        {/* --- NAVEGAÇÃO (BREADCRUMBS) --- */}
        <Paper 
          elevation={3}
          sx={{ 
            p: 2, 
            mb: 4, 
            bgcolor: "rgba(46, 30, 20, 0.9)", 
            border: "1px solid #5d4037",
            borderRadius: 2,
            display: "flex",
            alignItems: "center"
          }}
        >
          <Breadcrumbs 
            separator={<NavigateNextIcon fontSize="small" sx={{ color: "#bf8f00" }} />} 
            aria-label="breadcrumb"
            sx={{ "& .MuiBreadcrumbs-li": { display: "flex", alignItems: "center" } }}
          >
            <Link 
              component={RouterLink} 
              to="/" 
              sx={{ display: "flex", alignItems: "center", color: "#dcbfa6", textDecoration: "none", "&:hover": { color: "#fff" } }}
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" /> Início
            </Link>
            
            <Link 
              component={RouterLink} 
              to="/anotacoes" 
              sx={{ display: "flex", alignItems: "center", color: "#dcbfa6", textDecoration: "none", "&:hover": { color: "#fff" } }}
            >
              <AutoStoriesIcon sx={{ mr: 0.5 }} fontSize="inherit" /> Biblioteca
            </Link>

            <Typography sx={{ color: "#bf8f00", fontFamily: "Cinzel", fontWeight: "bold", display: "flex", alignItems: "center" }}>
              {folder.name}
            </Typography>
          </Breadcrumbs>
        </Paper>

        {/* --- CONTEÚDO DA GAVETA --- */}
        <Paper
          elevation={10}
          sx={{
            p: { xs: 2, md: 4 },
            bgcolor: "rgba(255, 255, 255, 0.02)", // Translúcido
            borderRadius: 4,
            border: "2px solid #5d4037",
            boxShadow: "inset 0 0 60px rgba(0,0,0,0.9)", // Sombra interna profunda
            minHeight: "60vh",
            position: "relative"
          }}
        >
          {/* Cabeçalho da Pasta */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ color: "#e0cda8", fontFamily: "Cinzel", fontWeight: 700, textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}>
                {folder.name}
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}>
                Conteúdo da gaveta
              </Typography>
            </Box>
            <NoteAdd folderId={folderId} />
          </Box>

          <Divider sx={{ borderColor: "rgba(191, 143, 0, 0.3)", mb: 4 }} />

          {notesArray.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 10, opacity: 0.4, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Typography variant="h5" color="#e0cda8" sx={{ fontFamily: "Cinzel", mb: 1 }}>
                Vazio...
              </Typography>
              <Typography variant="body2" color="#dcbfa6">
                Esta gaveta acumula apenas poeira. Adicione um documento acima.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {notesArray.map((note) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={note.id}>
                  <NoteCardFolder note={note} folderId={folderId} />
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default FolderPage;
