import React from "react";
import { motion } from "framer-motion";
import CheckIcon from "@mui/icons-material/Check";
import styles from "./HabilidadeDetalheModal.module.css";

export default function HabilidadeDetalheModal({ feature, className, onClose }) {
  if (!feature) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <motion.div
        className={styles.modalBox}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ duration: 0.2 }}
      >
        <div className={styles.modalHeader}>
          <div className={styles.badgeRow}>
            <span className={styles.classBadge}>Nível {feature.level} • {className}</span>
            <span className={styles.actionBadge}>{feature.actionType}</span>
          </div>
          <h3>{feature.name}</h3>
        </div>

        <div className={styles.metaRow}>
          <div className={styles.metaItem}>
            <small>Recarga / Custo</small>
            <strong>{feature.recharge || "Permanente"}</strong>
          </div>
          <div className={styles.metaItem}>
            <small>Ativação</small>
            <strong>{feature.actionType || "Passiva"}</strong>
          </div>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.featureFullText}>{feature.desc}</p>
        </div>

        <div className={styles.modalFooter}>
          <button type="button" className={styles.btnClose} onClick={onClose}>
            <span>Entendido</span>
            <CheckIcon className={styles.btnCheckIcon} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
