import React from "react";
import ComponentX from "../../libs/ComponentX.js";

const escapeRegexp = function(s){
  return String(s).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
}

export default class TodoItem extends ComponentX{
  constructor( props ){
    super( props );
    this.importSharedState( 'list','searchText' );
  }

  toggleDone(){
    this.props.item.done = !this.props.item.done;
    this.updateSharedState( 'list' );
  }

  removeItem(){
    this.sharedState.list.splice( this.props.index, 1 );
    this.updateSharedState( 'list' );        
  }

  render(){
    let done = this.props.item.done;
    const { value } = this.props.item;
    const { searchText } = this.sharedState;
    let html, regx = new RegExp( `(${escapeRegexp( searchText )})`, 'ig' );

    html = value.replace( regx, s=> `<span style="color:red;">${ s }</span>` );
      
    return(
      <li className={ `task-todo-item ${ this.props.item.display }`} key={ this.props.index }>
        <div className={ `done-${ done } status` }>
          <i className="fa fa-times pull-right" onClick={ this.removeItem.bind( this ) }></i>
          <label onClick={ this.toggleDone.bind( this ) }>
            { done ? <i className="fa fa-check-square-o"></i> : '' }
            <i className="fa fa-square-o"></i>
          </label>
          <span className="description" onClick={ this.toggleDone.bind( this ) } dangerouslySetInnerHTML={ { __html: html } }></span>  
        </div>
      </li>
    );
  }
}

// var index =value.toLowerCase().indexOf( searchText.toLowerCase() );

//     if( searchText ){
//       startText = value.slice( 0, index );
//       highlightingText = value.slice( index,index + searchText.length );
//       endText = value.slice( index　+ highlightingText.length );
//     }else{
//       startText = value;
//       highlightingText = '';
//       endText = '';
//     }