// DeleteNote.js
import { database, storage, auth } from "APIs/firebaseConfig";

/**
 * Remove o arquivo físico do Firebase Storage
 */
export const deleteNoteFolder = async (note) => {
  if (!note.url) return;

  try {
    // Cria uma referência direta ao arquivo usando a URL salva
    const fileRef = storage.refFromURL(note.url);
    await fileRef.delete();
    console.log("Arquivo físico incinerado com sucesso.");
  } catch (error) {
    console.error("Erro ao deletar arquivo do Storage:", error);
    // Se o arquivo não existir (404), seguimos em frente para deletar o registro do banco
    if (error.code !== 'storage/object-not-found') {
      throw error;
    }
  }
};

/**
 * Remove a referência da nota dentro do Array da pasta no Realtime Database
 */
export const deleteArrayNoteFromFolder = async (folderId, noteId) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Mago não autenticado.");

  try {
    // Caminho para as notas dentro da pasta específica
    const noteRef = database.ref(`folders/${user.uid}/${folderId}/notes/${noteId}`);
    await noteRef.remove();
    console.log("Registro do grimório apagado.");
  } catch (error) {
    console.error("Erro ao remover nota do banco:", error);
    throw error;
  }
};
