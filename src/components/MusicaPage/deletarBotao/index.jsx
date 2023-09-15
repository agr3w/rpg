import { app } from "APIs/firebaseConfig"; // Importar a instância do aplicativo Firebase
import { getAuth } from "firebase/auth";
import "firebase/database"; // Importe os serviços do Firebase que você está usando, como 'database', 'storage', etc.

export const deletarArray = async (musicaId) => {
  const musicasRef = app.database().ref("musicas"); // Usar a instância do aplicativo Firebase

  // Encontre a referência da música com base no ID
  const musicaParaExcluirRef = musicasRef.child(musicaId);

  // Remova a música do Firebase Realtime Database
  await musicaParaExcluirRef.remove();
};

export function deletarMusica(nomeArquivoAudio, nomeArquivoImagem) {
  const auth = getAuth();
  const user = auth.currentUser;
  const userID = user.uid;
  const storage = app.storage();
  const storageRef = storage.ref();
  const arquivoAudioRef = storageRef.child(
    `arquivos/musicas/${userID}/${nomeArquivoAudio}`
  );
  const imagemRef = storageRef.child(`imagens/${userID}/${nomeArquivoImagem}`);
  arquivoAudioRef.delete();
  imagemRef.delete();
}