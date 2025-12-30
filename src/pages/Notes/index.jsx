// NotePage.js
import React from "react";
import { Container, Stack, Typography, Box, Divider, Link as MuiLink } from "@mui/material";
import { useNoteContext } from "APIs/NoteContext";
import { useFolderContext } from "APIs/FolderContext";

import RpgSection from "components/RpgSection";
import NoteCard from "components/NotesPage/NoteCard";
import FoldersCard from "components/NotesPage/folderCard";
import NoteAddGlobal from "components/NotesPage/NoteAddGlobal";
import { FolderAdd } from "components/NotesPage/folderAdd";

const NotePage = () => {
  const { notes, addNote } = useNoteContext();
  const { folders } = useFolderContext();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Stack spacing={2.5}>
        <RpgSection
          title="Anotações"
          subtitle="Organize PDFs/Docs por pastas e mantenha tudo acessível."
        >
          <Stack spacing={2}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems={{ md: "flex-end" }}>
              <NoteAddGlobal onNoteAdded={addNote} />
              <FolderAdd />
            </Stack>

            <Divider />

            <Stack spacing={1}>
              <Typography variant="h6">Pastas</Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                    md: "repeat(3, minmax(0, 1fr))",
                    lg: "repeat(4, minmax(0, 1fr))",
                  },
                  gap: 1.5,
                }}
              >
                {folders.map((folder) => (
                  <FoldersCard key={folder.id} folder={folder} />
                ))}
              </Box>
              {folders.length === 0 ? (
                <Typography sx={{ opacity: 0.75 }}>Nenhuma pasta criada ainda.</Typography>
              ) : null}
            </Stack>

            <Divider />

            <Stack spacing={1}>
              <Typography variant="h6">Arquivos</Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                    md: "repeat(3, minmax(0, 1fr))",
                    lg: "repeat(4, minmax(0, 1fr))",
                  },
                  gap: 1.5,
                }}
              >
                {notes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </Box>
              {notes.length === 0 ? (
                <Typography sx={{ opacity: 0.75 }}>Nenhuma anotação adicionada ainda.</Typography>
              ) : null}
            </Stack>
          </Stack>
        </RpgSection>

        <Typography variant="caption" sx={{ opacity: 0.75 }}>
          BackGround Art By:{" "}
          <MuiLink
            href="https://waneella.tumblr.com/post/729923261853564928/seashore-patreon-youtube"
            target="_blank"
            rel="noreferrer"
            underline="hover"
            sx={{ fontWeight: 800 }}
          >
            Waneella Pixel Art
          </MuiLink>
        </Typography>
      </Stack>
    </Container>
  );
};

export default NotePage;
