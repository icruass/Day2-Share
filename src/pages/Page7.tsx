import React from 'react';
import CodeBox from '../components/CodeBox';
import { Grid, Button } from '@mui/material';
import ContentCard from '../components/ContentCard';
import PageIndex from '../components/PageIndex';
import { animated, useSpring, useSprings } from '@react-spring/web';
import theme from '../components/Pages/theme';

function Page() {
	const count = useCountStore((state) => state.count);
	const addCount = useCountStore((state) => state.addCount);

	const [titleSpringed, setTitleSpringed] = React.useState(false);

	const springTitleProps = useSpring({
		position: 'fixed',
		fontSize: titleSpringed ? 40 : 100
	} as any);

	const queueCount = 6;
	const queueIndex = React.useRef(0);
	const [springQueueProps, springQueueApi] = useSprings(queueCount, () => {
		return { display: 'none', opacity: 0 };
	});

	const springTitleLeave = () => {
		setTitleSpringed(true);
	};

	const springQueueNext = () => {
		springTitleLeave();

		springQueueApi.start((i) => {
			if (i === queueIndex.current) {
				return { display: 'block', opacity: 1 };
			}
		});
		if (queueIndex.current < queueCount - 1) {
			queueIndex.current++;
		}
	};

	const springQueueBack = () => {
		springQueueApi.start((i) => {
			if (i === queueIndex.current) {
				return { display: 'none', opacity: 0 };
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
		document.addEventListener('keydown', onkeydown);
		return () => document.removeEventListener('keydown', onkeydown);
	}, []);

	return (
		<div
			style={{
				height: '100%',
				width: '100%',
				boxSizing: 'border-box',
				padding: 30,
				paddingBottom: 400,
				overflow: 'auto'
			}}
		>
			<PageIndex index={7} />
			<div
				style={{
					...(titleSpringed && {
						height: 90
					})
				}}
			>
				<animated.span
					onClick={springQueueNext}
					style={{
						display: 'inline-block',
						color: '#fff',
						fontWeight: 800,
						letterSpacing: 2,
						marginBottom: 20,
						cursor: 'pointer',
						top: titleSpringed ? '0px' : '30%',
						left: titleSpringed ? '30px' : '50%',
						zIndex: 1,
						transform: titleSpringed ? 'none' : 'translateX(-50%)',
						...(titleSpringed && {
							width: '100%',
							background: theme.primary.page.background,
							boxShadow: theme.primary.page.boxShadow,
							padding: 20,
							borderRadius: 10
						}),
						...springTitleProps
					}}
				>
					中间件
				</animated.span>
			</div>

			<div />
			<animated.div style={{ ...springQueueProps[0] }}>
				<ContentCard>
					<div>
						{`在redux中,提供了类似后端 Express 的中间件概念，
          本质的目的是提供第三方插件的模式，自定义拦截 action -> reducer 的过程。
          变为 action -> middlewares -> reducer 。这种机制可以让我们改变数据流，
          实现如异步 action ,action 过滤，日志输出，异常报告等功能。`}
					</div>
				</ContentCard>
			</animated.div>

			<div />
			<animated.div style={{ ...springQueueProps[1] }}>
				<ContentCard>
					<div>我理解的中间件就是在设计当初, 在set数据和get数据之前和之后, 留下了可操作空间, 给第三方插件操作数据, 利用数据的能力.</div>
				</ContentCard>
			</animated.div>

			<div />
			<animated.div style={{ ...springQueueProps[2] }}>
				<ContentCard>
					<div>zustand也支持中间件. 自带了persist, devtools, immer等中间件.</div>
				</ContentCard>
			</animated.div>
			<div />

			<Grid container rowSpacing={5} columnSpacing={5}>
				<Grid item>
					<animated.div style={{ ...springQueueProps[3] }}>
						<CodeBox
							style={{
								fontSize: 20,
								width: 450,
								height: 550,
								display: 'inline-block'
							}}
						>
							{persistCode}
						</CodeBox>
					</animated.div>
				</Grid>

				<Grid item>
					<animated.div style={{ ...springQueueProps[4] }}>
						<div
							style={{
								background: '#394a52',
								color: '#fff',
								padding: 20,
								borderRadius: '10px'
							}}
						>
							<div
								style={{
									textAlign: 'center',
									fontSize: 30,
									marginTop: 10,
									marginBottom: 20
								}}
							>
								{count}
							</div>
							<Button
								style={{
									backgroundColor: 'transparent',
									borderRadius: 5,
									color: '#fff',
									border: '1px solid #fff',
									padding: '4px 10px',
									cursor: 'pointer',
									textTransform: 'none'
								}}
								onClick={() => {
									addCount();
								}}
							>
								Add Count
							</Button>
						</div>
					</animated.div>
				</Grid>
			</Grid>

			<div>
				<animated.div style={{ ...springQueueProps[5] }}>
					<ContentCard>
						<div>persist这个中间件, 将store里的state同步到浏览器的本地存储localstorage或sessionStorage, 可以将数据持久化存储</div>
						<div>在实际项目中, 我们用这个可以达到页面的数据缓存, 切换页面数据不丢失. 缓存搜索条件等等.</div>
					</ContentCard>
				</animated.div>
				<div />
			</div>
		</div>
	);
}

import { create } from 'zustand';
import { persist, devtools, createJSONStorage } from 'zustand/middleware';

const getState = (set, get) => ({
	count: 0,
	addCount: () => set({ count: get().count + 1 })
});

export const useCountStore = create(
	devtools(
		persist(getState, {
			name: 'count-storage',
			storage: createJSONStorage(() => sessionStorage)
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
