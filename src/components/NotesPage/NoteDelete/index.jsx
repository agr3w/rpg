// DeleteNote.js
import { database, storage, auth, firebase } from "APIs/firebaseConfig";

/**
 * Remove nota do array de notas do usuário (Realtime Database)
 */
export const deleteArrayNote = async (noteId) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");
  const uid = user.uid;
  const notesRef = database.ref(`notes/${uid}`);

  try {
    await notesRef.child(noteId).remove();
    console.log("Note removed successfully");
    return { success: true };
  } catch (error) {
    console.error("Error removing note:", error);
    throw error;
  }
};

export const deleteArrayNoteFromFolder = async (folderId, noteId) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");
  const uid = user.uid;
  const folderRef = database.ref(`folders/${uid}/${folderId}/notes`);

  try {
    await folderRef.child(noteId).remove();
    console.log("Note removed from folder successfully");
    return { success: true };
  } catch (error) {
    console.error("Error removing note from folder:", error);
    throw error;
  }
};

export async function deleteNoteFolder(note) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");
  const uid = user.uid;

  // tenta obter referência pelo URL, se houver
  let fileRef;
  try {
    if (note.url) {
      fileRef = storage.refFromURL(note.url);
    } else if (note.arquivoNomeCompleto) {
      fileRef = storage.ref(`arquivos/anotacoes/${uid}/pasta/${note.arquivoNomeCompleto}`);
    }
  } catch (err) {
    console.warn("Não foi possível criar referência de storage:", err);
    fileRef = null;
  }

  const noteDocRef = note.id ? firebase.firestore().doc(`notes/${note.id}`) : null;

  try {
    if (fileRef) {
      await fileRef.delete().catch((e) => {
        console.warn("Falha ao deletar arquivo no Storage (talvez não exista):", e);
      });
    }

    if (noteDocRef) {
      await noteDocRef.delete().catch((e) => {
        console.warn("Falha ao deletar documento Firestore (talvez não exista):", e);
      });
    }

    alert("Anotação deletada com sucesso!");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar anotação:", error);
    alert("Ocorreu um erro ao deletar a anotação!");
    throw error;
  }
}

export async function deleteNote(note) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");
  const uid = user.uid;

  let fileRef;
  try {
    if (note.url) {
      fileRef = storage.refFromURL(note.url);
    } else if (note.arquivoNomeCompleto) {
      fileRef = storage.ref(`arquivos/anotacoes/${uid}/${note.arquivoNomeCompleto}`);
    }
  } catch (err) {
    console.warn("Não foi possível criar referência de storage:", err);
    fileRef = null;
  }

  const noteDocRef = note.id ? firebase.firestore().doc(`notes/${note.id}`) : null;

  try {
    if (fileRef) {
      await fileRef.delete().catch((e) => {
        console.warn("Falha ao deletar arquivo no Storage (talvez não exista):", e);
      });
    }

    if (noteDocRef) {
      await noteDocRef.delete().catch((e) => {
        console.warn("Falha ao deletar documento Firestore (talvez não exista):", e);
      });
    }

    alert("Anotação deletada com sucesso!");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar anotação:", error);
    alert("Ocorreu um erro ao deletar a anotação!");
    throw error;
  }
}
