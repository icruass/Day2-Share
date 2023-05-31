import React from "react";
import CodeBox from "../components/CodeBox";
import { Grid, Button } from "@mui/material";
import ContentCard from "../components/ContentCard";
import PageIndex from "../components/PageIndex";

function Page4() {
  const count = useCountStore((state) => state.count);
  const addCount = useCountStore((state) => state.addCount);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        boxSizing: "border-box",
        padding: 30,
        paddingBottom: 200,
        overflow: "auto",
      }}
    >
      <PageIndex index={4} />
      <Grid container rowSpacing={5} columnSpacing={5}>
        <Grid item>
          <CodeBox
            style={{
              fontSize: 20,
              width: 500,
              height: 470,
              display: "inline-block",
            }}
          >
            {storeCode}
          </CodeBox>
        </Grid>

        <Grid item>
          <CodeBox
            style={{
              fontSize: 20,
              width: 700,
              height: 470,
              display: "inline-block",
            }}
          >
            {useStoreCode}
          </CodeBox>
        </Grid>

        <Grid item>
          <div
            style={{
              background: "#394a52",
              color: "#fff",
              padding: 20,
              borderRadius: "10px",
            }}
          >
            <div
              style={{
                textAlign: "center",
                fontSize: 30,
                marginTop: 10,
                marginBottom: 20,
              }}
            >
              {count}
            </div>
            <Button
              style={{
                backgroundColor: "transparent",
                borderRadius: 5,
                color: "#fff",
                border: "1px solid #fff",
                padding: "4px 10px",
                cursor: "pointer",
                textTransform: "none",
              }}
              onClick={() => {
                addCount();
              }}
            >
              Add Count
            </Button>
          </div>
        </Grid>
      </Grid>

      <div>
        <ContentCard>
          <div>
            api `create` 函数返回的是一个react hook函数,
            只能在react函数组件中执行.
          </div>
        </ContentCard>

        <div />

        <ContentCard>
          <div>`get` 获取 store 瞬时值, `set` 修改store中的state</div>
        </ContentCard>

        <div />

        <ContentCard>
          <div>
            state可以是一般的值, 对象, 也可以是函数,
            普通函数或者异步函数都可以,zustand不关心这个, 它只关心你如何 `set` ,
            `get` .
          </div>
        </ContentCard>

        <div />
      </div>
    </div>
  );
}

import { create } from "zustand";

const getState = (set, get) => {
  return {
    count: 0,
    addCount: () => {
      let { count } = get();
      set({ count: count + 1 });
    },
  };
};

const useCountStore = create(getState);

const storeCode = `// store.ts文件

import { create } from 'zustand';

const getState = (set, get) => {
  return {
    count: 0,
    addCount: () => {
      const { count } = get();
      set({ count: count + 1 });
    },
  };
};

const useCountStore = create(getState);

export { useCountStore };`;

const useStoreCode = `// count.tsx组件
import { useCountStore } from './store';

function Count(){
  const count = useCountStore(state => state.count);
  const addCount = useCountStore(state => state.addCount);

  return (
    <div>
      <div>{count}</div>
      <div onClick={addCount}>Add Count</div>
    </div>
  )
};

export default Count;`;

export default Page4;
