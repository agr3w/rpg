import React, { createContext, useContext, useState, useEffect } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../APIs/firebaseConfig";

const BookContext = createContext();

export const useBookContext = () => useContext(BookContext);

export const BookProvider = ({ children }) => {
  const [livros, setLivros] = useState([]);

  useEffect(() => {
    const livrosRef = app.firestore().collection("livros");

    const unsubscribe = livrosRef.onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLivros(data);
    });

    return () => unsubscribe();
  }, []);

  const adicionarLivro = async (novoLivro) => {
    const db = getFirestore(app);
    const livrosCollection = collection(db, "livros");

    await addDoc(livrosCollection, {
      ...novoLivro,
    });
  };

  // ... Outras funções como deletarLivro, deletarArray, etc.

  return (
    <BookContext.Provider
      value={{
        livros,
        adicionarLivro,
        // ... outras funções
      }}
    >
      {children}
    </BookContext.Provider>
  );
};
