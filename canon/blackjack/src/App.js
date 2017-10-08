import React, { Component } from 'react';

import underground from '../../../src/';

import logo from './logo.svg';
import './App.css';

const initialState = {
  blah: 'hmm',
  cpHand: [],
  pHands: [[], [], []],
};

class App extends Component {
  static get actions(){
    return {
      
    };
  }

  static get reducers(){
    return {
      
    };
  }

  static get hooks(){
    return {
      
    };
  }
  
  static get decays(){
    return {
      
    };
  }
  
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>{this.props.state.blah}</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default underground( App, initialState );
export { initialState };
