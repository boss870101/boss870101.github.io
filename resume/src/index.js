var writingModel = require( './scripts/models/writings.json' );
var opus = document.querySelector( '#opus' );

opus.innerHTML = writingModel.map( function( item ){
  return [
    '<li>',
      '<a href=' + item.url + '>',
        '<img src=' + item.pic + ' width=' + item.size[ 0 ] + ' height=' + item.size[1] + '>',
        '<h3>' + item.title + '</h3></a>',
    '</li>'  
  ].join('');
}).join('')