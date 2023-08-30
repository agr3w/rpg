import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import styles from "./NoteAdd.module.css";
import { app } from "APIs/firebaseConfig";
import { useFolderContext } from "APIs/FolderContext"; // Importe o contexto de folders

const NoteAdd = ({ folderId }) => {
  const { addNoteToFolder } = useFolderContext(); // Use a função de adicionar notas ao folder
  const [noteFile, setNoteFile] = useState(null);

  const handleFileChange = (e) => {
    setNoteFile(e.target.files[0]);
  };

  const handleAddNote = async () => {
    if (noteFile) {
      const storage = app.storage();
      const storageRef = storage.ref();
      const noteFileRef = storageRef.child(
        `arquivos/anotacoes/pasta/${noteFile.name}`
      );

      await noteFileRef.put(noteFile);
      const noteFileUrl = await noteFileRef.getDownloadURL();

      // Crie um novo objeto de nota
      const newNote = {
        id: app.database().ref().child("notes").push().key,
        arquivoNomeCompleto: noteFile.name,
        title: noteFile.name.replace(/\.[^/.]+$/, ""),
        url: noteFileUrl,
      };

      // Adicione a nova nota ao folder correspondente
      addNoteToFolder(folderId, newNote);

      setNoteFile(null);
    }
  };
  return (
    <div className={styles.noteAddContainer}>
      <div className={styles.noteAdd}>
        <label
          className={
            noteFile
              ? styles.fileInputSelected
              : styles.fileInput
          }
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
        <button
          className={styles.addButton}
          onClick={handleAddNote}
          disabled={!noteFile}
        >
          <FaPlus size={14} /> Adicionar Anotação
        </button>
      </div>
    </div>
  );
};

export default NoteAdd;
