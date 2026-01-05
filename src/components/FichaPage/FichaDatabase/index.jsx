// FichaDatabase.js

import { database, auth, firebase } from "APIs/firebaseConfig";

/**
 * Envia ficha para Realtime Database sob /fichas/{userId}/{fichaId}
 * Retorna Promise que resolve { success: true, id } ou rejeita com Error.
 */
export const enviarFichaParaDatabase = async (
  nome,
  raca,
  classe,
  tendencia,
  itensSelecionados, // Alterei o nome aqui para bater com a chamada, antes estava 'antecedente' solto
  riquezaInicial,
  RacasInfo,
  Classesinfo,
  inventory = {} // <--- NOVO PARÂMETRO
) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  // validações básicas
  const nomeLimpo = typeof nome === "string" ? nome.trim() : "";
  if (!nomeLimpo) {
    throw new Error("Nome da ficha inválido.");
  }

  const fichaListRef = database.ref(`fichas/${user.uid}`);
  const novaFichaRef = fichaListRef.push(); // gera id automático (compat)

  const payload = {
    id: novaFichaRef.key,
    nome: nomeLimpo,
    raca: raca || null,
    classe: classe || null,
    tendencia: tendencia || null,

    // Ajuste para bater com o objeto 'itensSelecionados' passado no index.jsx
    antecedenteDetalhes: itensSelecionados || null,

    riquezaInicial: typeof riquezaInicial === "number" ? riquezaInicial : null,
    DetalhesDaRaça: RacasInfo || null,
    DetalhesDaClasse: Classesinfo || null,

    inventory: inventory, // <--- SALVANDO O INVENTÁRIO

    createdAt: firebase.database.ServerValue.TIMESTAMP,
  };

  try {
    await novaFichaRef.set(payload);
    return { success: true, id: novaFichaRef.key };
  } catch (error) {
    console.error("Erro ao criar a ficha:", error);
    throw new Error("Erro ao enviar ficha para o database.");
  }
};

export default enviarFichaParaDatabase;
