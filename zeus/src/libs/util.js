import axios from "axios";
import Vue from "vue";
import Cookie from "js-cookie";
import { Notice } from "iview";
import env from "../config/env";

const accountUrl = env === 'production' ?
  'https://account.wei3h.com' :
  'https://account.wei3h.com';

const notificationUrl = env === 'production' ?
  'https://notification.wei3h.com' :
  'http://10.10.0.115:8001';

const bookUrl = env === 'production' ?
  'https://book.wei3h.com' :
  'http://10.10.0.115:8000';

let util = {};

util.accountAxios = axios.create({
  baseURL: accountUrl,
  timeout: 30000
});

util.accountAxios.interceptors.request.use( config => {
  if( Cookie.get('token') ){
    config['headers']['Authorization'] = 'Bearer ' + Cookie.get('token');
  }

  return config;
}, error => {
  console.log("error", error);
  return Promise.reject( error );
} )

util.notificationAxios = axios.create({
  baseURL: notificationUrl,
  timeout: 30000
});


util.notificationAxios.interceptors.request.use( config => {
  if( Cookie.get('token') ){
    config['headers']['Authorization'] = 'Bearer ' + Cookie.get('token');
  }

  return config;
}, error => {
  console.log("error", error);
  return Promise.reject( error );
} );

util.notificationAxios.interceptors.response.use( response => {
  if( response.data.errcode !== 0 ){
    Notice.error({
      title: '出错了',
      desc: response.data.errmsg
    })
  }
  return response;
}, error => {
  console.log("error", error)
  let { status } = error.response;
  console.log("status", status)
  Cookie.remove( 'token' );
  if( status === 401 ){
    Notice.error({
      title: '无效身份信息',
      desc: '请刷新页面重新登录'
    })
    setTimeout( 'window.location.reload();', 3000)
  }else{
    Notice.error({
      title: '出错了',
      desc: '请刷新页面重试!'
    })
  }
  return Promise.reject( error );
} )

util.bookAxios = axios.create({
  baseURL: bookUrl,
  timeout: 30000,
});

util.bookAxios.interceptors.request.use( config => {
  if( Cookie.get('token') ){
    config['headers']['Authorization'] = 'Bearer ' + Cookie.get('token');
  }

  return config;
}, error =>{
  console.log("error", error);
  return Promise.reject( error );
} );

util.bookAxios.interceptors.response.use( response => {
  if( response.data.errcode !== 0 ){
    Notice.error({
      title: '出错了',
      desc: response.data.errmsg
    })
  }
  return response;
}, error => {
  console.log("error", error)
  let { status } = error.response;
  console.log("status", status)
  Cookie.remove( 'token' );
  if( status === 401 ){
    Notice.error({
      title: '无效身份信息',
      desc: '请刷新页面重新登录'
    })
    setTimeout( 'window.location.reload();', 3000)
  }else{
    Notice.error({
      title: '出错了',
      desc: '请刷新页面重试!'
    })
  }
  return Promise.reject( error );
} )

export default util;