// src/APIs/sessionService.js
import { getDatabase, ref, set, onValue, update, remove, onDisconnect, serverTimestamp } from "firebase/database";
import { auth } from "./firebaseConfig";

const db = getDatabase();

/**
 * Cria ou atualiza as configurações da Sala no Realtime Database
 */
export async function setupSession(sessionId, { roomName, isPublic, password }) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");

  const sessionRef = ref(db, `vtt_sessions/${sessionId}/meta`);
  await update(sessionRef, {
    name: roomName || "Mesa de Jogo",
    dmId: user.uid,
    isPublic: Boolean(isPublic),
    password: password || "",
    updatedAt: serverTimestamp()
  });
}

/**
 * Registra a presença do jogador conectado e remove ao desconectar
 */
export function trackPlayerPresence(sessionId, userInfo, onKicked) {
  const user = auth.currentUser;
  if (!user) return () => {};

  const playerRef = ref(db, `vtt_sessions/${sessionId}/players/${user.uid}`);
  const kickedRef = ref(db, `vtt_sessions/${sessionId}/kicked/${user.uid}`);

  // Escuta se o jogador foi expulso pelo Mestre
  const unsubKicked = onValue(kickedRef, (snapshot) => {
    if (snapshot.val() === true) {
      remove(playerRef);
      if (onKicked) onKicked();
    }
  });

  // Registra dados do jogador na sala
  set(playerRef, {
    uid: user.uid,
    name: userInfo?.name || user.displayName || "Aventureiro",
    photoURL: userInfo?.photoURL || user.photoURL || "",
    online: true,
    isDM: userInfo?.isDM || false,
    joinedAt: serverTimestamp()
  });

  // Limpa presença automaticamente se fechar a aba
  onDisconnect(playerRef).remove();

  return () => {
    unsubKicked();
    remove(playerRef);
  };
}

/**
 * Sincroniza o estado do mapa (Névoa e Tokens) disparado pelo Mestre
 */
export function syncMapState(sessionId, mapData) {
  const stateRef = ref(db, `vtt_sessions/${sessionId}/state`);
  return update(stateRef, {
    ...mapData,
    lastUpdate: serverTimestamp()
  });
}

/**
 * Expulsa jogador da sessão
 */
export async function kickPlayer(sessionId, targetUid) {
  await set(ref(db, `vtt_sessions/${sessionId}/kicked/${targetUid}`), true);
  await remove(ref(db, `vtt_sessions/${sessionId}/players/${targetUid}`));
}
