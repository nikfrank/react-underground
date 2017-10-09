import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import underground from 'react-underground';

const AppG = underground( App );

const onDispatch = (...a)=> console.log('D', ...a);
const onAction = (...a)=> console.log('A', ...a);
const onTrigger = (...a)=> console.log('T', ...a);
const onDecays = (...a)=> console.log('Y', ...a);
const onHook = (...a)=> console.log('H', ...a);

ReactDOM.render(
  <AppG
      initialState={App.initialState}
      onDispatch={onDispatch}
      onAction={onAction}
      onTrigger={onTrigger}
      onDecays={onDecays}
      onHook={onHook}
  />,
  document.getElementById('root')
);
registerServiceWorker();
