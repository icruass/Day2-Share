import React from "react";
import { Box } from "@mui/material";
import styles from "./index.less";
import { useMenuStore } from "./store";

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

      <span
        className={`${styles["menu-item"]}`}
        onClick={() => useMenuStore.getState().showZustandWebsite()}
      >
        <span className={`${styles["menu-item-text"]}`}>Zustand</span>
      </span>

      <span
        className={`${styles["menu-item"]}`}
        onClick={() => {
          window.open("https://www.npmjs.com/package/zustand", "npm");
          window.open("https://github.com/pmndrs/zustand", "git");
        }}
      >
        <a className={`${styles["menu-item-text"]}`}>Zus Npm/Git</a>
      </span>

      <span
        className={`${styles["menu-item"]}`}
        onClick={() => {
          window.open("https://github1s.com/pmndrs/zustand", "git");
        }}
      >
        <a className={`${styles["menu-item-text"]}`}>Zus Code</a>
      </span>
    </Box>
  );
  return render;
}

export default Menu;
