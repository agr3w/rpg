import React from "react";
import { TfiMarkerAlt } from "react-icons/tfi";
import HubTile from "components/HubTile";
import img from "./Caderno.png";

export default function AnotacoesCard() {
  return (
    <HubTile
      title="Anotações"
      subtitle="Rascunhos e registros"
      to="/anotacoes"
      icon={<TfiMarkerAlt size={22} />}
      imageSrc={img}
      imageAlt="Anotações"
    />
  );
}
