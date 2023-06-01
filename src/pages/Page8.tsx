import React from 'react';
import CodeBox from '../components/CodeBox';
import { Grid, Button, TextField } from '@mui/material';
import ContentCard from '../components/ContentCard';
import PageIndex from '../components/PageIndex';
import { animated, useSpring, useSprings } from '@react-spring/web';
import theme from '../components/Pages/theme';

function Page() {
	const [spring6Animated, setSpring6Animated] = React.useState(false);
	const [titleSpringed, setTitleSpringed] = React.useState(false);

	const springTitleProps = useSpring({
		position: 'fixed',
		fontSize: titleSpringed ? 40 : 100
	} as any);

	const queueCount = 7;
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
			if (queueIndex.current === 6) {
				setSpring6Animated(true);
			}
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
			<PageIndex index={8} />

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
					发布订阅模式
				</animated.span>
			</div>

			<div />
			<animated.div style={{ ...springQueueProps[0] }}>
				<ContentCard>
					<div>发布 - 订阅模式 (Publish-Subscribe Pattern, pub-sub)又叫观察者模式(Observer Pattern)</div>
					<div>它定义了一种一对多的关系，让多个订阅者对象同时监听某一个发布者,</div>
					<div>这个主题对象的状态发生变化时就会通知所有订阅自己的订阅者对象，使得它们能够自动更新自己.</div>
				</ContentCard>
			</animated.div>

			<div />
			<animated.div style={{ ...springQueueProps[1] }}>
				<ContentCard>
					<div>生活中的发布订阅模式</div>
					<div>当我们进入一个聊天室 / 群，如果有人在聊天室发言，那么这个聊天室里的所有人都会收到这个人的发言。</div>
					<div>这是一个典型的发布 -订阅模式，当我们加入了这个群，相当于订阅了在这个聊天室发送的消息，</div>
					<div>当有新的消息产生，聊天室会负责将消息发布给所有聊天室的订阅者。</div>
				</ContentCard>
			</animated.div>

			<div />
			<animated.div style={{ ...springQueueProps[2] }}>
				<ContentCard>
					<div>我们来看看Zustand源码, 它的核心代码之一就是应用了发布订阅模式, 了解发布订阅模式有利于我们了解zustand的原理.</div>
				</ContentCard>
			</animated.div>

			<div />
			<animated.div style={{ ...springQueueProps[3] }}>
				<ContentCard>
					<div>让我们用js来手搓一个发布订阅模式, 加深理解</div>
				</ContentCard>
			</animated.div>
			<div />

			<Grid container rowSpacing={5} columnSpacing={5}>
				<Grid item {...(spring6Animated && { xs: 12 })}>
					<animated.div style={{ ...springQueueProps[4] }}>
						<CodeBox
							style={{
								fontSize: 20,
								width: 'auto',
								height: 'auto',
								display: 'inline-block'
							}}
						>
							{pupSubCode}
						</CodeBox>
					</animated.div>
				</Grid>

				<Grid item>
					<animated.div style={{ ...springQueueProps[5] }}>
						<div style={{ position: 'relative', height: 660 }}>
							<CodeBox
								style={{
									fontSize: 20,
									width: 'auto',
									height: '100%',
									display: 'inline-block'
								}}
							>
								{pubCode}
							</CodeBox>
							<div style={{ position: 'absolute', left: 120, bottom: 20 }}>
								<PubComp />
							</div>
						</div>
					</animated.div>
				</Grid>

				<Grid item>
					<animated.div style={{ ...springQueueProps[6] }}>
						<div style={{ position: 'relative', height: 620 }}>
							<CodeBox
								style={{
									fontSize: 20,
									width: 800,
									height: 620,
									display: 'inline-block'
								}}
							>
								{subCode}
							</CodeBox>
							<div
								style={{
									position: 'absolute',
									width: 300,
									height: '100%',
									top: 0,
									right: 0
								}}
							>
								<SubComp />
							</div>
						</div>
					</animated.div>
				</Grid>
			</Grid>
		</div>
	);
}

