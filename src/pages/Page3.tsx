import React from "react";
import { animated, useSpring, useSprings } from "@react-spring/web";

import ContentCard from "../components/ContentCard";
import PageIndex from "../components/PageIndex";

function Page() {
  const [springProps, springApi] = useSpring(() => ({
    from: { top: "90%" },
  }));

  const [springTitleProps, springTitleApi] = useSpring(
    () =>
      ({
        position: "fixed",
        top: "30%",
        left: "50%",
        zIndex: 10,
        transform: "translateX(-50%)",
        fontSize: 100,
      } as any)
  );

  const queueCount = 2;
  const queueIndex = React.useRef(0);
  const [springQueueProps, springQueueApi] = useSprings(queueCount, () => {
    return { display: "none", opacity: 0 };
  });

  const springQueueNext = () => {
    springTitleApi.start(() => ({
      position: "unset",
      transform: "none",
      fontSize: 60,
    }));

    springQueueApi.start((i) => {
      if (i === queueIndex.current) {
        return { display: "block", opacity: 1 };
      }
    });
    if (queueIndex.current < queueCount - 1) {
      queueIndex.current++;
    }
  };

  const springQueueBack = () => {
    springQueueApi.start((i) => {
      if (i === queueIndex.current) {
        return { display: "none", opacity: 0 };
      }
    });
    if (queueIndex.current > 0) {
      queueIndex.current--;
    }
  };

  React.useEffect(() => {
    const onkeydown = (e) => {
      if (e.ctrlKey && e.keyCode === 90) {
        springQueueBack();
      }
    };
    document.addEventListener("keydown", onkeydown);
    return () => document.removeEventListener("keydown", onkeydown);
  }, []);

  const [picType, setPicType] = React.useState<"stars" | "zus">("stars");

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
      draggable={false}
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
      <PageIndex index={3} />
      <div style={{ padding: "0 20%" }}>
        <div
          style={{
            textAlign: "center",
            width: "100%",
          }}
        >
          <animated.span
            onClick={springQueueNext}
            style={{
              display: "inline-block",
              color: "#fff",
              fontWeight: 800,
              letterSpacing: 2,
              cursor: "pointer",
              ...springTitleProps,
            }}
          >
            Zustand
          </animated.span>
        </div>

        <animated.div style={{ ...springQueueProps[0] }}>
          <ContentCard>
            <div
              onDoubleClick={() => {
                if (!picVisible.current) {
                  setPicType("stars");
                  showPic();
                }
              }}
            >
              zustand 是一个非常时髦的状态管理库，也是 2021 年 Star 增长最快的
              React 状态管理库。
            </div>
          </ContentCard>
        </animated.div>

        <animated.div style={{ ...springQueueProps[1] }}>
          <ContentCard>
            <div
              onDoubleClick={() => {
                if (!picVisible.current) {
                  setPicType("zus");
                  showPic();
                }
              }}
            >
              <div>
                zustand可以与框架无关, 底层是js, 只要是js语言的平台就可以使用.
              </div>
              <div>
                像React, vue, 原生web, 小程序等等框架平台, 底层用的都是js,
                因此zustand都能在这些平台或者框架下使用.
              </div>
            </div>
          </ContentCard>
        </animated.div>
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
          src={
            picType === "stars"
              ? require("../static/stars.png")
              : picType === "zus"
              ? require("../static/zustand.png")
              : ""
          }
        />
      </animated.div>

      <div></div>
    </div>
  );
}

export default Page;
