let drag = require( './scripts/libs/drag' );
let closest = require( 'closest' );
let HTML = require( 'html' );
let model = require( './scripts/models/model.json' );

let container = document.getElementById( 'container' );
let desktopContainer = container.querySelector( '#desktop-container' );
let sliderNav = desktopContainer.querySelector( '.slider-nav' );
let sliderPrev = container.querySelector( '.slider-prev' );
let sliderNext = container.querySelector( '.slider-next' );
let dockContainer = container.querySelector( '.dock-container' );
let dock = container.querySelector( '.dock' );
let dockApp = container.querySelector( '.dock-app' );
let downMenu = container.querySelector( '.down-menu' );
let upMenu = container.querySelector( '.up-menu' );
let sliderDesktop = document.getElementById( 'slider-desktop' );
let indexBlock = container.querySelector( '.index-block' );

let configs = {
  containerSize: [ 1440, 700 ],
  desktopStartPosition: [ 170, 30 ],
  desktopSpaceSize: [ 204, 130 ],
  desktopSize: [ 1440, 580 ],
  iconSize: [ 80, 80 ],
  dockStartPosition: [ 270, 48 ],
  dockSpaceSize: [ 204, 48 ],
  colNum: 6
}

window.addEventListener( 'resize', () => {
}, false );

let css = {
  transform: ( element, position ) =>
    element.style.transform = `translate3d(${ position[ 0 ] }px,${ position[ 1 ] }px,0px)`,

  translate3dScale: ( element, position, scale ) =>
    element.style.transform = `translate3d(${position[ 0 ]}px,
    ${position[ 1 ]}px,0px) scale(${scale[ 0 ]},${scale[ 1 ]})`,

  spaceIndexLeftWidth: ( element, position ) =>{
    element.style.left = position[ 0 ] + 'px';
    element.style.width = position[ 1 ] + 'px';
  },

  enlarge: ( desktop, element, size, targetSize ) =>{
    let x = targetSize[ 0 ] / size[ 0 ];
    let y = targetSize[ 1 ] / size[ 1 ];
    let position = getTransformPosition( desktop );
    let elementLeft = element.getBoundingClientRect().left;
    let elementTop = element.getBoundingClientRect().top;
    let translateX = desktop.offsetWidth * 5 / 2 - desktop.offsetWidth / 2 - 
      ( elementLeft * 5 - ( desktop.offsetWidth / 2 - element.offsetWidth * 5 / 2 ) ); 
    let translateY = configs.containerSize[ 1 ] * 6 / 2 - configs.containerSize[ 1 ] / 2 -
     elementTop * 6 + (configs.containerSize[ 1 ] - element.offsetHeight * 6 ) / 2 - 300;
    desktopContainer.style.height = configs.containerSize[ 1 ] + 'px';
    container.parentNode.onmousewheel = () => false;
    desktop.style.transform = `translate3d(${ translateX }px,${ translateY }px,0px) scale(5,6)`;

    let { style, firstChild, classList, lastChild } = element.lastChild;
    let { elStyle } = element.parentNode;
    style.transform = `translate3d(0,0,0) scale(${ x/5 },${ y/6 })`;
    firstChild.style.transform = `translate3d(0,0,0) scale(${ 5/x },${ 6/y })`;
    classList.remove( 'hidden' );
    lastChild.classList.remove( 'hidden' );
    element.parentNode.style.zIndex = 20;
    element.parentNode.position = 'absolute';
    dockContainer.style.zIndex = 0;
    sliderNext.style.display = 'none';
    sliderPrev.style.display = 'none';
    console.log( sliderPrev );
    dockContainer.style.transform = 'translate3d(' + -2000 + 'px,' + -1700 + 'px,0px) scale('+ 5 +','+ 6 +')';
  },

  transformPosition: ( element, position, pos ) =>{
    let Pos = pos === undefined ? [ 0, 0 ] : pos;
    element.style.transform = `translate3d(${Pos[ 0 ] + position[ 0 ]}px,${Pos[1] + position[ 1 ]}px,0px)`;
  },

  reduce: ( desktop, element ) =>{
    desktop.style.transform = 'scale(1,1)';
    desktopContainer.style.height = 580 + 'px';
    element.parentNode.style.transform = 'scale(1,1)';
    container.parentNode.onmousewheel = () => true;
    setTimeout( () => element.parentNode.classList.add( 'hidden' ), 180 );
    
    element.parentNode.style.zIndex = 2;
    element.classList.add( 'hidden' );
    dockContainer.style.zIndex = 2;
    sliderNext.style.display = 'block';
    sliderPrev.style.display = 'block';
    dockContainer.style.transform = 'translate3d(0,0,0) scale(1,1)';
  },

  position: ( element, position ) =>{
    element.style.left = position[ 0 ] + 'px';
    element.style.top = position[ 1 ] + 'px';
  },

  size: ( element, size ) =>{
    element.style.width = size[ 0 ] + 'px';
    element.style.height = size[ 1 ] + 'px';
  }
} 

