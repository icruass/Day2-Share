import React from 'react';
import CodeBox from '../components/CodeBox';
import { Grid, Button } from '@mui/material';
import ContentCard from '../components/ContentCard';
import PageIndex from '../components/PageIndex';
import { animated, useSpring, useSprings } from '@react-spring/web';
import theme from '../components/Pages/theme';

function Page4() {
	const count = useCountStore((state) => state.count);
	const addCount = useCountStore((state) => state.addCount);
	const [titleSpringed, setTitleSpringed] = React.useState(false);

	const springTitleProps = useSpring({
		position: 'fixed',
		fontSize: titleSpringed ? 40 : 100
	} as any);

	const queueCount = 4;
	const queueIndex = React.useRef(0);
	const [springQueueProps, springQueueApi] = useSprings(queueCount, () => {
		return { display: 'none', opacity: 0 };
	});

	const springQueueNext = () => {
		setTitleSpringed(true);

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
			<PageIndex index={4} />
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
						...springTitleProps,
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
						})
					}}
				>
					基本使用
				</animated.span>
			</div>
			<div>
				<Grid container columnSpacing={5} rowSpacing={5}>
					<Grid item>
						<animated.div style={{ ...springQueueProps[0] }}>
							<CodeBox
								style={{
									fontSize: 20,
									width: 500,
									height: 470,
									display: 'inline-block'
								}}
							>
								{storeCode}
							</CodeBox>
						</animated.div>
					</Grid>

					<Grid item>
						<animated.div style={{ ...springQueueProps[1] }}>
							<CodeBox
								style={{
									fontSize: 20,
									width: 700,
									height: 470,
									display: 'inline-block'
								}}
							>
								{useStoreCode}
							</CodeBox>
						</animated.div>
					</Grid>

					<Grid item>
						<animated.div style={{ ...springQueueProps[2] }}>
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
			</div>

			<div>
				<animated.div style={{ ...springQueueProps[3] }}>
					<ContentCard>
						<div>api `create` 函数返回的是一个react hook函数, 只能在react函数组件中执行.</div>
					</ContentCard>

					<div />

					<ContentCard>
						<div>`get` 获取 store 瞬时值, `set` 修改store中的state</div>
					</ContentCard>

					<div />

					<ContentCard>
						<div>state可以是一般的值, 对象, 也可以是函数, 普通函数或者异步函数都可以,zustand不关心这个, 它只关心你如何 `set` , `get` .</div>
					</ContentCard>

					<div />
				</animated.div>
			</div>
		</div>
	);
}

import { create } from 'zustand';

const getState = (set, get) => {
	return {
		count: 0,
		addCount: () => {
			let { count } = get();
			set({ count: count + 1 });
		}
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
