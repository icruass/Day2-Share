import React from "react";
import { animated, useSpring } from "@react-spring/web";

import ContentCard from "../components/ContentCard";
import PageIndex from "../components/PageIndex";

function Page() {
  const [springProps, springApi] = useSpring(() => ({
    from: { top: "90%" },
  }));

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
            marginTop: 100,
          }}
        >
          <span
            style={{
              display: "inline-block",
              color: "#fff",
              fontWeight: 800,
              fontSize: 60,
              letterSpacing: 2,
            }}
          >
            Zustand
          </span>
        </div>

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
