import React from "react";
import styles from "./NoteCard.module.css";
import iconeNote from "./IconeNote.png"
import {
  deleteNote,
  deleteArrayNote,
} from "../NoteDelete";
import { Link } from "react-router-dom";
import DeleteButton from "../buttonsOfDelete/noteCommom";

const NoteCard = ({ note }) => {
  const handleDeleteNote = () => {
    deleteNote(note);
    deleteArrayNote(note.id);
  };

  return (
    <div className={styles.noteCard}>
      <p>{note.title}</p>
      <div className={styles.link_img}>
        <Link to={note.url}>
          <img
            src={iconeNote}
            alt=""
            width={100}
          />
        </Link>
      </div>
      <DeleteButton
        onDeleteOutsideFolder={handleDeleteNote}
        showInsideFolderButton={false}
      />
      {/* <button onClick={handleDeleteNote} className={styles.deleteButton}>
        <FaTrash size={16} /> Deletar Anotação
      </button> */}
    </div>
  );
};

export default NoteCard;
