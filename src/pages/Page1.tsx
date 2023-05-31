import React from "react";
import CodeBox from "../components/CodeBox";
import PageIndex from "../components/PageIndex";

function Page1() {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        boxSizing: "border-box",
        padding: 30,
        overflow: "auto",
      }}
    >
      <PageIndex index={1} />
      <CodeBox>{`const a = 2;`}</CodeBox>
    </div>
  );
}

export default Page1;
