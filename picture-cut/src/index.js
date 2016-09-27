import { HTML } from "./scripts/libs/html.js";

function pictureCut( image ){
  var imageBoxWidth = image.parentNode.offsetWidth;
  var imageBoxHeight = image.parentNode.offsetHeight;
  var container = document.querySelector( '#container' );
  var definite = container.querySelector( '.definite' );
  var cancel = container.querySelector( '.cancel' );

  var model = {
    pos: [ 0, 0 ],
    size: [ 300, 300 ],
    pic: 'images/pic.jpg'
  }

  var config = {
    pos: [ 0, 0 ],
    minimumSize: [ 200, 200 ]
  }

  var htmls,selection,picBox,portraitBox,portrait;
  function render(){
    if( !model[ 'el' ] ){
      model.el = document.createElement( 'div' );
      image.parentNode.appendChild( model.el );

      selection = HTML( '<div class="selection"></div>').append( model.el );
      picBox = HTML( '<div></div>' ).append( image.parentNode );
     
      htmls = HTML( [
        '<div class="leftPicBox"></div>',
        '<div class="upPicBox"></div>',  
        '<div class="rightPicBox"></div>',
        '<div class="downPicBox"></div>'
      ] ).append( picBox );

      portraitBox = HTML( [ 
        '<div style="width:200px;',
        'height:200px;position:relative;',
        'border: 1px solid #41D0F5;',
        'overflow: hidden;"></div>'
      ] ).prepend( container );

      portrait = HTML( '<div></div>' ).append( portraitBox );
    }

    portrait.style.cssText = [
      'width:' + imageBoxWidth + 'px;',
      'height:' + imageBoxHeight +'px;',
      'left:' + config.pos[ 0 ] + 'px;',
      'top:' + config.pos[ 1 ] + 'px;',
      'background-image:url(' + model.pic + ');',
      'transform-origin:' + -config.pos[ 0 ] + 'px ' + -config.pos[ 1 ] + 'px;',
      'transform: scale(' + portraitBox.offsetWidth / model.size[ 0 ] + ',' +
       portraitBox.offsetHeight / model.size[ 1 ] + ');',
      'position: absolute;',
      'z-index: 10;cousor: move;'
    ].join( '' );

    model.el.style.cssText = [
      'width:' + model.size[ 0 ] + 'px;',
      'height:' + model.size[ 1 ] +'px;',
      'left:' + model.pos[ 0 ] + 'px;',
      'top:' + model.pos[ 1 ] + 'px;',
      'position: absolute;',
      'box-sizing: border-box;',
      'cousor: move;',
      'z-index: 100;overflow: hidden;'
    ].join( '' );

    selection.style.cssText = [
      'width:' + imageBoxWidth + 'px;',
      'height:' + imageBoxHeight +'px;',
      'left:' + config.pos[ 0 ] + 'px;',
      'top:' + config.pos[ 1 ] + 'px;',
      'position: absolute;',
      'z-index: 10;cursor: move;'
    ].join( '' );
    
    picBox.style.cssText = [
      'width:' + model.size[ 0 ] + 'px;',
      'height:' + model.size[ 1 ] + 'px;',
      'left:' + ( model.pos[ 0 ] - 2 ) + 'px;',
      'top:' + ( model.pos[ 1 ] - 2 ) + 'px;',
      'position: absolute;',
      'background-repeat: no-repeat;',
      'border: 2px solid #CA091E;',
      'box-sizing: content-box',
      'z-index: 50;'
    ].join( '' ); 

    htmls[ 0 ].style.cssText = [
      'height:' + model.el.offsetHeight + 'px;',
      'width: 60px; left: -60px; top: 0px;',
      'position: absolute; cursor: e-resize;',
      'z-index: 1000;'
    ].join( '' );

    htmls[ 1 ].style.cssText = [
      'width:' + model.el.offsetWidth + 'px;',
      'height: 60px; left: 0px; top: -60px;',
      'position: absolute; cursor: s-resize;',
      'z-index: 1000;'
    ].join( '' );

    htmls[ 2 ].style.cssText = [
      'height:' + model.el.offsetHeight + 'px;',
      'width: 60px; right: -60px; top: 0px;',
      'position: absolute; cursor: w-resize;',
      'z-index: 1000;'
    ].join( '' );

    htmls[ 3 ].style.cssText = [
      'width:' + model.el.offsetWidth + 'px;',
      'height: 60px; left: 0px; bottom: -60px;',
      'position: absolute; cursor: n-resize;',
      'z-index: 1000;'
    ].join( '' );
  }
  
  var recotdSize = [];
  var recordPicBoxPos = [];
  var recordPicPos = [];
  var target,mobile = true;
  var drag = function( picPos, picBoxPos, size, element ){
    var picBoxMouseIsDown,picMouseIsDown,offsetPosition = [], offsetSize = [];
      
    document.addEventListener( 'mousedown', function( event ){
      target = event.target;

      if( target.className === 'leftPicBox' || target.className === 'upPicBox' ||
        target.className === 'rightPicBox' || target.className === 'downPicBox' ){
        picBoxMouseIsDown = true;
        offsetSize[ 0 ] = event.clientX;
        offsetSize[ 1 ] = event.clientY;
        recotdSize[ 0 ] = size[ 0 ];
        recotdSize[ 1 ] = size[ 1 ];
        recordPicPos[ 1 ] = picPos[ 1 ];
        recordPicPos[ 0 ] = picPos[ 0 ];
        recordPicBoxPos[ 0 ] = picBoxPos[ 0 ];
        recordPicBoxPos[ 1 ] = picBoxPos[ 1 ];
      }
    }, false );

    element.addEventListener( 'mousedown', function( e ){
      picMouseIsDown = true;
      offsetPosition[ 0 ] = e.clientX - picBoxPos[ 0 ];
      offsetPosition[ 1 ] = e.clientY - picBoxPos[ 1 ];
    },false )

    var o;

    document.addEventListener( 'mousemove', function( event ){
        
      if( picBoxMouseIsDown ){
        var moveDistance = [ 
          event.clientX - offsetSize[ 0 ],
          event.clientY - offsetSize[ 1 ]
        ];

        if( target.className === 'leftPicBox' || target.className === 'rightPicBox' )
          o = moveDistance[ 0 ];
        else
          o = moveDistance[ 1 ];

        switch( target.className ){
          case 'leftPicBox':
          case 'upPicBox':
            if( recordPicBoxPos[ 0 ] + o < 0 )
              o = -recordPicBoxPos[ 0 ];

            if( recordPicBoxPos[ 1 ] + o < 0 ) 
              o = -recordPicBoxPos[ 1 ];

            if( recotdSize[ 0 ] - o < config.minimumSize[ 0 ] )
              o = recotdSize[ 0 ] - config.minimumSize[ 0 ];   

            if( recotdSize[ 1 ] - o < config.minimumSize[ 1 ] ){
              o = recotdSize[ 1 ] + config.minimumSize[ 1 ]; 
            }

           picBoxPos[ 0 ] = recordPicBoxPos[ 0 ] + o;
           picBoxPos[ 1 ] = recordPicBoxPos[ 1 ] + o;
           picPos[ 0 ] = -picBoxPos[ 0 ];
           picPos[ 1 ] = -picBoxPos[ 1 ];
           size[ 0 ] = recotdSize[ 0 ] - o;
           size[ 1 ] = recotdSize[ 1 ] - o;
           break;

           case 'rightPicBox':
           case 'downPicBox':
             if( recordPicBoxPos[ 0 ] + recotdSize[ 0 ] + o > imageBoxWidth )
               o = imageBoxWidth - recordPicBoxPos[ 0 ] - recotdSize[ 0 ];

             if( recordPicBoxPos[ 1 ] + recotdSize[ 1 ] + o > imageBoxHeight )
               o = imageBoxHeight - recordPicBoxPos[ 1 ] - recotdSize[ 1 ];

             if( recotdSize[ 0 ] + o < config.minimumSize[ 0 ] )
               o = config.minimumSize[ 0 ] - recotdSize[ 0 ];

             if( recotdSize[ 1 ] + o < config.minimumSize[ 1 ] )
               o = config.minimumSize[ 1 ] - recotdSize[ 1 ];

             
           size[ 0 ] = recotdSize[ 0 ] + o;
           size[ 1 ] = recotdSize[ 1 ] + o; 
           break;
        }

        render();
      }

      if( picMouseIsDown  ){
        picBoxPos[ 0 ] = event.clientX - offsetPosition[ 0 ];
        picBoxPos[ 1 ] = event.clientY - offsetPosition[ 1 ];
        picPos[ 0 ] = - picBoxPos[ 0 ]; 
        picPos[ 1 ] = - picBoxPos[ 1 ];

        if( picBoxPos[ 0 ] < 0 ){
          picBoxPos[ 0 ] = 0;
          picPos[ 0 ] = 0;
        }
        if( picBoxPos[ 1 ] < 0 ){
          picBoxPos[ 1 ] = 0;
          picPos[ 1 ] = 0;
        }
        if( picBoxPos[ 0 ] + size[ 0 ] > imageBoxWidth ){
          picBoxPos[ 0 ] = imageBoxWidth - size[ 0 ]; 
          picPos[ 0 ] = size[ 0 ] - imageBoxWidth ;
        }
        if( picBoxPos[ 1 ] + size[ 1 ] > imageBoxHeight ){
          picBoxPos[ 1 ] = imageBoxHeight - size[ 0 ];
          picPos[ 1 ] = size[ 0 ] - imageBoxHeight;
        }
        render();
      }
    }, false );

    document.addEventListener( 'mouseup', function( event ){
      picBoxMouseIsDown = false;
      picMouseIsDown = false;
    }, false );
  };

  container.addEventListener( 'click', function( event ){
    switch( event.target.className ){
      case 'definite':
        image.style.display = 'none';
        model.el.style.display = 'none';
        picBox.style.display = 'none';
        break;
      case 'cancel':
        image.style.display = 'block';
        model.el.style.display = 'block';
        picBox.style.display = 'block';
        break;  
    }
  }, false );

  render();
  drag( config.pos, model.pos, model.size, model.el )
}  

pictureCut( document.getElementById( 'image' ) )