var enlarge = ( element ) =>{
  let x = configs.containerSize[ 0 ] / element.offsetWidth;
  let y = configs.containerSize[ 1 ] / element.offsetHeight;
  let elementPosition = getTransformPosition( element.parentNode );
  let translateX = configs.containerSize[ 0 ] * 5 / 2 - configs.containerSize[ 0 ] / 2 -
      ( elementPosition[ 0 ] * 5 - ( configs.containerSize[ 0 ] / 2 - element.offsetWidth * 5 / 2 ) ); 
  let translateY = configs.containerSize[ 1 ] * 6 / 2 - configs.containerSize[ 1 ] / 2 -
     ( elementPosition[ 1 ] * 6 - ( configs.containerSize[ 1 ] / 2 - element.offsetHeight * 6 / 2 ) ) -
     ( configs.containerSize[ 1 ] - dock.offsetHeight );
  dock.style.transform = 'translate3d(' + translateX + 'px,' + translateY + 'px,0px) scale(' + 5 + ',' + 6 + ')';
  dock.style.height = configs.containerSize[ 1 ] + 'px';

  element.lastChild.style.transform = `translate3d(0,0,0) scale(${ x/5 },${ y/6 })`;
  element.lastChild.firstChild.style.transform = `translate3d(0,0,0) scale(${ 5/x },${ 6/y })`;
  element.lastChild.classList.remove( 'hidden' );
  element.lastChild.lastChild.classList.remove( 'hidden' );
  dockContainer.style.zIndex = 2;
  sliderNext.style.display = 'none';
  sliderPrev.style.display = 'none';
  desktopContainer.style.transform = `translate3d(${ translateX }px,-1700px,0px) scale(5,6)`;
}

var reduce = ( element ) =>{
  closest( element, '.dock' ).style.transform = 'scale(1,1)';
  setTimeout( () => {
    dock.style.height = '160px';
  }, 1000 );
  element.parentNode.style.transform = 'scale(1,1)';
  setTimeout( () => element.parentNode.classList.add( 'hidden' ), 180 );
  element.classList.add( 'hidden' );
  dockContainer.style.zIndex = 2;
  desktopContainer.style.transform = 'translate3d(0,0,0) scale(1,1)';
  sliderNext.style.display = 'block';
  sliderPrev.style.display = 'block';
}

var desktopContainerRender = () =>{
  model.desktops.forEach( ( el, index ) => {
    if( !el.desktop ){
      el.desktop = document.createElement( 'div' );
      el.desktop.className = 'desktop';
      el.desktop.setAttribute( 'data-index', index );
      sliderDesktop.appendChild( el.desktop );
    }
    css.transform( el.desktop, [ configs.containerSize[ 0 ] *
    el.desktop.dataset.index, 0 ] )

    if( !el.sliderItem ){
      el.sliderItem = document.createElement( 'li' );
      el.sliderItem.setAttribute( 'data-index', index );
      el.sliderItem.className = index === 0 ? 'slider-item checked' : 'slider-item';
      sliderNav.appendChild( el.sliderItem );
    }
  } );
}

desktopContainerRender();

model.desktops.forEach( ( element ) => {
  element.forEach( ( item, index ) => {
    let desktopHtml = HTML( [
      '<div class="item-container">',
        `<div class="item" data-index="${ index }" style="background-image: url(${ item.pic });">`,
          `<div class="title">${ item.title }</div>`,
          '<div class="before-space"></div>',
          '<div class="after-space hidden"></div>',
          '<div class="close"></div>',
          '<div class="app hidden">',
            '<input type="button" value="关闭" class="desktop-app-off hidden">',
          '</div>',  
        '</div>',
        `<div class="inline-box hidden" data-index="${ index }"></div>`,
        '<div class="app hidden"></div>',
        '<input class="inline-box-name hidden" type="text" value="未定义">',
      '</div>'
    ] ).append( element.desktop );
    let titleHtml = HTML( '<div class="title hidden">' + 
    closest( desktopHtml, '.inline-box-name hidden' ).value + '</div>' ).append( desktopHtml );
    css.transform( desktopHtml, [ 
      configs.desktopStartPosition[ 0 ] + ( index % configs.colNum ) * configs.desktopSpaceSize[ 0 ],
      configs.desktopStartPosition[ 1 ] + (index / configs.colNum | 0 ) * configs.desktopSpaceSize[ 1 ]
    ] );
  } );
} );

