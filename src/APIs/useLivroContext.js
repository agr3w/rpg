import React, { createContext, useContext, useState, useEffect } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../APIs/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

const BookContext = createContext();

export const useBookContext = () => useContext(BookContext);

export const BookProvider = ({ children }) => {
  const [livros, setLivros] = useState([]);
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null);

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

  useEffect(() => {
    // Verificar o estado de autenticação do usuário
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuarioAutenticado(user ? user : null);
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
        usuarioAutenticado,
        // ... outras funções
      }}
    >
      {children}
    </BookContext.Provider>
  );
};
