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

  // Retorne o contexto de pastas
  return (
    <FolderContext.Provider
      value={{
        folders,
        addFolder,
      }}
    >
      {children}
    </FolderContext.Provider>
  );
};
