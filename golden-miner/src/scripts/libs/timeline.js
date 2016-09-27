export var timeline = function( time, callback ){
  var startTime = Date.now();
  var started,ended,restarts,stop,pauseOnOff,reverses,roundtrips;
  var pauseTime,offSetTime = 0;
  var animater = {
    state: 'started',

    stop: function(){
      stop = true;
    },

    reverse: function(){
      reverses = !reverses;
      init();
    },

    restart: function(){
      restarts = true;
      init();
    },

    pause: function(){
      pauseOnOff = true;
      pauseTime = Date.now();
    },

    resume: function(){
      pauseOnOff = false;
      offSetTime = Date.now() - pauseTime;
    }
  };
  
  function init(){
    animater.state = 'started';
    startTime = Date.now();
  }

  var mainloop = function mainloop(){
    var nowTime,rate;

    if( pauseOnOff ){
      requestAnimationFrame( mainloop );
      return;
    }

    nowTime = Date.now();
    rate = ( nowTime - startTime - offSetTime ) / time;
    if( stop ){
      return;
    }
    
    if( animater.state == 'started' && rate < 1 ){
      callback( reverses ? 1 - rate : rate, animater );
    }else if( rate <= 0 ){
      rate = 0;
      callback( reverses ? 1 - rate : rate, animater );
    }else if( rate >= 1 ){
      animater.state = 'ended';
      rate = 1;
      callback( reverses ? 1 - rate : rate, animater );
    }

      requestAnimationFrame( mainloop )
  }();
  
};



