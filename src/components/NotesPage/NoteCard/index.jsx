import React from "react";
import { FaTrash } from "react-icons/fa";
import styles from "./NoteCard.module.css";
import {
  deleteNote,
  deleteArrayNote,
  deleteArrayNoteFromFolder,
} from "../NoteDelete";
import { Link } from "react-router-dom";

const NoteCard = ({ note, folderId }) => {
  const handleDeleteNote = () => {
    deleteArrayNote(note.id);
    deleteNote(note);
    deleteArrayNoteFromFolder(folderId, note.id);
    window.location.reload();
  };

  // Determinar qual ícone usar com base na extensão do arquivo
  // const fileExtension = note.title.split('.').pop(); // Obtém a extensão do título
  // let fileIcon;

  // switch (fileExtension) {
  //   case 'pdf':
  //     fileIcon = <FaFilePdf size={24} />;
  //     break;
  //   case 'doc':
  //   case 'docx':
  //     fileIcon = <FaFileWord size={24} />;
  //     break;
  //   default:
  //     fileIcon = <FaFile size={24} />;
  // }

  return (
    <div className={styles.noteCard}>
      <p>{note.title}</p>
      <Link to={note.url}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/833px-PDF_file_icon.svg.png"
          alt=""
          width={100}
        />
      </Link>
      <button onClick={handleDeleteNote}>
        <FaTrash size={16} /> Deletar Anotação
      </button>
    </div>
  );
};

export default NoteCard;
