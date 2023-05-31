import React from "react";
import CodeBox from "../components/CodeBox";
import { Grid } from "@mui/material";
import ContentCard from "../components/ContentCard";
import PageIndex from "../components/PageIndex";

function Page() {
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
      <PageIndex index={5} />
      <div
        style={{
          display: "inline-block",
          color: "#fff",
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: 2,
        }}
      >
        异步action
      </div>

      <div />
      <ContentCard>
        <div>
          状态管理除了状态共享外,
          另外第二个极其必要的能力就是状态变更。就是改变state,
          在rudux中一般称为action
        </div>
        <div>
          当遇到异步action时, zustand的设计显得比较优雅, 只需在异步回调中 `set`
          即可.
        </div>
      </ContentCard>
      <div />

      <Grid container rowSpacing={5} columnSpacing={5}>
        <Grid item>
          <CodeBox
            style={{
              fontSize: 20,
              width: 550,
              height: 820,
              display: "inline-block",
            }}
          >
            {reduxCode}
          </CodeBox>
        </Grid>

        <Grid item>
          <CodeBox
            style={{
              fontSize: 20,
              width: 750,
              height: 700,
              display: "inline-block",
            }}
          >
            {dvaCode}
          </CodeBox>
        </Grid>

        <Grid item>
          <CodeBox
            style={{
              fontSize: 20,
              width: 700,
              height: 450,
              display: "inline-block",
            }}
          >
            {zustandCode}
          </CodeBox>
        </Grid>
      </Grid>

      <div>
        <ContentCard>
          <div>redux针对同步异步方法需要大量的模板代码</div>
        </ContentCard>

        <div />

        <ContentCard>
          <div>
            在 zustand中,函数可以直接写, 完全不用区分同步或者异步,
            一下子把区分同步异步的心智负担降到了0.
          </div>
        </ContentCard>

        <div />

        <ContentCard>
          <div>
            为什么zustand用起来更简单,代码却更少呢? 得益于zustand的设计,
          </div>
          <div>
            我们可以看到, redux根据模板代码划分state, reducer, action,
            所以redux需要区分action是同步的还是异步的,
            当无法区分异步还是同步函数时, 就要引入额外的中间件来处理异步函数.
          </div>
          <div>
            而zustand不关心异步还是同步函数,
            开发者只需要在合适的时机调用set更新state即可.
          </div>
        </ContentCard>
        <div />
      </div>
    </div>
  );
}

const reduxCode = `// redux处理异步

import { createAsyncThunk, 
  createSlice } from '@reduxjs/toolkit';
import API from '@/services';

// 1. 创建异步函数
const fetchUserById = createAsyncThunk(
  'users/fetchByIdStatus',
  async (userId) => {
    const response = await API.getUser(userId);
    return response.data;
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: { users: [] },
  // 同步的 reducer 方法
  reducers: {

  },
  // 异步的 reducer 方法
  extraReducers: (builder) => {
    // 2. 将异步函数添加到 Slice 中
    builder.addCase(fetchUserById.fulfilled, 
      (state, action) => {
        state.users.push(action.payload)
    })
  },
});

// 3. 调用异步方法
dispatch(fetchUserById(111))`;

const dvaCode = `// umi dva处理异步
reducers: {
  saveMenuAndResource(state, { payload }) {
    return {
      ...state,
      menu: payload.menu,
      resource: payload.resource,
    };
  },
  saveLoginInfoM(state, { payload }) {
    return {
      ...state,
      loginInfoM: payload,
    };
  },
},
effects: {
  *fetchMenu(_, { call, put }) {
    const response = yield call(() => getApiAuthResourceMenutree());
    if (response.data) {
      const menu = response.data.filter((item) => item.type === 0);
      const resource = response.data.filter((item) => item.type === 1);
      yield put({
        type: 'saveMenuAndResource',
        payload: { menu, resource },
      });
    }
  }`;

const zustandCode = `// zustand处理异步

import { create } from 'zustand';
import API from '@/services';

const getState = (set, get) => {
  return {
    users: [],
    fetchUserById: async (userId) => {
      const response = await API.getUser(userId);
      const { users } = get();
      set({ users: users.concat([response.data]) })
    },
  };
};

export const useUsersStore = create(getState);`;

export default Page;