const pupSubCode = `// js实现一个发布订阅模式
class PubSub {
  private subscriptions = new Set();

  publish = function(val) {
    for (const sub of this.subscriptions) {
      sub(val);
    }
  };

  subscribe = function(callback){
    function subscribe(val) {
      if (callback) {
        callback(val);
      }
    };
    this.subscriptions.add(subscribe);

    function unSubscribe(){
      this.subscriptions.delete(subscribe);
    };

    return unSubscribe;
  };
}
export const PubSubInstance = new PubSub();
export default PubSub;`;

const pubCode = ` // 发布消息组件
import PubSubInstance from './PubSub';

const PubComp = () => {
  const [value, setValue] = React.useState('');

  const onChange = (e) => setValue(e.target.value);

  const pubMsg = () => PubSubInstance.publish(value);

 return (
  <div>
    <TextField value={value} onChange={onChange} />
    <Button onClick={pubMsg}>发布</Button>
  </div>
 );
};`;

const subCode = ` // 接收消息组件
import PubSubInstance from './PubSub';

const PubComp = () => {
  const [subV, setSubV] = React.useState([]);

  React.useEffect(() => {
    const unsubscribe = PubSubInstance.subscribe(
      (val) => {
        if (val) {
          setSubV((pre) => [val, ...pre]);
        };
      });
    return () => {
      unsubscribe();
    };
  }, []);

 return (
  <div>
    <div>我收到消息啦</div>
    <List value={subV} />
  </div>
 );
};`;

type Subscription<T> = (val: T) => void;
class PubSub<T> {
	private subscriptions = new Set<Subscription<T>>();

	publish = function (val: T) {
		for (const subscription of this.subscriptions) {
			subscription(val);
		}
	};

	subscribe = function (callback: Subscription<T>) {
		function subscription(val: T) {
			if (callback) {
				callback(val);
			}
		}
		this.subscriptions.add(subscription);

		const unsubscribe = () => {
			this.subscriptions.delete(subscription);
		};
		return unsubscribe;
	};
}
const PubSubInstance = new PubSub();

const PubComp = () => {
	const [value, setValue] = React.useState('');

	return (
		<div
			style={{
				background: '#394a52',
				color: '#fff',
				padding: 20,
				borderRadius: '10px'
			}}
		>
			<TextField
				onPointerDown={(e) => e.stopPropagation()}
				label="输入消息"
				variant="filled"
				fullWidth
				value={value}
				onChange={(e) => {
					setValue(e.target.value);
				}}
				sx={{
					'& input, & label': { color: '#fff !important' },
					'& .MuiInputBase-root input': { paddingTop: '32px !important' },
					'& .MuiInputBase-root:after': {
						borderColor: '#fff !important'
					}
				}}
			/>
			<Button
				style={{
					marginTop: 20,
					backgroundColor: 'transparent',
					borderRadius: 5,
					color: '#fff',
					border: '1px solid #fff',
					padding: '4px 10px',
					cursor: 'pointer',
					textTransform: 'none'
				}}
				onClick={() => {
					PubSubInstance.publish(value);
				}}
			>
				发布
			</Button>
		</div>
	);
};

const SubComp = () => {
	const [subV, setSubV] = React.useState([]);

	React.useEffect(() => {
		const unSub = PubSubInstance.subscribe((val) => {
			if (val) {
				setSubV((pre) => [val, ...pre]);
			}
		});
		return () => {
			unSub();
		};
	}, []);

	return (
		<div
			style={{
				boxSizing: 'border-box',
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
				padding: 30
			}}
		>
			{subV.length > 0 && (
				<div style={{ marginBottom: 20 }} onDoubleClick={() => setSubV([])}>
					我收到消息啦:
				</div>
			)}
			<div
				style={{
					flex: 1,
					minHeight: 0,
					overflowX: 'hidden',
					paddingRight: '20px',
					boxSizing: 'border-box'
				}}
				className={`scroll-beauty-primary`}
			>
				{subV.map((item, i) => {
					return (
						<div key={i}>
							<span
								style={{
									boxShadow: 'rgb(0 0 0 / 100%) 0px 1px 2px 0px',
									lineHeight: 1.5,
									fontSize: 14,
									color: '#fff',
									padding: '6px 20px',
									boxSizing: 'border-box',
									maxWidth: '100%',
									wordBreak: 'break-all',
									borderRadius: '20px',
									display: 'inline-block',
									//   background: "linear-gradient(135deg, #ccc 0%, #c3cfe2 100%)",
									marginBottom: 20
								}}
							>
								{item}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Page;
