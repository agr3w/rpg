import { getStorage, ref, deleteObject } from "firebase/storage";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { app } from "APIs/firebaseConfig"; // Importe a instância do aplicativo Firebase
import { getAuth } from "firebase/auth";

export const deleteArrayLivro = async (livroId) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const userID = user.uid;
    const livrosRef = app.database().ref(`books/${userID}`);
    console.log("livrosRef", livrosRef.toString());

    const livrosExcluirRef = livrosRef.child(livroId);
    console.log("livrosExcluirRef", livrosExcluirRef.toString());

    try {
        await livrosExcluirRef.remove();
        console.log("Livro removed successfully");
    } catch (error) {
        console.error("Error removing livro:", error);
    }
}


export function deletarLivro(livro) {
  const auth = getAuth();
  const user = auth.currentUser;
  const userID = user.uid;  const storage = getStorage(app);
  const livroRef = ref(
    storage,
    `gs://test-b6bc2.appspot.com/arquivos/livros/${userID}/${livro.titulo}.pdf`
  );

  // Referência para o documento no Firebase Firestore
  const db = getFirestore(app);
  const livroDocRef = doc(db, "livros", livro.id);

  // Deletar o arquivo de livro do Firebase Storage
  deleteObject(livroRef)
    .then(() => {
      // Deletar o documento do Firebase Firestore
      return deleteDoc(livroDocRef);
    })
    .then(() => {
      // Mostrar uma mensagem de sucesso
      alert("Livro deletado com sucesso!");
    })
    .catch((error) => {
      // Tratar o erro
      console.error(error);
      // Mostrar uma mensagem de erro
      alert("Ocorreu um erro ao deletar o livro!");
    });
}
