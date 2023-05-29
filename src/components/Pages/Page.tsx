import React from 'react';
import type { PagesProps } from './Pages';

import { animated } from '@react-spring/web';

import theme from './theme';

import { usePagesStore } from './store';

export type PageProps = {
	name?: string;
	index?: number;
	bgColor?: string;
	children?: any;
	dragStyle?: any;
	dragBindProps?: any;
	themeType?: PagesProps['themeType'];
};

function Page(props: PageProps) {
	const { dragBindProps, dragStyle, bgColor, children, themeType } = props;

	React.useLayoutEffect(() => {
		const { name, index } = props;
		usePagesStore.getState().registerPage({ name, index });
	}, []);

	const style = {
		boxSizing: 'border-box',
		display: 'block',
		position: 'absolute',
		width: '100%',
		height: '100%',
		touchAction: 'none',
		...dragStyle,
		background: theme[themeType]?.page?.background || bgColor,
		boxShadow: theme[themeType]?.page?.boxShadow
	};

	return (
		<animated.div {...dragBindProps} style={style}>
			{children}
		</animated.div>
	);
}

export default Page;
