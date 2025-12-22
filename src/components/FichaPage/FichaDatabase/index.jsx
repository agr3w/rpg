// FichaDatabase.js

import { app } from "APIs/firebaseConfig";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, push, set, serverTimestamp } from "firebase/database";

/**
 * Envia ficha para Realtime Database sob /fichas/{userId}/{fichaId}
 * Retorna Promise que resolve { success: true, id } ou rejeita com Error.
 */
export const enviarFichaParaDatabase = async (
  nome,
  raca,
  classe,
  tendencia,
  antecedente,
  riquezaInicial,
  RacasInfo,
  Classesinfo
) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  // validações básicas
  const nomeLimpo = typeof nome === "string" ? nome.trim() : "";
  if (!nomeLimpo) {
    throw new Error("Nome da ficha inválido.");
  }

  const db = getDatabase();
  const fichaListRef = ref(db, `fichas/${user.uid}`);
  const novaFichaRef = push(fichaListRef); // gera id automático

  const payload = {
    id: novaFichaRef.key,
    nome: nomeLimpo,
    raca: raca || null,
    classe: classe || null,
    tendencia: tendencia || null,
    antecedenteDetalhes: antecedente || null,
    riquezaInicial: typeof riquezaInicial === "number" ? riquezaInicial : null,
    DetalhesDaRaça: RacasInfo || null,
    DetalhesDaClasse: Classesinfo || null,
    createdAt: serverTimestamp(),
  };

  try {
    await set(novaFichaRef, payload);
    return { success: true, id: novaFichaRef.key };
  } catch (error) {
    console.error("Erro ao criar a ficha:", error);
    throw new Error("Erro ao enviar ficha para o database.");
  }
};

export default enviarFichaParaDatabase;
