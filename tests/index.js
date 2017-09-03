import blah from '../src/';

const { it, expect } = global;

it('runs the test', ()=>{

  expect( blah() ).toEqual( 'blah' );

});


