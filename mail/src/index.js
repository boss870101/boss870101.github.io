import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, hashHistory } from "react-router";
import Component from "./scripts/libs/Component";
import Home from "./scripts/components/Home/";
import WirteMail from "./scripts/components/WirteMail/";
import Inboxs from "./scripts/components/Inboxs/";
import EmailContainer from "./scripts/components/EmailContainer";
// import Advertisement from "./scripts/components/Advertisement";
// import App from "./scripts/containers/App/";

const de = document.documentElement;
let screenSize = [ de.clientWidth, de.clientHeight ];

Component.initSharedState({
  screenSize: screenSize,

  accounts: '447563595@qq.com',

  addresser: 'jason ',

  indexName: '',

  home: [ 
    { name: '收件箱', img: 'images/Email.png', checked: 'false', dataIndex: 'inboxData' },
    { name: '重要联系人', img: 'images/magnifier.png', checked: 'false', dataIndex: 'personagesMail' },
    { name: '星标邮件', img: 'images/star.png', checked: 'false', dataIndex: 'asteriskMail' },
    { name: '未读邮件', img: 'images/tag.png', checked: 'false', dataIndex: 'unreadMail' },
    { name: '附件收藏', img: 'images/edit.png', checked: 'false', dataIndex: 'accessoryCollect' }
  ],
  app: [
    { name: '通信录', img: 'images/all.png', checked: 'false' },
    { name: '贺卡', img: 'images/me.png', checked: 'false' },
    { name: '读书', img: 'images/tag.png', checked: 'false' },
    { name: '更多应用', img: 'images/link.png', false: '' }
  ],

  file: [
    { name: '群邮件', img: 'images/Email.png', dataIndex: 'groupMail' },
    { name: '草稿箱', img: 'images/tag.png', dataIndex: 'draftsMail' },
    { name: '已发送', img: 'images/all.png', dataIndex: 'sentMail' },
    { name: '已删除', img: 'images/delete.png', dataIndex: 'deletedMail' },
    { name: '垃圾箱', img: 'images/edit.png', dataIndex: 'dustbinMail' }
  ],

  inboxData: [
    { name: '收件箱', addresser: '圣诞老人', accounts: '10000@qq.com', checked: false, img: 'images/me.png', theme: '网易通行证', date: '10月10日', article: '每日精选品质团购，让生活省钱，省时，更省心', id: 1 },
    { name: '收件箱', addresser: '圣诞老人', accounts: '10000@qq.com', checked: false, img: 'images/link.png', theme: '网易通行证', date: '10月10日', article: '每日精选品质团购，让生活省钱，省时，更省心', id: 2 },
    { name: '收件箱', addresser: '圣诞老人', accounts: '10000@qq.com', checked: false, img: 'images/edit.png', theme: '网易通行证', date: '10月10日', article: '每日精选品质团购，让生活省钱，省时，更省心', id: 3 },
    { name: '收件箱', addresser: '圣诞老人', accounts: '10000@qq.com', checked: false, img: 'images/Email.png', theme: '网易通行证', date: '10月10日', article: '每日精选品质团购，让生活省钱，省时，更省心', id: 4 },
    { name: '收件箱', addresser: '圣诞老人', accounts: '10000@qq.com', checked: false, img: 'images/all.png', theme: '网易通行证', date: '10月10日', article: '每日精选品质团购，让生活省钱，省时，更省心', id: 5 },
    { name: '收件箱', addresser: '圣诞老人', accounts: '10000@qq.com', checked: false, img: 'images/me.png', theme: '网易通行证', date: '10月10日', article: '每日精选品质团购，让生活省钱，省时，更省心', id: 6 },
    { name: '收件箱', addresser: '圣诞老人', accounts: '10000@qq.com', checked: false, img: 'images/star.png', theme: '网易通行证', date: '10月10日', article: '每日精选品质团购，让生活省钱，省时，更省心', id: 7 }
  ],

  personagesMail: [
    { name: '重要联系人', addresser: '圣诞老人', accounts: '10000@qq.com', checked: false, img: 'images/all.png', theme: '网易通行证', date: '10月10日', article: '每日精选品质团购，让生活省钱，省时，更省心', id: 1 },
    { name: '重要联系人', addresser: '圣诞老人', accounts: '10000@qq.com', checked: false, img: 'images/me.png', theme: '网易通行证', date: '10月10日', article: '每日精选品质团购，让生活省钱，省时，更省心', id: 2 },
    { name: '重要联系人', addresser: '圣诞老人', accounts: '10000@qq.com', checked: false, img: 'images/star.png', theme: '网易通行证', date: '10月10日', article: '每日精选品质团购，让生活省钱，省时，更省心', id: 3 }
  ],

  asteriskMail: [
    { name: '星标邮件', addresser: '圣诞老人', accounts: '10000@qq.com', checked: false, img: 'images/me.png', theme: '网易通行证', date: '10月10日', article: '每日精选品质团购，让生活省钱，省时，更省心', id: 0 }
  ],

  unreadMail: [
    { name: '未读邮件', addresser: '苏宁易购', accounts: '10000@qq.com', checked: false, img: 'images/magnifier.png', theme: '福田站　－【广告邮件】【衬衫假领两件套】', date: '10月10日', article: '每日精选品质团购，让生活省钱，省时，更省心', id: 0 }
  ],

  accessoryCollect: [
    { name: '附件收蔵', addresser: '圣诞老人', accounts: '10000@qq.com', checked: false, img: 'images/Email.png', theme: '网易通行证', date: '10月10日', article: '每日精选品质团购，让生活省钱，省时，更省心', id: 0 }
  ],

  advertMail: [
    { name: '广告邮件', accounts: '10000@qq.com', addresser: 'QQ团购', checked: false, img: 'images/magnifier.png', theme: '福田站　－【广告邮件】【衬衫假领两件套】', date: '10月10日', article: '这是集合里的第一条，每日精选品质团购，让生活省钱，省时，更省心', id: 0 },
    { name: '广告邮件', accounts: '10000@qq.com', addresser: '唯品会', checked: false, img: 'images/magnifier.png', theme: '福田站　－【广告邮件】【衬衫假领两件套】', date: '10月10日', article: '每日精选品质团购，让生活省钱，省时，更省心', id: 1 },
    { name: '广告邮件', accounts: '10000@qq.com', addresser: '苏宁易购', checked: false, img: 'images/magnifier.png', theme: '福田站　－【广告邮件】【衬衫假领两件套】', date: '10月10日', article: '每日精选品质团购，让生活省钱，省时，更省心', id: 2 },
    { name: '广告邮件', accounts: '10000@qq.com', addresser: '淘宝', checked: false, img: 'images/magnifier.png', theme: '福田站　－【广告邮件】【衬衫假领两件套】', date: '10月10日', article: '每日精选品质团购，让生活省钱，省时，更省心', id: 3 },
    { name: '广告邮件', accounts: '10000@qq.com', addresser: '京东商城', checked: false, img: 'images/magnifier.png', theme: '福田站　－【广告邮件】【衬衫假领两件套】', date: '10月10日', article: '每日精选品质团购，让生活省钱，省时，更省心', id: 4 },
    { name: '广告邮件', accounts: '10000@qq.com', addresser: '天猫', checked: false, img: 'images/magnifier.png', theme: '福田站　－【广告邮件】【衬衫假领两件套】', date: '10月10日', article: '每日精选品质团购，让生活省钱，省时，更省心', id: 5 }
  ],

  draftsMail: [
    { name: '草稿箱', addresser: 'QQ团购', checked: false, img: 'images/magnifier.png', theme: '福田站　－【广告邮件】【衬衫假领两件套】', date: '10月15日', article: '这是集合里的第一条，每日精选品质团购，让生活省钱，省时，更省心', id: 1 }
  ],

  outbox: [
    { name: '发件箱', addresser: 'QQ团购', checked: false, img: 'images/magnifier.png', theme: '福田站　－【广告邮件】【衬衫假领两件套】', date: '10月13日', article: '这是集合里的第一条，每日精选品质团购，让生活省钱，省时，更省心', id: 1 }
  ],

  sentMail: [
    { name: '已发送', addresser: '京东商城', checked: false, img: 'images/magnifier.png', theme: '福田站　－【广告邮件】【衬衫假领两件套】', date: '10月12日', article: '每日精选品质团购，让生活省钱，省时，更省心', id: 1 }
  ],

  groupMail: [
    { name: '群邮件', addresser: '淘宝', checked: false, img: 'images/magnifier.png', theme: '福田站　－【广告邮件】【衬衫假领两件套】', date: '12月10日', article: '每日精选品质团购，让生活省钱，省时，更省心', id: 1 }
  ],

  deletedMail: [
    { name: '已删除', addresser: '唯品会', checked: false, img: 'images/magnifier.png', theme: '福田站　－【广告邮件】【衬衫假领两件套】', date: '10月10日', article: '每日精选品质团购，让生活省钱，省时，更省心', id: 1 }
  ],

  dustbinMail: [
    { name: '垃圾箱', addresser: '苏宁易购', checked: false, img: 'images/magnifier.png', theme: '福田站　－【广告邮件】【衬衫假领两件套】', date: '10月10日', article: '每日精选品质团购，让生活省钱，省时，更省心', id: 1 }
  ]

});

ReactDOM.render(
  (<Router history={ hashHistory }>
    <Route path="/" component={ Home }>
      <Route path="WirteMail" component={ WirteMail } />
      <Route path="EmailContainer/:title/:id" component={ EmailContainer } />
      <Route path="Inboxs/:id" component={ Inboxs } />
    </Route>
  </Router>
  ),document.querySelector( '#root' )
)