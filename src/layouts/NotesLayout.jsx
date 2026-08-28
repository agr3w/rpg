import React from "react";
import { Outlet } from "react-router-dom";
import { FolderProvider } from "APIs/FolderContext";
import { NoteProvider } from "APIs/NoteContext";

export default function NotesLayout() {
  return (
    <FolderProvider>
      <NoteProvider>
        <Outlet />
      </NoteProvider>
    </FolderProvider>
  );
}
