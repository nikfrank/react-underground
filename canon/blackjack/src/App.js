import React, { Component } from 'react';

class App extends Component {
  static get actions(){
    return {
      start: ()=>({
        reducer: 'start'
      }),

      update: ()=> ({
        hook: 'wait',
        payload: 1000,
        then: {
          reducer: 'update',
        },
      }),
    };
  }

  static get reducers(){
    return {
      start: (state, action)=> ({
        ...state, blah: 'rawr'
      }),

      update: (state, action)=> ({
        ...state, blah: 'really?',
      }),
    };
  }

  static get hooks(){
    return {
      wait: ({ payload: time })=> (new Promise(s=>
        setTimeout(s, time) ) ),
    };
  }

  static get triggers(){
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
          then
          <button onClick={this.props.update}>
            click here to wait
          </button>
        </p>
      </div>
    );
  }
}

export default App;
