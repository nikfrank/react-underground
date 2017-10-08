import underground from '../src/';

import React from 'react';

import { mount } from 'enzyme';

import Blackjack from '../canon/blackjack/src/App';

const { it, expect } = global;

it('runs the app', ()=>{

  const App = underground(Blackjack, Blackjack.initialState);
  
  const app = mount(<App />);
  
  expect( typeof app ).toEqual( 'object' );

  
});


