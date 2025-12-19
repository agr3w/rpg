import { useFolderContext } from "APIs/FolderContext";
import styles from "./folderAdd.module.css";
import { Button, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { useState } from "react";

export const FolderAdd = () => {
  const { addFolder } = useFolderContext();
  const [folderName, setFolderName] = useState("");

  const handleAddFolder = async () => {
    if (folderName) {
      if (folderName.trim() !== "") {
        addFolder({ name: folderName, notes: [] });
        setFolderName("");
      }

      setFolderName("");
    }
  };
  
  return (
    <div className={styles.folderAddContainer}>
      <div className={styles.folderAdd}>
        <TextField
          type="text"
          placeholder="Nome da Pasta"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          variant="outlined"
        />
        <Button
          onClick={handleAddFolder}
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          disabled={folderName.trim() === ""}
        >
          Adicionar Pasta
        </Button>
      </div>
    </div>
  );
};
