import React, { useState } from "react";
import styles from "./NoteAdd.module.css";
import { useFolderContext } from "APIs/FolderContext"; // Importe o contexto de folders
import { Button } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { database, storage, auth, firebase } from "APIs/firebaseConfig";

const NoteAdd = ({ folderId }) => {
  const { addNoteToFolder } = useFolderContext(); // Use a função de adicionar notas ao folder
  const [noteFile, setNoteFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setNoteFile(e.target.files[0]);
  };

  const handleAddNote = async () => {
    if (!noteFile) return;
    setIsUploading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não autenticado");
      const userID = user.uid;

      const storageRef = storage.ref();
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
      };

      await addNoteToFolder(folderId, newNote);

      setNoteFile(null);
    } catch (err) {
      console.error("Erro ao adicionar anotação:", err);
      alert("Erro ao adicionar anotação.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.noteAddContainer}>
      <div className={styles.noteAdd}>
        <label
          className={`${styles.fileInputLabel} ${
            noteFile ? styles.fileInputSelected : ""
          }`}
        >
          <span className={styles.customFileInputButton}>
            {noteFile ? "Arquivo Selecionado" : "Selecionar Arquivo"}
          </span>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
        </label>
        <Button
          className={styles.addButton}
          onClick={handleAddNote}
          disabled={!noteFile || isUploading}
          variant="contained"
          startIcon={<CloudUpload />}
        >
          {isUploading ? "Carregando..." : "Adicionar Anotação"}
        </Button>
      </div>
    </div>
  );
};

export default NoteAdd;
