// FolderPage.jsx

import React from "react";
import { useParams } from "react-router-dom";
import { useFolderContext } from "APIs/FolderContext";
import NoteCard from "components/NotesPage/NoteCard";
import NoteAdd from "components/NotesPage/NoteAdd";

const FolderPage = () => {
  const { folderId } = useParams();
  const { folders } = useFolderContext();
  const folder = folders.find((f) => f.id === folderId);

  if (!folder) {
    return <div>Folder not found.</div>;
  }

  return (
    <div>
      <h2>{folder.name}</h2>
      <div>
        {folder.notes && folder.notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
      <NoteAdd folderId={folderId} /> {/* Renderizar o componente NoteAdd somente quando folderId está definido */}
    </div>
  );
};

export default FolderPage;
