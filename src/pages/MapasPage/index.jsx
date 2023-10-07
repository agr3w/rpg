// MapasPage.js
import mapas from "Array/MapasArray";
import MapaCard from "components/MapasPage/CardsMapas";
import React from "react";

const MapasPage = () => {
  return (
    <div>
      {mapas.map((mapa) => (
        <MapaCard
          key={mapa}
          imagem={mapa.imagem}
          link={mapa.link}
          titulo={mapa.titulo}
          icone={mapa.icone}
        />
      ))}
    </div>
  );
};

export default MapasPage;
