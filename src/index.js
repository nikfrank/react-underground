import React, { Component } from 'react';

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
}

const sourceStamp = (id = guid())=>({
  timestamp: (new Date()).getTime(),
  source: id,
  id,
  arity: 0,
});

const downstreamStamp = (a)=> ({
  source: a.source,
  prev: a.id,
  id: guid(),
  arity: a.arity + 1,
});


export default P=> class nuP extends Component {

  static get defaultProps(){
    return {
      onAction: (A)=>0,
      onDispatch: (A)=>0,
      onTrigger: (A, Ts)=>0,
      onDecays: (A, state, causes, effects)=>0,
      onHook: (A, hookPromise)=>0,
    };
  }
  

  dispatch = (a)=>{
    this.props.onDispatch({
      ...a,
      timestamp: (new Date()).getTime(),
    });
    
    const {
      reducer,
      hook,
      trigger,
    } = a;

    if ( reducer in P.reducers )
      this.setState(
        state => P.reducers[a.reducer]( state, a ),
        
        (()=> {
          // atomic decay should be available
          // for sync reducer/trigger effects:
          
          // calc effects from set state
          // if effects.length
          // do
          //   calc provisional next state after first effect reducer(s)
          //      // reducers are pure!
          //      // treat trigger [d] as an atom? or decay at each step?
          //   dispatch rest of action if any
          //      // this can trigger hooks
          //      // it is assumed that this decay will finish before hook
          //      // based on decay chain being sync, hook being async
          //   calc next effects
          //      // can loop inf if effect never unsets cause
          //      // could skip repeats, but may *want* to retrigger decay!
          //      // and anyhow, could push-me-pull-you around it
          //      // so dev is responsible for halting atomic decay.
          // while ( effects.length )
          // decays are done, setState to decay chain output

          // it suffices for now to say dev must enforce atomicity
          // for such an ejemplo, see blackjack state.dealing atom
          
          const causedDecays =
            P.decays.filter( decay => decay.cause(this.state) );

          const effects = causedDecays
            .map( decay => ({
              ...decay.effect( this.state ),
              ...downstreamStamp(a),
              sourceDecay: decay.name,
            }) )

          if ( effects.length )
            this.props.onDecays( a,
                                 this.state,
                                 causedDecays.map( d => d.name ),
                                 effects, guid() );
          
          effects.forEach( this.dispatch );
        })
      );


    if( hook in P.hooks ){
      this.props.onHook(
        a,
        P.hooks[hook](a)
         .then( payload=>
           this.dispatch({
             ...a.then,
             payload: payload || a.then.payload,
             timestamp: (new Date()).getTime(),
             ...downstreamStamp(a),
           }) )
      );
    }


    
    if( trigger in P.triggers ) {
      const triggeredActions =
        [].concat(
          P.triggers[ trigger ]( a )
        ).map( triggeredA => ({
          ...triggeredA,
          ...downstreamStamp(a),
        }) );
      
      this.props.onTrigger( a, triggeredActions );
      triggeredActions.forEach( this.dispatch );
    }
    
    // should anything (promise?) be returned from dispatch?
    // whatever it is, is resolved from onHook.args[1]
  };

  constructor( props ){
    super( props );

    this.state = props.initialState;

    this.actionCreators = Object.keys(P.actions).reduce((p, c)=> ({
      ...p, [c]: (...args)=>{
        
        const action = {
          ...P.actions[c](...args),
          ...sourceStamp(),
        };
        
        this.props.onAction( action, c );
        return this.dispatch( action );
      },
    }), {});
  }
  

  
  render(){
    return (
      <P state={this.state} {...this.actionCreators}/>
    );
  }
};


// uglogger
const typedActions = (A, {
  hook, trigger, reducer, decays,
} = A) => [
  (hook && reducer) ? { ...A, type: 'hookANDreducer' } : undefined,
  hook && !reducer ? { ...A, type: 'hook'} : undefined,
  trigger ? { ...A, type: 'trigger'} : undefined,
  reducer && !hook ? { ...A, type: 'reducer'} : undefined,
  decays ? { ...A, type: 'decays'} : undefined,
].filter(i=>i);

const timedAction = (sources = [], A) => ({
  ...A,
  timediff: !sources.length ? 0 : A.timestamp - sources[0].timestamp,
  spacediff: !sources.length ? 0 : (
    sources.filter( ({ timestamp }) => A.timestamp - timestamp < 25 ).length * 15
    + 16 * Math.random() - 8
  ),
});

const CAstrokes = {
  action: 'red',
  trigger: 'orange',
  reducer: 'blue',
  hook: 'green',
  hookANDreducer: 'yellowgreen',
  decays: 'yellow',
};

const CAfills = {
  action: '#f44',
  trigger: '#fc7',
  reducer: '#77f',
  hook: '#4f4',
  hookANDreducer: '#cfc',
  decays: '#ff4',
};

export class UgLogger extends Component {

  state = {
    open: true,
    actions: {},
    currentAction: '',
  };
  
  onDispatch = A=> this.setState(state => ({
    ...state, actions: {
      ...state.actions,
      [A.source]: (state.actions[A.source] || [])
        .concat( typedActions( timedAction(state.actions[A.source], A) ) )
        .sort((a, b)=>  a.timestamp - b.timestamp),
    },

    currentAction: state.currentAction ||
                   (state.actions && Object.keys(state.actions)[0]),
  }) );

