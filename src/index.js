import React from "react";
import ReactDOM from "react-dom/client";
import Rout from "./Route";
import "./styles/reset.css";
import { MusicProvider } from "APIs/MusicContext";
import { BookProvider } from "APIs/BookContext";
import { NoteProvider } from "APIs/NoteContext";
import { FolderProvider } from "APIs/FolderContext";
// import { FichaProvider } from "APIs/FichaContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MusicProvider>
      <BookProvider>
        <FolderProvider>
          <NoteProvider>
            {/* <FichaProvider> */}
            <Rout />
            {/* </FichaProvider> */}
          </NoteProvider>
        </FolderProvider>
      </BookProvider>
    </MusicProvider>
  </React.StrictMode>
);
