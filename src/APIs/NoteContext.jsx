import { createContext, useContext, useState, useEffect } from "react";
import { database, auth, firebase } from "./firebaseConfig"; // usa exports compat

const NoteContext = createContext();

export const useNoteContext = () => useContext(NoteContext);

export const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setUserID(user ? user.uid : null);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!userID) {
      setNotes([]);
      return;
    }
    const notesRef = database.ref(`notes/${userID}`);
    const handle = (snapshot) => {
      const data = snapshot.val();
      setNotes(data ? Object.values(data) : []);
    };
    notesRef.on("value", handle);
    return () => notesRef.off("value", handle);
  }, [userID]);

  const addNote = async (newNote) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");
    const uid = user.uid;
    const notesRef = database.ref(`notes/${uid}`);
    const newNoteRef = notesRef.push();
    const newNoteId = newNoteRef.key;
    await newNoteRef.set({
      ...newNote,
      id: newNoteId,
      criadoEm: firebase.database.ServerValue.TIMESTAMP,
    });
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        addNote,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};
