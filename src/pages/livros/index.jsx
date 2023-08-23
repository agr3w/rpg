import React from "react";
import styles from "./LivrosPage.module.css";
import { useBookContext } from "APIs/BookContext";
import BotaoAdicionarLivro from "components/LivroPage/livroAdd/AdicionarLivro";
import LivroCard from "components/LivroPage/livrosCard/BookCard";


const LivrosPage = () => {
  const { books, addBook } = useBookContext(); // Use o contexto dos livros

  return (
    <div className={styles.livrosPage}>
      <BotaoAdicionarLivro onLivroAdded={addBook} />
      <div className={styles.livrosList}>
        {books.map((books) => (
          <LivroCard key={books.id} livro={books} />
        ))}
      </div>
    </div>
  );
};

export default LivrosPage;