  onDecays = (A, s, c, e, g)=>
    this.setState(state => {
      const prev = state.actions[A.source].filter( ({ id })=> id === A.id)[0];
      
      return ({
        ...state, actions: {
          ...state.actions,
          [A.source]: (state.actions[A.source] || [])
            .concat( typedActions( timedAction(state.actions[A.source], {
              source: A.source, prev: A.id, nexts: e.map(e=> e.id),
              timestamp: prev.timestamp + 1, arity: A.arity + 0.5,
              decays: c, id: g,
            }) ) )
            .sort((a, b)=>  a.timestamp - b.timestamp),
        },
      });
    })

  setCurrentAction = (actionId)=>{
    this.setState({ currentAction: actionId });
  }

  displayAction = (Aid) => ()=>{
    console.log(Aid);
    
    const A = this.state.actions[this.state.currentAction].find(({ id }) => Aid === id);
    A.decays ? console.log(A.decays.join(' ')) : 'noop';
    A.reducer ? console.log( A.reducer ) : 'noop';
    A.hook ? console.log( A.hook ) : 'noop';
    A.trigger ? console.log( A.trigger ) : 'noop';
    console.log(A);
  }
  
  render(){
    const {
      onAction = (...a)=> false && console.log('A', ...a),
      onTrigger = (...a)=> false && console.log('T', ...a),
      onDecays = this.onDecays,
      onHook = (...a)=> false && console.log('H', ...a),
      Component,
      ...props,
    } = this.props;

    const currentAction = this.state.currentAction;
    const cActions = this.state.actions[currentAction] || [];
    const cActionIndex = {};
    cActions.forEach( a => (cActionIndex[a.id] = a) );
    
    return (
      <div>
        <Component
            onDispatch={this.onDispatch}
            onAction={onAction}
            onTrigger={onTrigger}
            onDecays={onDecays}
            onHook={onHook}
            {...props}
        />
        
        <div style={{
          position: 'fixed', top: 5, right: 5,
          backgroundColor: 'black', color: 'white',
          height: 17, width: 17, borderRadius: '50%',
          textAlign: 'center', zIndex: 10,
        }} onClick={()=> this.setState(state => ({ open: !state.open }) )}>
          { this.state.open ? 'X' : 'O' }
        </div>

        {
          !this.state.open ? null : (
            <div style={{
              position: 'fixed', top: 0, right: 0,
              height: '100vh', width: '36vw',
              borderLeft: '1px solid black',
              backgroundColor: 'white',
              zIndex: 5,
            }}>
              <div>
                {
                  Object.keys(this.state.actions).map( actionId => (
                    <div key={actionId} onClick={()=> this.setCurrentAction(actionId)}>
                      {actionId} - 
                      {this.state.actions[actionId].length}
                    </div>
                  ) )
                }
              </div>

              {
                !this.state.currentAction ? null : (
                  <svg viewBox="0 0 200 1000">
                    {
                      cActions.map( ({
                        id, type, timediff, spacediff, arity, prev, nexts, sourceDecay,
                      }, cai) => [
                        <circle key={id+''+cai} r={4}
                                cx={25 + spacediff} cy={30 + (arity * 20)}
                                fill={CAfills[type]}
                                stroke={CAstrokes[type]}
                                strokeWidth={2}
                                onClick={this.displayAction(id)}
                        />,

                        prev && !sourceDecay && (
                          <line x1={25 + spacediff} y1={30 + (arity * 20)}
                                x2={cActionIndex[prev].spacediff + 25}
                                y2={cActionIndex[prev].arity * 20 + 30}
                                strokeWidth='1' stroke='black' key={id+' p '+cai}/>
                        ),

                        ...(nexts||[]).map( next=> (
                          <line x1={25 + spacediff} y1={30 + (arity * 20)}
                                x2={cActionIndex[next].spacediff + 25}
                                y2={cActionIndex[next].arity * 20 + 30}
                                strokeWidth='1' stroke='green' key={id+'n '+cai+''+next}/>
                        ) ),
                      ] )
                    }
                  </svg>
                )
              }
            </div>
          )
        }
      </div>
    );
  }
};






// the setState should only be called after the state invariants pass

// loop every 20 ms
// collect pending actions
// calculate their sync effect
// save version of state,
// is state valid? (by invariants)
//   publish to setState

// all decays need to be calculated recursively as discussed in previous commentary




//////////
// Context


/// furthermore, outstanding actions (hooks) should leave their next action on the state, not in their enclosures

// this would allow the callback actions to be updated as part of the reducer loop
// and is simply an honest way to deal withe fact that there are really two states (inbound, outbound)

// this constitutes an update to the api of a reducer from
((state, action) => ({ ...state, /* action effects */}))();

// to
((state, context, action) => ({ state, context }))();


// anything changing anything in context needs to leave his ids for diagramming
// this can be implemented here (if contextChanged)=> tag changed context by ids


// also decays should be possible for context just the same also:

({
  cause: (state, context)=> Boolean,
  effect: (state, context)=> `{A}`
});

// and invariants in general

((state, context) => Boolean)();


// context should be an object as such:

({
  pending: [],
  outstanding: [],
});

// each of which is
[
  `{A}`
]

