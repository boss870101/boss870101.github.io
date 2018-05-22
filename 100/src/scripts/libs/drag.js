import eventHelps from "./eventHelps.js";
import distance from "./distance.js";


const drag = ( event, move, up )=>{ 
  let movingPosition, touchStart, touchMove, touchEnd, offsetPosition;
  let element = event.target.parentNode.parentNode;
  let getBounding = element.getBoundingClientRect();
  let position = [ getBounding.left, getBounding.top ];

  let currentPosition = [
    event.pageX - position[ 0 ],
    event.pageY - position[ 1 ]
  ];

  event.preventDefault();
  move = move || Function();
  up = up || Function();
  const isMobile = ()=> /mobile/gi.test( navigator.userAgent );
  touchStart = isMobile() ? 'touchstart' : 'mousedown';
  touchMove = isMobile() ? 'touchmove' : 'mousemove';
  touchEnd = isMobile() ? 'touchend' : 'mouseup';

  let moving = event=>{
    movingPosition = [ event.pageX, event.pageY ]; 

    offsetPosition = [
      movingPosition[ 0 ] - currentPosition[ 0 ],
      movingPosition[ 1 ] - currentPosition[ 1 ]
    ];
   
    if( distance( currentPosition, movingPosition ) > 6 )
      move(  element, offsetPosition );      
  }

  let end =()=>{
    up( element, offsetPosition, position );
    eventHelps.off( document, touchMove, moving );
    eventHelps.off( document, touchEnd, end );
  }

  eventHelps.on( document, touchMove, moving );
  eventHelps.on( document, touchEnd, end );
}

export default drag;


