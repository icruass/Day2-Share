import React from "react";
import CodeBox from "../components/CodeBox";
import { Grid, Button } from "@mui/material";
import ContentCard from "../components/ContentCard";
import PageIndex from "../components/PageIndex";

function Page() {
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
      <PageIndex index={7} />
      <div
        style={{
          display: "inline-block",
          color: "#fff",
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: 2,
        }}
      >
        中间件
      </div>

      <div />
      <ContentCard>
        <div>
          {`在redux中,提供了类似后端 Express 的中间件概念，
          本质的目的是提供第三方插件的模式，自定义拦截 action -> reducer 的过程。
          变为 action -> middlewares -> reducer 。这种机制可以让我们改变数据流，
          实现如异步 action ，action 过滤，日志输出，异常报告等功能。`}
        </div>
      </ContentCard>
      <div />
      <ContentCard>
        <div>
          我理解的中间件就是在设计当初, 在set数据和get数据之前和之后,
          留下了可操作空间, 给第三方插件操作数据, 利用数据的能力.
        </div>
      </ContentCard>
      <div />
      <ContentCard>
        <div>zustand也支持中间件. 自带了persist, devtools, immer等中间件.</div>
      </ContentCard>
      <div />

      <Grid container rowSpacing={5} columnSpacing={5}>
        <Grid item>
          <CodeBox
            style={{
              fontSize: 20,
              width: 450,
              height: 550,
              display: "inline-block",
            }}
          >
            {persistCode}
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
            persist这个中间件,
            将store里的state同步到浏览器的本地存储localstorage或sessionStorage,
            可以将数据持久化存储
          </div>
          <div>
            在实际项目中, 我们用这个可以达到页面的数据缓存, 切换页面数据不丢失.
            缓存搜索条件等等.
          </div>
        </ContentCard>
        <div />
      </div>
    </div>
  );
}

import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";

const getState = (set, get) => ({
  count: 0,
  addCount: () => set({ count: get().count + 1 }),
});

export const useCountStore = create(
  devtools(
    persist(getState, {
      name: "count-storage",
      storage: createJSONStorage(() => sessionStorage),
    })
  )
);

const persistCode = `// 中间件persist

import { create } from "zustand";
import { persist, createJSONStorage
 } from "zustand/middleware";

const getState = (set, get) => ({
  count: 0,
  addCount: () => {
    const oldCount = get().count;
    set({ count: oldCount + 1 });
  },
});

export const useCountStore = create(
  persist(getState, {
    name: "count-storage",
    storage: createJSONStorage(() => {
      return sessionStorage;
    }),
  })
);`;

export default Page;
