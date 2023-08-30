import React from "react";
import styles from "./NoteCard.module.css";
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
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/833px-PDF_file_icon.svg.png"
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
