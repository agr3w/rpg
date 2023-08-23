import React from "react";
import { FaTrash } from "react-icons/fa";
import styles from "./FoldersCard.module.css";
import { FolderAdd } from "../folderAdd";
import { deleteArrayFolder } from "../folderDelete";
// import { deleteFolder, deleteArrayFolder } from '../FolderDelete';

const FoldersCard = ({ folder }) => {
    const handleDeleteFolder = () => {
      deleteArrayFolder(folder.id);
      window.location.reload();
    };

  return (
    <div className={styles.foldersCard}>
      <p>Nome da Pasta: {folder.name}</p>
      {/* Aqui você pode adicionar mais informações sobre a pasta, se necessário */}
      <button onClick={handleDeleteFolder}>
        <FaTrash size={16} /> Deletar Pasta
      </button>
    </div>
  );
};

export default FoldersCard;
