export function encontrarItensPorNome(a, b) {
  const arr = Array.isArray(a) ? a : b;
  const nome = Array.isArray(a) ? b : a;

  if (!Array.isArray(arr) || !nome) return [];

  const found = arr.find((x) => x?.nome === nome || x?.name === nome) || null;
  if (!found) return [];

  const candidate =
    found.descricaoTendencia ??        // ✅ tendências (possíveis chaves)
    found.descricaoDaTendencia ??
    found.descricao ??
    found.Descricao ??
    found.habilidades ??               // ✅ raças
    found.habilidadesSubRaca ??        // ✅ sub-raças
    found.itens ??
    found.Itens ??
    found.traits ??
    found.Traits ??
    found.descricoes ??
    found.descricaoRaca ??
    found.tracos ??
    null;

  if (Array.isArray(candidate)) return candidate.filter(Boolean).map(String);
  if (typeof candidate === "string") return [candidate];

  if (candidate && typeof candidate === "object") {
    return Object.values(candidate)
      .flat()
      .filter((v) => typeof v === "string" && v.trim().length > 0);
  }

  return [];
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
      test: racaSelecionada,
    };
  }
  return {};
};

// subRacas

export const getSubRacasField = (SubRaca, IdiomaAltoElfo, detalhesSubRaca) => {
  if (
    SubRaca === "Anão da Colina" ||
    SubRaca === "Anão da Montanha" ||
    SubRaca === "Elfo Da Floresta" ||
    SubRaca === "Elfo Negro (DROW)" ||
    SubRaca === "Alto Elfo" ||
    SubRaca === "Pés-Leves" ||
    SubRaca === "Robustos" ||
    SubRaca === "Azul" ||
    SubRaca === "Branco" ||
    SubRaca === "Bronze" ||
    SubRaca === "Cobre" ||
    SubRaca === "Latão" ||
    SubRaca === "Negro" ||
    SubRaca === "Ouro" ||
    SubRaca === "Prata" ||
    SubRaca === "Verde" ||
    SubRaca === "Vermelho" ||
    SubRaca === "Gnomo da Floresta" ||
    SubRaca === "Gnomo das Rochas" ||
    SubRaca === "Sem SubRaca"
  ) {
    return {
      SubRaca: SubRaca,
      idiomasSubRaca: IdiomaAltoElfo,
      atributosSubRaca: detalhesSubRaca.habilidadeBonusSubRaca,
    };
  }
  return {};
};

export const getSubRacasGnomoField = (SubRaca, Engenhocas) => {
  if (SubRaca === "Gnomo das Rochas") {
    return {
      Engenhoca: Engenhocas,
    };
  }
  return {};
};

// Classes

export const getArtesaoCaracteristicasFields = (
  antecedente,
  CarcDosAntecedentes1,
  CarcDosAntecedentes2
) => {
  if (antecedente === "Artesão de Guilda") {
    return {
      CarcDosAntecedentes1: CarcDosAntecedentes1,
      CarcDosAntecedentes2: CarcDosAntecedentes2,
    };
  }
  return {};
};

export const getAcolitoCaracteristicasFields = (
  antecedente,
  antecedenteSelecionado
) => {
  if (
    antecedente === "Acólito" ||
    antecedente === "Marinheiro" ||
    antecedente === "Nobre" ||
    antecedente === "Órfão"
  ) {
    return {
      CaracteristicasGerais:
        antecedenteSelecionado.CaracteristicaDoAntecedente.CaracteristicaTexto1,
    };
  }
  return {};
};

export const getArtistaCaracteristicasFields = (
  antecedente,
  CarcDosAntecedentes3,
  antecedenteSelecionado
) => {
  if (
    antecedente === "Charlatão" ||
    antecedente === "Artista" ||
    antecedente === "Charlatão" ||
    antecedente === "Criminoso" ||
    antecedente === "Eremita" ||
    antecedente === "Forasteiro" ||
    antecedente === "Sábio" ||
    antecedente === "Soldado"
  ) {
    return {
      CarcDosAntecedentes3,
      CaracteristicasGerais:
        antecedenteSelecionado.CaracteristicaDoAntecedente.CaracteristicaTexto1,
    };
  }
  return {};
};

export const getIdiomasAntecendete = (antecedente, idiomaDoAntecedente) => {
  if (
    antecedente === "Artesão de Guilda " ||
    antecedente === "Eremita" ||
    antecedente === "Forasteiro" ||
    antecedente === "Nobre"
  ) {
    return {
      Idiomas: idiomaDoAntecedente,
    };
  }
  return {};
};

export const getIdiomasAntecendete1 = (
  antecedente,
  idiomaDoAntecendente2,
  idiomaDoAntecedente
) => {
  if (antecedente === "Acólito" || antecedente === "Sábio") {
    return {
      Idiomas: { idiomaDoAntecedente, idiomaDoAntecendente2 },
    };
  }
  return {};
};
