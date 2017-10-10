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
});

const downstreamStamp = (a)=>({
  source: a.source,
  prev: a.id,
  id: guid(),
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
    this.props.onDispatch(a);
    
    const {
      reducer,
      hook,
      trigger,
    } = a;


    
    if ( reducer in P.reducers )
      this.setState(
        state => P.reducers[a.reducer]( state, a ),
        
        ()=> {
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
          
          const causedDecays =
            P.decays.filter( decay => decay.cause(this.state) )
          
          const effects = causedDecays
            .map( decay => ({
              ...decay.effect( this.state ),
              ...sourceStamp(),
              sourceDecay: decay.name,
            }) )

          if ( effects.length )
            this.props.onDecays( a, this.state, causedDecays, effects );
          
          effects.forEach( this.dispatch );
        }
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
        
        this.props.onAction( action );
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
