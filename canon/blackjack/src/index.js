import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import underground, { UgLogger } from 'react-underground';

ReactDOM.render(
  <UgLogger Component={underground(App)} initialState={App.initialState}/>,
  document.getElementById('root')
);
registerServiceWorker();
