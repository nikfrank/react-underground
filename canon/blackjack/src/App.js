import React, { Component } from 'react';

import { Hand } from 'react-deck-o-cards';

const handTotal = cards => {
  const total = cards.reduce( (p, c)=> p + Math.min(10, c.rank), 0);
  const hasAce = cards.findIndex( ({ rank })=> rank === 1 ) > -1;

  return ((total <= 11) && hasAce) ? total + 10 : total;
};

const doesDealerHit = cards => {
  const total = handTotal(cards);
  const hasAce = cards.findIndex( ({ rank })=> rank === 1 ) > -1;
  
  return (total === 17 && hasAce) || (total < 17);
};


const defHandStyle = {
  maxHeight:'34vh',
  minHeight:'34vh',
  
  maxWidth: '100vw',
  padding: 0,
};

class App extends Component {
  static get actions(){
    return {
      newHand: ()=> ({ trigger: 'newHand' }),
      
      hit: (hi)=>({
        hook: 'dealCard',
        then: {
          reducer: 'dealCard',
          hand: hi,
        },
      }),
      
      doubleDown: ()=>0,
      split: ()=>0,
      
      stand: (hi)=> ({
        reducer: 'setHandPhase',
        payload: {
          handIndex: hi,
          phase: 'stand',
        },
      }),
    };
  }

  static get reducers(){
    return {
      newHand: state=> App.initialState,

      dealing: (state, { payload })=> ({
        ...state,
        dealing: payload,
      }),
      
      setHandPhase: (state, { payload: { handIndex, phase } })=> ({
        ...state, pHands: state.pHands.map( (hand, hi)=>
          hi !== handIndex ? hand : ({ ...hand, phase })
        )
      }),

      dealCard: (state, { payload: card, hand: hiDealing })=>
        state.pHands[hiDealing].phase !== 'deal' ? state : ({
          ...state,
          dealing: null,
          pHands: state.pHands.map( (hand, hi)=>
            hi !== hiDealing ? hand : ({
              ...hand, cards: hand.cards.concat( card )
            })
          )
        }),

      dealCpCard: (state, { payload: card })=> ({
        ...state,
        cpCards: state.cpCards.concat(card)
      }),
        
    };
  }


  static get triggers(){
    return {
      cpPlay: ({ payload: cpCards })=>
        !doesDealerHit(cpCards) ? [] : [{
          hook: 'dealCard',
          then: { reducer: 'dealCpCard' }
        }],

      newHand: ()=> [
        { reducer: 'newHand' },
        { trigger: 'cpPlay', payload: [] },
      ],
    };
  }
  
  static get hooks(){
    return {
      dealCard: ()=> Promise.resolve({
        rank: Math.floor( Math.random()*13 ) +1,
        suit: Math.floor( Math.random()*4 ),
      }),
    };
  }

  static get decays(){
    return [
      {
        cause: state=>
          state.dealing === null && (
            state.pHands.findIndex( hand => hand.cards.length < 2 ) > -1 ),

        effect: state=> ({
          reducer: 'dealing',
          payload: state.pHands.findIndex( hand => hand.cards.length < 2 ),

          hook: 'dealCard',
          then: {
            reducer: 'dealCard',
            hand: state.pHands.findIndex( hand => hand.cards.length < 2 )
          },
        }),

        name: 'deal hand',
      },
        
      {
        cause: state=> state
          .pHands.findIndex( hand => (handTotal(hand.cards) > 21) &&
                                   ( hand.phase !== 'bust' ) ) > -1,
        effect: state=> ({
          reducer: 'setHandPhase',
          payload: {
            phase: 'bust',
            handIndex: state
              .pHands.findIndex( hand =>
                (handTotal(hand.cards) > 21) &&
                                       ( hand.phase !== 'bust' ) ),
          },
        }),
        name: 'bust hand',
      },

      {
        cause: state=> !state.pHands.filter( ({ phase })=>
          ['stand', 'bust'].indexOf(phase) === -1
        ).length && doesDealerHit(state.cpCards),

        effect: state=> ({ trigger: 'cpPlay', payload: state.cpCards }),
        name: 'dealer plays',
      },
    ];
  }

  static get initialState(){
    return {
      cpCards: [ ],
      pHands: [
        {
          cards: [],
          phase: 'deal'
        },
      ],
      dealing: null,
    };
  }

  componentDidMount(){
    this.props.newHand();
  }

  render() {
    const { cpCards, pHands } = this.props.state;

    const { newHand, hit, doubleDown, split, stand } = this.props;

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">
            Black Jack Game!
            <button onClick={newHand}>new</button>
          </h1>
        </header>
        
        <Hand
            cards={
              cpCards.length !== 1 ? cpCards:
                   cpCards.concat([{ rank: 1, hidden: true }])
                  }
            cardWidth={90}
            cardOffset={95}
            cardHeight={125}
            onClick={()=> 0}
            style={defHandStyle}/>
        
        
        {
          pHands.map( ({ cards, phase }, hi) => (
            <div key={hi} style={{ textAlign: 'center' }}>
              <Hand cards={ cards }
                    cardWidth={90}
                    cardOffset={100}
                    cardHeight={130}
                    onClick={()=>0}
                    style={defHandStyle}/>
              
              {
                ['stand', 'bust'].indexOf(phase) > -1 ? null : (
                  <div>
                    <button onClick={()=> hit(hi)}>HIT</button>
                    {
                      cards.length !== 2 ? null : (
                        <button onClick={()=> doubleDown(hi)}>
                          DOUBLE DOWN
                        </button>
                      )
                    }
                    <button onClick={()=> stand(hi)}>STAND</button>
                    {
                      ((cards.length !== 2) ||
                       (cards[0].rank !== cards[1].rank)) ? null : (
                         <button onClick={()=> split(hi)}>SPLIT</button>
                       )
                    }
                  </div>
                )
              }
            </div>
          ) )
        }
        
      </div>
    );
  }
}

export default App;
