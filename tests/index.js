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

  expect(actionCreatorButtons.length).toEqual( 2 );

  const button = actionCreatorButtons.first();

  button.simulate('click');

  expect( onAction.mock.calls ).toHaveLength( 1 );
  
});


it('triggers reducers from the action', ()=>{
  const App = underground(Blackjack, Blackjack.initialState);
  const app = mount(<App />);

  expect( app.state() ).toEqual( Blackjack.initialState );
  
  const button = app.find('button').first();
  button.simulate('click');

  expect( app.state() ).toEqual(
    Blackjack
      .reducers['start'](
        Blackjack.initialState,
        Blackjack.actions['start']()
      )
  );
});


it('triggers a timeout hook', (done)=>{
  const App = underground(Blackjack, Blackjack.initialState);

  let waitStarted, stateUpdated = false, waitWaited = false;
  
  const onAction = a=>{
    if( 'hook' in a )
      waitStarted = (new Date()).getTime();
  };

  const onDispatch = a=> {
    if( a.reducer === 'update'){
      try{
        expect( (new Date()).getTime() - waitStarted ).toBeGreaterThan( 1000 );
      }catch(e){
        return done(e);
      }
      waitWaited = true;

      if( stateUpdated && waitWaited ) done();
    }
  };
  
  const app = mount(<App onAction={onAction} onDispatch={onDispatch}/>);

  expect( app.state() ).toEqual( Blackjack.initialState );
  
  const button = app.find('button').at(1);
  button.simulate('click');

  expect( app.state() ).toEqual( Blackjack.initialState );

  setTimeout(()=> {
    app.update();
    
    try{
      expect( app.state() ).toEqual(
        Blackjack
          .reducers['update'](
            Blackjack.initialState,
            Blackjack.actions['update']()
          )
      );
    }catch(e){
      return done(e);
    }

    stateUpdated = true;
    if( stateUpdated && waitWaited ) done();
  }, 1100);
});
