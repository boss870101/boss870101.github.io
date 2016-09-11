var eventHelps = require( './eventHelps' );
var distance = require( './distance' );

var currentPosition,movingPosition;
var drag = module.exports = function( event, move ){
  currentPosition = [
    event.clientX,
    event.clientY
  ]
  event.preventDefault();
  move = move || Function()

  function moving( event ){
    movingPosition = [ event.clientX, event.clientY ];
    var offsetPosition = [ 
      movingPosition[ 0 ] - currentPosition[ 0 ],
      movingPosition[ 1 ] - currentPosition[ 1 ]
    ];
    if( distance( currentPosition, movingPosition ) > 6 ){
      move( offsetPosition )
    }
  }

  function up( event ){
    eventHelps.off( document, 'mousemove', moving )
    eventHelps.off( document, 'mouseup', up )
  }

  eventHelps.on( document, 'mousemove', moving)

  eventHelps.on( document, 'mouseup', up )
}