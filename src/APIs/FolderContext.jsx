import React, { createContext, useContext, useState, useEffect } from "react";
import { database, auth, firebase } from "./firebaseConfig"; // usa exports compat

const FolderContext = createContext();

export const useFolderContext = () => useContext(FolderContext);

export default FolderContext;

export const FolderProvider = ({ children }) => {
  const [folders, setFolders] = useState([]);
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setUserID(user ? user.uid : null);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!userID) {
      setFolders([]);
      return;
    }
    const foldersRef = database.ref(`folders/${userID}`);
    const handle = (snapshot) => {
      const data = snapshot.val();
      setFolders(data ? Object.values(data) : []);
    };
    foldersRef.on("value", handle);
    return () => foldersRef.off("value", handle);
  }, [userID]);

  // Função para adicionar uma nova pasta
  const addFolder = async (newFolder) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");
    const uid = user.uid;
    const foldersRef = database.ref(`folders/${uid}`);
    const newFolderRef = foldersRef.push();
    const newFolderId = newFolderRef.key;
    await newFolderRef.set({
      ...newFolder,
      id: newFolderId,
      criadoEm: firebase.database.ServerValue.TIMESTAMP,
    });
  };

  const addNoteToFolder = (folderId, note) => {
    if (!userID) return;
    const foldersRef = database.ref(`folders/${userID}`);
    try {
      const folderRef = foldersRef.child(folderId);
      const newNoteRef = folderRef.child("notes").push();
      note.id = newNoteRef.key;
      newNoteRef.set({ ...note, criadoEm: firebase.database.ServerValue.TIMESTAMP });
      console.log("Note added to folder successfully");
    } catch (error) {
      console.error("Error adding note to folder:", error);
    }
  };

  const deleteNoteFromFolder = async (folderId, noteId) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");
    const uid = user.uid;
    const folderRef = database.ref(`folders/${uid}/${folderId}`);
    try {
      const folderSnapshot = await folderRef.once("value");
      const folderData = folderSnapshot.val();
      if (folderData && folderData.notes) {
        // notes pode ser array ou objeto; tenta suportar ambos
        const notes = Array.isArray(folderData.notes) ? folderData.notes : Object.values(folderData.notes);
        const updatedNotes = notes.filter((note) => note.id !== noteId);
        await folderRef.child("notes").set(updatedNotes);
        console.log("Note removed from folder successfully");
        await database.ref(`notes/${noteId}`).remove();
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
