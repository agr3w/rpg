// BookContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { database, auth, firebase } from "./firebaseConfig"; // usa exports compat

const BookContext = createContext();

export const useBookContext = () => useContext(BookContext);

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setUserID(user ? user.uid : null);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!userID) {
      setBooks([]);
      return;
    }
    const booksRef = database.ref(`books/${userID}`);
    const handle = (snapshot) => {
      const data = snapshot.val();
      setBooks(data ? Object.values(data) : []);
    };
    booksRef.on("value", handle);
    return () => booksRef.off("value", handle);
  }, [userID]);

  const addBook = async (newBook) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");
    const uid = user.uid;
    const booksRef = database.ref(`books/${uid}`);
    const newBookRef = booksRef.push();
    const newBookId = newBookRef.key;
    await newBookRef.set({
      ...newBook,
      id: newBookId,
      criadoEm: firebase.database.ServerValue.TIMESTAMP,
    });
  };

  const deleteBook = async (bookId) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");
    const uid = user.uid;
    const bookRef = database.ref(`books/${uid}/${bookId}`);
    await bookRef.remove();
  };

  return (
    <BookContext.Provider
      value={{
        books,
        addBook,
        deleteBook,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};
