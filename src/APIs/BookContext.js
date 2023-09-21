// BookContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { app } from "../APIs/firebaseConfig"; // Import your Firebase app instance
import { getAuth } from "firebase/auth";

const BookContext = createContext();

export const useBookContext = () => useContext(BookContext);

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
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
      const foldersRef = app.database().ref(`books/${userID}`);
      foldersRef.on("value", (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setBooks(Object.values(data));
        }
      });
    }
  }, [userID]);

  const addBook = async (newBook) => {
    const auth = getAuth();
    const user = auth.currentUser;
    const userID = user.uid;
    const booksRef = app.database().ref(`books/${userID}`);
    const newBookRef = booksRef.push();
    const newBookId = newBookRef.key;
    await newBookRef.set({
      ...newBook,
      id: newBookId,
    });
  };

  const deleteBook = async (bookId) => {
    const auth = getAuth();
    const user = auth.currentUser;
    const userID = user.uid;
    const bookRef = app.database().ref(`arquivos/livros/${userID}/${bookId}`);
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
