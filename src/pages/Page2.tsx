import React from "react";
import { animated, useSpring } from "@react-spring/web";
import PageIndex from "../components/PageIndex";

function Page2() {
  const [springProps, springApi] = useSpring(() => ({
    from: { top: "90%" },
  }));

  const picVisible = React.useRef(false);
  const showPic = () => {
    picVisible.current = true;
    springApi.start({
      to: { top: "10%" },
    });
  };
  const hidePic = () => {
    picVisible.current = false;
    springApi.start({
      to: { top: "90%" },
    });
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        boxSizing: "border-box",
        padding: 30,
        overflow: "auto",
        position: "relative",
        userSelect: "none",
      }}
    >
      <PageIndex index={2} />
      <div
        style={{
          textAlign: "center",
          position: "absolute",
          width: "100%",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <span
          onDoubleClick={() => {
            if (!picVisible.current) {
              showPic();
            }
          }}
          style={{
            display: "inline-block",
            color: "#fff",
            fontWeight: 800,
            fontSize: 60,
            letterSpacing: 2,
          }}
        >
          前端数据状态管理库
        </span>
      </div>

      <animated.div
        style={{
          position: "absolute",
          zIndex: 1,
          bottom: "10%",
          left: "10%",
          right: "10%",
          textAlign: "center",
          ...springProps,
        }}
      >
        <img
          onDoubleClick={() => {
            hidePic();
          }}
          height="100%"
          style={{
            margin: "0 auto",
          }}
          draggable={false}
          src={require("../static/stores.png")}
        />
      </animated.div>

      <div></div>
    </div>
  );
}

export default Page2;
