import React, { useState } from "react";
import { Box, Container, Typography, Grid, Link, Paper, Divider } from "@mui/material";
import { useMusicContext } from "APIs/MusicContext";
import BotaoAdicionarMusica from "components/MusicaPage/botaoAddMusica";
import MusicaCard from "components/MusicaPage/musicaCard";
import FiltroCategoria from "components/MusicaPage/filtroCategorias";

// Ícones
import NightlifeIcon from '@mui/icons-material/Nightlife';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

const MusicasPage = () => {
  const { musicas, adicionarMusica } = useMusicContext();
  const [filtroCategoria, setFiltroCategoria] = useState("");

  const categorias = Array.from(
    new Set(musicas.map((musica) => musica.categoria))
  );

  const handleFiltroCategoriaChange = (novaCategoria) => {
    setFiltroCategoria(novaCategoria);
  };

  const musicasFiltradas = filtroCategoria
    ? musicas.filter((musica) => musica.categoria === filtroCategoria)
    : musicas;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#120a06", // Fundo muito escuro
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://www.transparenttextures.com/patterns/wood-pattern.png")`,
        pb: 8,
        color: "#dcbfa6"
      }}
    >
      {/* --- CABEÇALHO DA TAVERNA --- */}
      <Box 
        sx={{ 
          py: 4, 
          borderBottom: "4px solid #833c0b",
          bgcolor: "rgba(0,0,0,0.4)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
        }}
      >
        <Container maxWidth="xl">
          <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <NightlifeIcon sx={{ fontSize: 50, color: "#bf8f00", filter: "drop-shadow(0 0 10px rgba(191, 143, 0, 0.5))" }} />
              <Box>
                <Typography variant="h3" sx={{ fontFamily: "Cinzel", fontWeight: "bold", color: "#fff" }}>
                  Taverna do Bardo
                </Typography>
                <Typography variant="subtitle1" sx={{ fontFamily: "Cinzel", color: "#bf8f00", opacity: 0.8 }}>
                  Onde as lendas são cantadas e a cerveja nunca acaba.
                </Typography>
              </Box>
            </Box>
            
            {/* Botão de Adicionar (Passaremos a estilização dentro do componente depois, ou aqui se ele aceitar sx) */}
            <BotaoAdicionarMusica onMusicaAdded={adicionarMusica} />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        
        {/* --- MENU DE RITMOS (FILTRO) --- */}
        <Paper 
          elevation={4}
          sx={{ 
            p: 2, 
            mb: 4, 
            bgcolor: (t) => (t.palette.mode === "dark" ? "#1e1814" : "#2e1e14"), 
            border: (t) => `1px solid ${t.palette.rpg?.stroke || "#5d4037"}`,
            borderRadius: 2,
            display: "flex",
            justifyContent: "center"
          }}
        >
          <FiltroCategoria
            categorias={categorias}
            onFiltroCategoriaChange={handleFiltroCategoriaChange}
            categoriaAtiva={filtroCategoria}
          />
        </Paper>

        {/* --- PALCO (LISTA DE MÚSICAS) --- */}
        {musicasFiltradas.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <MusicNoteIcon sx={{ fontSize: 60, mb: 2, color: "secondary.main", opacity: 0.8 }} />
            <Typography variant="h5" sx={{ fontFamily: "Cinzel", color: (t) => (t.palette.mode === 'dark' ? '#f5ede0' : '#2c1a10'), fontWeight: 800 }}>
              O silêncio reina no salão...
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              Peça ao bardo para tocar algo novo.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {musicasFiltradas.map((musica) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={musica.id}>
                <MusicaCard
                  musica={musica}
                  nomeArquivoAudio={musica.nomeArquivoAudio}
                  nomeArquivoImagem={musica.nomeArquivoImagem}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* --- CRÉDITOS --- */}
        <Divider sx={{ my: 6, borderColor: "rgba(255,255,255,0.1)" }} />
        <Typography variant="caption" align="center" display="block" sx={{ opacity: 0.5 }}>
          Arte do Ambiente por:{" "}
          <Link
            href="https://waneella.tumblr.com/post/157664690747/details-here"
            target="_blank"
            rel="noopener"
            sx={{ color: "#bf8f00", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
          >
            Waneella Pixel Art
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default MusicasPage;
