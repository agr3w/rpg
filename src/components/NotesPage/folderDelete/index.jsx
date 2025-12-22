// FolderDelete.js
import { database, storage, auth, firebase } from "APIs/firebaseConfig";

/**
 * Exclui uma nota específica dentro de uma pasta do usuário
 */
export const deleteNoteFromFolder = async (folderId, noteId) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");
  const uid = user.uid;

  const folderNotesRef = database.ref(`folders/${uid}/${folderId}/notes`);
  try {
    await folderNotesRef.child(noteId).remove();
    console.log(`Note ${noteId} removed from folder ${folderId} successfully`);
    return { success: true };
  } catch (error) {
    console.error(`Error removing note ${noteId} from folder ${folderId}:`, error);
    throw error;
  }
};

/**
 * Exclui uma pasta e seus arquivos (se confirmar) do Storage e do Realtime Database
 */
export const deleteArrayFolder = async (folderId) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");
  const uid = user.uid;
  const foldersRef = database.ref(`folders/${uid}`);

  try {
    const notesSnapshot = await foldersRef.child(folderId).child("notes").once("value");
    const folderData = notesSnapshot.val();

    if (folderData) {
      const confirmDelete = window.confirm(
        "Tem certeza que deseja deletar esta pasta e todo o seu conteúdo?"
      );

      if (!confirmDelete) {
        console.log("Folder deletion canceled.");
        return { canceled: true };
      }

      // folderData pode ser objeto ou array; normaliza para objeto
      const notesObj = Array.isArray(folderData) ? Object.fromEntries(folderData.map((n, i) => [n.id ?? i, n])) : folderData;

      for (const noteKey of Object.keys(notesObj)) {
        const note = notesObj[noteKey];
        // tenta remover arquivo associado no Storage (se existir)
        const arquivoNome = note.arquivoNomeCompleto || note.nomeArquivo || note.fileName || null;
        const arquivoUrl = note.urlDoArquivo || note.arquivoUrl || null;

        if (arquivoUrl) {
          try {
            const fileRef = storage.refFromURL(arquivoUrl);
            await fileRef.delete();
            console.log(`Arquivo removido por URL: ${arquivoUrl}`);
          } catch (err) {
            console.warn("Falha ao deletar arquivo por URL (pode não existir):", err);
          }
        } else if (arquivoNome) {
          try {
            const fileRef = storage.ref(`arquivos/anotacoes/${uid}/pasta/${arquivoNome}`);
            await fileRef.delete();
            console.log(`Arquivo removido: ${arquivoNome}`);
          } catch (err) {
            console.warn("Falha ao deletar arquivo pelo path:", err);
          }
        }

        // remove a nota individualmente do nó da pasta
        try {
          await foldersRef.child(`${folderId}/notes/${noteKey}`).remove();
        } catch (err) {
          console.warn("Falha ao remover nota individualmente:", err);
        }
      }
    }

    // finalmente remove a pasta
    await foldersRef.child(folderId).remove();
    console.log("Folder removed from array successfully");
    return { success: true };
  } catch (error) {
    console.error("Error removing folder from array:", error);
    throw error;
  }
};
