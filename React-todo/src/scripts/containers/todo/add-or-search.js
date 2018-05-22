import React from "react";
import ComponentX from "../../libs/ComponentX.js";

export class AddOrSearch extends ComponentX{
  constructor( props ){
    super( props );
    this.state = { value: '' }
    this.importSharedState( 'list', 'mode', 'searchText' );
  }

  searchClick(){
    this.sharedState.mode = 'search';
    this.updateSharedState( 'show', 'mode' );
  }

  addClick(){
    this.sharedState.mode = 'add';
    this.sharedState.searchText = '';
    this.updateSharedState( 'mode', 'searchText' );
  }

  onAdd(){
    let { value } = this.state;

    if( !Boolean( value.trim() ) )
      return;

    this.sharedState.list.unshift( { value } );
    this.updateSharedState( 'list' );
    this.setState( { value: '' } );
  }

  addChange( event ){
    let { value } = event.target; 

    this.setState( { value: value } );

　}

  onSearch( event ){
    var value = event.target.value;

    this.sharedState.searchText = value;
    this.updateSharedState( 'searchText' );
  }

  onKeyDown( event ){
    if( event.keyCode !== 13 )
      return;

    this.onAdd();
  }

  render(){
    let showAdd = this.sharedState.mode === 'add';
    let showSearch = this.sharedState.mode === 'search';
  
    return(
      <div className="controls">
        <div className="btns">
          <div className={ `add-task btn ${ showAdd ? 'active' : '' }` } onClick={ this.addClick.bind( this ) }>
            <i className="fa fa-plus row"></i>
            <i className="fa fa-plus col"></i>
          </div>
          <div className={ `search-task btn ${ showSearch ? 'active' : '' }` } onClick={ this.searchClick.bind( this ) }>
            <i className="fa fa-search radius"></i>
            <i className="fa fa-search bias"></i>
          </div>
          <div className="my-account">
            <div>
              <img src="images/i.png" width="30" height="30" />
            </div>
            <div>
              <a href="http://www.ijsuc.com">jason</a>
              <span>Logged in</span>
            </div>
          </div>
        </div>
        <div className="overlay">
          <div className={ `add-task ${ showAdd ? 'active' : '' }` }>
              <input type="text" placeholder="Add a task ..." 
                value={ this.state.value } 
                onChange={ this.addChange.bind( this ) } 
                onKeyDown={ this.onKeyDown.bind( this ) }
              />
              <button className="add-task-btn" onClick={ this.onAdd.bind( this ) } >
                <i className="fa fa-plus row"></i>
                <i className="fa fa-plus col"></i>
              </button>
          </div>
          <div className={ `search-task ${ showSearch ? 'active' : '' }` }>
            <input type="search" placeholder="Search for a task ..." value={ this.sharedState.searchText } onChange={ this.onSearch.bind( this ) } />
            <button>
              <i className="fa fa-search radius"></i>
            </button>
          </div>
        </div>
      </div>   
    );
  }
}