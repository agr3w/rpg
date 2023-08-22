import { deleteObject, getStorage, ref } from "firebase/storage";
import { app } from "../../../APIs/firebaseConfig"; // Importar a instância do aplicativo Firebase
import "firebase/database"; // Importe os serviços do Firebase que você está usando, como 'database', 'storage', etc.

const musicasRef = app.database().ref("musicas");

export default function deletarArray() {
  try {
    // Deletar a array do banco de dados usando o método remove()
    musicasRef.remove();
    // Mostrar uma mensagem de sucesso
    alert("Array deletada com sucesso!");
  } catch (error) {
    // Tratar o erro
    console.error(error);
    // Mostrar uma mensagem de erro
    alert("Ocorreu um erro ao deletar a array!");
  }
  // Criar uma função que delete uma música do banco de dados e do Storage
}

export async function deletarMusica(musica) {
  // Criar uma referência para a array de músicas
  const storage = getStorage(app);
  // Criar uma referência para o arquivo de áudio
  const audioRef = ref(storage, "arquivos/musicas/agora deu o carai memmo.mp3");
  // Deletar a array do banco de dados usando o método remove()
  deleteObject(audioRef)
    .then(() => {
      // Mostrar uma mensagem de sucesso
      alert("Música deletada com sucesso!");
    })
    .catch((error) => {
      // Tratar o erro
      console.error(error);
      // Mostrar uma mensagem de erro
      alert("Ocorreu um erro ao deletar a música!");
    });
}
