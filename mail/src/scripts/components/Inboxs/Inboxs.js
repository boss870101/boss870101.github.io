import React from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router";
import Component from "../../libs/Component";
import "./Inboxs.scss";
import closest from "../../libs/closest";

export default class Inboxs extends Component{
  constructor( props ){
    super(props);
    this.importSharedState(
      'inboxData',
      'indexName', 
      'outboxData', 
      'InboxsMail',
      'screenSize',
      'addresser',
      'dustbinMail',
      'deletedMail',
      'groupMail',
      'sentMail',
      'draftsMail',
      'personagesMail',
      'asteriskMail',
      'unreadMail',
      'accessoryCollect'
    );
    this.hashId = null;
    this.checked = false;
    this.checkAll = false;
  }

  componentWillMount(){
    this.hashId = window.location.hash.slice( 9 );
  }

  compileAnimate( instruct ){
    let inboxs = ReactDOM.findDOMNode( this );
    inboxs.classList.toggle( `${ instruct ? 'animate1' : 'animate2' }` );
      setTimeout( ()=>
        inboxs.classList.toggle( `${ instruct ? 'animate2' : 'animate1' }` ), 300);
  }

  inboxsClick( event ){
    let inboxs = ReactDOM.findDOMNode( this );
    let { className } = event.target;
    let { screenSize } = this.sharedState;
    let arrData = this.sharedState[ this.hashId ];
    let inboxsData;

    if( className === 'back' ){
      let { style } = inboxs.parentNode;
      style.transform = `translate3d(0,0,0)`;
      style.opacity = 1;  

      setTimeout( ()=> window.location.hash = '#/',300);
    }

    if( className === 'compile' )
      this.compileAnimate( true );

    if( className === 'checkbox' ){
      for( let item of arrData ){ 
        if( Number( event.target.dataset.index ) === item.id ){
          this.checked = !this.checked;
          item.checked = !item.checked;
          this.updateSharedState( `${this.hashId}` );
        }   
      }
    }

    
    if( className === 'delete' ){
      for( let i = arrData.length-1; i >= 0; i-- ){
        if( arrData[ i ].checked ){
          arrData.splice( i, 1 );
          this.updateSharedState( `${this.hashId}` );
        }
      }

      this.compileAnimate();
    }

    if( className === 'done' )
      this.compileAnimate();
      

    if( className === 'check-all' ){
      for( let item of arrData ){
        item.checked = !this.checkAll;
      }
      this.checkAll = !this.checkAll;
      this.checked = !this.checked;
      this.updateSharedState( `${this.hashId}` );
    }


    // if( inboxsData = closest( event.target, '.inboxs' ) ){
    //   // this.sharedState.indexName = target.innerText.replace( />/, '' );
    //   inboxs.style.transform = `translate3d(${ -screenSize[ 0 ] }px,0,0)`;
    // }

  }

  compileHeader(){

  }

  componentDidMount(){
    let inboxs = ReactDOM.findDOMNode( this );
    let { screenSize } = this.sharedState;
    inboxs.style.transform = `translate3d(${screenSize[ 0 ]}px,0,0)`;
  }
  
  render(){
    let { advertMail } = this.sharedState;
    let { hashId } = this;
    let deleteStyle = this.sharedState[ hashId ].some( item => item.checked === true ) ? { color: 'red' } : { color: '#DFE1E1', pointerEvents: 'none' };
    let names,firstContainer;

    return (
      <div className="inboxs" onClick={ this.inboxsClick.bind( this ) }>
        <div className="header">
          <div className="back"><img className="back" src="images/keyboard-arrow-left.png" />返回</div>
          <div>{ this.sharedState.indexName }</div>
          <div><Link to="/WirteMail"><img src="images/iconfont-bianji.png" /></Link></div>
        </div>
        <div className="compile-header" onClick={ this.compileHeader.bind( this ) }>
          <div className="check-all">{ this.checkAll ? '取消全选' : '全选' }</div>
          <div>{ this.sharedState.indexName }</div>
          <div className="done">完成</div>
        </div>
        <div className="search">
          <div>
            <input type="search" />
          </div>
          <div className="compile">编辑</div>
        </div>
        <div className="list">
          { this.sharedState[ hashId ].map( ( el, index )=> 
            <div key={ index } className="item">
                <input className="checkbox" type="checkbox" checked={ el.checked } data-index={ el.id } />
                <Link to={ `EmailContainer/${hashId}/${ el.id }` } className="inboxs-data">
                <img src={ el.img } />
                <div className="container">
                  <div>
                    <h6>{ el.addresser }</h6>
                    <i>{el.date}&#62;</i>
                    <p>{ el.theme }</p>
                    <p>{ el.article }</p>
                  </div>
                </div>
              </Link>
            </div>  
          ) }
        </div>
        <div className="delete" style={ deleteStyle }>删除</div>
        { this.props.children }
      </div>  
    );
  }
}