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
    <div className={styles.folderContainer}>
      <div className={styles.foldersCard}>
        <p>Nome da Pasta: <span>{folder.name}</span></p>
        <div className={styles.linkFolder}>
          <Link to={`/folders/${folder.id}`} className={styles.link}>
            <img
              src="https://www.iconpacks.net/icons/2/free-folder-icon-1437-thumb.png"
              alt=""
            />
          </Link>
        </div>
        <button onClick={handleDeleteFolder} className={styles.deleteButton}>
          <FaTrash size={16} /> Deletar Pasta
        </button>
      </div>
    </div>
  );
};

export default FoldersCard;