model.dock.forEach( ( item,index ) => {
  let dockHtml = HTML( [
    '<div class="item-container">',
      `<div class="item" data-index="${ index }" style="background-image: url(${ item.pic });">`,
        `<div class="title">${ item.title }</div>`,
        '<div class="before-space"></div>',
        '<div class="close"></div>',
        '<div class="app hidden">',
            '<input type="button" value="关闭" class="dock-app-off hidden">',
        '</div>',
      '</div>',
    '</div>'
  ] ).append( dock );
  
  css.transform( dockHtml, [
    configs.dockStartPosition[ 0 ] + ( index % configs.colNum ) * configs.dockSpaceSize[ 0 ],
    configs.dockStartPosition[ 1 ]
  ] );
} );

let box = document.createElement( 'div' );
box.className = 'box';
container.appendChild( box );

// let dockBox = document.createElement( 'div' );
// dockBox.className = 'dockBox';
// dockContainer.appendChild( dockBox );

var spaceStyle = ( container, html ) =>{
  css.spaceIndexLeftWidth( html.length ? html[ 0 ] : html, [ 
        -configs.dockSpaceSize[ 0 ] + configs.iconSize[ 0 ], 
        configs.dockSpaceSize[ 0 ] -  configs.iconSize[ 0 ]
      ] );
  container.length === 3 ? css.spaceIndexLeftWidth( html[ 2 ], [
    configs.iconSize[ 0 ],
    configs.dockSpaceSize[ 0 ] -  configs.iconSize[ 0 ]  
  ] ) : null;
}

var sliderDesktopIndexEndPositionRender = () =>{
  Array.from( sliderDesktop.children ).forEach( ( item, index ) => {
    Array.from( item.children ).forEach( ( el, index ) => {
      let elIndex = Number( el.firstChild.dataset.index );
      ( elIndex === configs.colNum - 1 || elIndex === configs.colNum * 2 - 1 ||
       elIndex === configs.colNum * 3 - 1 ) ? ( closest( el.firstChild, '.after-space hidden' ) !==
        null ? closest( el.firstChild, '.after-space hidden' ).classList.remove( 'hidden' ) : '' ):
      ( closest( el.firstChild, '.after-space' ) !== null ?
       closest( el.firstChild, '.after-space' ).classList.add( 'hidden' ) : '');
      css.transform( el, [ 
        configs.desktopStartPosition[ 0 ] + ( elIndex % configs.colNum ) * configs.desktopSpaceSize[ 0 ],
        configs.desktopStartPosition[ 1 ] + ( elIndex / configs.colNum | 0 ) * configs.desktopSpaceSize[ 1 ] 
      ] );
    } );
  } );
}

let sliderDockIndexEndPositionRender = ()=>{
  Array.from( dock.children ).forEach( (item) =>{
    let elIndex = Number( item.firstChild.dataset.index );
    css.transform( item, [ 
      configs.dockStartPosition[ 0 ] + ( elIndex % configs.colNum ) * configs.dockSpaceSize[ 0 ],
      configs.dockStartPosition[ 1 ] 
    ] );  
  } );
}

var inlineBoxIndexEndPositionRender = ( element ) =>{
  Array.from( element.children ).forEach( ( item, index ) => {
    let elIndex = Number( item.firstChild.dataset.index );
    item.firstChild.classList.add( 'animate' );
    inlineBoxHtml = HTML( [
      '<div class="before-space"></div>',
      '<div class="close"></div>',
      elIndex % configs.colNum === configs.colNum - 1 ? '<div class="after-space"></div>' : ''
    ] ).append( item.firstChild );
      
      css.transform( item, [ 
        configs.desktopStartPosition[ 0 ] - 80 + ( elIndex % configs.colNum ) * (configs.desktopSpaceSize[ 0 ] - 160),
        configs.desktopStartPosition[ 1 ] + ( elIndex / configs.colNum | 0 ) * configs.desktopSpaceSize[ 1 ] 
      ] );
  } );
}

