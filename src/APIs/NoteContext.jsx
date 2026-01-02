import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, database } from "./firebaseConfig"; // Certifique-se que o caminho está correto

const NoteContext = createContext();

export const useNoteContext = () => useContext(NoteContext);

export const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Monitorar estado de autenticação
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setNotes([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Monitorar notas do usuário no Realtime Database
  useEffect(() => {
    if (!user) return;

    const notesRef = database.ref(`notes/${user.uid}`);

    const handleValue = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Transforma o objeto do Firebase em array
        const notesList = Object.entries(data).map(([id, note]) => ({
          id,
          ...note,
        }));
        // Ordena por data (mais recente primeiro) se houver campo createdAt
        notesList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setNotes(notesList);
      } else {
        setNotes([]);
      }
      setLoading(false);
    };

    notesRef.on("value", handleValue);

    return () => notesRef.off("value", handleValue);
  }, [user]);

  // --- FUNÇÕES DE AÇÃO ---

  const addNote = async (note) => {
    if (!user) return;
    try {
      await database.ref(`notes/${user.uid}`).push(note);
    } catch (error) {
      console.error("Erro ao adicionar nota:", error);
      throw error;
    }
  };

  // ✅ Função que faltava: Deletar
  const deleteNote = async (noteId) => {
    if (!user) return;
    try {
      await database.ref(`notes/${user.uid}/${noteId}`).remove();
    } catch (error) {
      console.error("Erro ao deletar nota:", error);
      throw error;
    }
  };

  // ✅ Função que faltava: Atualizar
  const updateNote = async (noteId, updatedData) => {
    if (!user) return;
    try {
      // Remove o ID do objeto de dados para não duplicar no banco
      const { id, ...dataToUpdate } = updatedData;
      await database.ref(`notes/${user.uid}/${noteId}`).update(dataToUpdate);
    } catch (error) {
      console.error("Erro ao atualizar nota:", error);
      throw error;
    }
  };

  return (
    <NoteContext.Provider value={{ notes, loading, addNote, deleteNote, updateNote }}>
      {children}
    </NoteContext.Provider>
  );
};
