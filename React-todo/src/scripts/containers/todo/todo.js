import React from "react";
import ComponentX from "../../libs/ComponentX.js";
import { Header } from "./header.js"; 
import { AddOrSearch } from "./add-or-search.js"; 
import { TodoList } from "./todo-list.js"; 
import { Footer } from "./footer.js"; 
import Notify from "./notify.js";
import './todo.scss';

export class Todo extends ComponentX{
  constructor( props ){
    super( props );
    window.addEventListener( 'resize', ()=>this.forceUpdate() );
    window.addEventListener( 'touchmove', (e)=> e.preventDefault() );
  }

  render(){
    const de = document.documentElement;
    const isIOS = /iP\w+ OS/.test( navigator.userAgent );
    const hasAddToHome = navigator.standalone;
    const screenWidth = de.clientWidth;
    const screenHeight = de.clientHeight;
    const landscape = screenWidth > screenHeight;

    if( isIOS ){
      if( hasAddToHome ){
        if( landscape ){
          return <Notify notify='请使用竖屏显示' />
        }else{
          return (
            <div>
              <Header />
              <AddOrSearch />
              <TodoList />
              <Footer />
            </div>
          )
        }    
      }else{
        return <Notify　notify='由于您使用的是iSO设备，请添加到主屏幕上使用' />
      }       
    }else{
      return (
        <div>
          <Header />
          <AddOrSearch />
          <TodoList />
          <Footer />
        </div>
      )
    }
  }
}
      
  
  
