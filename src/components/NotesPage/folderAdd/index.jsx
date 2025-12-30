import { useFolderContext } from "APIs/FolderContext";
import { Button, Stack, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

export const FolderAdd = () => {
  const { addFolder } = useFolderContext();
  const [folderName, setFolderName] = useState("");

  const handleAddFolder = async () => {
    const name = String(folderName || "").trim();
    if (!name) return;

    await addFolder({ name, notes: [] });
    setFolderName("");
  };

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ minWidth: { xs: "100%", md: 360 } }}>
      <TextField
        label="Nova pasta"
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
        fullWidth
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleAddFolder();
          }
        }}
      />
      <Button
        onClick={handleAddFolder}
        variant="contained"
        startIcon={<AddIcon />}
        disabled={folderName.trim() === ""}
        sx={{ whiteSpace: "nowrap" }}
      >
        Adicionar pasta
      </Button>
    </Stack>
  );
};