var positionTest = ( container, position ) =>{
  let arr = Array.from( container.children );
  let containerSize = [ container.offsetWidth, container.offsetHeight ];
  let item = getTransformPosition( arr[ arr.length-1 ] );
    
  if( container.className === 'desktop' ){
    if( item[ 0 ] + configs.iconSize[ 0 ] < position[ 0 ]  && item[ 1 ] < 
      position[ 1 ] && position[ 0 ] < containerSize[ 0 ] && position[ 1 ] < containerSize[ 1 ] ){
      return true;
    }else if( item[ 1 ] + configs.iconSize[ 1 ] < position[ 1 ] &&
      position[ 0 ] < containerSize[ 0 ] && position[ 1 ] < containerSize[ 1 ] - sliderNav.offsetHeight ){
      return true;
    }else{
      return false;
    }
  }else{
    if( item[ 0 ] + configs.iconSize[ 0 ] < position[ 0 ] && configs.containerSize[ 1 ] -
    containerSize[ 1 ] < position[ 1 ] && position[ 1 ] < configs.containerSize[ 1 ] ){
      return true;
    }else if( item[ 1 ] + configs.desktopSize[ 1 ] > position[ 1 ] &&
    configs.desktopSize[ 1 ] - sliderNav.offsetHeight < position[ 1 ]  ){
      return true;
    }{
      return false;
    }
  }
}
 
var getTransformPosition = ( element ) =>{
  let str = element.style.transform;
  let position = [
    Number( parseFloat( str.substring( 12 ).split( ',' ) ) ),
    Number( parseFloat( str.substring( 12 ).split( ',' )[ 1 ] ))
  ];
  return position;
}

let target,times,mouseIsdown,startIndex,downIsIndex;
let desktopItem,dockItem;

document.addEventListener( 'mousedown', event => {
  mouseIsdown = true;
  target = event.target;
  if( target.className === 'item' ){
    times = setTimeout( () => { 
      sliderDesktopIndexEndPositionRender();
      container.classList.add( 'animate' );
    },1500 )
  }

  if( closest( target, '.hidden animate' ) && target.className === 'item' ){
    let position = getTransformPosition( target.parentNode );
    let dockpos = [ position[ 0 ], position[ 1 ] + 540 ];
    let pos = closest( target, '.desktop' ) !== null ? position : dockpos; 
    
    drag( event, offsetPosition => css.transformPosition( box, offsetPosition, pos ) );
    
    if( box.firstChild === null ){
      desktopItem = closest( target, '.desktop' );
      dockItem = closest( target, '.dock' );
      target.classList.remove( 'animate' );
      target.classList.add( 'add' );
      target.parentNode.style.transform = '';
      box.appendChild( target.parentNode );
      startIndex = Number( target.dataset.index );
      downIsIndex = true;  
    }
  }

  // if( closest( target, '.hidden animate' ) && closest( target, '.dock' ) && target.className === 'item' ){
  //   let dockpos = getTransformPosition( target.parentNode )
  //   drag( event, offsetPosition => css.transformPosition( target.parentNode, offsetPosition, dockpos ) );  
  //   if( box.firstChild === null ){
  //     css.translate3dScale( box, [ 0, 0 ], [ 1, 1 ] );

  //     target.classList.remove( 'animate' );
  //     target.classList.add( 'add' );
  //     dockBox.appendChild( target.parentNode );
  //     startIndex = Number( target.dataset.index );
  //   }
  // }

  if( target.className === 'desktop-app-off' ){
    let desktopElement = closest( target, '.desktop' )
    css.reduce( desktopElement, target );
  }

  if( target.className === 'dock-app-off' ){
    reduce( target );
  }
}, false );

let desktopIndex,dockIndex,index; 
document.body.addEventListener( 'mousemove', ( event ) => {
  let target = event.target;
  let className = target.className;
  let containerArr,desktopArr;
  
  if( box.firstChild ){
    if( !downIsIndex )
      return;

    if( className === 'desktop' || className === 'dock' ){
      desktopArr = Array.from( target.children );
    }

    let mousePosition = [ event.clientX + window.pageXOffset, event.clientY + window.pageYOffset ];
    let limit = className === 'desktop' || className === 'dock' ?
     positionTest( target, mousePosition ) : false;
    
    if( limit ){
      index = Number( desktopArr[ desktopArr.length-1 ].firstChild.dataset.index ) + 1;
      sequence( startIndex, index, target );
      downIsIndex =  false;
    }

  }  
}, false );

