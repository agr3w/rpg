import { deleteObject, getStorage, ref } from "firebase/storage";
import { app } from "../../../APIs/firebaseConfig"; // Importar a instância do aplicativo Firebase
import "firebase/database"; // Importe os serviços do Firebase que você está usando, como 'database', 'storage', etc.
import { deleteDoc, doc, getFirestore } from "firebase/firestore";


export const deletarArray = async (musicaId) => {
  const musicasRef = app.database().ref("musicas"); // Usar a instância do aplicativo Firebase
  
  // Encontre a referência da música com base no ID
  const musicaParaExcluirRef = musicasRef.child(musicaId);

  // Remova a música do Firebase Realtime Database
  await musicaParaExcluirRef.remove();
};


export function deletarMusica(musica) {
  const storage = getStorage(app);
  const audioRef = ref(storage, `gs://test-b6bc2.appspot.com/arquivos/musicas/${musica.titulo}.mp3`);

  const db = getFirestore(app);
  const docRef = doc(db, "colecao", "documento");

  // Deletar o arquivo de áudio do Firebase Storage
  deleteObject(audioRef)
    .then(() => {
      // Deletar o documento do Firebase Firestore
      return deleteDoc(docRef);
    })
    .then(() => {
      // Mostrar uma mensagem de sucesso
      alert("Item deletado com sucesso!");
    })
    .catch((error) => {
      // Tratar o erro
      console.error(error);
      // Mostrar uma mensagem de erro
      alert("Ocorreu um erro ao deletar o item!");
    });
}
