import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import underground from 'react-underground';

const AppG = underground( App, App.initialState );

ReactDOM.render(<AppG />, document.getElementById('root'));
registerServiceWorker();
