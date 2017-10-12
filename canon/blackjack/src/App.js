import React, { Component } from 'react';

import { Card, CardBack, Hand } from 'react-deck-o-cards';

const defHandStyle = {
  maxHeight:'34vh',
  minHeight:'34vh',
  
  maxWidth:'100vw',
  padding: 0,
};

class App extends Component {
  static get actions(){
    return {
      selectCard: (card)=>({
        trigger: 'log',
        payload: card,
      }),
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
      log: a=> console.log(a) || [],
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
        <Hand cards={ [{ rank: 1 }, { rank: 2 }, { rank: 3 }] }
              hidden={true}
              onClick={this.props.selectCard}
              style={defHandStyle}/>
        <Hand cards={ [
          { rank: 1, suit: 0 },
          { rank: 10, suit: 1 },
          { rank: 13, suit: 2 },
          { rank: 3, suit: 3 },
        ] }
              onClick={this.props.selectCard}
              style={defHandStyle}/>
        
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
