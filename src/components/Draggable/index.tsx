import React from "react";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

export type DraggableProps = React.HTMLProps<any> & {
  children?: any;
  style?: React.CSSProperties;
  preventDefault?: boolean;
  filterTaps?: boolean;
  stopPropagation?: boolean;
  component?: any;
};

function Draggable(props: DraggableProps) {
  const {
    children,
    style,
    component = "div",
    preventDefault = false,
    filterTaps = true,
    stopPropagation = true,
  } = props;

  const dragActive = React.useRef(false);

  const [{ x, y }, api] = useSpring(() => ({
    x: 0,
    y: 0,
  }));

  const bind = useDrag(
    ({ offset: [x, y], active }) => {
      dragActive.current = active;
      api.start(() => {
        return { x, y };
      });
    },
    {
      preventDefault,
      filterTaps,
    }
  );

  const bindProps = bind();

  const onPointerMove = (e: any) => {
    if (stopPropagation && dragActive.current) {
      e.stopPropagation();
    }
    bindProps.onPointerMove(e);
  };

  const Comp = React.useRef(animated[component]).current;

  return (
    <Comp
      {...bindProps}
      onPointerMove={onPointerMove}
      style={{ display: "inline-block", ...style, x, y }}
    >
      {children}
    </Comp>
  );
}

export default Draggable;
