import React, { useState } from "react";
import { useFolderContext } from "APIs/FolderContext";
import { Button, Box, Typography, CircularProgress } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { database, storage, auth, firebase } from "APIs/firebaseConfig";
import ArcaneAlert from "components/ArcaneAlert"; // Importe o novo componente

const NoteAdd = ({ folderId }) => {
  const { addNoteToFolder } = useFolderContext();
  const [noteFile, setNoteFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Estados para o Alerta Arcano
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNoteFile(e.target.files[0]);
    }
  };

  const handleAddNote = async () => {
    if (!noteFile) return;
    setIsUploading(true);
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Mago não identificado (Usuário não logado).");
      const userID = user.uid;

      const storageRef = storage.ref();
      // Caminho deve bater com a regra do Firebase Storage
      const noteFileRef = storageRef.child(
        `arquivos/anotacoes/${userID}/pasta/${noteFile.name}`
      );
      
      await noteFileRef.put(noteFile);
      const noteFileUrl = await noteFileRef.getDownloadURL();

      const newNote = {
        arquivoNomeCompleto: noteFile.name,
        title: noteFile.name.replace(/\.[^/.]+$/, ""),
        url: noteFileUrl,
        criadoEm: firebase.database.ServerValue.TIMESTAMP,
        type: "file"
      };

      await addNoteToFolder(folderId, newNote);
      
      // Sucesso!
      setNoteFile(null);
      setAlertSeverity("success");
      setAlertMessage(`O documento "${newNote.title}" foi arquivado com segurança.`);
      setAlertOpen(true);

    } catch (err) {
      console.error("Erro ao adicionar anotação:", err);
      
      // Erro!
      setAlertSeverity("error");
      // Mensagem amigável se for erro de permissão
      if (err.code === 'storage/unauthorized') {
        setAlertMessage("Permissão negada pelos deuses antigos (Verifique as regras do Storage).");
      } else {
        setAlertMessage("Ocorreu um erro desconhecido ao tentar guardar o pergaminho.");
      }
      setAlertOpen(true);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <input
        accept=".pdf,.doc,.docx,.txt,.png,.jpg"
        style={{ display: "none" }}
        id="raised-button-file"
        type="file"
        onChange={handleFileChange}
      />
      
      <label htmlFor="raised-button-file">
        <Button
          variant="outlined"
          component="span"
          startIcon={noteFile ? <CheckCircleIcon color="success" /> : <InsertDriveFileIcon />}
          sx={{
            borderColor: "#833c0b",
            color: "#833c0b",
            fontFamily: "Cinzel",
            fontWeight: "bold",
            textTransform: "none",
            "&:hover": {
              borderColor: "#bf8f00",
              bgcolor: "rgba(131, 60, 11, 0.05)"
            }
          }}
        >
          {noteFile ? (
            <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
              {noteFile.name}
            </Typography>
          ) : (
            "Escolher Arquivo"
          )}
        </Button>
      </label>

      <Button
        onClick={handleAddNote}
        disabled={!noteFile || isUploading}
        variant="contained"
        startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
        sx={{
          bgcolor: "#833c0b",
          color: "#fff",
          fontFamily: "Cinzel",
          boxShadow: 3,
          "&:hover": { bgcolor: "#a04d14" },
          "&.Mui-disabled": { bgcolor: "rgba(0,0,0,0.1)" }
        }}
      >
        {isUploading ? "Arquivando..." : "Guardar"}
      </Button>

      {/* Componente de Alerta Inserido Aqui */}
      <ArcaneAlert 
        open={alertOpen} 
        onClose={() => setAlertOpen(false)} 
        severity={alertSeverity} 
        message={alertMessage} 
      />
    </Box>
  );
};

export default NoteAdd;
