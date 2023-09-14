// NotePage.js
import React from "react";
import styles from "./NotePage.module.css"; // Certifique-se de ter os estilos corretos
import { useNoteContext } from "APIs/NoteContext"; // Importe o contexto das anotações
import NoteCard from "components/NotesPage/NoteCard";
import { FolderAdd } from "components/NotesPage/folderAdd";
import { useFolderContext } from "APIs/FolderContext";
import FoldersCard from "components/NotesPage/folderCard";
import NoteAddGlobal from "components/NotesPage/NoteAddGlobal";
import Nav from "components/nav";

const NotePage = () => {
  const { notes, addNote } = useNoteContext(); // Use o contexto das anotações
  const { folders } = useFolderContext();

  return (
    <>
      <Nav />
      <div className={styles.notePage}>
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
      </div>
    </>
  );
};

export default NotePage;
