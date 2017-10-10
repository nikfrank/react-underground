import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import underground, { UgLogger } from 'react-underground';

ReactDOM.render(
  <UgLogger Component={underground(App)} />,
  document.getElementById('root')
);
registerServiceWorker();
