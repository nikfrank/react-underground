import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import underground from 'react-underground';

const AppG = underground( App );

const onDispatch = (...a)=> console.log('dis', ...a);
const onAction = (...a)=> console.log('act', ...a);

ReactDOM.render(
  <AppG
      initialState={App.initialState}
      onDispatch={onDispatch}
      onAction={onAction}/>,
  document.getElementById('root')
);
registerServiceWorker();
