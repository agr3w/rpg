import React from "react";
import { FaMapSigns } from "react-icons/fa";
import HubTile from "components/HubTile";
import img from "./MapsIcon.png";

export default function MapsCard() {
  return (
    <HubTile
      title="Cartografia"
      subtitle="Mapas e mundos"
      to="/mapas"
      icon={<FaMapSigns size={22} />}
      imageSrc={img}
      imageAlt="Mapas"
    />
  );
}
