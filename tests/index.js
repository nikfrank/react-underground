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


it('binds the action creators', ()=>{
  const App = underground(Blackjack, Blackjack.initialState);

  const onAction = jest.fn();
  
  const app = mount(<App onAction={onAction}/>);

  const actionCreatorButtons = app.find('button');

  expect(actionCreatorButtons.length).toEqual( 1 );

  const button = actionCreatorButtons.first();

  button.simulate('click');

  expect( onAction.mock.calls ).toHaveLength( 1 );
  
});


