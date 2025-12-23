import React from "react";
import { TfiMarkerAlt } from "react-icons/tfi";
import HubTile from "components/HubTile";
import img from "./fichanova.png";

export default function FichaCard() {
  return (
    <HubTile
      title="Fichas"
      subtitle="Personagens e campanhas"
      to="/fichas"
      icon={<TfiMarkerAlt size={22} />}
      imageSrc={img}
      imageAlt="Fichas"
    />
  );
}
