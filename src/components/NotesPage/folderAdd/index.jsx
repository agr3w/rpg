import { useFolderContext } from "APIs/FolderContext";
import styles from "components/NotesPage/NoteCard/NoteCard.module.css";

// const { app } = require("APIs/firebaseConfig");
const { useState } = require("react");
const { FaPlus } = require("react-icons/fa");

export const FolderAdd = () => {
  const { addFolder } = useFolderContext();
  const [folderName, setFolderName] = useState("");

  const handleAddFolder = async () => {
    if (folderName) {
      const newFolder = {
        name: folderName,
        notes: [],
      };

      addFolder(newFolder);

      setFolderName("");
    }
  };

  return (
    <div className={styles.folderAdd}>
      <input
        type="text"
        placeholder="Nome da Pasta"
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
      />
      <button onClick={handleAddFolder}>
        <FaPlus /> Adicionar Pasta
      </button>
    </div>
  );
};
