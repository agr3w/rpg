import React from "react";
import { FaTrash } from "react-icons/fa";
import styles from "./FoldersCard.module.css";
import { deleteArrayFolder } from "../folderDelete";
import { Link } from "react-router-dom";
// import { deleteFolder, deleteArrayFolder } from '../FolderDelete';

const FoldersCard = ({ folder }) => {
    const handleDeleteFolder = () => {
      deleteArrayFolder(folder.id);
      window.location.reload();
    };

  return (
    <div className={styles.foldersCard}>
      <p>Nome da Pasta: {folder.name}</p>
      <Link to={`/folders/${folder.id}`}>
        {folder.name}
      </Link>
      <button onClick={handleDeleteFolder}>
        <FaTrash size={16} /> Deletar Pasta
      </button>
    </div>
  );
};

export default FoldersCard;
