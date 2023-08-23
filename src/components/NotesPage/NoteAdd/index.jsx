import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import styles from "./NoteAdd.module.css";
import { app } from "APIs/firebaseConfig";
import { useNoteContext } from "APIs/NoteContext";
import { useFolderContext } from "APIs/FolderContext"; // Importe o contexto de folders

const NoteAdd = ({ folderId }) => {
  const { addNote } = useNoteContext(); // Use o contexto de notas
  const { addNoteToFolder } = useFolderContext(); // Use a função de adicionar notas ao folder
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
        title: noteFile.name.replace(/\.[^/.]+$/, ""),
        url: noteFileUrl,
      };

      // Adicione a nova nota ao contexto de notas
      addNote(newNote);

      // Adicione a nova nota ao folder correspondente
      addNoteToFolder(folderId, newNote);

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

export default NoteAdd;
