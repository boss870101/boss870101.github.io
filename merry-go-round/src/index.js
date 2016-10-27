import { domRadey } from "./scripts/libs/domRadey.js";
import { direction } from "./scripts/libs/direction.js";
import model from "./scripts/models/mode.json";

domRadey(function(){
  var config = {
    "sliderWidth": 600,
    "sliderHeight": 400,
    "scale": 50,
    "imgWidth": 600,
    "rotate": 60,
    "verticalAlign": { "top": 0, "bottom": 1, "middle": 2 }
  }

  var slider = document.getElementById( 'slider' );
  var container = document.getElementById( 'container' );
  var offsetIndex = model.length % 2 ? 0 : -1;

  var render = function(){
    model.forEach( function( item, index, arr ){
      var moietyLength = Math.floor( arr.length / 2 );
      var abs = Math.abs;
      if( !item.el ){
        item.el = document.createElement( 'div' );
        item.index = index - moietyLength;
        item.el.className = 'item';
        item.el.style.backgroundImage = 'url(' + item.pic + ')';
        slider.appendChild( item.el );
      }
      var style = item.el.style;

      style.zIndex = ( item.index > 0 ? -item.index : item.index );
      style.width = config.imgWidth + 'px';
      style.height = config.sliderHeight - abs( item.index ) * config.scale + 'px';
      style.left = item.index * config.scale + 'px'; 
      style.top = abs( item.index ) * config.scale / config.verticalAlign.middle  + 'px';
      style.opacity = 5 / ( abs( item.index ) + 5 );
    } );
  }

  render();

  function merryGoRound( dir ){
    model.forEach( function( item ){
      var v = dir === 'E' ? -1 : 1;
      item.index += v;
      item.index = Math.abs( item.index * 2 ) > model.length ? dir !== 'E' && offsetIndex ?
      v * 3 + offsetIndex - item.index : v + offsetIndex - item.index : item.index;
       
    } );

    render();
  }

  var start = true;

  container.addEventListener( 'click', function( event ){
    var target = event.target;
    if( start && target.className === 'prve' ){
      merryGoRound( 'E' );
      start = false;
      setTimeout( () => {
        start = true;
      }, 800 );
    }

    if( start && target.className === 'next' ){
      merryGoRound( 'W' );
      start = false;
      setTimeout( () => {
        start = true;
      }, 800 );
    }
  }, false );
   
  var startX,startY;
  window.addEventListener( 'touchstart',function( event ){
    startX = event.touches[ 0 ].pageX;
    startY = event.touches[ 0 ].pageY;
  }, false );
 
  window.addEventListener( 'touchend', function( event ){
    var endX = event.changedTouches[ 0 ].pageX;
    var endY = event.changedTouches[ 0 ].pageY;
    
    if( start ){
      merryGoRound( direction( [ endX, endY ], [ startX, startY ] ) ); 
      start = false;
      setTimeout( () => {
        start = true;
      }, 800 );
    }
  }, false );
});
