import React from 'react';
import CodeBox from '../components/CodeBox';
import { Grid, Button, TextField } from '@mui/material';
import ContentCard from '../components/ContentCard';
import PageIndex from '../components/PageIndex';

function Page() {
	React.useEffect(() => {
		const unSub = PubSubInstance.subscribe((val) => {
			alert(val);
		});
		return () => {
			unSub();
		};
	}, []);

	return (
		<div
			style={{
				height: '100%',
				width: '100%',
				boxSizing: 'border-box',
				padding: 30,
				paddingBottom: 200,
				overflow: 'auto'
			}}
		>
			<PageIndex index={8} />
			<div
				style={{
					display: 'inline-block',
					color: '#fff',
					fontWeight: 800,
					fontSize: 30,
					letterSpacing: 2
				}}
			>
				发布订阅模式
			</div>

			<div />
			<ContentCard>
				<div>发布 - 订阅模式 (Publish-Subscribe Pattern, pub-sub)又叫观察者模式(Observer Pattern)</div>
				<div>它定义了一种一对多的关系，让多个订阅者对象同时监听某一个发布者,</div>
				<div>这个主题对象的状态发生变化时就会通知所有订阅自己的订阅者对象，使得它们能够自动更新自己.</div>
			</ContentCard>
			<div />
			<ContentCard>
				<div>我们来看看Zustand源码, 它的核心代码之一就是应用了发布订阅模式, 了解发布订阅模式有利于我们了解zustand的原理.</div>
			</ContentCard>
			<div />
			<ContentCard>
				<div>生活中的发布订阅模式</div>
				<div>当我们进入一个聊天室 / 群，如果有人在聊天室发言，那么这个聊天室里的所有人都会收到这个人的发言。</div>
				<div>这是一个典型的发布 -订阅模式，当我们加入了这个群，相当于订阅了在这个聊天室发送的消息，</div>
				<div>当有新的消息产生，聊天室会负责将消息发布给所有聊天室的订阅者。</div>
			</ContentCard>

			<div />
			<ContentCard>
				<div>让我们用js来手搓一个发布订阅模式, 加深理解</div>
			</ContentCard>
			<div />

			<Grid container rowSpacing={5} columnSpacing={5}>
				<Grid item>
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
				</Grid>

				<Grid item>
					<PubComp />
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
		console.log(this);
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
					'& .MuiInputBase-root input': { paddingTop: '22px !important' },
					'& .MuiInputBase-root.Mui-focused input': { paddingTop: '32px !important' },
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

export default Page;
