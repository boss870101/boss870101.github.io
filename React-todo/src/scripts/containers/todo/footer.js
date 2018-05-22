import React from "react";
import ComponentX from "../../libs/ComponentX.js";
export class Footer extends ComponentX{
  constructor( props ){
    super(props);
  }
  
  render(){
    return(
      <div className="footer">
        <span>done items.</span>
      </div>
    );
  }
}