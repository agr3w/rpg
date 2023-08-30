// NoteAddGlobal.jsx

import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import styles from "../NoteAdd/NoteAdd.module.css";
import { app } from "APIs/firebaseConfig";
import { useNoteContext } from "APIs/NoteContext";

const NoteAddGlobal = () => {
  const { addNote } = useNoteContext();
  const [noteFile, setNoteFile] = useState(null);

  const handleFileChange = (e) => {
    setNoteFile(e.target.files[0]);
  };

  const handleAddNote = async () => {
    if (noteFile) {
      const storage = app.storage();
      const storageRef = storage.ref();
      const noteFileRef = storageRef.child(`arquivos/anotacoes/${noteFile.name}`);

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
      <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange} />
      <button onClick={handleAddNote}>
        <FaPlus /> Adicionar Anotação
      </button>
    </div>
  );
};

export default NoteAddGlobal;
