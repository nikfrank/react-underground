import React from 'react';
import ReactDOM from 'react-dom';
import App, { initialState } from './App';

import { mount } from 'enzyme';

import underground from '../../../src/';

it('renders without crashing', () => {
  const p = mount(<App/>);

  expect(p.find('h2').at(0).text()).toEqual( initialState.blah );
  
});
