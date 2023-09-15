// MusicContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../APIs/firebaseConfig"; // Importar a instância do aplicativo Firebase
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { getAuth } from "firebase/auth";

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
      const foldersRef = app.database().ref(`musicas/${userID}`);
      foldersRef.on("value", (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setMusicas(Object.values(data));
        }
      });
    }
  }, [userID]);

  const adicionarMusica = async (novaMusica) => {
    const auth = getAuth();
    const user = auth.currentUser;
    const userID = user.uid;
    const musicasRef = app.database().ref(`musicas/${userID}`); // Usar a instância do aplicativo Firebase

    // Crie um ID único para a música usando o método push()
    const novaMusicaRef = musicasRef.push();
    const novaMusicaId = novaMusicaRef.key; // Obtém o ID gerado

    // Adicione as informações da música ao Firebase Realtime Database
    await novaMusicaRef.set({
      ...novaMusica,
      id: novaMusicaId, // Use o mesmo ID no nó interno da música
    });
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
  };

  // Ler os dados da coleção de músicas usando o método once()
  const lerMusicas = () => {
    const musicasRef = app.database().ref(`musicas/${userID}`); // Usar a instância do aplicativo Firebase
    musicasRef
      .once("value")
      .then((snapshot) => {
        // Obter os dados em forma de objeto usando o método val()
        const data = snapshot.val();
        // Fazer algo com os dados
        console.log(data);
      })
      .catch((error) => {
        // Tratar o erro
        console.error(error);
      });
  };

  // Função para adicionar uma nova música
  const adicionarMusicaArquivo = async (novaMusica) => {
    const auth = getAuth();
    const user = auth.currentUser;
    const userID = user.uid;
    const db = getFirestore(app);
    const musicasCollection = collection(db, `musicas/${userID}`);

    // Primeiro, faça o upload do arquivo MP3 para o Firebase Storage
    const storage = getStorage(app);
    const arquivoRef = ref(
      storage,
      `https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/${userID}/${novaMusica.arquivo.name}`
    );
    await uploadBytes(arquivoRef, novaMusica.arquivo);

    // Obtenha a URL do arquivo MP3 recém-carregado
    const urlDoArquivo = await getDownloadURL(arquivoRef);

    // Adicione as informações da música ao Firestore, incluindo a URL
    await addDoc(musicasCollection, {
      titulo: novaMusica.titulo,
      artista: novaMusica.artista,
      urlDoArquivo: urlDoArquivo, // URL do arquivo MP3
      // ...outras informações
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
