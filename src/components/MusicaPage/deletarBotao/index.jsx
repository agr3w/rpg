import { database, storage, auth, firebase } from "APIs/firebaseConfig";

export const deletarArray = async (musicaId) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");
  const userID = user.uid;
  const musicasRef = database.ref(`musicas/${userID}`);
  const musicaParaExcluirRef = musicasRef.child(musicaId);
  try {
    await musicaParaExcluirRef.remove();
    return { success: true };
  } catch (err) {
    console.error("Erro ao remover música do database:", err);
    throw err;
  }
};

export async function deletarMusica(nomeArquivoAudio, nomeArquivoImagem, opts = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");
  const userID = user.uid;
  const storageRef = storage.ref();

  // Deletar arquivo de áudio
  if (nomeArquivoAudio) {
    try {
      // tenta tratar se for URL ou apenas nome
      const audioRef = nomeArquivoAudio.startsWith("gs://") || nomeArquivoAudio.startsWith("https://")
        ? storage.refFromURL(nomeArquivoAudio)
        : storageRef.child(`arquivos/musicas/${userID}/${nomeArquivoAudio}`);
      await audioRef.delete();
    } catch (err) {
      console.warn("Não foi possível deletar arquivo de áudio:", err);
    }
  }

  // Deletar imagem
  if (nomeArquivoImagem) {
    try {
      const imgRef = nomeArquivoImagem.startsWith("gs://") || nomeArquivoImagem.startsWith("https://")
        ? storage.refFromURL(nomeArquivoImagem)
        : storageRef.child(`imagens/${userID}/${nomeArquivoImagem}`);
      await imgRef.delete();
    } catch (err) {
      console.warn("Não foi possível deletar imagem:", err);
    }
  }

  return { success: true };
}