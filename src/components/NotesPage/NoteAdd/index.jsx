import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import styles from "./NoteAdd.module.css"; // Certifique-se de ter o arquivo de estilos correspondente
import { app } from "APIs/firebaseConfig"; // Importe a configuração do Firebase
import { useNoteContext } from "APIs/NoteContext";

const NoteAdd = () => {
  const { addNote } = useNoteContext();
  const [noteFile, setNoteFile] = useState(null);

  const handleFileChange = (e) => {
    setNoteFile(e.target.files[0]);
  };

  const handleAddNote = async () => {
    if (noteFile) {
      // Primeiro, faça o upload do arquivo de nota para o Firebase Storage
      const storage = app.storage();
      const storageRef = storage.ref();
      const noteFileRef = storageRef.child(`arquivos/anotacoes/${noteFile.name}`); // Defina o caminho desejado no Storage

      await noteFileRef.put(noteFile);

      // Obtenha a URL do arquivo de nota recém-carregado
      const noteFileUrl = await noteFileRef.getDownloadURL();

      // Crie um ID único para a anotação usando o método push()
      const newNote = {
        id: app.database().ref().child("notes").push().key, // Gere um ID único
        title: noteFile.name.replace(/\.[^/.]+$/, ""), // Nome do arquivo sem extensão
        url: noteFileUrl,
      };

      // Adicione as informações da anotação ao contexto de anotações
      addNote(newNote);

      // Limpe o campo de arquivo
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
