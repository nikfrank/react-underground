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
    console.log('re is');
    return {
      cpHand: [ { rank: 1, suit: 0} ],
      pHands: [
        [ { rank: 8, suit: 1 }, { rank: 11, suit: 2 } ],
        [ { rank: 8, suit: 3 } ],
      ],
    };
  }


  render() {
    const { cpHand, pHands } = this.props.state;
    
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Black Jack Game</h1>
        </header>
        
        <Hand
          cards={
            cpHand.length !== 1 ? cpHand: cpHand.concat([{}, { rank: 1, hidden: true }])
          }
          onClick={this.props.selectCard}
          style={defHandStyle}/>
        
        
        { pHands.map( hand => (
          <Hand cards={ hand }
                onClick={this.props.selectCard}
                style={defHandStyle}/>
        ) ) }
        
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
