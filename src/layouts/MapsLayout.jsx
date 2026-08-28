import React from "react";
import { Outlet } from "react-router-dom";
import { MapProvider } from "APIs/MapContext";
import { AssetProvider } from "APIs/AssetContext";

export default function MapsLayout() {
  return (
    <MapProvider>
      <AssetProvider>
        <Outlet />
      </AssetProvider>
    </MapProvider>
  );
}
