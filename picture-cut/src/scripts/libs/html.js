export var HTML = function(){
  var html = function( html ){
    this.html = html;
  };

  html.prototype.getElementsByHtml = function( html ){
    var elt = document.createElementNS( 'xml', 'x' );
    elt.innerHTML = Array.isArray( html ) ? html.join( '' ) : html;
    var eltChildNodes = elt.childNodes;
    return [].slice.call( eltChildNodes, 0 );
  };

  html.prototype.innerHTML = function( container, element, html  ){
    var htmls = this.getElementsByHtml( this.html );
    htmls.forEach( function( item ){
      container.insertBefore( item, element );
    } );
    return htmls.length === 1 ? htmls[ 0 ] : htmls;
  };

  html.prototype.append = function( container, html ){
    return this.innerHTML( container, null, this.html );
  }
  
  html.prototype.prepend = function( container, html ){
    return this.innerHTML( container, container.firstChild, this.html );
  }
  
  html.prototype.before = function( element, html ){
    return this.innerHTML( element.parentNode, element, this.html );
  }
  
  html.prototype.after = function( element, html ){
    return this.innerHTML( element.parentNode, element.nextSibling, this.html );
  }

  html.prototype.replace = function( element, html ){
    var htmls = this.getElementsByHtml( this.html );
    htmls.forEach( function( item ){
      element.parentNode.insertBefore( item, element )
    } );
    return element.parentNode.removeChild( element );
  }
  return function( h ){
    return new html( h );
  }
}(); 
