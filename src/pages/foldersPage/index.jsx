import React from "react";
import styles from "./FolderPage.module.css"; // Importe os estilos apropriados
import { useParams } from "react-router-dom";
import { useFolderContext } from "APIs/FolderContext";
import NoteCard from "components/NotesPage/NoteCard"; // Importe o componente de cartão de nota
import NoteAdd from "components/NotesPage/NoteAdd";

const FolderPage = () => {
  const { folderId } = useParams();
  const { folders, deleteNoteFromFolder  } = useFolderContext();
  const folder = folders.find((f) => f.id === folderId);

  const handleDeleteNote = async (noteId) => {
    deleteNoteFromFolder(folderId, noteId);
    window.location.reload();

  };

  if (!folder.notes || folder.notes.length === 0) {
    return <NoteAdd folderId={folder.id} />;
  }

  return (
    <div className={styles.folderPage}>
      <h2>{folder.name}</h2>
      <div className={styles.notesList}>
        <NoteAdd folderId={folder.id} />
        {folder.notes.map((note) => (
          <NoteCard key={note.id} note={note} onDelete={() => handleDeleteNote(note.id)}/>
        ))}
      </div>
    </div>
  );
};

export default FolderPage;
