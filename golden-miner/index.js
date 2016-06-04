void function(){
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

  var goldenMinerData = {
    "type": { 
      "ironoreS": { "p": [ 100, 230 ], "p1": [ 250, 200 ], "p2": [ 550, 220 ] },
      "ironoreL": { "p": [ 330, 250 ], "p1": [ 150, 270 ], "p2": [ 450, 220 ] },
      "goldM": { "p": [ 440, 300 ], "p1": [ 350, 170 ], "p2": [ 70, 300 ] },
      "goldL": { "p": [ 550, 400 ], "p1": [ 150, 370 ] }
    },
    "porperty": {
      "ironoreS": { "weight": 2.5, "money": 20, "width": 37, "size": 20, "height": 30, "url": "url(images/ironoreS.png)", "top": 14, "className": "ironoreS" },
      "ironoreL": { "weight": 5, "money": 50, "size": 35, "width": 56, "height": 50, "url": "url(images/ironoreL.png)", "top": 14, "className": "ironoreL" },
      "goldM": { "weight": 2.5, "money": 200, "size": 20, "width": 38, "height": 34, "url": "url(images/goldM.png)", "top": 14, "className": "goldM" },
      "goldL": { "weight": 5, "money": 500, "size": 34, "width": 68, "height": 64, "url": "url(images/goldL.png)", "top": 14, "className": "goldL" }
    }
  };

  var hookthing = {
    "hook1": { "width": 23, "height": 30, "url": "url(images/hook-1.png)", "className": "hook1", "top": 0 },
    "hook3": { "width": 23, "height": 30, "url": "url(images/hook-3.png)", "className": "hook3", "top": 0 },
    "goldL": { "width": 68, "height": 64, "url": "url(images/goldL.png)", "className": "goldL", "top": 14 },
    "goldM": { "width": 38, "height": 34, "url": "url(images/goldM.png)", "className": "goldM", "top": 14 },
    "ironoreL": { "width": 56, "height": 50, "url": "url(images/ironoreL.png)", "className": "ironoreL", "top": 14 },
    "ironoreS": { "width": 37, "height": 30, "url": "url(images/ironoreS.png)", "className": "ironoreS", "top": 14 }
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
  var s = 61,stop;
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
    var target1 = document.createElement( 'div' );
    var s = 3;

    target1.className = 'target1';
    container.appendChild( target1 );
    function time(){
      s--;
      t = setTimeout( time, 1000 );

      if( s === 0  ){
        target1.style.width = 0 + 'px';
        target1.style.height = 0 + 'px';
        play();
        times();
        clearTimeout( t );
      }
    }
    time();
  }

  function mineral( type, porperty, divinset ){
    for( var i in type ){
      for( var l in type[ i ] ){
        if( !type[ i ][ l ][ 'el' ] ){
          type[ i ][ l ].el = document.createElement( 'div' );
          type[ i ][ l ].el.style.cssText = 'width:' + porperty[ i ].width + 'px; height:' +
          porperty[ i ].height + 'px; background:' + porperty[ i ].url + 
          ' no-repeat; position:absolute; left:' + type[ i ][ l ][ 0 ] + 'px; top:' + type[ i ][ l ][ 1 ] + 'px';
          divinset.appendChild( type[ i ][ l ].el );
        }
      }
    }
  };

  function collisionDetection( x, y, type, porperty ){ 
    return Math.sqrt( Math.pow( x + 40 - ( type[ 0 ] + porperty.width / 2 ), 2 ) +
      Math.pow( y - ( type[ 1 ] + porperty.height / 2 ), 2 ) ) < porperty.size ? true : false;
  };

  function times(){
    s--;
    stop = setTimeout( times, 1000 );
    countdown.innerHTML = s;

    if( s == 0 ){
      clearTimeout( stop )
      // targetMoneySum > sum ? alert( '没有达到目标金钱' ) : alert( '恭喜过关' );
    }
  };
 
  var play = function(){
    var hook = document.createElement( 'div' );
    
    hook.className = 'hook';
    hook.style.cssText = 'width:' + config.hook + 'px; height:' + config.hook + 'px;'
    gameMap.appendChild( hook );

    var hookgold = document.createElement( 'div' );

    hookgold.className = 'hookgold';
    gameMap.appendChild

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

      moneySum.innerHTML = sum;
      targetMoney.innerHTML = targetMoneySum;
      level.innerHTML = levelCount;
      mineral( goldenMinerData.type, goldenMinerData.porperty, gameMap );
    };

    var mainloop = function(){
      var hookAngle = currentAngle + hookAngleOffset;

      hook.style.transform = 'rotate(' + hookAngle + 'deg)';
      hook.style.left = originX + 'px';
      hook.style.top = originY + 'px';
      people.className = 'people';

      render();
      
      currentAngle += angleDir;

      if( currentAngle >= 155 || currentAngle <= 25 ){
         angleDir = -angleDir
       } 
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

      hook.style.left = x + 'px';
      hook.style.top = y + 'px';
      direction += speed;
        
      for( var i in goldenMinerData.type ){
        for( var l in goldenMinerData.type[ i ] ){
          if( collisionDetection( x, y, goldenMinerData.type[ i ][ l ], goldenMinerData.porperty[ i ] ) ){
            goldenMinerData.type[ i ][ l ][ 0 ] = -300;
            goldenMinerData.type[ i ][ l ].el.style.display = 'none';
            hookthing[ i ].el.style.display = 'block';
            speed = speed / goldenMinerData.porperty[ i ].weight;
            sum += goldenMinerData.porperty[ i ].money;
            speed = -speed;
          }else if( direction >= 500 ){
            speed = -speed;
          }
        }
      }

      if( direction <= 0 ){
        speed = 4;
        mainloops.splice( 0, 1, mainloop );
        hookthing.ironoreS.el.style.display = 'none';
        hookthing.ironoreL.el.style.display = 'none';
        hookthing.goldM.el.style.display = 'none';
        hookthing.goldL.el.style.display = 'none';
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

    document.addEventListener( 'mousedown', function( event ){
      mainloops.splice( 0,1, panning );
      peoplechange( 30 );
    }, false );
  };
}();