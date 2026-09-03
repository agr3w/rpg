// src/pages/LandingPage/components/ParchmentDivider.jsx
import React from "react";
import { motion } from "framer-motion";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import styles from "../LandingPage.module.css";

export default function ParchmentDivider({ rune, dragonColor = "#C89B3C" }) {
  return (
    <div className={styles.dividerContainer}>
      <motion.div
        className={styles.dividerLine}
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <motion.div
        className={styles.dividerSigil}
        style={{ borderColor: dragonColor }}
        initial={{ scale: 0, rotate: -45 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 120, damping: 10, delay: 0.2 }}
      >
        {rune ? (
          <span>{rune}</span>
        ) : (
          <AutoAwesomeIcon sx={{ color: dragonColor, fontSize: 18 }} />
        )}
      </motion.div>
      <motion.div
        className={styles.dividerLine}
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}
