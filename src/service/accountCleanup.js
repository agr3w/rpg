import { auth, database, storage, firebase } from "APIs/firebaseConfig";

/**
 * Deleta todos os arquivos dentro de um "prefixo" no Firebase Storage (compat).
 * Ex.: arquivos/livros/{uid}
 */
async function deleteStoragePrefix(prefix) {
  if (!prefix) return;
  const ref = storage.ref(prefix);

  async function walkAndDelete(folderRef) {
    const res = await folderRef.listAll();
    await Promise.all(res.items.map((itemRef) => itemRef.delete().catch(() => null)));
    await Promise.all(res.prefixes.map((p) => walkAndDelete(p)));
  }

  try {
    await walkAndDelete(ref);
  } catch {
    // noop
  }
}

/**
 * Apaga conteúdo seletivo do usuário (DB + Storage).
 * targets: { books, notes, musicas, fichas }
 */
export async function deleteUserContent({ currentPassword, targets }) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado.");

  const email = user.email;
  if (!email) throw new Error("Seu usuário não possui e-mail.");

  if (!currentPassword) throw new Error("Informe sua senha atual para confirmar.");

  const t = targets || {};
  if (!t.books && !t.notes && !t.musicas && !t.fichas) {
    throw new Error("Selecione ao menos um tipo de conteúdo para deletar.");
  }

  const credential = firebase.auth.EmailAuthProvider.credential(email, currentPassword);
  await user.reauthenticateWithCredential(credential);

  const uid = user.uid;
  const updates = {};

  if (t.books) updates[`books/${uid}`] = null;
  if (t.notes) updates[`notes/${uid}`] = null;
  if (t.musicas) updates[`musicas/${uid}`] = null;
  if (t.fichas) updates[`fichas/${uid}`] = null;

  await database.ref().update(updates);

  await Promise.all([
    t.books ? deleteStoragePrefix(`arquivos/livros/${uid}`) : Promise.resolve(),
    t.notes ? deleteStoragePrefix(`arquivos/anotacoes/${uid}`) : Promise.resolve(),
    t.musicas ? deleteStoragePrefix(`arquivos/musicas/${uid}`) : Promise.resolve(),
  ]);
}

/**
 * Remove dados do usuário no Realtime Database + arquivos no Storage.
 * Ajuste/adicione paths aqui conforme seu schema crescer.
 */
export async function deleteUserData(uid) {
  if (!uid) throw new Error("UID inválido.");

  // Realtime Database (paths vistos no projeto)
  const updates = {
    [`folders/${uid}`]: null,
    [`notes/${uid}`]: null,
    [`books/${uid}`]: null,
    [`musicas/${uid}`]: null,
    [`fichas/${uid}`]: null,

    // (opcionais) se você usar depois:
    // [`mapas/${uid}`]: null,
    // [`profile/${uid}`]: null,
  };

  await database.ref().update(updates);

  // Storage (paths vistos no projeto)
  await Promise.all([
    deleteStoragePrefix(`arquivos/livros/${uid}`),
    deleteStoragePrefix(`arquivos/musicas/${uid}`),
    deleteStoragePrefix(`arquivos/anotacoes/${uid}`),
  ]);
}

/**
 * Reautentica (senha atual) -> apaga dados -> apaga a conta do Auth.
 */
export async function deleteAccountAndData({ currentPassword }) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado.");

  const email = user.email;
  if (!email) throw new Error("Seu usuário não possui e-mail.");

  if (!currentPassword) throw new Error("Informe sua senha atual para confirmar.");

  const credential = firebase.auth.EmailAuthProvider.credential(email, currentPassword);

  await user.reauthenticateWithCredential(credential);

  await deleteUserData(user.uid);

  await user.delete();
}

/**
 * Troca e-mail (exige reauth)
 */
export async function changeEmail({ newEmail, currentPassword }) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado.");
  const email = user.email;
  if (!email) throw new Error("Seu usuário não possui e-mail.");

  if (!newEmail) throw new Error("Informe o novo e-mail.");
  if (!currentPassword) throw new Error("Informe sua senha atual.");

  const credential = firebase.auth.EmailAuthProvider.credential(email, currentPassword);
  await user.reauthenticateWithCredential(credential);

  await user.updateEmail(newEmail.trim());
}

/**
 * Troca senha (exige reauth)
 */
export async function changePassword({ newPassword, currentPassword }) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado.");
  const email = user.email;
  if (!email) throw new Error("Seu usuário não possui e-mail.");

  if (!newPassword) throw new Error("Informe a nova senha.");
  if (!currentPassword) throw new Error("Informe sua senha atual.");

  const credential = firebase.auth.EmailAuthProvider.credential(email, currentPassword);
  await user.reauthenticateWithCredential(credential);

  await user.updatePassword(newPassword);
}