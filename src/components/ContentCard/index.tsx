import React from "react";
import type { BoxProps } from "@mui/material";

import { Box } from "@mui/material";
import styles from "./index.less";

function ContentCard(props: BoxProps) {
  return (
    <Box {...props} className={`${styles.box} ${props.className || ""}`}></Box>
  );
}

export default ContentCard;
