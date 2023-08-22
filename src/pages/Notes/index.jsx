// NotePage.js
import React from "react";
import styles from "./NotePage.module.css"; // Certifique-se de ter os estilos corretos
import { useNoteContext } from "APIs/NoteContext"; // Importe o contexto das anotações
import BotaoAdicionarNote from "components/NotesPage/NoteAdd";
import NoteCard from "components/NotesPage/NoteCard";

const NotePage = () => {
  const { notes, addNote } = useNoteContext(); // Use o contexto das anotações

  return (
    <div className={styles.notePage}>
      <BotaoAdicionarNote onNoteAdded={addNote} />
      <div className={styles.noteList}>
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
};

export default NotePage;
