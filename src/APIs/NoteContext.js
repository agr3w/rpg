import { createContext, useContext, useState, useEffect } from "react";
import { app } from "../APIs/firebaseConfig"; // Import your Firebase app instance

const NoteContext = createContext();

export const useNoteContext = () => useContext(NoteContext);

export const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const notesRef = app.database().ref("notes");
    notesRef.on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setNotes(Object.values(data));
      }
    });
  }, []);

  const addNote = async (newNote) => {
    const notesRef = app.database().ref("notes");
    const newNoteRef = notesRef.push();
    const newNoteId = newNoteRef.key;
    await newNoteRef.set({
      ...newNote,
      id: newNoteId,
    });
  };

  const deleteNote = async (noteId) => {
    const noteRef = app.database().ref(`notes/${noteId}`);
    await noteRef.remove();
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        addNote,
        deleteNote,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};
