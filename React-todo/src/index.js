import React from "react";
import { render } from "react-dom";
import ComponentX from "./scripts/libs/ComponentX.js";
import { Todo } from "./scripts/containers/todo/todo";

ComponentX.initSharedState( {
  list: [
    { value: '本应用支持手机端，ipad,iphone可以添加到主屏幕使用', done: false },
    { value: '学习 React学习', done: false },
    { value: '学习 Component', done: false },
    { value: '学习 Component \\d+ 423425', done: false },
    { value: '学习 Component', done: true },
  ],
  mode: 'add',
  searchText: ''
} );

render(
  <Todo />,
  document.querySelector( '.window-wrapper' )    
);