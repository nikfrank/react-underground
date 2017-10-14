import underground from '../src/';

import React from 'react';

import { mount } from 'enzyme';

import Testapp from '../canon/testapp/src/App';

const { it, expect } = global;

it('runs the app', ()=>{
  const App = underground(Testapp);
  
  const app = mount(<App initialState={Testapp.initialState}/>);
  
  expect( typeof app ).toEqual( 'object' );
});


it('binds the action creators', ()=>{
  const App = underground(Testapp);

  const onAction = jest.fn();
  
  const app = mount(<App
                        initialState={Testapp.initialState}
                        onAction={onAction}/>);

  const actionCreatorButtons = app.find('button');

  expect(actionCreatorButtons.length).toEqual( 4 );

  const button = actionCreatorButtons.first();

  button.simulate('click');

  expect( onAction.mock.calls ).toHaveLength( 1 );
  
});


it('triggers reducers from the action', ()=>{
  const App = underground(Testapp);
  const app = mount(<App initialState={Testapp.initialState}/>);

  expect( app.state() ).toEqual( Testapp.initialState );
  
  const button = app.find('button').first();
  button.simulate('click');

  expect( app.state() ).toEqual(
    Testapp
      .reducers['start'](
        Testapp.initialState,
        Testapp.actions['start']()
      )
  );
});


it('triggers a timeout hook', (done)=>{
  const App = underground(Testapp);

  let waitStarted, stateUpdated = false, waitWaited = false;
  
  const onAction = a=>{
    if( 'hook' in a )
      waitStarted = (new Date()).getTime();
  };

  const onDispatch = a=> {
    if( a.reducer === 'update'){
      try{
        expect( (new Date()).getTime() - waitStarted ).toBeGreaterThan( 999 );
      }catch(e){
        return done(e);
      }
      waitWaited = true;

      if( stateUpdated && waitWaited ) done();
    }
  };
  
  const app = mount(<App
                        initialState={Testapp.initialState}
                        onAction={onAction}
                        onDispatch={onDispatch}/>);

  expect( app.state() ).toEqual( Testapp.initialState );
  
  const button = app.find('button').at(1);
  button.simulate('click');

  expect( app.state() ).toEqual( Testapp.initialState );

  setTimeout(()=> {
    app.update();
    
    try{
      expect( app.state() ).toEqual(
        Testapp
          .reducers['update'](
            Testapp.initialState,
            Testapp.actions['update']()
          )
      );
    }catch(e){
      return done(e);
    }

    stateUpdated = true;
    if( stateUpdated && waitWaited ) done();
  }, 1100);
});
