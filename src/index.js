import React from "react";
import ReactDOM from "react-dom/client";
import Rout from "./Route";
import "./styles/reset.css";
import { MusicProvider } from "APIs/MusicContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MusicProvider>
      <Rout />
    </MusicProvider>
  </React.StrictMode>
);
