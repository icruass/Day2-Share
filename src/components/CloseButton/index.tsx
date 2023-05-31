import React from "react";
import { Box } from "@mui/material";
import styles from "./index.less";

function CloseButton(props: any) {
  const render = (
    <Box
      component="span"
      {...props}
      className={`${styles["button"]} ${props.className}`}
    >
      <span className={`${styles["lines"]} ${styles["line-1"]}`}></span>
      <span className={`${styles["lines"]} ${styles["line-2"]}`}></span>
      <span className={`${styles["lines"]} ${styles["line-3"]}`}></span>
    </Box>
  );
  return render;
}

export default CloseButton;
