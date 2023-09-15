// NoteAddGlobal.jsx

import React, { useState } from "react";
import styles from "../NoteAdd/NoteAdd.module.css";
import { app } from "APIs/firebaseConfig";
import { useNoteContext } from "APIs/NoteContext";
import { Button } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { getAuth } from "firebase/auth";

const NoteAddGlobal = () => {
  const { addNote } = useNoteContext();
  const [noteFile, setNoteFile] = useState(null);

  const handleFileChange = (e) => {
    setNoteFile(e.target.files[0]);
  };

  const handleAddNote = async () => {
    if (noteFile) {
      const auth = getAuth();
      const user = auth.currentUser;
      const userID = user.uid;
      const storage = app.storage();
      const storageRef = storage.ref();
      const noteFileRef = storageRef.child(`arquivos/anotacoes/${userID}/${noteFile.name}`);

      await noteFileRef.put(noteFile);
      const noteFileUrl = await noteFileRef.getDownloadURL();

      // Crie um novo objeto de nota
      const newNote = {
        id: app.database().ref().child("notes").push().key,
        arquivoNomeCompleto: noteFile.name,
        title: noteFile.name.replace(/\.[^/.]+$/, ""),
        url: noteFileUrl,
      };

      // Adicione a nova nota ao contexto de notas
      addNote(newNote);

      setNoteFile(null);
    }
  };

  return (
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
          disabled={!noteFile}
          variant="contained"
          startIcon={<CloudUpload />}
        >
          Adicionar Anotação
        </Button>
    </div>
  );
};

export default NoteAddGlobal;
