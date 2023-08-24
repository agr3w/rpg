import React, { useState, useEffect } from "react";
import { app } from "../APIs/firebaseConfig"; // Importe a configuração do Firebase

import { createContext, useContext } from "react";

const FolderContext = createContext();

export const useFolderContext = () => useContext(FolderContext);

export default FolderContext;

export const FolderProvider = ({ children }) => {
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    const foldersRef = app.database().ref("folders");
    foldersRef.on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setFolders(Object.values(data));
      }
    });
  }, []);

  // Função para adicionar uma nova pasta
  const addFolder = async (newFolder) => {
    const foldersRef = app.database().ref("folders");
    const newFolderRef = await foldersRef.push();
    const newFolderId = newFolderRef.key;
    await newFolderRef.set({
      ...newFolder,
      id: newFolderId,
    });
  };

  const addNoteToFolder = (folderId, note) => {
    const foldersRef = app.database().ref("folders");
  
    try {
      const folderRef = foldersRef.child(folderId);
      // Defina o ID da nota com o mesmo valor que o nome do item
      const newNoteRef = folderRef.child("notes").push();
      note.id = newNoteRef.key;
       newNoteRef.set(note); // Adicione a nova nota ao banco de dados em tempo real
      console.log("Note added to folder successfully");
    } catch (error) {
      console.error("Error adding note to folder:", error);
    }
  };

const deleteNoteFromFolder = async (folderId, noteId) => {
  const folderRef = app.database().ref(`folders/${folderId}`);

  try {
    const folderSnapshot = await folderRef.once("value");
    const folderData = folderSnapshot.val();

    if (folderData && folderData.notes) {
      const updatedNotes = folderData.notes.filter((note) => note.id !== noteId);
      await folderRef.child("notes").set(updatedNotes);

      console.log("Note removed from folder successfully");

      // Também remover a nota do banco de dados de notas
      await app.database().ref(`notes/${noteId}`).remove();

      console.log("Note removed from notes successfully");
    }
  } catch (error) {
    console.error("Error removing note from folder:", error);
  }
};



  // Retorne o contexto de pastas
  return (
    <FolderContext.Provider
      value={{
        folders,
        addFolder,
        addNoteToFolder,
        deleteNoteFromFolder,
      }}
    >
      {children}
    </FolderContext.Provider>
  );
};
