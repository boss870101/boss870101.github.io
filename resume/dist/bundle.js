(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./scripts/models/writings.json":2}],2:[function(require,module,exports){
module.exports=[
  {
    "title": "贪吃蛇",
    "url": "http://www.ijsuc.com/snake/dist/index.html",
    "pic": "./images/snake.png",
    "size": [ 153, 153 ]
  },
  {
    "title": "黄金矿工",
    "url": "http://www.ijsuc.com/golden-miner/dist/index.html",
    "pic": "./images/golden-miner.png",
    "size": [ 153, 153 ]
  },
  {
    "title": "图片剪切",
    "url": "http://www.ijsuc.com/picture-cut/dist/index.html",
    "pic": "./images/picture-cut.png",
    "size": [ 153, 153 ]
  },
  {
    "title": "ipad桌面",
    "url": "http://www.ijsuc.com/ipad/dist/index.html",
    "pic": "./images/ipad.png",
    "size": [ 153, 153 ]
  },
  {
    "title": "slider",
    "url": "http://www.ijsuc.com/slider/dist/index.html",
    "pic": "./images/slider.png",
    "size": [ 153, 153 ]
  }
]

},{}]},{},[1])