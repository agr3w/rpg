import React from "react";
import { FaTrash } from "react-icons/fa";
import { app } from "APIs/firebaseConfig";
import styles from "./FolderNoteCard.module.css";

const FolderNoteCard = ({ note, onDeleteNote }) => {
  const handleDeleteNote = async () => {
    await onDeleteNote(note.id);
  };

  return (
    <div className={styles.noteCard}>
      <p>{note.title}</p>
      <a href={note.url} target="_blank" rel="noopener noreferrer">
        Ver arquivo
      </a>
      <button onClick={handleDeleteNote}>
        <FaTrash size={16} /> Deletar Anotação
      </button>
    </div>
  );
};

export default FolderNoteCard;
