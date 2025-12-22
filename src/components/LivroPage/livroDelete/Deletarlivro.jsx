import React from "react";
import { database, storage, auth, firebase } from "APIs/firebaseConfig";

/**
 * Remove entrada do livro no Realtime Database
 */
export const deleteArrayLivro = async (livroId) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");
  const userID = user.uid;

  try {
    await database.ref(`books/${userID}/${livroId}`).remove();
    return { success: true };
  } catch (error) {
    console.error("Error removing livro from database:", error);
    throw error;
  }
};

/**
 * Deleta arquivo do Storage (por URL se disponível) e remove entrada no Realtime Database
 */
export async function deletarLivro(livro) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");
  const userID = user.uid;

  try {
    // tenta remover pelo url (mais confiável), senão monta path pelo título
    let storageRef = null;
    if (livro.urlDoArquivo) {
      storageRef = storage.refFromURL(livro.urlDoArquivo);
    } else {
      // fallback (pode variar conforme como o arquivo foi salvo)
      storageRef = storage.ref(`arquivos/livros/${userID}/${livro.titulo}.pdf`);
    }

    // Deleta o arquivo no Storage (se existir)
    try {
      await storageRef.delete();
      console.log("Arquivo do Storage deletado com sucesso");
    } catch (err) {
      console.warn("Não foi possível deletar arquivo do Storage (ou já não existe):", err);
    }

    // Remove entrada do Realtime Database
    await database.ref(`books/${userID}/${livro.id}`).remove();
    console.log("Entrada do livro removida do database com sucesso");

    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar livro:", error);
    throw error;
  }
}
