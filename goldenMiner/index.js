void function(){
  var container = document.querySelector( '#container' );
  var container2 = document.createElement( 'div' );

  container2.className = 'container2';
  container.appendChild( container2 );

  var moneySum = document.querySelector( '.money-sum' );
  var targetMoney = document.querySelector( '.target-money' );
  var countdown = document.querySelector( '.countdown' );
  var level = document.querySelector( '.level-count' );  

  var config = {
    'mapWidth': 680,
    'mapHeight': 494,
    'hook': 80,
    'hookSpeed': 4,
    'angle': 30,
  };

  var ironoreS = [
    [ Math.floor( Math.random() * 100 + 150 ), Math.floor( Math.random() * 60 + 110 ) ],
    [ Math.floor( Math.random() * 100 + 300 ), Math.floor( Math.random() * 60 + 110 ) ],
    [ Math.floor( Math.random() * 100 + 550 ), Math.floor( Math.random() * 60 + 110 ) ]
  ];

  var ironoreL = [
    [ Math.floor( Math.random() * 100 + 100 ), Math.floor( Math.random() * 70 + 250 ) ],
    [ Math.floor( Math.random() * 100 + 310 ), Math.floor( Math.random() * 70 + 250 ) ],
    [ Math.floor( Math.random() * 100 + 550 ), Math.floor( Math.random() * 70 + 250 ) ]
  ];

  var goldM = [
    [ Math.floor( Math.random() * 100 + 10 ), Math.floor( Math.random() * 70 + 170 ) ],
    [ Math.floor( Math.random() * 100 + 250 ), Math.floor( Math.random() * 70 + 170 ) ],
    [ Math.floor( Math.random() * 100 + 360 ), Math.floor( Math.random() * 70 + 170 ) ]
  ];

  var goldL =[ 
    [ Math.floor( Math.random() * 200 + 10 ), Math.floor( Math.random() * 70 + 330 ) ],
    [ Math.floor( Math.random() * 150 + 220 ), Math.floor( Math.random() * 70 + 330 ) ],
    [ Math.floor( Math.random() * 200 + 380 ), Math.floor( Math.random() * 70 + 330 ) ]
  ];

  var hookthing = {
    'hook1': { 'width': 23, 'height': 30, 'url': 'url(images/hook-1.png)', 'className': 'hook1', 'top': 0 },
    'hook3': { 'width': 23, 'height': 30, 'url': 'url(images/hook-3.png)', 'className': 'hook3', 'top': 0 },
    'goldL': { 'width': 68, 'height': 64, 'url': 'url(images/goldL.png)', 'className': 'goldL', 'top': 14 },
    'goldM': { 'width': 38, 'height': 34, 'url': 'url(images/goldM.png)', 'className': 'goldM', 'top': 14 },
    'ironoreL': { 'width': 56, 'height': 50, 'url': 'url(images/ironoreL.png)', 'className': 'ironoreL', 'top': 14 },
    'ironoreS': { 'width': 37, 'height': 30, 'url': 'url(images/ironoreS.png)', 'className': 'ironoreS', 'top': 14 }
  };

  var on = true;
  var off = false;
  var mainloopOnOff = true;
  var originY = 0; 
  var originX = config.mapWidth/2 - config.hook/2;
  var currentAngle;
  var speed = 4;
  var direction = 0;
  var hookAngleOffset = -90;
  var directionOn = true;
  var directionOff = false;
  var panningOnOff = false;
  var sum = 0,levelCount = 1;
  var targetMoneySum = 650;
  var s = 61,stop;

  container.style.cssText = 'width:' + config.mapWidth + 'px;height:' + config.mapHeight + 'px';

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

  function mineral( name, width, height, url){
    name.forEach( function( item, index ){
      if( !name[ index ][ 2 ] ){
        name[ index ][ 2 ] = document.createElement( 'div' );
        name[ index ][ 2 ].style.cssText = 'width:' + width + 'px; height:' + 
        height + 'px; left:' + name[ index ][ 0 ] + 'px; top:' + name[ index ][ 1 ] + 
        'px; position: absolute; background:' + url + ' no-repeat;';
        container2.appendChild( name[ index ][ 2 ] );
      }
    } );
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
    container2.appendChild( hook );

    var hookgold = document.createElement( 'div' );

    hookgold.className = 'hookgold';
    container2.appendChild

    var people = document.createElement( 'div' );

    people.className = 'people';
    container.appendChild( people );

    var map = document.createElement( 'div' );

    map.className = 'map';
    container.appendChild( map );

    var peoplechange = function( time ){
      var s = time;
      var times = function(){
        s --;
        clearTimeout( t )
        t = setTimeout( times,500 )

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
      mineral( ironoreS, hookthing.ironoreS.width, hookthing.ironoreS.height, hookthing.ironoreS.url );
      mineral( ironoreL, hookthing.ironoreL.width, hookthing.ironoreL.height, hookthing.ironoreL.url );
      mineral( goldM, hookthing.goldM.width, hookthing.goldM.height, hookthing.goldM.url );
      mineral( goldL, hookthing.goldL.width, hookthing.goldL.height, hookthing.goldL.url );
    };

    var mainloop = function(){
      var hookAngle = config.angle + hookAngleOffset;

      hook.style.transform = 'rotate(' + hookAngle + 'deg)';
      hook.style.left = originX + 'px';
      hook.style.top = originY + 'px';
      people.className = 'people';

      render();

      if( on ){
        config.angle += 1.5;
        currentAngle = config.angle
        speed = 4
        if( config.angle >= 150 ){
          on = false;
          off = true;
        }
      }
    
      if( off ){
        config.angle -= 1.5;
        currentAngle = config.angle

        if( config.angle <= 25 ){
          on = true;
          off = false;
        }
      }
       
      if( mainloopOnOff )
        requestAnimationFrame( mainloop );
    };

    mainloop();

    var panning = function(){
      var r = currentAngle * Math.PI / 180;  
      var x = direction * Math.cos( r ) + originX;
      var y = direction * Math.sin( r ) + originY;

      hook.style.left = x + 'px';
      hook.style.top = y + 'px';

      if( directionOn ){
        direction += speed;

        for( var i = 0, l = ironoreS.length; i < l; i ++ ){
          var hookX = x + config.hook / 2;
          var hookY = y + config.hook / 6;

          if( hookX > ironoreS[ i ][ 0 ] && hookX < ironoreS[ i ][ 0 ] + hookthing.ironoreS.width && hookY > 
            ironoreS[ i ][ 1 ] && hookY < ironoreS[ i ][ 1 ] + hookthing.ironoreS.height ){          
            ironoreS[ i ][ 2 ].style.display = 'none';
            ironoreS[ i ][ 0 ] = -300;
            hookthing.ironoreS.el.style.display = 'block';
            directionOff = true;
            directionOn = false;
            speed = 1.5;
            sum += 25;
            peoplechange( 8 );
          }else if( hookX > ironoreL[ i ][ 0 ] && hookX < ironoreL[ i ][ 0 ] + hookthing.ironoreL.width && hookY >
          ironoreL[ i ][ 1 ] && hookY < ironoreL[ i ][ 1 ] + hookthing.ironoreL.height ){
            ironoreL[ i ][ 2 ].style.display = 'none';
            ironoreL[ i ][ 0 ] = -300;
            hookthing.ironoreL.el.style.display = 'block';
            directionOff = true;
            directionOn = false;
            speed = 0.8;
            sum += 50; 
            peoplechange( 18 );
          }else if( hookX > goldM[ i ][ 0 ] && hookX < goldM[ i ][ 0 ] + hookthing.goldM.width && hookY >
          goldM[ i ][ 1 ] && hookY < goldM[ i ][ 1 ] + hookthing.goldM.height ){
            goldM[ i ][ 2 ].style.display = 'none';
            goldM[ i ][ 0 ] = -300;
            hookthing.goldM.el.style.display = 'block';
            directionOff = true;
            directionOn = false;
            speed = 1.5;
            sum += 200;
            peoplechange( 16 );
          }else if( hookX > goldL[ i ][ 0 ] && hookX < goldL[ i ][ 0 ] + hookthing.goldL.width && hookY >
          goldL[ i ][ 1 ] && hookY < goldL[ i ][ 1 ] + hookthing.goldL.height ){
            goldL[ i ][ 2 ].style.display = 'none';
            goldL[ i ][ 0 ] = -300;
            hookthing.goldL.el.style.display = 'block';
            directionOff = true;
            directionOn = false;
            speed = 0.5;
            sum += 500;
            peoplechange( 24 );
          }else if( direction >= 500 ){
            directionOff = true;
            directionOn = false;
            peoplechange( 6 );
          }
        }
      }

      if( directionOff ){
        direction -= speed;

        if( direction <= 0 ){
          speed = 4;
          hookthing.ironoreS.el.style.display = 'none';
          hookthing.ironoreL.el.style.display = 'none';
          hookthing.goldM.el.style.display = 'none';
          hookthing.goldL.el.style.display = 'none';
          directionOff = false;
          directionOn = true;
          panningOnOff = false;
          mainloopOnOff = true;
          mainloop();
        }
      }

      if( panningOnOff )
        requestAnimationFrame( panning ); 
    };


    document.addEventListener( 'keydown', function( event ){
      var code = event.keyCode;

      if( code != 40 )
        return;

      if( mainloopOnOff ){
        switch( code ){
          case 40:
            mainloopOnOff = false;
            panningOnOff = true;
            panning();
            peoplechange( 6 );
            break;

          default:
            return;
        }
      }
    }, false );

    document.addEventListener( 'mousedown', function( event ){
      if( mainloopOnOff ){
        mainloopOnOff = false;
        panningOnOff = true;
        panning();
        peoplechange( 6 );
      }
    }, false );
  };
}();