import React from "react";
export default class Notify extends React.Component{
  constructor( props ){
    super(props);
  }
  
  render(){
    return (
      <div className="notify or">
        <div className="circle">×</div>
        <div className="info">
          <span>{ this.props.notify }</span>
        </div> 
      </div>
    )
  }
}