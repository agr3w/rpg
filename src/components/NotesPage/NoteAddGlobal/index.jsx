// NoteAddGlobal.jsx

import React, { useRef, useState } from "react";
import { Stack, Button, Typography } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { useNoteContext } from "APIs/NoteContext";
import { storage, auth } from "APIs/firebaseConfig";

const NoteAddGlobal = ({ onNoteAdded }) => {
  const { addNote } = useNoteContext();
  const inputRef = useRef(null);

  const [noteFile, setNoteFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setNoteFile(e.target.files?.[0] || null);
  };

  const handleAddNote = async () => {
    if (!noteFile) return;

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não autenticado");
      const userID = user.uid;

      const storageRef = storage.ref();
      const noteFileRef = storageRef.child(`arquivos/anotacoes/${userID}/${noteFile.name}`);

      await noteFileRef.put(noteFile);
      const noteFileUrl = await noteFileRef.getDownloadURL();

      const newNote = {
        arquivoNomeCompleto: noteFile.name,
        title: noteFile.name.replace(/\.[^/.]+$/, ""),
        url: noteFileUrl,
      };

      await addNote(newNote);
      onNoteAdded?.(newNote);

      setNoteFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      console.error("Erro ao adicionar anotação global:", err);
      alert("Erro ao adicionar anotação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={1} sx={{ flex: 1, minWidth: { xs: "100%", md: 360 } }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap", gap: 1 }}>
        <Button variant="outlined" component="label" disabled={loading}>
          Selecionar arquivo
          <input
            ref={inputRef}
            type="file"
            hidden
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
          />
        </Button>

        <Button
          variant="contained"
          startIcon={<CloudUpload />}
          onClick={handleAddNote}
          disabled={!noteFile || loading}
        >
          {loading ? "Carregando..." : "Adicionar anotação"}
        </Button>
      </Stack>

      <Typography variant="caption" sx={{ opacity: 0.8 }}>
        {noteFile ? `Selecionado: ${noteFile.name}` : "Nenhum arquivo selecionado."}
      </Typography>
    </Stack>
  );
};

export default NoteAddGlobal;
