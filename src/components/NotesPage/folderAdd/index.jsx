import { useFolderContext } from "APIs/FolderContext";
import { Button, Stack, TextField, InputAdornment } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
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
    <Stack spacing={1} sx={{ width: "100%" }}>
      <TextField
        label="Nova Gaveta"
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
        fullWidth
        variant="filled"
        size="small"
        placeholder="Ex: Magias, Mapas..."
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleAddFolder();
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <CreateNewFolderIcon sx={{ color: "#dcbfa6" }} />
            </InputAdornment>
          ),
          disableUnderline: true,
          sx: {
            color: "#fff",
            fontFamily: "Cinzel",
            bgcolor: "rgba(0,0,0,0.3)",
            borderRadius: 1,
            border: "1px solid rgba(255,255,255,0.1)",
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.5)",
            },
            "&.Mui-focused": {
              bgcolor: "rgba(0,0,0,0.5)",
              border: "1px solid #bf8f00",
            }
          }
        }}
        InputLabelProps={{
          sx: { color: "rgba(255,255,255,0.5)", fontFamily: "Cinzel" },
          shrink: true
        }}
      />
      <Button
        onClick={handleAddFolder}
        variant="contained"
        fullWidth
        startIcon={<AddCircleIcon />}
        disabled={folderName.trim() === ""}
        sx={{ 
          bgcolor: "#833c0b",
          color: "#fff",
          fontFamily: "Cinzel",
          fontWeight: "bold",
          "&:hover": { bgcolor: "#a04d14" },
          "&.Mui-disabled": { bgcolor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)" }
        }}
      >
        Construir
      </Button>
    </Stack>
  );
};
