import React from "react";
import { Pages, Page } from "./components/Pages";

import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";
import Page3 from "./pages/Page3";
import Page4 from "./pages/Page4";
import Page5 from "./pages/Page5";
import Page6 from "./pages/Page6";
import Page7 from "./pages/Page7";
import Page8 from "./pages/Page8";
import Page9 from "./pages/Page9";
import Page10 from "./pages/Page10";
import Page11 from "./pages/Page11";
import ZustandWebsite from "./pages/ZustandWebsite";

export default function App() {
  return (
    <div>
      <Pages>
        <Page>
          <Page1 />
        </Page>

        <Page>
          <Page2 />
        </Page>

        <Page>
          <Page3 />
        </Page>

        <Page>
          <Page4 />
        </Page>

        <Page>
          <Page5 />
        </Page>

        <Page>
          <Page6 />
        </Page>

        <Page>
          <Page7 />
        </Page>

        <Page>
          <Page8 />
        </Page>

        <Page>
          <Page9 />
        </Page>

        <Page>
          <Page10 />
        </Page>

        <Page>
          <Page11 />
        </Page>
      </Pages>

      <ZustandWebsite />
    </div>
  );
}
