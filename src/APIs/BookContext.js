// BookContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { app } from "../APIs/firebaseConfig"; // Import your Firebase app instance
import { getAuth } from "firebase/auth";

const BookContext = createContext();

export const useBookContext = () => useContext(BookContext);

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const booksRef = app.database().ref("books");
    booksRef.on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setBooks(Object.values(data));
      }
    });
  }, []);

  const addBook = async (newBook) => {
    const booksRef = app.database().ref("books");
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
