import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import Rout from "./Route";
import "styles/reset.css";
import { MusicProvider } from "APIs/MusicContext";
import { BookProvider } from "APIs/BookContext";
import { NoteProvider } from "APIs/NoteContext";
import { FolderProvider } from "APIs/FolderContext";
import firebase from 'firebase/compat/app'; // Importando o Firebase corretamente
import 'firebase/compat/auth'; // Importando o módulo de autenticação

const root = ReactDOM.createRoot(document.getElementById("root"));

const App = () => {
  // Função para autenticação anônima
  const signInAnonymously = () => {
    firebase.auth().signInAnonymously()
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Usuário autenticado anonimamente:', user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Erro na autenticação anônima:', errorCode, errorMessage);
      });
  };

  useEffect(() => {
    signInAnonymously();
  }, []); // Chame a função uma vez quando o componente for montado

  return (
    <React.StrictMode>
      <MusicProvider>
        <BookProvider>
          <FolderProvider>
            <NoteProvider>
              <Rout />
            </NoteProvider>
          </FolderProvider>
        </BookProvider>
      </MusicProvider>
    </React.StrictMode>
  );
};

root.render(<App />);
