import React from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router";
import Component from "../../libs/Component";
import "./EmailContainer.scss";

export default class EmailContainer extends Component{
  constructor( props ){
    super(props);
    this.hashId = null;
    this.title = null;
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
  }

  componentDidMount(){
    let emailContainer = ReactDOM.findDOMNode( this );
    let { screenSize } = this.sharedState;

    emailContainer.style.transform = `translate3d(${screenSize[ 0 ]}px,0,0)`;
  }

   componentWillMount(){
    let urlHash = window.location.hash; 
    this.title = urlHash.slice(17, urlHash.lastIndexOf('/') );
    this.hashId = urlHash.slice( urlHash.lastIndexOf( '/' ) + 1 );
  }
  
  render(){
    let emailData = this.sharedState[ this.title ].filter( item => Number(item.id) === Number(this.hashId) )[0];
    console.log( emailData );

    return (
      <div className="email-container">
        <div className="header">
          <Link to="Inboxs/inboxData">
            <div className="back">
              <img className="back" src="images/keyboard-arrow-left.png" />
              { emailData.name }
            </div>
          </Link>
          <div><img src="images/fold.png" /></div>
          <div><img src="images/unfold.png" /></div>
        </div>
        <div className="container">
          <div className="title">{ emailData.theme }</div>
          <div className="addresser">
            <div>{ emailData.addresser }</div>
            <div>详情</div>
          </div>
          <ul>
            <li>
              <p><span>发件人：</span>{ emailData.addresser }</p>
              <p><span>{ emailData.accounts }</span></p> 
            </li>
            <li>
              <p><span>收件人：</span>{ this.sharedState.addresser }</p>
              <p><span>{ this.sharedState.accounts }</span></p> 
            </li>
            <li>
              <p><span>时间：</span><span>{ emailData.date }</span></p>
            </li>
          </ul>
          <div className="article">{ emailData.article }</div>
        </div>
      </div>
    )
  }
}