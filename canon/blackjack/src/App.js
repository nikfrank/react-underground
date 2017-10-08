import React, { Component } from 'react';

class App extends Component {
  static get actions(){
    return {
      start: ()=>({
        reducer: 'start'
      }),
    };
  }

  static get reducers(){
    return {
      
    };
  }

  static get triggers(){
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

  static get initialState(){
    return {
      blah: 'hmm...',
      cpHand: [],
      pHands: [[], [], []],
    };
  }
  
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>{this.props.state.blah}</h2>
        </div>
        <p className="App-intro">
          To get started, click
          <button onClick={this.props.start}>
            here
          </button>
        </p>
      </div>
    );
  }
}

export default App;
