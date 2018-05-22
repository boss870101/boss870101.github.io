import React from "react";
import Component from "../../libs/Component";
import { Router, Route, hashHistory } from "react-router";
import Home from "../../components/Home/";
import Inbox from "../../components/Inbox/";
import WirteMail from "../../components/WirteMail/";
import "./App.scss";

export default class App extends Component{
  constructor( props ){
    super(props);
    this.importSharedState( 'home', 'app', 'file', 'screenSize' );
  }
  
  render(){
    // let { screenSize } = this.sharedState;
    // let mailStyle = {
    //   width: `${ screenSize[ 0 ] }px`,
    //   height: `${ screenSize[ 1 ] }px`
    // }

    return (
      <div className="mail-container">
        { this.props.children }
      </div>
    )
  }
}