let endIndex,pageTurning;
document.addEventListener( 'mouseover', event => {
  let overOut = event.target;
  let desktop = closest( overOut, '.desktop' );
  let dock = closest( overOut, '.dock' );
  let container = desktop !== null ? desktop : dock;
  let leng,itemIndex,index,containerArr;
  let lastDesktopIndex = Number( model.desktops[ model.desktops.length-1 ].desktop.dataset.index );
  let firstDesktopIndex = Number( model.desktops[ 0 ].desktop.dataset.index );

  if( overOut.className === 'slider-next' && lastDesktopIndex !== 0 )
    itemIndex = -1;
  

  if( overOut.className === 'slider-prev' && firstDesktopIndex !== 0 )
    itemIndex = 1;

  if( ( overOut.className === 'slider-next' || overOut.className === 'slider-prev' ) && itemIndex ){
    for( var i = 0; i < model.desktops.length; i ++ ){
      leng = Number( model.desktops[ i ].desktop.getAttribute( 'data-index' ) ) + itemIndex;
      model.desktops[ i ].sliderItem.className = leng === 0 ? 'slider-item checked' : 'slider-item';  
      model.desktops[ i ].desktop.setAttribute( 'data-index', leng);

      if( leng === 0 )
        desktopArr = model.desktops[ i ].desktop.children;
    }

    desktopContainerRender();
  }

  if( box.firstChild && !downIsIndex ){
    if( overOut.className === 'desktop' || overOut.className === 'dock' ){
      containerArr = Array.from( overOut.children );
      index = Number( containerArr[ containerArr.length-1 ].firstChild.dataset.index ) + 1;
      startIndex = index;  
    }
  }

  if( box.firstChild && ( overOut.className === 'before-space' || overOut.className === 'after-space' ) ){
    if( overOut.className === 'before-space' ){
      endIndex = Number( overOut.parentNode.dataset.index );
      endIndex = ( endIndex === configs.colNum || endIndex === configs.colNum * 2 ||
      endIndex === configs.colNum * 3 ) && startIndex < endIndex ? endIndex + 1 : endIndex;
      downIsIndex = true; 
    }

    if( overOut.className === 'after-space' ){
      endIndex = ( typeof endIndex === 'number' && startIndex < endIndex ?
      Number( overOut.parentNode.dataset.index ) + 1 : Number( overOut.parentNode.dataset.index ) );
      downIsIndex = true;  
    }

    sequence( startIndex, endIndex, container );
  }

  // if( box.firstChild && overOut.className === 'item animate' ){
  //     let title = closest( overOut, '.title' );
  //     let inlineBox = closest( overOut, '.inline-box hidden' )
  //     let close = closest( overOut, '.close' );
  //     let inlineBoxName = closest( overOut, '.inline-box-name hidden' );
  //     inlineBoxName.classList.remove( 'hidden' );
  //     title.classList.add( 'hidden' );
  //     inlineBox.classList.remove( 'hidden' )
  //     close.classList.add( 'hidden' );
  //     let app = closest( overOut, '.app hidden' );
  //     time = setTimeout( () => {
  //       css.size( inlineBox, [
  //         configs.containerSize[ 0 ] - configs.iconSize[ 0 ] * 2,
  //         180
  //       ] );
  //       overOut.parentNode.style.zIndex = 4;
  //       css.position( inlineBox, [ 
  //         -overOut.getBoundingClientRect().left + configs.iconSize[ 0 ],
  //         configs.containerSize[ 1 ] / 2 - inlineBox.offsetHeight / 2 - 
  //         overOut.getBoundingClientRect().top
  //       ] );

  //       inlineBox.style.opacity = 1;
  //       inlineBox.style.zIndex = 8;
  //       inlineBox.style.pointerEvents = '';
  //       app.classList.remove( 'hidden' );
  //       css.translate3dScale( app, [
  //         configs.containerSize[ 0 ] / 2 - ( overOut.getBoundingClientRect().left + overOut.offsetWidth / 2 ),
  //         configs.containerSize[ 1 ] / 2 - ( overOut.getBoundingClientRect().top + overOut.offsetHeight / 2 )
  //       ],[
  //         configs.containerSize[ 0 ] / app.offsetWidth,
  //         configs.containerSize[ 1 ] / app.offsetHeight
  //       ] );
  //       css.position( inlineBoxName, [
  //         ( configs.containerSize[ 0 ] - inlineBoxName.offsetWidth ) / 2 - 
  //         overOut.getBoundingClientRect().left,
  //         configs.containerSize[ 1 ] / 2 - inlineBox.offsetHeight / 2 - 
  //         overOut.getBoundingClientRect().top - inlineBoxName.offsetHeight
  //       ] );

  //       inlineBox.appendChild( overOut );
  //     }, 1000 );
  // }

  // document.addEventListener( 'mouseout', () => {
  //   if( box.firstChild && overOut.className === 'item animate' ){
  //     clearTimeout( time )
  //   }
  // }, false );
}, false );

