import React from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router";
import Component from "../../libs/Component";
import "./Advertisement.scss";

export default class Advertisement extends Component{
  constructor( props ){
    super(props);
  }

  
  render(){
    let { advertMail } = this.sharedState;
    let { hashId } = this;

    return (
      <div>这是个</div>
    );
  }
}