import React from "react";
import { Link, useParams } from "react-router-dom";
import { useFolderContext } from "APIs/FolderContext";
import styles from "./FolderPage.module.css";
import styleFundo from "pages/FichaDetalhes/fichaDetalhe.module.css";
import NoteCardFolder from "components/NotesPage/NoteCard/CardFolder";
import NoteAdd from "components/NotesPage/NoteAdd";
import { Typography } from "@mui/material";

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
      <h2>Pasta: {folder.name}</h2>
      <NoteAdd folderId={folderId} />
      <div className={styles.NoteFolderList}>
        {notesArray.map((note) => (
          <NoteCardFolder key={note.id} note={note} folderId={folderId} />
        ))}
      </div>
      <Typography className={styleFundo.support}>
        BackGround Art By:{" "}
        <Link
          to="https://waneella.tumblr.com/post/729923261853564928/seashore-patreon-youtube"
          className={styleFundo.supportLink}
        >
          Waneella Pixel Art
        </Link>
      </Typography>
    </div>
  );
};
export default FolderPage;
