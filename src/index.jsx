import React from "react";
import ReactDOM from "react-dom/client";
import Rout from "./Route";
import "styles/reset.css";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import "./APIs/firebaseConfig";
import { MusicProvider } from "APIs/MusicContext";
import { BookProvider } from "APIs/BookContext";
import { NoteProvider } from "APIs/NoteContext";
import { FolderProvider } from "APIs/FolderContext";
import { AuthProvider } from "contexts/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

export const App = () => {
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <MusicProvider>
            <BookProvider>
              <FolderProvider>
                <NoteProvider>
                  <Rout />
                </NoteProvider>
              </FolderProvider>
            </BookProvider>
          </MusicProvider>
        </AuthProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
};

root.render(<App />);
