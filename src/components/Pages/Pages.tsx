import React from "react";
import type { BoxProps, SxProps } from "@mui/material";

import _ from "lodash";
import theme from "./theme";

import { useSprings } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

import { Box } from "@mui/material";

export type PagesProps = BoxProps & {
  bgColor?: string;
  children?: any;
  themeType?: "primary";
};

function Pages(props: PagesProps) {
  const { children, themeType = "primary", ...restProps } = props;

  const index = React.useRef(0);
  const width = window.innerWidth;

  const pagesLength = React.Children.count(props.children);

  const [springsProps, api] = useSprings(pagesLength, (i) => ({
    x: i * width,
    scale: 1,
    display: "block",
  }));
  const bind: any = useDrag(
    ({ active, movement: [mx], direction: [xDir], cancel }) => {
      if (active && Math.abs(mx) > width / 2) {
        index.current = _.clamp(
          index.current + (xDir > 0 ? -1 : 1),
          0,
          pagesLength - 1
        );
        cancel();
      }
      api.start((i) => {
        if (i < index.current - 1 || i > index.current + 1)
          return { display: "none" };
        const x = (i - index.current) * width + (active ? mx : 0);
        const scale = active ? 1 - Math.abs(mx) / width / 2 : 1;
        return {
          x,
          scale,
          display: "block",
        };
      });
    }
  );

  const pagesWrapSx = getClasses(props).PageWrap;

  return (
    <Box sx={pagesWrapSx} {...restProps}>
      {React.Children.map(children, (child, i) => {
        const springsProp = springsProps[i];
        return React.cloneElement(child, {
          themeType,
          dragBindProps: { ...bind() },
          dragStyle: {
            x: springsProp.x,
            scale: springsProp.scale,
            display: springsProp.display,
            ...springsProp,
          },
        });
      })}
    </Box>
  );
}

const getClasses: (props: PagesProps) => Record<string, SxProps> = (props) => {
  return {
    PageWrap: {
      "&": {
        boxSizing: "border-box",
        position: "fixed",
        zIndex: 1,
        width: "100%",
        minWidth: "100vw",
        height: "100%",
        minHeight: "100vh",
        touchAction: "none",
        overflow: "hidden",
        background:
          theme[props.themeType || "primary"]?.pages?.background ||
          props.bgColor,
        ...props.sx?.["&"],
      },
    },
  };
};

export default Pages;
