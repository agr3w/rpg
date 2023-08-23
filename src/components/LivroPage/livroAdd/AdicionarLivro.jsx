import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import styles from "./BotaoAdicionarLivro.module.css"; // Certifique-se de ter o arquivo de estilos correspondente
import { app } from "APIs/firebaseConfig"; // Importe a configuração do Firebase
import { useBookContext } from "APIs/BookContext";

const BotaoAdicionarLivro = () => {
  const { addBook } = useBookContext();
  const [books, setBooks] = useState(null);

  const handleArquivoChange = (e) => {
    setBooks(e.target.files[0]);
  };

  const handleAdicionarLivro = async () => {
    if (books) {
      // Primeiro, faça o upload do arquivo PDF para o Firebase Storage
      const storage = app.storage();
      const storageRef = storage.ref();
      const arquivoRef = storageRef.child(`arquivos/livros/${books.name}`); // Defina o caminho desejado no Storage

      await arquivoRef.put(books);

      // Obtenha a URL do arquivo PDF recém-carregado
      const urlDoArquivo = await arquivoRef.getDownloadURL();

      // Crie um ID único para o livro usando o método push()
      const novoLivro = {
        id: app.database().ref().child("livros").push().key, // Gere um ID único
        titulo: books.name.replace(/\.[^/.]+$/, ""), // Nome do arquivo sem extensão
        urlDoArquivo,
      };

      // Adicione as informações do livro ao contexto de livros
      addBook(novoLivro);

      // Limpe o campo de arquivo
      setBooks(null);
    }
  };

  return (
    <div className={styles.botaoAdicionarLivro}>
      <input type="file" accept=".pdf" onChange={handleArquivoChange} />
      <button onClick={handleAdicionarLivro}>
        <FaPlus /> Adicionar Livro
      </button>
    </div>
  );
};

export default BotaoAdicionarLivro;
