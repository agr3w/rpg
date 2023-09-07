export function encontrarItensPorNome(nomeItem, array) {
  const itensEncontrados = array.reduce((itens, item) => {
    const habilidades = item.habilidades || [];
    const dadosDeVida = item.dadosDeVida || [];
    const descricao = item.descricao || [];
    const proficienciaPericia = item.proficienciaPericia || [];
    const idiomas = item.idiomas || [];
    const equipamento = item.equipamento || [];
    const todosItens = habilidades.concat(
      dadosDeVida,
      descricao,
      proficienciaPericia,
      idiomas,
      equipamento
    );

    if (item.nome === nomeItem) {
      itens.push(...todosItens);
    }

    return itens;
  }, []);

  return itensEncontrados;
}

// fichaUtils.js

// verificação de antecedente
// const getArtesaoCaracteristicasFields = (antecedente) => {
//   if (antecedente === "Artesão de Guilda") {
//     return {
//       CaracterísticasDaGuilda: caracteristicasGuildaSelecionado,
//       NegocioDaGuilda: negocioGuildaSelecionado,
//     };
//   }
//   return {};
// };

// const getAcolitoCaracteristicasFields = (antecedente) => {
//   if (antecedente === "Acólito") {
//     return {
//       caracteristicaAbrigoDosFiéis:
//         antecedenteSelecionado.CaracteristicaDoAntecedente
//           .caracteristicaAbrigoDosFiéis,
//     };
//   }
//   return {};
// };

// const getArtistaCaracteristicasFields = (antecedente) => {
//   if (antecedente === "Artista") {
//     return {
//       rotinasArtisticas: rotinasArtisticasSelcioando,
//       caracteristicaDemandaPopular:
//         antecedenteSelecionado.CaracteristicaDoAntecedente
//           .caracteristicaDemandaPopular,
//     };
//   }
//   return {};
// };

// Raças

export const getHumanoCaracteristicasFields = (
  racaSelecionada,
  idiomaRacaSelecionado,
  idiomaRacaSelecionado2
) => {
  if (racaSelecionada === "Humano") {
    return {
      IdiomasDaRaca: {
        idiomaRacaSelecionado,
        idiomaRacaSelecionado2,
      },
      test: racaSelecionada
    };
  }
  return {};
};

// Classes

export const getArtesaoCaracteristicasFields = (
  antecedente,
  caracteristicasGuildaSelecionado,
  negocioGuildaSelecionado,
  idiomaDoAntecedente
) => {
  if (antecedente === "Artesão de Guilda") {
    return {
      CaracterísticasDaGuilda: caracteristicasGuildaSelecionado,
      NegocioDaGuilda: negocioGuildaSelecionado,
      idioma: idiomaDoAntecedente,
    };
  }
  return {};
};

export const getAcolitoCaracteristicasFields = (
  antecedente,
  antecedenteSelecionado,
  idiomaDoAntecedente,
  idiomaDoAntecendente2
) => {
  if (antecedente === "Acólito") {
    return {
      caracteristicaAbrigoDosFiéis:
        antecedenteSelecionado.CaracteristicaDoAntecedente
          .caracteristicaAbrigoDosFiéis,

      Idiomas: { idiomaDoAntecedente, idiomaDoAntecendente2 },
    };
  }
  return {};
};

export const getArtistaCaracteristicasFields = (
  antecedente,
  rotinasArtisticas,
  antecedenteSelecionado
) => {
  if (antecedente === "Artista") {
    return {
      rotinasArtisticas,
      caracteristicaDemandaPopular:
        antecedenteSelecionado.CaracteristicaDoAntecedente
          .caracteristicaDemandaPopular,
    };
  }
  return {};
};
