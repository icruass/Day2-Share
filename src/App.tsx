import React, { useRef } from "react";
import { useSprings, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import _ from "lodash";
import { Pages, Page } from "./components/Pages";
import Menu from "./components/Menu";

export default function App() {
  return (
    <div>
      <Pages>
        <Page>
          <Menu />
        </Page>
        <Page>
          <Menu />
        </Page>
      </Pages>
    </div>
  );
}
