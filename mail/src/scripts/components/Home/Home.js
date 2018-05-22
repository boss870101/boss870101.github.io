import React from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router";
import Component from "../../libs/Component";
import "./Home.scss";
import closest from "../../libs/closest";

export default class Home extends Component{
  constructor( props ){
    super(props);
    this.importSharedState( 'home', 'app', 'file', 'screenSize', 'addresser', 'indexName' );
  }

  componentDidMount(){

  }

  restore( event ){
    let { target } = event;
    let { className } = target;
    let { screenSize } = this.sharedState;
    let home = ReactDOM.findDOMNode( this );

    if( className === 'addEmail' || className === 'shade' || className === 'wirte-mail' )
      home.classList.toggle( 'hidden' );

    if( className === 'inbox' || className === 'wirte-mail' ||
        className === 'file' ){
      this.sharedState.indexName = target.innerText.replace( />/, '' );
      home.style.transform = `translate3d(${ -screenSize[ 0 ] }px,0,0)`;
    }   
  }

  componentWillUpdate( nextProps, nextState ){

  }
  
  render(){
    let { screenSize } = this.sharedState;
    let homeStyle = {
      width: `${ screenSize[ 0 ] }px`,
      height: `${ screenSize[ 1 ] }px`
    }

    return (
      <div className="home" style={ homeStyle } onClick={ this.restore.bind( this ) }>
        <div className="shade"></div>
        <div className="header">
          <div className="hidden">新建</div>
          <div>{ this.sharedState.addresser }</div>
          <div className="addEmail">
            <img src="images/add.png" className="addEmail" />
            <ul>
              <li><Link to="/WirteMail" className="wirte-mail">写邮件</Link></li>
              <li>写记事</li>
              <li>上传文件</li>
              <li>设置</li>
            </ul>
          </div>
          <div className="shade"></div>
        </div>
        <div className="list">
          { this.sharedState.home.map( ( el, index )=>
            <div key={ index } className="item">
              <Link to={ `/Inboxs/${ el.dataIndex }` } className="inboxs">
                <img src={ el.img } />
                <div className="container">
                  <div className='inbox'>{ el.name }<i><img src="images/right.png" /></i></div>
                </div>
              </Link>
            </div>
          ) }
        </div>
        {//<div className="list">
        //   <div className="title">应用</div>
        //   { this.sharedState.app.map( ( el, index )=>
        //     <div key={ index } className="item">
        //       <img src={ el.img } />
        //       <div className="container">
        //         <div>{ el.name }<i><img src="images/right.png" /></i></div>
        //       </div>
        //     </div>
        //   ) }
        // </div>
        }
        <div className="list">
          <div className="title">文件夹</div>
          { this.sharedState.file.map( ( el, index )=>
            <div key={ index } className="item">
              <Link to={ `/Inboxs/${ el.dataIndex }` } className="inboxs">
                <img src={ el.img } />
                <div className="container">
                  <div className='file'>{ el.name }<i><img src="images/right.png" /></i></div>
                </div>
              </Link>
            </div>
          ) }
        </div>
        { this.props.children }
      </div>
    );
  }
}
