// DeleteNote.js
import { getStorage, ref, deleteObject } from "firebase/storage";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { app } from "APIs/firebaseConfig"; // Importe a instância do aplicativo Firebase
import { getAuth } from "firebase/auth";

export const deleteArrayNote = async (noteId) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const userID = user.uid;
  const notesRef = app.database().ref(`notes/${userID}`);

  try {
    await notesRef.child(noteId).remove();
    console.log("Note removed successfully");
  } catch (error) {
    console.error("Error removing note:", error);
  }
};

export const deleteArrayNoteFromFolder = async (folderId, noteId) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const userID = user.uid;
  const folderRef = app.database().ref(`folders/${userID}/${folderId}/notes`);

  try {
    await folderRef.child(noteId).remove();
    console.log("Note removed from folder successfully");
  } catch (error) {
    console.error("Error removing note from folder:", error);
  }
};

export function deleteNoteFolder(note) {
  const auth = getAuth();
  const user = auth.currentUser;
  const userID = user.uid;
  const storage = getStorage(app);
  const noteRef = ref(
    storage,
    `gs://test-b6bc2.appspot.com/arquivos/anotacoes/${userID}/pasta/${note.arquivoNomeCompleto}`
  );
  const db = getFirestore(app);
  const noteDocRef = doc(db, "notes", note.id);
  deleteObject(noteRef);

  deleteObject(noteRef)
    .then(() => {
      // Deletar o documento do Firebase Firestore
      return deleteDoc(noteDocRef);
    })
    .then(() => {
      // Mostrar uma mensagem de sucesso
      alert("Anotação deletada com sucesso!");
    })
    .catch((error) => {
      // Tratar o erro
      console.error(error);
      // Mostrar uma mensagem de erro
      alert("Ocorreu um erro ao deletar a anotação!");
    });
}

export function deleteNote(note) {
  const auth = getAuth();
  const user = auth.currentUser;
  const userID = user.uid;
  const storage = getStorage(app);
  const noteRef = ref(
    storage,
    `gs://test-b6bc2.appspot.com/arquivos/anotacoes/${userID}/${note.arquivoNomeCompleto}` //necessita de file extension arrumar***
  );

  // Referência para o documento no Firebase Firestore
  const db = getFirestore(app);
  const noteDocRef = doc(db, "notes", note.id);

  // Deletar o arquivo de anotação do Firebase Storage
  deleteObject(noteRef)
    .then(() => {
      // Deletar o documento do Firebase Firestore
      return deleteDoc(noteDocRef);
    })
    .then(() => {
      // Mostrar uma mensagem de sucesso
      alert("Anotação deletada com sucesso!");
    })
    .catch((error) => {
      // Tratar o erro
      console.error(error);
      // Mostrar uma mensagem de erro
      alert("Ocorreu um erro ao deletar a anotação!");
    });
}
