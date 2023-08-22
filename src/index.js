import React from "react";
import ReactDOM from "react-dom/client";
import Rout from "./Route";
import "./styles/reset.css";
import { MusicProvider } from "APIs/MusicContext";
import { BookProvider } from "APIs/BookContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MusicProvider>
      <BookProvider>
        <Rout />
      </BookProvider>
    </MusicProvider>
  </React.StrictMode>
);
