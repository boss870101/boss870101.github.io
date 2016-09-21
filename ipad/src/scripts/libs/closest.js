export function closest( el, string ){
  var regexp = /^\./;
  var initialEl = el;
  if( regexp.test( string ) ){
    while( el && el.tagName && el.className !== string.replace( regexp, '' ) )
      el = el.parentNode;

    if( !el.tagName ){
      [].slice.call( initialEl.parentNode.children, 0 ).forEach( function( item ){
        if( item.className === string.replace( regexp, '' ) )
          el = item;
      } )
    }     
    if( !el.tagName ){
      [].slice.call( initialEl.children, 0 ).forEach( function( item ){
        if( item.className === string.replace( regexp, '' ) ) el = item;
      } )
    }       

  }else{
    while( el && el.tagName && el.tagName.toLowerCase() !== tagName.toLowerCase() )
    el = el.parentNode;
  }
  
  return el.tagName ? el : null;
};
