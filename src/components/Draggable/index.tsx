import React from "react";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

export type DraggableProps = {
  children?: any;
  style?: React.CSSProperties;
};

function Draggable(props: DraggableProps) {
  const { children, style } = props;

  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));

  const bind = useDrag(({ offset: [x, y] }) => api.start({ x, y }), {
    preventDefault: true,
    filterTaps: true,
  });

  return (
    <animated.span {...bind()} style={{ ...style, x, y }}>
      {children}
    </animated.span>
  );
}

export default Draggable;
