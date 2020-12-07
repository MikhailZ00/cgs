import * as React from "react";
import {
	BrowserRouter as Router,
	Route
} from 'react-router-dom';
import { MainPage } from 'pages/main-page'

import './app.scss';


export const App = (): React.ReactElement => {




	return (
		<div className='app'>
			<div>
				<Router>
					<Route path="/" exact render={() => ( <MainPage /> )} />
				</Router>
			</div>
		</div>
	)
}
