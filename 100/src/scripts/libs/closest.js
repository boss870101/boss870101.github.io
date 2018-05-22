export function closest( el, string ){
  var regexp = /^\./;
  var initialEl = el;
  if( regexp.test( string ) ){
    while( el && el.tagName && el.className !== string.replace( regexp, '' ) )
      el = el.parentNode;

  }else{
    while( el && el.tagName && el.tagName.toLowerCase() !== tagName.toLowerCase() )
    el = el.parentNode;
  }
  
  return el.tagName ? el : null;
};

export default closest;