const eventHelps = {
  on: ( element, type, fn )=>{
        if( element.addEventListener ){
          element.addEventListener( type, fn, false );
        }else if( element.attachEvent ){
          element.attachEvent( 'on' + type, fn );
        }else
          element[ 'on' + type ] = fn;
      },


  off: ( element, type, fn )=>{
         if( element.removeEventListener ){
           element.removeEventListener( type, fn, false )
        }else if( element.detachEvent ){
          element.detachEvent( 'on' + type, fn )
        }else{
          element[ 'on' + type ] = null;
        }
      }
} 

export default eventHelps;