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

  const addNoteToFolder = (folderId, newNote) => {
    const updatedFolders = folders.map((folder) => {
      if (folder.id === folderId) {
        return {
          ...folder,
          notes: folder.notes ? [...folder.notes, newNote] : [newNote], // Certifique-se de criar um array se notes não existir ainda
        };
      }
      return folder;
    });
    setFolders(updatedFolders);
  };

  const deleteNoteFromFolder = async (folderId, noteId) => {
    const folderIndex = folders.findIndex((folder) => folder.id === folderId);

    if (folderIndex !== -1) {
      const updatedFolders = [...folders];
      const notes = updatedFolders[folderIndex].notes;
      const noteIndex = notes.findIndex((note) => note.id === noteId);

      if (noteIndex !== -1) {
        notes.splice(noteIndex, 1); // Remove a nota do array de notas do folder

        try {
          // Atualiza o banco de dados com as notas atualizadas do folder
          await app.database().ref(`folders/${folderId}/notes`).set(notes);

          console.log("Note removed from folder successfully");

          // Agora, remova a nota do banco de dados de notas também
          await app.database().ref(`notes/${noteId}`).remove();

          console.log("Note removed from notes successfully");
        } catch (error) {
          console.error("Error removing note from folder:", error);
        }

        setFolders(updatedFolders); // Atualiza o estado dos folders
      }
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
