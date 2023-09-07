// FichaDatabase.js

import { getDatabase, ref, push } from "firebase/database";

// Função para enviar informações para o Realtime Database
export const enviarFichaParaDatabase = (
  nome,
  raca,
  classe,
  tendencia,
  antecedente,
  riquezaInicial,
  RacasEClassesInfo
  /* outros campos */
) => {
  // Crie uma referência para o nó onde você deseja armazenar as informações, por exemplo, "fichas"
  const database = getDatabase();
  const fichasRef = ref(database, "fichas");

  // Crie um objeto com as informações que você deseja armazenar
  const novaFicha = {
    nome: nome,
    raca: raca,
    classe: classe,
    tendencia: tendencia,
    antecedenteDetalhes: antecedente,
    riquezaInicial: riquezaInicial,
    IdiomasDaRaca: RacasEClassesInfo,
    // Adicione mais campos conforme necessário
  };

  // Use a função push para adicionar uma nova entrada com um ID único
  const novaFichaRef = push(fichasRef, novaFicha);

  // A novaFichaRef agora contém uma referência à entrada recém-criada no banco de dados
  // Você pode usar esta referência para atualizar ou recuperar os dados, se necessário
};


