import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import styles from "./BotaoAdicionarLivro.module.css"; // Certifique-se de ter o arquivo de estilos correspondente
import { app } from "APIs/firebaseConfig"; // Importe a configuração do Firebase
import { useBookContext } from "APIs/BookContext";
import { Button } from "@mui/material";
import { getAuth } from "firebase/auth";

const BotaoAdicionarLivro = () => {
  const { addBook } = useBookContext();
  const [books, setBooks] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleArquivoChange = (e) => {
    const arquivo = e.target.files[0];
    if (arquivo) {
      // Verificar se o arquivo é PDF
      if (arquivo.type !== "application/pdf") {
        // Mostrar alerta se não for um arquivo PDF
        alert("Por favor, selecione apenas arquivos PDF.");
        // Limpar o campo de arquivo
        e.target.value = null;
        setBooks(null);
      } else {
        setBooks(arquivo);
      }
    } else {
      setBooks(null);
    }
  };

  const handleAdicionarLivro = async () => {
    if (books) {
      setIsLoading(true);

      // Primeiro, faça o upload do arquivo PDF para o Firebase Storage
      const auth = getAuth();
      const user = auth.currentUser;
      const userID = user.uid;
      const storage = app.storage();
      const storageRef = storage.ref();
      const arquivoRef = storageRef.child(
        `arquivos/livros/${userID}/${books.name}`
      ); // Defina o caminho desejado no Storage

      await arquivoRef.put(books);

      // Obtenha a URL do arquivo PDF recém-carregado
      const urlDoArquivo = await arquivoRef.getDownloadURL();

      // Crie um ID único para o livro usando o método push()
      const novoLivro = {
        id: app.database().ref().child(`livros/${userID}`).push().key, // Gere um ID único
        titulo: books.name.replace(/\.[^/.]+$/, ""), // Nome do arquivo sem extensão
        urlDoArquivo,
      };
      setIsLoading(false);

      // Adicione as informações do livro ao contexto de livros
      addBook(novoLivro);

      // Limpe o campo de arquivo
      setBooks(null);
    }
  };

  return (
    <div className={styles.botaoAdicionarLivro}>
      <label className={`${books ? styles.InputSelected : styles.InputButton}`}>
        <span className={styles.customFileInputButton}>
          {books ? "Livro Selecionado" : "Selecionar Livro"}
        </span>
        <input
          type="file"
          accept=".pdf"
          onChange={handleArquivoChange}
          className={styles.fileInput}
        />
      </label>

      <Button
        onClick={handleAdicionarLivro}
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        disabled={!books || isLoading}
        style={{
          backgroundColor: books && !isLoading ? "#007bff" : "#ccc",
        }}
      >
        {isLoading ? "Carregando..." : "Adicionar Livro"}
      </Button>
    </div>
  );
};

export default BotaoAdicionarLivro;
