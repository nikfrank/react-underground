import React, { Component } from 'react';

export default (P, initialState)=> class nuP extends Component {

  state = initialState
  
  render(){
    return (
      <div className="blah">
        <P state={this.state}/>
      </div>
    );
  }
};
