
import React, { Component } from 'react';
import logoSilicon from  './img/logoSilicon.png';
import 'simplebar/dist/simplebar.min.css';

import './App.css';

export default class InfoView extends Component {

  constructor(props){
    super(props)
    this.state = {
      viewSelected:this.props.viewSelected
    }
  }
  componentWillReceiveProps(newprops){
    this.setState({viewSelected:newprops.viewSelected})
  }
  render(){
    return(
      <div className="App-header" style={{display: this.state.viewSelected === 4 ? 'block':'none'}}>
          <img src={logoSilicon} height="290px" width="250px" />
          <h2>Silicon Bear</h2>
          z
      </div>
    );
  }
}
//export default App;
