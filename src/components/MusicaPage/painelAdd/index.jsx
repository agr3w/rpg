import React, { useState } from "react";
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  MenuItem, 
  Box, 
  Typography, 
  Stack,
  CircularProgress,
  InputAdornment
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AudioFileIcon from '@mui/icons-material/AudioFile';
import ImageIcon from '@mui/icons-material/Image';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { useMusicContext } from "APIs/MusicContext";
import { storage, auth } from "APIs/firebaseConfig";
import ArcaneAlert from "components/ArcaneAlert";

const AddMusicButton = ({ onMusicAdded }) => {
  const { adicionarMusica, categorias } = useMusicContext();
  
  // Estados do Formulário
  const [open, setOpen] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [arquivo, setArquivo] = useState(null);
  const [imagem, setImagem] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Estados do Alerta
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  // Handlers
  const handleOpen = () => setOpen(true);
  
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitulo("");
    setCategoria("");
    setImagem(null);
    setArquivo(null);
  };

  const handleArquivoChange = (e) => setArquivo(e.target.files[0] || null);
  const handleImagemChange = (e) => setImagem(e.target.files[0] || null);

  const handleAdicionarMusica = async () => {
    if (!arquivo || !titulo || !imagem || !categoria) {
      setAlertSeverity("error");
      setAlertMessage("Preencha todos os campos do contrato!");
      setAlertOpen(true);
      return;
    }

    setIsUploading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Bardo não identificado.");
      
      const userID = user.uid;
      const storageRef = storage.ref();

      // Upload do Áudio
      const arquivoRef = storageRef.child(`arquivos/musicas/${userID}/${arquivo.name}`);
      await arquivoRef.put(arquivo);
      const urlDoArquivo = await arquivoRef.getDownloadURL();

      // Upload da Imagem
      const imagemRef = storageRef.child(`imagens/${userID}/${imagem.name}`);
      await imagemRef.put(imagem);
      const imagemUrl = await imagemRef.getDownloadURL();

      const novaMusica = {
        titulo: titulo,
        categoria: categoria,
        nomeArquivoAudio: arquivo.name,
        nomeArquivoImagem: imagem.name,
        urlAudio: urlDoArquivo, // Padronizando nome da chave
        urlImagem: imagemUrl,   // Padronizando nome da chave
        createdAt: new Date().toISOString()
      };

      await adicionarMusica(novaMusica);
      if (typeof onMusicAdded === "function") onMusicAdded();
      
      handleClose();
      setAlertSeverity("success");
      setAlertMessage(`"${titulo}" foi adicionada ao repertório!`);
      setAlertOpen(true);

    } catch (err) {
      console.error("Erro ao adicionar música:", err);
      setAlertSeverity("error");
      setAlertMessage("Falha ao registrar a canção. Tente novamente.");
      setAlertOpen(true);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Button 
        onClick={handleOpen}
        variant="contained"
        startIcon={<AddCircleIcon />}
        sx={{
          bgcolor: "#833c0b",
          color: "#fff",
          fontFamily: "Cinzel",
          fontWeight: "bold",
          border: "1px solid #5d4037",
          "&:hover": { bgcolor: "#a04d14", borderColor: "#bf8f00" }
        }}
      >
        Nova Canção
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "#fdfbf7",
            backgroundImage: `url("https://www.transparenttextures.com/patterns/paper.png")`,
            border: "3px solid #833c0b",
            borderRadius: 2,
            boxShadow: "0 0 20px rgba(0,0,0,0.5)"
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: "center", 
          fontFamily: "Cinzel", 
          fontWeight: "bold", 
          color: "#833c0b",
          borderBottom: "1px solid rgba(131, 60, 11, 0.2)"
        }}>
          Registrar Nova Obra
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={3}>
            
            {/* Título */}
            <TextField
              label="Título da Música"
              variant="outlined"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              fullWidth
              InputLabelProps={{ sx: { fontFamily: "Cinzel" } }}
              InputProps={{ sx: { fontFamily: "Cinzel", fontWeight: "bold" } }}
            />

            {/* Categoria */}
            <TextField
              select
              label="Ritmo / Categoria"
              variant="outlined"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              fullWidth
              InputLabelProps={{ sx: { fontFamily: "Cinzel" } }}
            >
              {categorias.map((cat) => (
                <MenuItem key={cat} value={cat} sx={{ fontFamily: "Cinzel" }}>
                  {cat}
                </MenuItem>
              ))}
              {/* Opção extra caso queira permitir criar nova (lógica futura) */}
              <MenuItem value="Outros" sx={{ fontFamily: "Cinzel", fontStyle: "italic" }}>
                Outros / Desconhecido
              </MenuItem>
            </TextField>

            {/* Uploads */}
            <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
              
              {/* Botão Imagem */}
              <Box sx={{ flex: 1 }}>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="upload-cover"
                  type="file"
                  onChange={handleImagemChange}
                />
                <label htmlFor="upload-cover">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    startIcon={imagem ? <CheckCircleIcon color="success" /> : <ImageIcon />}
                    sx={{ 
                      height: "56px",
                      borderColor: imagem ? "#2e7d32" : "#833c0b",
                      color: imagem ? "#2e7d32" : "#5d4037",
                      borderStyle: "dashed",
                      fontFamily: "Cinzel"
                    }}
                  >
                    {imagem ? "Capa Definida" : "Capa do Álbum"}
                  </Button>
                </label>
                {imagem && (
                  <Typography variant="caption" display="block" align="center" noWrap sx={{ mt: 0.5, maxWidth: "200px" }}>
                    {imagem.name}
                  </Typography>
                )}
              </Box>

              {/* Botão Áudio */}
              <Box sx={{ flex: 1 }}>
                <input
                  accept="audio/*"
                  style={{ display: "none" }}
                  id="upload-audio"
                  type="file"
                  onChange={handleArquivoChange}
                />
                <label htmlFor="upload-audio">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    startIcon={arquivo ? <CheckCircleIcon color="success" /> : <AudioFileIcon />}
                    sx={{ 
                      height: "56px",
                      borderColor: arquivo ? "#2e7d32" : "#833c0b",
                      color: arquivo ? "#2e7d32" : "#5d4037",
                      borderStyle: "dashed",
                      fontFamily: "Cinzel"
                    }}
                  >
                    {arquivo ? "Áudio Pronto" : "Arquivo de Áudio"}
                  </Button>
                </label>
                {arquivo && (
                  <Typography variant="caption" display="block" align="center" noWrap sx={{ mt: 0.5, maxWidth: "200px" }}>
                    {arquivo.name}
                  </Typography>
                )}
              </Box>
            </Box>

          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: "1px solid rgba(0,0,0,0.1)" }}>
          <Button 
            onClick={handleClose} 
            disabled={isUploading}
            sx={{ color: "#5d4037", fontFamily: "Cinzel" }}
          >
            Rasgar Contrato
          </Button>
          <Button
            onClick={handleAdicionarMusica}
            variant="contained"
            disabled={isUploading}
            startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
            sx={{
              bgcolor: "#833c0b",
              color: "#fff",
              fontFamily: "Cinzel",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#a04d14" }
            }}
          >
            {isUploading ? "Registrando..." : "Assinar e Publicar"}
          </Button>
        </DialogActions>
      </Dialog>

      <ArcaneAlert 
        open={alertOpen} 
        onClose={() => setAlertOpen(false)} 
        severity={alertSeverity} 
        message={alertMessage} 
      />
    </>
  );
};

export default AddMusicButton;
