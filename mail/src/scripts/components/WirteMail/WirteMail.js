import React from "react";
import ReactDOM from "react-dom";
import Component from "../../libs/Component";
import "./WirteMail.scss"

export default class WirteMail extends Component{
  constructor( props ){
    super(props);
    this.importSharedState( 'outbox', 'draftsMail', 'screenSize', 'addresser' );
    this.data = {};
  }

  getData( key, event ){
    this.data[ key ] = event.target.value;
  }

  onSend(){
    
  }

  goHome(){ 
    let wirteMail = ReactDOM.findDOMNode( this );
    let { style } = wirteMail.parentNode;
    
    style.transform = `translate3d(0,0,0)`;
    setTimeout( ()=> window.location.hash = '#/',300);
  }

  onCancel( prop ){
    let wirteMail = ReactDOM.findDOMNode( this );

    if( prop === 'noSave' )
      this.goHome();
      

    let { screenSize } = this.sharedState;

    if( !Object.keys( this.data ).length )
      this.goHome();
    else
      wirteMail.classList.toggle( 'save' ); 
  }

  onSaveMail(){
    let { recipient, theme, container, img, id, checked } = this.data;
    let date = new Date();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    this.data.recipient = recipient === undefined ? "（未填写收件人）" : recipient;
    this.data.theme = theme === undefined ? "（无主题）" : theme;
    this.data.container = container === undefined ? "（无摘要）" : container;
    this.data.img = img === undefined ? "images/Email.png" : img;
    this.data.id = this.sharedState.draftsMail.length;
    this.data.checked = false;
    this.data.date = `${ month }月${ day }日`;
    this.sharedState.draftsMail.push( this.data );
    this.goHome();
  }

  componentDidMount(){
    let wirteMail = ReactDOM.findDOMNode( this );
    let { screenSize } = this.sharedState;

    wirteMail.style.transform = `translate3d(${screenSize[ 0 ]}px,0,0)`;
  }
  
  render(){
    let { recipient = '', theme = '', article = '' } = this.data;
    
    return (
      <form className="wirte-mail-container">
        <div className="header">
          <div onClick={ this.onCancel.bind( this ) }>取消</div>
          <div>写邮件</div>
          <div onClick={ this.onSend.bind( this, 'send' ) }>发送</div>
        </div>
        <div className="shade" onClick={ this.onCancel.bind( this ) }></div>
        <div className="wirte-container">
          <ul className="fill-in-information">
            <li><span>收件人：</span><div><input type="text"  onChange={ this.getData.bind( this, 'recipient' ) } defaultValue={ recipient } autoFocus={true} /></div></li>
            <li><span>发件人：</span><div>{ this.sharedState.addresser }</div></li>
            <li><span>主题：</span><div><input type="text" onChange={ this.getData.bind( this, 'theme' ) } defaultValue={ theme } /></div></li>
            <li><div><input type="text" onChange={ this.getData.bind( this, 'article' ) } defaultValue={ article } /></div></li>
          </ul>
          <ul className="tooltip save">
            <li onClick={ this.onCancel.bind( this, 'noSave' ) }>不保存草稿</li>
            <li onClick={ this.onSaveMail.bind( this ) }>保存草稿</li>
            <li onClick={ this.onCancel.bind( this ) }>取消</li>
          </ul>
          <ul className="tooltip send">
            <li>邮件没有主题</li>
            <li>继续发送</li>
            <li>取消</li>
          </ul>
          <ul className="error-box">
            <li>收件人的格式错误</li>
            <li>a</li>
            <li>确定</li>
          </ul>
        </div>
      </form>
    );
  }
}