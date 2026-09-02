// src/components/MapEditor/ActivePlayersList.jsx
import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { kickPlayer } from "../../APIs/sessionService";
import styles from "./ActivePlayersList.module.css";

export default function ActivePlayersList({ sessionId, isMaster }) {
  const [players, setPlayers] = useState([]);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    const db = getDatabase();
    const playersRef = ref(db, `vtt_sessions/${sessionId}/players`);

    const unsubscribe = onValue(playersRef, (snapshot) => {
      const data = snapshot.val() || {};
      setPlayers(Object.values(data));
    });

    return () => unsubscribe();
  }, [sessionId]);

  return (
    <div className={styles.playersWidgetContainer}>
      <button 
        className={styles.triggerButton} 
        onClick={() => setShowMenu((prev) => !prev)}
        title="Jogadores na Sessão"
      >
        <span className={styles.onlineDot} />
        <PeopleAltIcon sx={{ fontSize: 18, color: "#ffd700" }} />
        <span className={styles.playerCount}>{players.length}</span>
      </button>

      {showMenu && (
        <div className={styles.playersDropdown}>
          <div className={styles.dropdownHeader}>
            <span>JOGADORES NA SALA</span>
          </div>

          <div className={styles.playerList}>
            {players.map((player) => (
              <div key={player.uid} className={styles.playerRow}>
                <div className={styles.avatarWrapper}>
                  {player.photoURL ? (
                    <img src={player.photoURL} alt={player.name} className={styles.avatar} />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {player.name?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                  <span className={styles.statusBadge} />
                </div>

                <div className={styles.playerDetails}>
                  <span className={styles.playerName}>
                    {player.name} {player.isDM && (
                      <span className={styles.dmCrown}>
                        <WorkspacePremiumIcon sx={{ fontSize: 14, verticalAlign: "middle", mr: 0.3 }} />
                        Mestre
                      </span>
                    )}
                  </span>
                </div>

                {isMaster && !player.isDM && (
                  <button
                    className={styles.kickButton}
                    onClick={() => kickPlayer(sessionId, player.uid)}
                    title="Expulsar jogador"
                    aria-label="Expulsar jogador"
                  >
                    <PersonRemoveIcon sx={{ fontSize: 14 }} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
