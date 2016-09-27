export var direction = function(){
  var atan2 = Math.atan2, PI = Math.PI;
  var directions = [ 'SW', 'W', 'NW', 'N', 'Ne', 'E', 'SE', 'S' ];
  return function( p1, p2 ){
    var n = Math.floor( ( atan2( p2[ 1 ] - p1[ 1 ], p2[ 0 ] - p1[ 0 ] ) * 180 / PI + 250 ) / 45 ) % 8;
    return directions[ n ];
  }
}();
