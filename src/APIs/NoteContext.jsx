import { createContext, useContext, useState, useEffect } from "react";
import { app } from "../APIs/firebaseConfig"; // Import your Firebase app instance
import { getAuth } from "firebase/auth";

const NoteContext = createContext();

export const useNoteContext = () => useContext(NoteContext);

export const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUserID(user.uid);
      } else {
        setUserID(null);
      }
    });
  }, []);

  useEffect(() => {
    if (userID) {
      const notesRef = app.database().ref(`notes/${userID}`);
      notesRef.on("value", (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setNotes(Object.values(data));
        }
      });
    }
  }, [userID]);

  const addNote = async (newNote) => {
    if (userID) {
      const notesRef = app.database().ref(`notes/${userID}`);
      const newNoteRef = notesRef.push();
      const newNoteId = newNoteRef.key;
      await newNoteRef.set({
        ...newNote,
        id: newNoteId,
      });
    }
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
