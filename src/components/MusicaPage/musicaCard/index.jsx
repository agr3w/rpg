import React, { useState, useRef, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  IconButton, 
  Box, 
  Slider,
  Tooltip
} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

import BurnConfirmation from "components/BurnConfirmation";
import ArcaneAlert from "components/ArcaneAlert";
import { useMusicContext } from "APIs/MusicContext"; // Assumindo que existe deleteMusica aqui

const MusicaCard = ({ musica }) => {
  const { deleteMusica } = useMusicContext(); // Precisamos implementar isso no contexto se não tiver
  
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  // Estados de UI
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  // --- ÁUDIO LOGIC ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurTime(audio.currentTime);
    }

    const setCurTime = () => setCurrentTime(audio.currentTime);

    // Eventos
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setCurTime);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setCurTime);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    }
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    audioRef.current.volume = newValue;
  };

  const handleTimeChange = (event, newValue) => {
    audioRef.current.currentTime = newValue;
    setCurrentTime(newValue);
  };

  const formatTime = (time) => {
    if(isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // --- DELETE LOGIC ---
  const handleConfirmDelete = async () => {
    try {
      // Aqui você chamaria a função real de deletar do seu contexto
      // await deleteMusica(musica.id); 
      console.log("Deletando musica:", musica.id);
      
      setDeleteDialogOpen(false);
      setAlertSeverity("burn");
      setAlertMessage("A melodia foi esquecida para sempre.");
      setAlertOpen(true);
      
      // Simulação de reload ou update
      // window.location.reload(); 
    } catch (error) {
      setAlertSeverity("error");
      setAlertMessage("Não foi possível silenciar esta canção.");
      setAlertOpen(true);
    }
  };

  return (
    <>
      <Card 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          bgcolor: "#2e1e14",
          border: "1px solid #5d4037",
          borderRadius: 2,
          position: "relative",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 16px rgba(0,0,0,0.5)",
            borderColor: "#bf8f00"
          }
        }}
      >
        {/* Capa do Álbum / Imagem */}
        <Box sx={{ position: "relative", height: 180, overflow: "hidden" }}>
          <CardMedia
            component="img"
            image={musica.urlImagem || "https://www.transparenttextures.com/patterns/wood-pattern.png"} // Fallback
            alt={musica.nome}
            sx={{ 
              height: "100%", 
              objectFit: "cover",
              filter: "brightness(0.8)",
              transition: "filter 0.3s",
              "&:hover": { filter: "brightness(1)" }
            }}
          />
          {/* Overlay Gradiente */}
          <Box 
            sx={{ 
              position: "absolute", 
              bottom: 0, 
              left: 0, 
              width: "100%", 
              height: "50%", 
              background: "linear-gradient(to top, #2e1e14, transparent)" 
            }} 
          />
          
          {/* Botão Play Gigante no Hover (Opcional) */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "rgba(0,0,0,0.5)",
              borderRadius: "50%",
              display: isPlaying ? "none" : "flex"
            }}
          >
             <IconButton onClick={togglePlay} sx={{ color: "#fff", p: 2 }}>
                <PlayArrowIcon fontSize="large" />
             </IconButton>
          </Box>
        </Box>

        <CardContent sx={{ flex: '1 0 auto', pb: 1 }}>
          <Typography component="div" variant="h6" sx={{ fontFamily: "Cinzel", color: "#e0cda8", lineHeight: 1.2, mb: 0.5 }}>
            {musica.nome}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" component="div" sx={{ color: "#bf8f00", mb: 2 }}>
            {musica.categoria}
          </Typography>

          {/* Elemento de Áudio Invisível */}
          <audio ref={audioRef} src={musica.urlAudio} preload="metadata" />

          {/* Controles */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <IconButton aria-label="play/pause" onClick={togglePlay} sx={{ color: "#dcbfa6", border: "1px solid #5d4037" }}>
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            
            <Box sx={{ width: "100%", mx: 1 }}>
               <Slider 
                 size="small"
                 value={currentTime}
                 max={duration}
                 onChange={handleTimeChange}
                 sx={{ 
                   color: "#bf8f00",
                   "& .MuiSlider-rail": { color: "#5d4037" }
                 }}
               />
               <Box display="flex" justifyContent="space-between">
                 <Typography variant="caption" color="rgba(255,255,255,0.5)">{formatTime(currentTime)}</Typography>
                 <Typography variant="caption" color="rgba(255,255,255,0.5)">{formatTime(duration)}</Typography>
               </Box>
            </Box>
          </Box>

          {/* Volume e Delete */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
             <Box sx={{ display: "flex", alignItems: "center", width: 100, gap: 1 }}>
                {volume === 0 ? <VolumeOffIcon fontSize="small" sx={{ color: "#5d4037" }} /> : <VolumeUpIcon fontSize="small" sx={{ color: "#5d4037" }} />}
                <Slider 
                  size="small" 
                  value={volume} 
                  max={1} 
                  step={0.1} 
                  onChange={handleVolumeChange}
                  sx={{ color: "#833c0b" }}
                />
             </Box>

             <Tooltip title="Queimar Música">
               <IconButton size="small" onClick={() => setDeleteDialogOpen(true)} sx={{ color: "#5d4037", "&:hover": { color: "#d32f2f" } }}>
                 <DeleteForeverIcon />
               </IconButton>
             </Tooltip>
          </Box>

        </CardContent>
      </Card>

      <BurnConfirmation 
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Queimar Partitura?"
        description={`Deseja remover "${musica.nome}" do repertório da taverna?`}
      />

      <ArcaneAlert 
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        severity={alertSeverity}
        message={alertMessage}
      />
    </>
  );
};

export default MusicaCard;
