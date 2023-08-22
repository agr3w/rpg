import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import styles from "./BotaoAdicionarMusica.module.css";
import { useMusicContext } from "../../../APIs/MusicContext";
import { app } from "../../../APIs/firebaseConfig"; // Importe a configuração do Firebase

const BotaoAdicionarMusica = () => {
  const { adicionarMusica } = useMusicContext();
  const [arquivo, setArquivo] = useState(null);

  const handleArquivoChange = (e) => {
    setArquivo(e.target.files[0]);
  };

  const handleAdicionarMusica = async () => {
    if (arquivo) {
      // Primeiro, faça o upload do arquivo MP3 para o Firebase Storage
      const storage = app.storage();
      const storageRef = storage.ref();
      const arquivoRef = storageRef.child(`arquivos/musicas/${arquivo.name}`); // Defina o caminho desejado no Storage

      await arquivoRef.put(arquivo);

      // Obtenha a URL do arquivo MP3 recém-carregado
      const urlDoArquivo = await arquivoRef.getDownloadURL();

      // Crie um ID único para a música usando o método push()
      const novaMusica = {
        id: app.database().ref().child("musicas").push().key, // Gere um ID único
        titulo: arquivo.name.replace(/\.[^/.]+$/, ""), // Nome do arquivo sem extensão
        artista: arquivo.name.replace(/\.[^/.]+$/, ""), // Nome do arquivo sem extensão
        urlDoArquivo,
      };

      // Adicione as informações da música ao Firebase Realtime Database
      adicionarMusica(novaMusica);

      // Limpe o campo de arquivo
      setArquivo(null);
    }
  };

  return (
    <div className={styles.botaoAdicionarMusica}>
      <input type="file" accept="audio/*" onChange={handleArquivoChange} />
      <button onClick={handleAdicionarMusica}>
        <FaPlus /> Adicionar Música
      </button>
    </div>
  );
};

export default BotaoAdicionarMusica;
