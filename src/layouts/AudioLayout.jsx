import React from "react";
import { Outlet } from "react-router-dom";
import { MusicProvider } from "APIs/MusicContext";

export default function AudioLayout() {
  return (
    <MusicProvider>
      <Outlet />
    </MusicProvider>
  );
}
