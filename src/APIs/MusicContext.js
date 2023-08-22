// MusicContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../APIs/firebaseConfig"; // Importar a instância do aplicativo Firebase
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";

const MusicContext = createContext();

export const useMusicContext = () => useContext(MusicContext);

export const MusicProvider = ({ children }) => {
  const [musicas, setMusicas] = useState([]);

  useEffect(() => {
    const musicasRef = app.database().ref("musicas"); // Usar a instância do aplicativo Firebase
    musicasRef.on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMusicas(Object.values(data));
      }
    });
  }, []);

  const adicionarMusica = (novaMusica) => {
    const musicasRef = app.database().ref("musicas"); // Usar a instância do aplicativo Firebase
    musicasRef.push(novaMusica);
  };

  // Ler os dados da coleção de músicas usando o método once()
  const lerMusicas = () => {
    const musicasRef = app.database().ref("musicas"); // Usar a instância do aplicativo Firebase
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
    const db = getFirestore(app);
    const musicasCollection = collection(db, "musicas");

    // Primeiro, faça o upload do arquivo MP3 para o Firebase Storage
    const storage = getStorage(app);
    const arquivoRef = ref(
      storage,
      `https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/${novaMusica.arquivo.name}`
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

  // Deletar um documento da coleção de músicas
  //   const deletarMusica = (id) => {
  //     const musicasRef = app.database().ref("musicas"); // Usar a instância do aplicativo Firebase
  //     musicasRef.child(id).remove();
  //   };

  return (
    <MusicContext.Provider
      value={{
        musicas,
        lerMusicas,
        adicionarMusica,
        adicionarMusicaArquivo,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};
