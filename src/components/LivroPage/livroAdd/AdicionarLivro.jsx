import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import styles from "./BotaoAdicionarLivro.module.css";
import { useBookContext } from "APIs/BookContext";
import { Button } from "@mui/material";
import { app, storage, auth } from "APIs/firebaseConfig";

const BotaoAdicionarLivro = () => {
  const { addBook } = useBookContext();
  const [books, setBooks] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleArquivoChange = (e) => {
    const arquivo = e.target.files[0];
    if (arquivo) {
      if (arquivo.type !== "application/pdf") {
        alert("Por favor, selecione apenas arquivos PDF.");
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
    if (!books) return;
    setIsLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Usuário não autenticado.");
        return;
      }
      const userID = user.uid;

      const storageRef = storage.ref();
      const arquivoRef = storageRef.child(`arquivos/livros/${userID}/${books.name}`);

      await arquivoRef.put(books);
      const urlDoArquivo = await arquivoRef.getDownloadURL();

      const novoLivro = {
        titulo: books.name.replace(/\.[^/.]+$/, ""),
        urlDoArquivo,
      };

      await addBook(novoLivro);

      setBooks(null);
    } catch (err) {
      console.error("Erro ao enviar livro:", err);
      alert("Erro ao adicionar livro.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.botaoAdicionarLivro}>
      <label className={`${books ? styles.InputSelected : styles.InputButton}`}>
        <span className={styles.customFileInputButton}>
          {books ? "Livro Selecionado" : "Selecionar Livro"}
        </span>
        <input type="file" accept=".pdf" onChange={handleArquivoChange} className={styles.fileInput} />
      </label>

      <Button
        onClick={handleAdicionarLivro}
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        disabled={!books || isLoading}
        style={{ backgroundColor: books && !isLoading ? "#007bff" : "#ccc" }}
      >
        {isLoading ? "Carregando..." : "Adicionar Livro"}
      </Button>
    </div>
  );
};

export default BotaoAdicionarLivro;
