export var eventHelper = function(){
  var on, off, lisener;

  lisener = function( fn, element ){
    return function(){
      fn.apply( element, arguments );
    }
  };

  if( window.addEventListener ){
    on = function( element, name, fn ){
      fn = lisener( fn, element );
      element.addEventListener( name, fn, false );
      return fn;
    };
    off = function( element, name, fn ){
      element.removeEventListener( name, fn );
    }
  }else{
    on = function( element, name, fn ){
      fn = lisener( fn, element );
      element.attachEvent( "on" + name, fn );
      return fn;
    };
    off = function( element, name, fn ){
      element.detachEvent( "on" + name, fn );
    }
  }

  return { on: on, off: off }
}();