let size;

document.addEventListener( 'mouseup', ( event ) => {
  let target = event.target;
  clearTimeout( times );

  if( mouseIsdown && closest( target, '.hidden animate' ) ===
   null && target.className === 'item' && closest( target, '.desktop' ) ){
    size = [ target.offsetWidth, target.offsetHeight ];
    css.enlarge( closest( target, '.desktop' ),target,size,configs.containerSize );
    mouseIsdown = false;
  }

  if( mouseIsdown && closest( target, '.dock' ) && target.className ===
   'item' && closest( target, '.hidden animate' ) === null ){
    enlarge( target );
  }

  if( box.firstChild ){
    closest( target, '.desktop' ) !== null ?
    css.transformPosition( box.firstChild, getTransformPosition( box ) ) :
    css.transformPosition( box.firstChild, getTransformPosition( box ), [ 0, -540 ] );
    css.transformPosition( box, [ 0, -1000 ] ); 
    box.firstChild.firstChild.dataset.index = startIndex;
    box.firstChild.firstChild.classList.remove( 'add' );

    if( target.className === 'desktop' || target.className === 'dock' ){

      Array.from( target.children ).forEach( ( item, index ) => {
        if( Array.from( target.children ).length === startIndex ) 
          target.appendChild( box.firstChild );

        if( index === startIndex ) target.insertBefore( box.firstChild, item );

      } );

      target.className === 'desktop' ? setTimeout( () => sliderDesktopIndexEndPositionRender(), 40 ) :
      setTimeout( () => sliderDockIndexEndPositionRender(), 40 );
      startIndex = null,endIndex = null;
    }

    if( target.className === 'before-space' ){
      let itemContainer = closest( target, '.item-container' );
      let desktop = closest( target, '.desktop' );
      let dock = closest( target, '.dock' );
      let container = desktop !== null ? desktop : dock;

      container.insertBefore( box.firstChild, itemContainer );
      container.className === 'desktop' ? setTimeout( () => sliderDesktopIndexEndPositionRender(), 40 ) :
      setTimeout( () => sliderDockIndexEndPositionRender(), 40 );
      startIndex = null,endIndex = null;
    }
  }
}, false );

document.addEventListener( 'keydown', ( event ) => {

  switch( window.event.keyCode ){
    case 13:
    case 32:
      container.classList.remove( 'animate' ); 
      container.classList.add( 'hidden' ) 
        break;  
  }
}, false );

let start,ends,end;

var sequence = ( indexA, indexB, desktop ) =>{
  if( indexA - indexB === -1 || indexA - indexB === 0 ){
    return;
  }
  start = indexA < indexB ? indexA : indexB;
  ends = indexA < indexB ? indexB : indexA;
  end = indexA < indexB ? ends - 1 : ends;

  let sub = Array.from( desktop.children ).slice( start, end );

  for( let item of sub ){
    let itemChild = item.firstChild;
    itemChild.dataset.index = indexA < indexB ?
       Number( itemChild.dataset.index ) - 1 : Number( itemChild.dataset.index ) + 1;
    css.transform( item, [ 
      configs.desktopStartPosition[ 0 ] + ( Number( itemChild.dataset.index ) %
        configs.colNum ) * configs.desktopSpaceSize[ 0 ],
      configs.desktopStartPosition[ 1 ] + ( Number( itemChild.dataset.index ) /
        configs.colNum | 0 ) * configs.desktopSpaceSize[ 1 ] 
      ] );    
  }

  startIndex = indexA < indexB ? indexB - 1 : indexB;
  desktop.className === 'desktop' ? setTimeout( () => sliderDesktopIndexEndPositionRender(), 40 ) :
  setTimeout( () => sliderDockIndexEndPositionRender(), 40 );
}
