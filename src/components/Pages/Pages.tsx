import React from "react";
import type { BoxProps, SxProps } from "@mui/material";

import _ from "lodash";
import theme from "./theme";
import { $$type } from "./Page";

import { useSprings } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { usePagesStore } from "./store";

import { Box } from "@mui/material";
import Menu from "../Menu";
import Draggable from "../Draggable";

export type PagesProps = BoxProps & {
  bgColor?: string;
  children?: any;
  themeType?: "primary";
};

function Pages(props: PagesProps) {
  const { children, themeType = "primary", ...restProps } = props;

  const getChildIsPage = (child: any) => child.type?.$$type === $$type;

  const width = window.innerWidth;

  const pagesLength = React.Children.count(props.children);
  const index = usePagesStore((s) => s.currentPageIndex);

  const [springsProps, api] = useSprings(pagesLength, (i) => {
    if (i < index - 1 || i > index + 1) return { display: "none" };
    const x = (i - index) * width;
    return {
      x,
      scale: 1,
      display: "block",
    };
  });

  usePagesStore
    .getState()
    .Event.on("next", ({ currentIndex, nextIndex }: any) => {
      api.start((i) => {
        if (i === currentIndex) {
          const x = (i - currentIndex) * width;
          return {
            from: { scale: 1 },
            to: { scale: 0.85, display: "none", x },
          };
        }
        if (i === nextIndex) {
          const x = (i - nextIndex) * width;
          return {
            from: { scale: 1, display: "none" },
            to: [
              { scale: 0.85, display: "block", x },
              { scale: 1, display: "block", x },
            ],
          };
        }
      });
    });

  usePagesStore
    .getState()
    .Event.on("pre", ({ currentIndex, preIndex }: any) => {
      api.start((i) => {
        if (i === currentIndex) {
          const x = (i - preIndex) * width;
          return {
            from: { scale: 1, display: "block" },
            to: [
              { scale: 0.85, display: "block", x },
              { scale: 1, display: "none", x },
            ],
          };
        }
        if (i === preIndex) {
          const x = (i - preIndex) * width;
          return {
            from: { scale: 1, display: "block" },
            to: [
              { scale: 0.85, display: "block", x },
              { scale: 1, display: "block", x },
            ],
          };
        }
      });
    });

  usePagesStore
    .getState()
    .Event.on("navigationTo", ({ fromPageIndex, toPageIndex }: any) => {
      api.start((i) => {
        if (i < toPageIndex - 1 || i > toPageIndex + 1)
          return { display: "none" };

        const x = (i - toPageIndex) * width;
        return {
          x,
          scale: 1,
          display: "block",
        };
      });
    });

  React.useLayoutEffect(() => {
    const onkeydown = (e) => {
      if (e.keyCode === 37) {
        usePagesStore.getState().pre();
      }
      if (e.keyCode === 39) {
        usePagesStore.getState().next();
      }
    };
    document.addEventListener("keydown", onkeydown);
    return () => {
      document.removeEventListener("keydown", onkeydown);
    };
  }, []);

  const bind: any = useDrag(
    ({ active, movement: [mx], direction: [xDir], cancel }) => {
      if (active && Math.abs(mx) > width / 2) {
        const index = usePagesStore.getState().currentPageIndex;
        const newIndex = _.clamp(
          index + (xDir > 0 ? -1 : 1),
          0,
          pagesLength - 1
        );
        usePagesStore.getState().setCurrentPageIndex(newIndex);
        cancel();
      }
      api.start((i) => {
        const index = usePagesStore.getState().currentPageIndex;
        if (i < index - 1 || i > index + 1) return { display: "none" };
        const x = (i - index) * width + (active ? mx : 0);
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
        if (getChildIsPage(child)) {
          const springsProp = springsProps[i];
          return React.cloneElement(child, {
            index: i,
            name: i,
            themeType,
            dragBindProps: { ...bind() },
            dragStyle: {
              ...springsProp,
            },
          });
        }
        return child;
      })}
      <Draggable style={{ position: "fixed", right: 100, bottom: 120 }}>
        <Menu />
      </Draggable>
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
