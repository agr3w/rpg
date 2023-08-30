import React from "react";
import { useParams } from "react-router-dom";
import { useFolderContext } from "APIs/FolderContext";
import styles from "./FolderPage.module.css";
import NoteCardFolder from "components/NotesPage/NoteCard/CardFolder";
import NoteAdd from "components/NotesPage/NoteAdd";

const FolderPage = () => {
  const { folderId } = useParams();
  const { folders } = useFolderContext();
  const folder = folders.find((f) => f.id === folderId);

  if (!folder) {
    return <div>Folder not found.</div>;
  }

  const notesArray = Object.values(folder.notes || {});

  return (
    <div className={styles.div}>
      <h2>{folder.name}</h2>
      <NoteAdd folderId={folderId} />
      <div className={styles.NoteFolderList}>
        {notesArray.map((note) => (
          <NoteCardFolder key={note.id} note={note} folderId={folderId}/>
        ))}
      </div>
    </div>
  );
};
export default FolderPage;
