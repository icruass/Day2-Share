import React from "react";
import { Box } from "@mui/material";
import styles from "./index.less";

let menuInputIdCount = 0;

function Menu() {
  const menuInputId = React.useRef(`menu-open-${menuInputIdCount++}`);

  const render = (
    <Box component="nav" className={styles.menu}>
      <Box
        component="input"
        type="checkbox"
        className={styles["menu-open"]}
        id={menuInputId.current}
      />
      <label
        className={styles["menu-open-button"]}
        htmlFor={menuInputId.current}
      >
        <span className={`${styles["lines"]} ${styles["line-1"]}`}></span>
        <span className={`${styles["lines"]} ${styles["line-2"]}`}></span>
        <span className={`${styles["lines"]} ${styles["line-3"]}`}></span>
      </label>

      <a href="#" className={`${styles["menu-item"]}`}>
        <i className={`${styles.fa} ${styles["fa-anchor"]}`}></i>
      </a>
      <a href="#" className={`${styles["menu-item"]}`}>
        <i className={`${styles.fa} ${styles["fa-coffee"]}`}></i>
      </a>
      <a href="#" className={`${styles["menu-item"]}`}>
        <i className={`${styles.fa} ${styles["fa-heart"]}`}></i>
      </a>
      <a href="#" className={`${styles["menu-item"]}`}>
        <i className={`${styles.fa} ${styles["fa-microphone"]}`}></i>
      </a>
      <a href="#" className={`${styles["menu-item"]}`}>
        <i className={`${styles.fa} ${styles["fa-star"]}`}></i>
      </a>
      <a href="#" className={`${styles["menu-item"]}`}>
        <i className={`${styles.fa} ${styles["fa-diamond"]}`}></i>
      </a>
    </Box>
  );
  return render;
}

export default Menu;
