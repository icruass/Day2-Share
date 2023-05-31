import React from "react";
import { useSpring, animated } from "@react-spring/web";
import { useMenuStore } from "../components/Menu/store";

import CloseButton from "../components/CloseButton";

function ZustandWebsite() {
  const zustandWebsiteVisible = useMenuStore((s) => s.zustandWebsiteVisible);

  const enterSpring = useSpring({
    from: {
      scale: 0,
      display: "none",
    },
    to: {
      scale: 1,
      display: "block",
    },
  });

  const leaveSpring = useSpring({
    to: {
      scale: 0,
      display: "none",
    },
  });

  const animateStyle = zustandWebsiteVisible ? enterSpring : leaveSpring;

  return (
    <animated.div
      style={{
        scale: 0,
        position: "fixed",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        zIndex: 10,
        ...animateStyle,
      }}
    >
      <div style={{ position: "absolute", zIndex: 1, right: 60, top: 10 }}>
        <CloseButton
          onClick={() => useMenuStore.getState().closeZustandWebsite()}
        />
      </div>
      <iframe
        style={{
          border: "none",
          width: "100%",
          height: "100%",
        }}
        src="https://zustand-demo.pmnd.rs/"
      />
    </animated.div>
  );
}

export default ZustandWebsite;
