// src/components/MapEditor/ShareSessionModal.jsx
import React, { useState } from "react";
import PublicIcon from "@mui/icons-material/Public";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import { setupSession } from "../../APIs/sessionService";
import styles from "./ShareSessionModal.module.css";

export default function ShareSessionModal({ sessionId, sessionMeta, onClose }) {
  const [roomName, setRoomName] = useState(sessionMeta?.name || "Mundo VTT");
  const [isPublic, setIsPublic] = useState(sessionMeta?.isPublic ?? true);
  const [password, setPassword] = useState(sessionMeta?.password || "");
  const [copied, setCopied] = useState(false);

  const playerUrl = `${window.location.origin}/sessao/${sessionId}`;

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await setupSession(sessionId, { roomName, isPublic, password });
    onClose();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(playerUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>
            <PublicIcon sx={{ fontSize: 20, verticalAlign: "middle", mr: 0.8, color: "#f1c40f" }} />
            COMPARTILHAR MUNDO (VTT)
          </h3>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">
            <CloseIcon fontSize="small" />
          </button>
        </div>

        <form onSubmit={handleSaveSettings} className={styles.form}>
          <div className={styles.field}>
            <label>Link da Mesa para os Jogadores:</label>
            <div className={styles.copyBox}>
              <input type="text" readOnly value={playerUrl} />
              <button type="button" onClick={handleCopyLink}>
                {copied ? (
                  <>
                    <CheckIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: "middle" }} />
                    Copiado!
                  </>
                ) : (
                  <>
                    <ContentCopyIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: "middle" }} />
                    Copiar
                  </>
                )}
              </button>
            </div>
          </div>

          <div className={styles.field}>
            <label>Nome da Sala / Mundo:</label>
            <input 
              type="text" 
              value={roomName} 
              onChange={(e) => setRoomName(e.target.value)} 
              required 
            />
          </div>

          <div className={styles.checkboxField}>
            <label>
              <input 
                type="checkbox" 
                checked={!isPublic} 
                onChange={(e) => setIsPublic(!e.target.checked)} 
              />
              Sala Privada com Senha
            </label>
          </div>

          {!isPublic && (
            <div className={styles.field}>
              <label>Senha de Acesso:</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Insira a senha da mesa" 
                required 
              />
            </div>
          )}

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancelar</button>
            <button type="submit" className={styles.saveBtn}>Salvar Configurações</button>
          </div>
        </form>
      </div>
    </div>
  );
}
