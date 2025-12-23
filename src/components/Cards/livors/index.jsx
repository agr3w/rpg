import React from "react";
import { FaBook } from "react-icons/fa";
import HubTile from "components/HubTile";
import img from "./livroDragao.png";

export default function LivrosCard() {
  return (
    <HubTile
      title="Biblioteca"
      subtitle="Livros e referências"
      to="/livros"
      icon={<FaBook size={22} />}
      imageSrc={img}
      imageAlt="Livros"
    />
  );
}
