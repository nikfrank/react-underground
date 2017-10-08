import React, { Component } from 'react';

export default (P, initialState)=> {
  
  return class nuP extends Component {

    state = initialState

    static get defaultProps(){
      return {
        onAction: ()=>0,
      };
    }
    
    constructor(props){
      super(props);

      this.actionCreators = Object.keys(P.actions).reduce((p, c)=> ({
        ...p, [c]: (...args)=>{
          const action = P.actions[c](...args);
          props.onAction(action);

          // here, dispatch to the local store
          return action;
        },
      }), {});
      
    }
    
    render(){
      return (
        <div className="blah">
          <P state={this.state} {...this.actionCreators}/>
        </div>
      );
    }
  }
};
