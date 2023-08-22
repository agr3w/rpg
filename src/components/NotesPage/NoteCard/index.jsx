import React from 'react';
import { FaTrash } from 'react-icons/fa';
import styles from './NoteCard.module.css'; // Certifique-se de ter o arquivo de estilos correspondente
import { deleteNote, deleteArrayNote } from '../NoteDelete'; // Certifique-se de importar as funções corretas para deletar a anotação

const NoteCard = ({ note }) => {

  const handleDeleteNote = () => {
    deleteArrayNote(note.id);
    deleteNote(note); // Chama a função para deletar a anotação
    window.location.reload(); // Recarrega a página
  };

  return (
    <div className={styles.noteCard}>
      <p>Título: {note.title}</p>
      <button onClick={handleDeleteNote}>
        <FaTrash size={16} /> Deletar Anotação
      </button>
    </div>
  );
};

export default NoteCard;
