import React from 'react';
import { FaTrash, FaFilePdf, FaFileWord, FaFile } from 'react-icons/fa';
import styles from './NoteCard.module.css';
import { deleteNote, deleteArrayNote } from '../NoteDelete';
import { Link } from 'react-router-dom';

const NoteCard = ({ note }) => {

  const handleDeleteNote = () => {
    deleteArrayNote(note.id);
    deleteNote(note);
    window.location.reload();
  };

  // Determinar qual ícone usar com base na extensão do arquivo
  const fileExtension = note.title.split('.').pop(); // Obtém a extensão do título
  let fileIcon;

  switch (fileExtension) {
    case 'pdf':
      fileIcon = <FaFilePdf size={24} />;
      break;
    case 'doc':
    case 'docx':
      fileIcon = <FaFileWord size={24} />;
      break;
    default:
      fileIcon = <FaFile size={24} />;
  }

  return (
    <div className={styles.noteCard}>
      <p>{fileIcon} {note.title}</p>
      <Link to={note.url}>
        Ver arquivo
      </Link>
      <button onClick={handleDeleteNote}>
        <FaTrash size={16} /> Deletar Anotação
      </button>
    </div>
  );
};

export default NoteCard;
