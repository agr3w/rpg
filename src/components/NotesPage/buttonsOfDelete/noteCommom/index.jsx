import React from "react";
import { FaTrash } from "react-icons/fa";
import styles from "./DeleteButton.module.css"; // Importe os estilos apropriados
import { Button } from "@mui/material";

const DeleteButton = ({
  onDeleteInsideFolder,
  onDeleteOutsideFolder,
  showInsideFolderButton,
}) => {
  const handleDeleteInsideFolder = async () => {
    if (onDeleteInsideFolder) {
      try {
        await onDeleteInsideFolder();
        window.location.reload();
      } catch (error) {
        console.error("Error deleting notes inside folder:", error);
      }
    }
  };

  const handleDeleteOutsideFolder = async () => {
    if (onDeleteOutsideFolder) {
      try {
        await onDeleteOutsideFolder();
        window.location.reload();
      } catch (error) {
        console.error("Error deleting notes outside folder:", error);
      }
    }
  };

  return (
    <div className={styles.deleteButtonContainer}>
      {showInsideFolderButton && (
        <Button
          onClick={handleDeleteInsideFolder}
          className={styles.deleteButton}
          variant="contained"
        >
          <FaTrash size={16} /> Deletar Anotação
        </Button>
      )}
      {!showInsideFolderButton && (
        <Button
          onClick={handleDeleteOutsideFolder}
          className={styles.deleteButton}
          variant="contained"
        >
          <FaTrash size={16} /> Deletar Anotação
        </Button>
      )}
    </div>
  );
};

export default DeleteButton;
