import { timeline } from "./scripts/libs/timeline.js";
import goldenMinerData from "./scripts/models/goldenMinerData.json";
import hookthing from "./scripts/models/hookthing.json";

var container = document.querySelector( '#container' );
var gameMap = document.createElement( 'div' );

gameMap.className = 'gameMap';
container.appendChild( gameMap );

var moneySum = document.querySelector( '.money-sum' );
var targetMoney = document.querySelector( '.target-money' );
var countdown = document.querySelector( '.countdown' );
var level = document.querySelector( '.level-count' );  

var config = {
  'containerWidth': 680,
  'containerHeight': 494,
  'hook': 80,
  'hookSpeed': 4,
  'angle': 25
};

var angleDir = 1.2;
var originY = 0; 
var originX = config.containerWidth/2 - config.hook/2;
var currentAngle = config.angle;
var speed = 4;
var direction = 0;
var hookAngleOffset = -90;
var sum = 0,levelCount = 1;
var targetMoneySum = 650;
var s = 61,stop,t;
var mainloops = [];

container.style.cssText = 'width:' + config.containerWidth + 'px;height:' + config.containerHeight + 'px';

var start = function(){
  var container1 = document.createElement( 'div' );

  container1.className = 'container1';
  container.appendChild( container1 );

  var glowed = document.createElement( 'div' );

  glowed.className = 'glowed';
  container1.appendChild( glowed );

  glowed.addEventListener( 'mousedown', function(){
    container1.style.width = 0 + 'px';
    container1.style.height = 0 + 'px';
    startTarget();
  }, false );
};

start();

function startTarget(){
  var goal = document.createElement( 'div' );
  goal.className = 'goal';
  container.appendChild( goal );
  var s = 3;
  function time(){
    s--;
    t = setTimeout( time, 1000 );

    if( s === 0  ){
      goal.style.width = 0 + 'px';
      goal.style.height = 0 + 'px';
      play();
      timeline( 60000, function( rate, animater ){
        countdown.innerHTML = Math.floor( ( 60000 - 60000 * rate ) / 1000 ); 
      } );
      clearTimeout( t );
    }
  }
  time();
}

function collisionDetection( x, y, mineral ){ 
  return Math.sqrt( Math.pow( x + 40 - ( mineral.pos[ 0 ] + mineral.width / 2 ), 2 ) +
    Math.pow( y - ( mineral.pos[ 1 ] + mineral.height / 2 ), 2 ) ) < mineral.width ? true : false;
};

var play = function(){
  var hook = document.createElement( 'div' );
  
  hook.className = 'hook';
  hook.style.cssText = 'width:' + config.hook + 'px; height:' + config.hook + 'px;'
  gameMap.appendChild( hook );

  var hookgold = document.createElement( 'div' );

  hookgold.className = 'hookgold';
  gameMap.appendChild( hookgold );

  var people = document.createElement( 'div' );

  people.className = 'people';
  container.appendChild( people );

  var peoplechange = function( time ){
    var s = time;
    var times = function(){
      s --;
      clearTimeout( t )
      t = setTimeout( times, 400 )
      s % 2 == 0 ? people.className = 'people' : people.className = 'people1';

      if( s == -1 )
        clearTimeout( t )
    };
    times();
  };

  var render = function(){
    for( var i in hookthing ){
      if( !hookthing[ i ][ 'el' ] ){
        hookthing[ i ].el = document.createElement( 'div' );
        hookthing[ i ].el.className = hookthing[ i ].className;
        hookthing[ i ].el.style.cssText = 'background:' + hookthing[ i ].url + ' no-repeat; width:' + 
        hookthing[ i ].width + 'px; height:' + hookthing[ i ].height + 'px; left:' + ( config.hook - hookthing[ i ].width ) / 2  +
         'px; top:' + hookthing[ i ].top + 'px' 
        hook.appendChild( hookthing[ i ].el );
      }
    }

    for( var i = 0, l = goldenMinerData.objects.length; i < l; i ++ ){
      var item = goldenMinerData.objects[ i ];
      if( !item[ 'el' ] ){
        item.el = document.createElement( 'div' );
        gameMap.appendChild( item.el );
      }
      item.el.style.cssText = 'width:' + item.width + 'px; height:' + item.height + 'px; background:' + item.url + 
        ' no-repeat; top:' + item.pos[ 1 ] + 'px; left:' + item.pos[ 0 ] + 'px; position: absolute;'; 
    }

    moneySum.innerHTML = sum;
    targetMoney.innerHTML = targetMoneySum;
    level.innerHTML = levelCount;
  };

  var mainloop = function(){
    var hookAngle = currentAngle + hookAngleOffset;
    var style = hook.style;

    style.transform = 'rotate(' + hookAngle + 'deg)';
    style.left = originX + 'px';
    style.top = originY + 'px';
    people.className = 'people';
    render();
    
    currentAngle += angleDir;

    if( currentAngle >= 155 || currentAngle <= 25 )
       angleDir = -angleDir;
  };
  
  function processControl(){
    if( mainloops.length == 0 )
      mainloops.push( mainloop );
    
    mainloops[ 0 ]();
    requestAnimationFrame( processControl );
  };

  processControl();

  var panning = function(){
    var r = currentAngle * Math.PI / 180;  
    var x = direction * Math.cos( r ) + originX;
    var y = direction * Math.sin( r ) + originY;
    var style = hook.style;

    style.left = x + 'px';
    style.top = y + 'px';
    direction += speed;
    
    for( var i = 0, l = goldenMinerData.objects.length; i < l; i ++ ){
      var item = goldenMinerData.objects[ i ];
      if( collisionDetection( x, y, item ) ){
        item.pos[ 1 ] = -500;
        render();
        hookthing[ item.type ].el.style.display = 'block';
        speed = speed / item.weight;
        sum += item.money;
        speed = -speed;
      }else if( direction >= 500 ){
        speed = -speed;
      }

      if( direction <= 0 ){
        speed = 4;
        mainloops.splice( 0, 1, mainloop );
        hookthing[ item.type ].el.style.display = 'none';
      }
    }
  };

  document.addEventListener( 'keydown', function( event ){
    var code = event.keyCode;

    if( code != 40 )
      return;

    switch( code ){
      case 40:
        mainloops.splice( 0,1, panning );
        peoplechange( 30 );
        break;

      default:
        return;
    }
  }, false );

  document.addEventListener( 'touchstart', function( event ){
    mainloops.splice( 0,1, panning );
    peoplechange( 30 );
  }, false );
};
