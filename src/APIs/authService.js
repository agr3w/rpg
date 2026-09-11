// src/APIs/authService.js
import { auth } from "./firebaseConfig";

/**
 * 1. Cadastro de usuário com envio imediato de e-mail de verificação.
 * Atualiza o displayName se informado e dispara sendEmailVerification.
 */
export async function cadastrarUsuario(email, senha, nome = "") {
  const credencial = await auth.createUserWithEmailAndPassword(email, senha);
  const user = credencial.user;

  if (nome && user?.updateProfile) {
    try {
      await user.updateProfile({ displayName: nome });
    } catch (profileErr) {
      console.warn("Aviso ao atualizar perfil inicial:", profileErr);
    }
  }

  // Dispara o e-mail de confirmação configurado no Firebase Authentication
  if (user?.sendEmailVerification) {
    await user.sendEmailVerification();
  }

  return user;
}

/**
 * 2. Recuperação de senha por e-mail.
 * Dispara link de redefinição de senha para o endereço informado.
 */
export async function recuperarSenha(email) {
  const cleanEmail = (email || "").trim();
  if (!cleanEmail) {
    throw new Error("E-mail não informado para recuperação.");
  }
  await auth.sendPasswordResetEmail(cleanEmail);
}

/**
 * 3. Reenvio manual do e-mail de verificação.
 * Verifica se o usuário já não está validado antes de disparar.
 */
export async function reenviarVerificacao(user) {
  const targetUser = user || auth.currentUser;
  if (targetUser && !targetUser.emailVerified && targetUser.sendEmailVerification) {
    await targetUser.sendEmailVerification();
    return true;
  }
  return false;
}

/**
 * 4. Recarrega os dados do usuário para atualizar o status de emailVerified em tempo de execução.
 */
export async function recarregarUsuario(user) {
  const targetUser = user || auth.currentUser;
  if (targetUser?.reload) {
    await targetUser.reload();
    return auth.currentUser;
  }
  return targetUser;
}
