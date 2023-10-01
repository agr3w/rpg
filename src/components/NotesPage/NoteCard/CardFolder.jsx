import React from "react";
import styles from "./NoteCard.module.css";
import imgNote from "../NoteCard/IconeNote.png"
import {
  deleteArrayNoteFromFolder,
  deleteNoteFolder,
} from "../NoteDelete";
import { Link } from "react-router-dom";
import DeleteButton from "../buttonsOfDelete/noteCommom";

const NoteCardFolder = ({ note, folderId }) => {
  const handleDeleteNote = () => {
    deleteNoteFolder(note);
    deleteArrayNoteFromFolder(folderId, note.id);
  };

  return (
    <div className={styles.noteCard}>
      <p>{note.title}</p>
      <div className={styles.link_img}>
        <Link to={note.url}>
          <img
            src={imgNote}
            alt=""
            width={100}
          />
        </Link>
      </div>
      <DeleteButton
        onDeleteInsideFolder={handleDeleteNote}
        showInsideFolderButton={true}
      />
    </div>
  );
};

export default NoteCardFolder;
