import React from "react";
import ComponentX from "../../libs/ComponentX.js";
import TodoItem from "./todo-item.js"; 
  
export class TodoList extends ComponentX{
  constructor( props ){
    super(props);
    this.importSharedState( 'list', 'mode', 'searchText' );
  }
  
  render(){
    return(
      <div className="main-area">
        <ul>
          { this.sharedState.list.map( ( el, index ) => {
            if( ~el.value.toLowerCase().indexOf( this.sharedState.searchText.toLowerCase() ) ){
              return <TodoItem key={ index } index={ index } item={ el } />
            }
          } ) }
        </ul>
      </div>
    );
  }
}

