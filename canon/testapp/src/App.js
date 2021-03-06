import React, { Component } from 'react';

class App extends Component {
  static get actions(){
    return {
      start: ()=>({
        reducer: 'start'
      }),

      updateWait: ()=> ({
        hook: 'wait',
        payload: 1000,
        then: {
          reducer: 'update',
          payload: 'wait',
        },
      }),

      yell: ({ text = 'nu' })=> ({
        trigger: 'yell',
        payload: text,
      }),

      
      spell: ({ text = 'spell' })=> ({
        trigger: 'spell',
        payload: text,
      }),
    };
  }

  static get reducers(){
    return {
      start: (state, action)=> ({
        ...state, blah: 'rawr?'
      }),

      update: (state, action)=> ({
        ...state, blah: action.payload,
      }),
    };
  }

  static get hooks(){
    return {
      wait: ({ payload: time })=>
        (new Promise(s=>
          setTimeout(s, time) ) ),
    };
  }

  static get triggers(){
    return {
      yell: a=> ({ reducer: 'update', payload: a.payload.toUpperCase() }),
      
      spell: a=> a.payload.split('').map( (ch, chi) => ({
        hook: 'wait',
        payload: chi * 500,
        then: {
          reducer: 'update',
          payload: ch,
        },
      }) ),
    };
  }

  static get decays(){
    return [
      {
        cause: state=> state.blah.indexOf('?') === -1,
        effect: state=> ({ reducer: 'update', payload: state.blah + '?' }),
        name: 'always question authority',
      },
    ];
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
          <button onClick={this.props.updateWait}>
            click here to wait
          </button>
          or
          <button onClick={this.props.yell}>
            yell?
          </button>
          or
          <button onClick={this.props.spell}>
            spell?
          </button>
        </p>
      </div>
    );
  }
}

export default App;
