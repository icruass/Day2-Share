import React from 'react';
import { Pages, Page } from './components/Pages';

import { usePagesStore } from './components/Pages/store';

export default function App() {
	return (
		<div>
			<Pages>
				<Page>
					<div onClick={() => usePagesStore.getState().navigationTo(1)}>next page</div>
				</Page>
				<Page>2</Page>
			</Pages>
		</div>
	);
}
