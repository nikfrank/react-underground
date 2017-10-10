import React, { Component } from 'react';

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

  static get triggers(){
    return {
    };
  }

  static get decays(){
    return [
    ];
  }

  static get initialState(){
    return {
      cpHand: [],
      pHands: [[], [], []],
    };
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
