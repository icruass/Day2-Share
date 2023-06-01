import React from "react";
import { Highlight } from "prism-react-renderer";

import styles from "./index.less";

export type CodeBoxProps = React.HTMLProps<HTMLPreElement> & {
  children?: any;
};

function CodeBox(props: CodeBoxProps) {
  const { children = "", style } = props;

  return (
    <Highlight code={children} language="tsx">
      {({ tokens, getLineProps, getTokenProps }) => (
        <pre className={styles.preBox} style={style}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}

export default CodeBox;
