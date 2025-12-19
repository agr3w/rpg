import React from "react";
import ReactDOM from "react-dom/client";
import Rout from "./Route";
import "styles/reset.css";
import "./firebaseConfig";
import { MusicProvider } from "APIs/MusicContext";
import { BookProvider } from "APIs/BookContext";
import { NoteProvider } from "APIs/NoteContext";
import { FolderProvider } from "APIs/FolderContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

export const App = () => {
  return (
    <React.StrictMode>
      <MusicProvider>
        <BookProvider>
          <FolderProvider>
            <NoteProvider>
              <Rout />
            </NoteProvider>
          </FolderProvider>
        </BookProvider>
      </MusicProvider>
    </React.StrictMode>
  );
};

root.render(<App />);
