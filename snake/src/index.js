  import {mapping} from './scripts/libs/mapping.js';
  import {backEaseInOut} from './scripts/libs/backEaseInOut.js';
  var row = 15;
  var col = 25;
  var size = 32;
  var map = document.getElementById( 'map' );
  var snake = [ [ 3, 0 ], [ 2, 0 ], [ 1, 0 ] ];
  var currentDir = 'right', targetDir = 'right';
  var headx,heady,food,dir;
  var foodpos = [ 5, 5 ];
  var grow = false;
  var speed = 200;
  var sum = 0;
  var directions = mapping( [ 'name', 'keyCode', 'xOffset', 'yOffset', 'reverse','horver','xyOffset' ], [
    [ 'up', 38, 0, -1, 'down', 'ver', '0,-1' ],
    [ 'down', 40, 0, 1, 'up', 'ver', '0,1' ],
    [ 'left', 37, -1, 0, 'right', 'hor', '-1,0' ],
    [ 'right', 39, 1, 0, 'left', 'hor', '1,0' ]
  ] );

  var start = document.querySelector( '.start' );
  var over = document.querySelector( '.over' );
  var reset = document.querySelector( 'input' );
  var span = document.querySelector( 'span' );
  var nameFromKeyCode = directions( 'name', 'keyCode' );
  var xOffsetFromName = directions( 'xOffset', 'name' );
  var yOffsetFromName = directions( 'yOffset', 'name' );
  var reverseFromName = directions( 'reverse', 'name' );
  var horverFromName = directions( 'horver', 'name' );
  var namesetFromXYOffset = directions( 'name', 'xyOffset' );
  var onOff = true;
  var startMove = true;
  var downTime = 0, overTime = 0;
  var totalTime = Math.sqrt( 1000 * 2/0.001 );
  var startY = 120, currentStartY = -350, targetStartY = 520;
  var mapSize = [ col * size, row * size ];
  var startSize = [ start.offsetWidth, start.offsetHeight ];
  
  start.style.left = ( mapSize[ 0 ] - startSize[ 0 ] ) / 2 + 'px';
  over.style.left = ( mapSize[ 0 ] - startSize[ 0 ] ) / 2 + 'px';

  document.body.parentNode.style.overflow="hidden";
  var gameStart = function(){
    var nowTime = new Date().getTime();

    if( onOff ){
      downTime = new Date().getTime();
      onOff = false;
    }

    if( downTime ){
      if( nowTime - downTime < totalTime ){
        startY = backEaseInOut( nowTime - downTime, currentStartY, targetStartY, totalTime );
      }else{
        downTime = 0; 
      }
    }

    start.style.top = startY + 'px';
  };

  
  map.style.cssText = 'width:' + mapSize[ 0 ] + 'px; height:' + mapSize[ 1 ] + 'px;';

  var getDirection = function( block, targetBlock ){
    return namesetFromXYOffset( [ targetBlock[ 0 ] - block[ 0 ], targetBlock[ 1 ] - block[ 1 ] ].join(',') );
  };

  var getDirection2 = function( block, prevBlock, nextBlock ){
    var resultPrev,resultNext;
      resultPrev = getDirection( block, prevBlock );
      resultNext = getDirection( block, nextBlock );

    return reverseFromName( resultPrev ) == resultNext ? horverFromName( resultPrev ) : resultPrev + '-' + resultNext;
  };

  var getBodyPartName = function( data, index, array ){
    if( index === 0 ){
      return 'snake head-' + getDirection( array[ index + 1 ], data );
    }else if( index === array.length-1 ){
      return 'snake tail-' + getDirection( data, array[ index - 1 ] );
    }else{
      return 'snake body-' + getDirection2( data, array[ index - 1 ], array[ index + 1 ] );
    }
  }; 

  function show(){
    for( var i = 0, l = snake.length; i < l; i ++ ){
      if( !snake[ i ][ 2 ] ){
        snake[ i ][ 2 ] = document.createElement( 'div' );
        map.appendChild( snake[ i ][ 2 ] ); 
      }

      var BodyPartName = getBodyPartName( snake[ i ], i, snake );
      snake[ i ][ 2 ].className = BodyPartName; 
      snake[ i ][ 2 ].style.left = snake[ i ][ 0 ] * size + 'px';
      snake[ i ][ 2 ].style.top = snake[ i ][ 1 ] * size + 'px';   
    }

    if( !food ){
      food = document.createElement( 'div' );
      food.className = 'apple';
      map.appendChild( food );
    }

    food.style.left = foodpos[ 0 ] * size + 'px';
    food.style.top = foodpos[ 1 ] * size + 'px';
  }  

  function move(){
    var length = snake.length - 1;

    process.length = 0;
    
    for( var i = length; i > 0; i -- ){
      if( i == length && grow ){
        snake.push( [ snake[ length ][ 0 ], snake[ length ][ 1 ] ] );
        grow = false;
      }
      snake[ i ][ 0 ] = snake[ i - 1 ][ 0 ];
      snake[ i ][ 1 ] = snake[ i - 1 ][ 1 ];
    } 

    if( currentDir != targetDir )
      currentDir = targetDir;

    snake[ 0 ][ 0 ] += xOffsetFromName( currentDir );
    snake[ 0 ][ 1 ] += yOffsetFromName( currentDir );

    var headx = snake[ 0 ][ 0 ];
    var heady = snake[ 0 ][ 1 ];

    

    if( headx == foodpos[ 0 ] && heady == foodpos[ 1 ] ){
      var allSnakePos = {};
      var allFoodPos = [],temp;
      grow = true;
      sum ++;  
      span.innerHTML = sum + '个';

      for( var i = 0, l = snake.length; i < l; i ++ ){
        allSnakePos[ snake[ i ][ 0 ] + '_' + snake[ i ][ 1 ] ] = 1
      }

      for( var x = 0, l = col; x < l; x ++ ){
        for( var y = 0, v = row; y < v; y ++ ){
          if( !allSnakePos[ x + '_' + y ] )
            allFoodPos.push( [ x, y ] );
        }
      }

      temp = allFoodPos[ Math.floor( Math.random() * allFoodPos.length ) ];
      foodpos[ 0 ] = temp[ 0 ];
      foodpos[ 1 ] = temp[ 1 ];
    }

    if( headx < 0 || heady < 0 || headx > col - 1 || heady > row - 1 ){
      onOff = true;
      startMove = false;
      currentStartY = -320; 
      targetStartY = 520;
      process.push( gameOver );
    }

    for( var i = 1, l = snake.length; i < l; i ++ ){
      if( headx == snake[ i ][ 0 ] && heady == snake[ i ][ 1 ] ){
      onOff = true;
      startMove = false;
      currentStartY = -320; 
      targetStartY = 520;
      process.push( gameOver );
      }
    }

    if( startMove ){
      show();
      setTimeout( move, speed );          
    }
  };

  function gameOver(){
    var nowTime = new Date().getTime();

    if( onOff ){
      downTime = new Date().getTime();
      onOff = false;
    }

    if( downTime ){
      if( nowTime - downTime < totalTime ){
        startY = backEaseInOut( nowTime - downTime, -350, 520, totalTime );
      }else{
        downTime = 0; 
      }
    }
    
    over.style.top = startY + 'px';
  };

  var process = [ gameStart ];

  function mainloop(){
    process.forEach( function( game ){
      game();
    } );

    requestAnimationFrame( mainloop );
  }

  mainloop();

  map.addEventListener( 'click',function( event ){
    var target = event.target;

    switch( target.className ){
      case 'on':
        downTime = new Date().getTime();
        currentStartY = 200; 
        targetStartY = -520;
        setTimeout( move, 1500 );
        break;
      case 'restart':
        location.reload();
        break;
    }
  }, false );

  document.addEventListener( 'keydown', function( event ){
    dir = nameFromKeyCode( window.event.keyCode );

    if( dir == reverseFromName( currentDir ) || !dir )
      return;

    if( dir )
      targetDir = dir;
  }, false );