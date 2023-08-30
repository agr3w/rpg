import React from 'react';
import { FaTrash } from 'react-icons/fa';
import styles from './DeleteButton.module.css'; // Importe os estilos apropriados

const DeleteButton = ({ onDeleteInsideFolder, onDeleteOutsideFolder, showInsideFolderButton }) => {
  const handleDeleteInsideFolder = async () => {
    if (onDeleteInsideFolder) {
      try {
        await onDeleteInsideFolder();
        window.location.reload();
      } catch (error) {
        console.error('Error deleting notes inside folder:', error);
      }
    }
  };

  const handleDeleteOutsideFolder = async () => {
    if (onDeleteOutsideFolder) {
      try {
        await onDeleteOutsideFolder();
        window.location.reload();
      } catch (error) {
        console.error('Error deleting notes outside folder:', error);
      }
    }
  };

  return (
    <div className={styles.deleteButtonContainer}>
      {showInsideFolderButton && (
        <button onClick={handleDeleteInsideFolder} className={styles.deleteButton}>
          <FaTrash size={16} /> Deletar Anotação (Dentro da Pasta)
        </button>
      )}
      {!showInsideFolderButton && (
        <button onClick={handleDeleteOutsideFolder} className={styles.deleteButton}>
          <FaTrash size={16} /> Deletar Anotação (Fora da Pasta)
        </button>
      )}
    </div>
  );
};

export default DeleteButton;
