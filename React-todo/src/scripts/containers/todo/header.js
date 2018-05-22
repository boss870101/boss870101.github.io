import React from "react";
import ComponentX from "../../libs/ComponentX.js";
export class Header extends ComponentX{
  constructor( props ) {
    super( props );
  }

  render(){
    return(
      <div className="window-title">
        <div className="dots">
          <i className="fa fa-circle"></i>
          <i className="fa fa-circle"></i>
          <i className="fa fa-circle"></i>
        </div>
        <span className="title">My Simple Todo App</span>
      </div>
    );
  }
}