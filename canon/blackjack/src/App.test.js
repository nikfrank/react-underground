import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { mount } from 'enzyme';

import underground from 'react-underground';

const UgApp = underground(App);

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<UgApp initialState={App.initialState}/>, div);
});


it('deals the hand from decays', ()=>{
  // mount the component HOCd
  // pass in an initial state of empty cards

  // expect that the state will update via async decay
  // expect that the state will stabilize at { cp.length: 1, p.length: 2 }
});
