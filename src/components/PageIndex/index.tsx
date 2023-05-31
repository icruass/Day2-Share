import React from "react";

function PageIndex(props: { index?: number }) {
  return (
    <div
      style={{
        position: "fixed",
        zIndex: 1,
        left: 0,
        top: 0,
        height: 50,
        width: 45,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          zIndex: 1,
          left: -20,
          top: -20,
          height: 50,
          width: 45,
          background: "#fff",
          color: "#222",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            position: "relative",
            left: 6,
            top: 6,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {props.index || 1}
        </span>
      </div>
    </div>
  );
}

export default PageIndex;
