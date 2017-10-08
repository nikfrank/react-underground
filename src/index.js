import React, { Component } from 'react';

export default (P, initialState)=> {
  
  return class nuP extends Component {

    state = initialState

    static get defaultProps(){
      return {
        onAction: ()=>0,
        onDispatch: ()=>0,
      };
    }
    
    constructor(props){
      super(props);

      this.dispatch = (a)=>{
        props.onDispatch(a);
        
        const { reducer, hook } = a;
        
        if ( reducer in P.reducers )
          this.setState( prev => P.reducers[a.reducer]( prev, a ) );

        if( hook in P.hooks ){
          // run the network behaviour
          // start with timeout hook
          P.hooks[hook](a).then(payload=>
            this.dispatch({ ...a.then, payload }) );
          
          // then simple http?
        }

        /// return a promise? or use prop calls?
      };

      
      this.actionCreators = Object.keys(P.actions).reduce((p, c)=> ({
        ...p, [c]: (...args)=>{
          const action = P.actions[c](...args);
          props.onAction(action);
          return this.dispatch( action );
        },
      }), {});
      
    }
    
    render(){
      return (
        <P state={this.state} {...this.actionCreators}/>
      );
    }
  }
};
