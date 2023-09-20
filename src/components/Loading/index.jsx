// Loading.js
import React from "react";
import styles from "./Loading.module.css";
import { Typography } from "@mui/material";

const Loading = () => {
  return (
    <div className={styles.loading}>
      <Typography variant="h2" style={{ color: "white" }}>
        Loading...
      </Typography>
    </div>
  );
};

export default Loading;
