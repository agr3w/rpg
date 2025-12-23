import React from "react";
import { FiMusic } from "react-icons/fi";
import HubTile from "components/HubTile";
import img from "./notanova.png";

export default function MusicasCard() {
  return (
    <HubTile
      title="Bardo"
      subtitle="Trilhas e ambientação"
      to="/musicas"
      icon={<FiMusic size={22} />}
      imageSrc={img}
      imageAlt="Músicas"
    />
  );
}
