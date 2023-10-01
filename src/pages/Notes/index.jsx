// NotePage.js
import React from "react";
import styles from "./NotePage.module.css"; // Certifique-se de ter os estilos corretos
import styleFundo from "pages/FichaDetalhes/fichaDetalhe.module.css";
import { useNoteContext } from "APIs/NoteContext"; // Importe o contexto das anotações
import NoteCard from "components/NotesPage/NoteCard";
import { FolderAdd } from "components/NotesPage/folderAdd";
import { useFolderContext } from "APIs/FolderContext";
import FoldersCard from "components/NotesPage/folderCard";
import NoteAddGlobal from "components/NotesPage/NoteAddGlobal";
import Nav from "components/nav";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

const NotePage = () => {
  const { notes, addNote } = useNoteContext(); // Use o contexto das anotações
  const { folders } = useFolderContext();

  return (
    <>
      <div className={styles.notePage}>
        <Nav />
        <NoteAddGlobal onNoteAdded={addNote} />
        <FolderAdd />
        <div className={styles.folderCard}>
          {folders.map((folders) => (
            <FoldersCard key={folders.id} folder={folders} />
          ))}
        </div>

        <div className={styles.noteList}>
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
        <Typography className={styleFundo.support}>
          BackGround Art By:{" "}
          <Link
            to="https://waneella.tumblr.com/post/729923261853564928/seashore-patreon-youtube"
            className={styleFundo.supportLink}
          >
            Waneella Pixel Art
          </Link>
        </Typography>
      </div>
    </>
  );
};

export default NotePage;
