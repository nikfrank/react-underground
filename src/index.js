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


export default P=>
  class nuP extends Component {

    static get defaultProps(){
      return {
        onAction: ()=>0,
        onDispatch: ()=>0,
        onTrigger: ()=>0,
        onDecays: ()=>0,
        onHook: ()=>0,
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
            const causedDecays = P.decays
              .filter( decay => decay.cause(this.state) )

            const effects = causedDecays
              .map( decay => ({
                ...decay.effect( nextState ),
                ...sourceStamp(),
                sourceDecay: decay.name,
              }) )

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
               payload,
               timestamp: (new Date()).getTime(),
               ...downstreamStamp(a),
             }) )
        );
      }


      
      if( trigger in P.triggers ) {
        const triggeredActions =
          P.triggers[ trigger ]( a )
           .map( triggeredA => ({
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
