import React, { useState } from "react";
import styles from "./LazyImage.module.css";

export default function LazyImage({ src, alt, className = "", width, height, style, ...props }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`${styles.wrapper} ${className}`} style={{ width, height, ...style }}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`${styles.image} ${loaded ? styles.loaded : styles.loading}`}
        {...props}
      />
    </div>
  );
}
