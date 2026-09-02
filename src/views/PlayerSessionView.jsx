// src/views/PlayerSessionView.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
import { auth } from "../APIs/firebaseConfig";
import { trackPlayerPresence } from "../APIs/sessionService";
import ActivePlayersList from "../components/MapEditor/ActivePlayersList";
import styles from "./PlayerSessionView.module.css";

export default function PlayerSessionView() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [sessionMeta, setSessionMeta] = useState(null);
  const [mapState, setMapState] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const fogCanvasRef = useRef(null);

  // Validação de login obrigatório
  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      }
    });
    return () => unsubAuth();
  }, [navigate]);

  // Carrega metadados da sessão
  useEffect(() => {
    if (!sessionId) return;
    const db = getDatabase();
    const metaRef = ref(db, `vtt_sessions/${sessionId}/meta`);

    const unsubMeta = onValue(metaRef, (snapshot) => {
      const meta = snapshot.val();
      if (!meta) {
        setErrorMsg("Sessão não encontrada.");
        return;
      }
      setSessionMeta(meta);
      if (meta.isPublic) {
        setAuthenticated(true);
      }
    });

    return () => unsubMeta();
  }, [sessionId]);

  // Presença do Jogador e escuta do estado do mapa
  useEffect(() => {
    if (!authenticated || !sessionId) return;

    const unsubPresence = trackPlayerPresence(
      sessionId,
      { name: auth.currentUser?.displayName, isDM: false },
      () => {
        alert("Você foi removido da sessão pelo Mestre.");
        navigate("/");
      }
    );

    const db = getDatabase();
    const stateRef = ref(db, `vtt_sessions/${sessionId}/state`);
    const unsubState = onValue(stateRef, (snapshot) => {
      const state = snapshot.val();
      if (!state) return;
      setMapState(state);

      // Aplica a imagem de névoa recebida do Mestre
      if (state.fogDataUrl && fogCanvasRef.current) {
        const img = new Image();
        img.src = state.fogDataUrl;
        img.onload = () => {
          const ctx = fogCanvasRef.current.getContext("2d");
          ctx.clearRect(0, 0, fogCanvasRef.current.width, fogCanvasRef.current.height);
          ctx.drawImage(img, 0, 0);
        };
      }
    });

    return () => {
      unsubPresence();
      unsubState();
    };
  }, [authenticated, sessionId, navigate]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (inputPassword === sessionMeta?.password) {
      setAuthenticated(true);
      setErrorMsg("");
    } else {
      setErrorMsg("Senha incorreta!");
    }
  };

  if (!authenticated) {
    return (
      <div className={styles.passwordScreen}>
        <div className={styles.passwordCard}>
          <h2>{sessionMeta?.name || "Mundo Protegido"}</h2>
          <p>Esta sessão requer uma senha informada pelo Mestre.</p>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              placeholder="Digite a senha da sala"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              required
            />
            {errorMsg && <span className={styles.error}>{errorMsg}</span>}
            <button type="submit">Entrar no Mapa</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.playerContainer}>
      <ActivePlayersList sessionId={sessionId} isMaster={false} />

      <div className={styles.viewport}>
        {/* Canvas de Fundo / Grid */}
        <div
          className={styles.mapSurface}
          style={{
            width: `${mapState?.width || 1200}px`,
            height: `${mapState?.height || 800}px`,
            backgroundImage: mapState?.bgUrl ? `url(${mapState.bgUrl})` : "none"
          }}
        >
          {/* Tokens visíveis (tokens marcados como ocultos pelo DM não renderizam) */}
          {mapState?.tokens
            ?.filter((t) => !t.hiddenFromPlayers)
            .map((t) => (
              <div
                key={t.id}
                className={styles.playerToken}
                style={{ left: `${t.x}px`, top: `${t.y}px` }}
              >
                <img src={t.src} alt={t.name} />
              </div>
            ))}

          {/* Névoa de Guerra 100% Blackout */}
          <canvas
            ref={fogCanvasRef}
            width={mapState?.width || 1200}
            height={mapState?.height || 800}
            className={styles.playerFog}
          />
        </div>
      </div>
    </div>
  );
}
