import writingModel from "./scripts/models/writingsModel.json";
var list = document.querySelector( '#list' );

list.innerHTML = writingModel.map( function( item ){
  return [
    '<li>',
      '<a href=' + item.url + '>',
        '<img src=' + item.pic + ' width="190" height="190">',
        '<h3>' + item.title + '</h3></a>',
    '</li>'  
  ].join('');
}).join('')