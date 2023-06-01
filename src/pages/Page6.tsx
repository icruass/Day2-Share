import React from 'react';
import CodeBox from '../components/CodeBox';
import { Grid } from '@mui/material';
import ContentCard from '../components/ContentCard';
import PageIndex from '../components/PageIndex';
import { animated, useSpring, useSprings } from '@react-spring/web';
import theme from '../components/Pages/theme';

function Page() {
	const [titleSpringed, setTitleSpringed] = React.useState(false);

	const springTitleProps = useSpring({
		position: 'fixed',
		fontSize: titleSpringed ? 40 : 100
	} as any);

	const queueCount = 5;
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
			<PageIndex index={6} />
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
					派生状态
				</animated.span>
			</div>

			<div />
			<animated.div style={{ ...springQueueProps[0] }}>
				<ContentCard>
					<div>状态派生是在实际场景中被大量使用的东西，这理应也是状态管理的一环。</div>
				</ContentCard>
				<div />
				<ContentCard>
					<div>状态派生可以很简单,也可以非常复杂。举个简单的栗子,比如基于name 字段和id, 拼接出对应的 url .</div>
				</ContentCard>
			</animated.div>
			<div />

			<Grid container rowSpacing={5} columnSpacing={5}>
				<Grid item>
					<animated.div style={{ ...springQueueProps[1] }}>
						<CodeBox
							style={{
								fontSize: 20,
								width: 450,
								height: 660,
								display: 'inline-block'
							}}
						>
							{vueCode}
						</CodeBox>
					</animated.div>
				</Grid>

				<Grid item>
					<animated.div style={{ ...springQueueProps[2] }}>
						<CodeBox
							style={{
								fontSize: 20,
								width: 500,
								height: 660,
								display: 'inline-block'
							}}
						>
							{reactCode}
						</CodeBox>
					</animated.div>
				</Grid>

				<Grid item>
					<animated.div style={{ ...springQueueProps[3] }}>
						<CodeBox
							style={{
								fontSize: 20,
								width: 700,
								height: 660,
								display: 'inline-block'
							}}
						>
							{zustandCode}
						</CodeBox>
					</animated.div>
				</Grid>
			</Grid>

			<div>
				<animated.div style={{ ...springQueueProps[4] }}>
					<ContentCard>
						<div>zustand 用了类似 redux selector 的方法，实现相应的状态派生</div>
						<div>selector就是选择细颗粒度的state, 来实现最细颗粒度下的state变化更新视图达到性能优化</div>
					</ContentCard>
				</animated.div>
				<div />
			</div>
		</div>
	);
}

const vueCode = `// vue计算属性

<template>
  <img :src="url" />
</template>

<script>
  export default {
    data(){
      return {
        name: '',
        id: '',
      },
    },

    computed: {
      url(){
        return this.name + this.id;
      }
    }
  };
</script>`;

const reactCode = `// react useMemo缓存.

import React from 'react';

function Comp(){
  const [name, setName] = React.useState('');
  const [id, setId] = React.useState('');

  const url = React.useMemo(()=>{
    return name + id;
  }, [name, id]);

  return <img src={url} />;
};

export default Comp;
`;

const zustandCode = `// zustand selector

// store.ts
import { create } from 'zustand';

export const selectorUrl = (state) => {
  return state.name + state.id;
};

const getState = (set, get) => {
  return {
    name: '',
    id: '',
  };
};

export const useMyStore = create(getState);

// Comp.tsx
import { useMyStore, selectorUrl } from "./store"

function Comp(){
  const url = useMyStore(s => selectorUrl(s));
  return <img src={url} />
};

export default Comp;`;

export default Page;
