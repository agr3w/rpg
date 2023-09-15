// FolderDelete.js
import { app } from "APIs/firebaseConfig";
import { getAuth } from "firebase/auth";
import { getStorage, ref, deleteObject } from "firebase/storage";

// Função para excluir uma nota específica de um folder
export const deleteNoteFromFolder = async (folderId, noteId) => {
  const folderRef = app.database().ref(`folders/${folderId}/notes`);

  try {
    await folderRef.child(noteId).remove();
    console.log(`Note ${noteId} removed from folder ${folderId} successfully`);
  } catch (error) {
    console.error(
      `Error removing note ${noteId} from folder ${folderId}:`,
      error
    );
  }
};

// Função para excluir um folder e todas as notas nele
export const deleteArrayFolder = async (folderId) => {
  const foldersRef = app.database().ref("folders");

  try {
    // Verifique se a pasta possui notas
    const folderSnapshot = await foldersRef
      .child(folderId)
      .child("notes")
      .get();
    const folderData = folderSnapshot.val();

    // Crie uma referência ao Storage
    const storage = getStorage(app);

    // Se a pasta tiver notas, mostre o alerta de confirmação
    if (folderData) {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this folder and its contents?"
      );

      if (confirmDelete) {
        // Percorra a lista de notas no folder
        for (const noteId in folderData) {
          // Exclua o arquivo de anotação no Storage
          const auth = getAuth();
          const user = auth.currentUser;
          const userID = user.uid;
          const note = folderData[noteId];
          const noteRef = ref(
            storage,
            `arquivos/anotacoes/${userID}/pasta/${note.arquivoNomeCompleto}`
          );

          foldersRef.child(folderId).remove();
          console.log("Folder removed from array successfully");

          await deleteObject(noteRef);

          // Exclua a nota individualmente
          await deleteNoteFromFolder(folderId, noteId);
        }
      } else {
        console.log("Folder deletion canceled.");
        return;
      }
    }

    // Remova a pasta do array
    await foldersRef.child(folderId).remove();
    console.log("Folder removed from array successfully");
  } catch (error) {
    console.error("Error removing folder from array:", error);
  }
};
