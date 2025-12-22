// NoteAddGlobal.jsx

import React, { useState } from "react";
import styles from "../NoteAdd/NoteAdd.module.css";
import { useNoteContext } from "APIs/NoteContext";
import { Button } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { storage, auth } from "APIs/firebaseConfig";

const NoteAddGlobal = () => {
  const { addNote } = useNoteContext();
  const [noteFile, setNoteFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setNoteFile(e.target.files[0] || null);
  };

  const handleAddNote = async () => {
    if (!noteFile) return;
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não autenticado");
      const userID = user.uid;

      const storageRef = storage.ref();
      const noteFileRef = storageRef.child(`arquivos/anotacoes/${userID}/${noteFile.name}`);

      await noteFileRef.put(noteFile);
      const noteFileUrl = await noteFileRef.getDownloadURL();

      const newNote = {
        arquivoNomeCompleto: noteFile.name,
        title: noteFile.name.replace(/\.[^/.]+$/, ""),
        url: noteFileUrl,
      };

      await addNote(newNote);
      setNoteFile(null);
    } catch (err) {
      console.error("Erro ao adicionar anotação global:", err);
      alert("Erro ao adicionar anotação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.noteAdd}>
      <label className={`${styles.fileInputLabel} ${noteFile ? styles.fileInputSelected : ""}`}>
        <span className={styles.customFileInputButton}>
          {noteFile ? "Arquivo Selecionado" : "Selecionar Arquivo"}
        </span>
        <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange} className={styles.fileInput} />
      </label>
      <Button className={styles.addButton} onClick={handleAddNote} disabled={!noteFile || loading} variant="contained" startIcon={<CloudUpload />}>
        {loading ? "Carregando..." : "Adicionar Anotação"}
      </Button>
    </div>
  );
};

export default NoteAddGlobal;
