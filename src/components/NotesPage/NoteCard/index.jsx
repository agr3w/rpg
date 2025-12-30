import React from "react";
import { Card, CardActionArea, CardContent, Typography, Stack } from "@mui/material";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import DeleteButton from "../buttonsOfDelete/noteCommom";
import { deleteNote, deleteArrayNote } from "../NoteDelete";

const NoteCard = ({ note }) => {
  const handleDeleteNote = () => {
    deleteNote(note);
    deleteArrayNote(note.id);
  };

  return (
    <Card>
      <CardActionArea component="a" href={note.url} target="_blank" rel="noreferrer">
        <CardContent>
          <Stack direction="row" spacing={1} alignItems="center">
            <DescriptionRoundedIcon />
            <Typography sx={{ fontWeight: 900 }} noWrap>
              {note.title || "Anotação"}
            </Typography>
          </Stack>

          <Typography variant="caption" sx={{ opacity: 0.75 }}>
            Abrir arquivo
          </Typography>
        </CardContent>
      </CardActionArea>

      <CardContent sx={{ pt: 0 }}>
        <DeleteButton onDeleteOutsideFolder={handleDeleteNote} showInsideFolderButton={false} />
      </CardContent>
    </Card>
  );
};

export default NoteCard;
