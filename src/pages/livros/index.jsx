import React from "react";
import styles from "./LivrosPage.module.css";
import styleFundo from "pages/FichaDetalhes/fichaDetalhe.module.css";
import { useBookContext } from "APIs/BookContext";
import BotaoAdicionarLivro from "components/LivroPage/livroAdd/AdicionarLivro";
import LivroCard from "components/LivroPage/livrosCard/BookCard";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

const LivrosPage = () => {
  const { books, addBook } = useBookContext(); // Use o contexto dos livros

  return (
    <>
      <div className={styles.livrosPage}>
        <BotaoAdicionarLivro onLivroAdded={addBook} />
        <div className={styles.livrosList}>
          {books.map((books) => (
            <LivroCard key={books.id} livro={books} />
          ))}
        </div>
        <Typography className={styleFundo.support} style={{ color: "white" }}>
          BackGround Art By:{" "}
          <Link
            to="https://waneella.tumblr.com/post/157664690747/details-here"
            className={styleFundo.supportLink}
            style={{ color: "white" }}
          >
            Waneella Pixel Art
          </Link>
        </Typography>
      </div>
    </>
  );
};

export default LivrosPage;
