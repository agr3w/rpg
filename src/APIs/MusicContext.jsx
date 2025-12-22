// MusicContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { app, firebase, database, storage, auth } from "./firebaseConfig"; // usa exports do arquivo compat

const MusicContext = createContext();

export const useMusicContext = () => useContext(MusicContext);

export const MusicProvider = ({ children }) => {
  const [musicas, setMusicas] = useState([]);
  const [userID, setUserID] = useState(null);
  const [categorias, setCategorias] = useState([
    "Sem categoria",
    "Épico e Orquestral",
    "Ambiental e Atmosférico",
    "Folclore e Étnico",
    "Celta e Medieval",
    "Misterioso e Sombrio",
  ]);
  const [isLooping, setIsLooping] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setUserID(user ? user.uid : null);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!userID) {
      setMusicas([]);
      return;
    }
    const foldersRef = database.ref(`musicas/${userID}`);
    const handle = (snapshot) => {
      const data = snapshot.val();
      setMusicas(data ? Object.values(data) : []);
    };
    foldersRef.on("value", handle);
    return () => foldersRef.off("value", handle);
  }, [userID]);

  const adicionarMusica = async (novaMusica) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");
    const uid = user.uid;
    const musicasRef = database.ref(`musicas/${uid}`);
    const novaMusicaRef = musicasRef.push();
    const novaMusicaId = novaMusicaRef.key;
    await novaMusicaRef.set({
      ...novaMusica,
      id: novaMusicaId,
    });
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
  };

  // Ler os dados da coleção de músicas usando o método once()
  const lerMusicas = () => {
    const musicasRef = database.ref(`musicas/${userID}`);
    musicasRef
      .once("value")
      .then((snapshot) => console.log(snapshot.val()))
      .catch((error) => console.error(error));
  };

  // Função para adicionar uma nova música
  const adicionarMusicaArquivo = async (novaMusica) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");
    const uid = user.uid;
    const musicasRef = database.ref(`musicas/${uid}`);
    const novaMusicaRef = musicasRef.push();
    const id = novaMusicaRef.key;

    let urlDoArquivo = null;
    if (novaMusica.arquivo) {
      const file = novaMusica.arquivo;
      const storageRef = storage.ref(`${uid}/${file.name}`);
      await storageRef.put(file);
      urlDoArquivo = await storageRef.getDownloadURL();
    }

    await novaMusicaRef.set({
      titulo: novaMusica.titulo,
      artista: novaMusica.artista,
      urlDoArquivo,
      id,
      criadoEm: firebase.database.ServerValue.TIMESTAMP,
    });
  };

  return (
    <MusicContext.Provider
      value={{
        musicas,
        lerMusicas,
        adicionarMusica,
        adicionarMusicaArquivo,
        toggleLoop,
        categorias,
        setCategorias,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};
