import Component from "./scripts/libs/Component";
import Game from "./scripts/components/Game.js";

const grids = [
  { color: '#a1aafe', shape: [ { x: 0, y: 0 } ], width: 1, height: 1 },
  { color: '#ffb715', shape: [ { x: 0, y: 0 },{ x: 1, y: 0 } ], width: 2, height: 1 },
  { color: '#ffb715', shape: [ { x: 0, y: 0 },{ x: 0, y: 1 } ], width: 1, height: 2 },
  { color: '#fcb151', shape: [ { x: 0, y: 0 },{ x: 1, y: 0 },{ x: 2, y: 0 } ], width: 3, height: 1 },
  { color: '#fcb151', shape: [ { x: 0, y: 0 },{ x: 0, y: 1 },{ x: 0, y: 2 } ], width: 1, height: 3 },
  { color: '#b2ffcb', shape: [ { x: 0, y: 0 },{ x: 1, y: 0 },{ x: 1, y: 1 } ], width: 2, height: 2 },
  { color: '#b2ffcb', shape: [ { x: 0, y: 0 },{ x: 0, y: 1 },{ x: 1, y: 1 } ], width: 2, height: 2 },
  { color: '#b2ffcb', shape: [ { x: 1, y: 0 },{ x: 1, y: 1 },{ x: 0, y: 1 } ], width: 2, height: 2 },
  { color: '#b2ffcb', shape: [ { x: 0, y: 0 },{ x: 1, y: 0 },{ x: 1, y: 1 } ], width: 2, height: 2 },
  { color: '#ff92ff', shape: [ { x: 0, y: 0 },{ x: 1, y: 0 },{ x: 2, y: 0 },{ x: 3, y: 0 } ], width: 4, height: 1 },
  { color: '#ff92ff', shape: [ { x: 0, y: 0 },{ x: 0, y: 1 },{ x: 0, y: 2 },{ x: 0, y: 3 } ], width: 1, height: 4 },
  { color: '#85ff16', shape: [ { x: 0, y: 0 },{ x: 1, y: 0 },{ x: 0, y: 1 },{ x: 1, y: 1 } ], width: 2, height: 2 },
  { color: '#fe6d4c', shape: [ { x: 0, y: 0 },{ x: 0, y: 1 },{ x: 0, y: 2 },{ x: 0, y: 3 },{ x: 0, y: 4 } ], width: 1, height: 5 },
  { color: '#fe6d4c', shape: [ { x: 0, y: 0 },{ x: 1, y: 0 },{ x: 2, y: 0 },{ x: 3, y: 0 },{ x: 4, y: 0 } ], width: 5, height: 1 },
  { color: '#47e9fe', shape: [ { x: 0, y: 0 },{ x: 1, y: 0 },{ x: 2, y: 0 },{ x: 2, y: 1 },{ x: 2, y: 2 } ], width: 3, height: 3 },
  { color: '#47e9fe', shape: [ { x: 0, y: 0 },{ x: 0, y: 1 },{ x: 0, y: 2 },{ x: 1, y: 2 },{ x: 2, y: 2 } ], width: 3, height: 3 },
  { color: '#47e9fe', shape: [ { x: 0, y: 0 },{ x: 1, y: 0 },{ x: 2, y: 0 },{ x: 0, y: 1 },{ x: 0, y: 2 } ], width: 3, height: 3 },
  { color: '#47e9fe', shape: [ { x: 2, y: 0 },{ x: 2, y: 1 },{ x: 2, y: 2 },{ x: 1, y: 2 },{ x: 0, y: 2 } ], width: 3, height: 3 },
  { color: '#00ffe0', shape: [ { x: 0, y: 0 },{ x: 1, y: 0 },{ x: 2, y: 0 },{ x: 0, y: 1 },{ x: 1, y: 1 },{ x: 2, y: 1 },{ x: 0, y: 2 },{ x: 1, y: 2 },{ x: 2, y: 2 } ], width: 3, height: 3 }
]

let de = document.documentElement;
let screenWidth = de.clientWidth;
let size = screenWidth <= 320 ? 25 : 30;


Component.initSharedState({
  gridData: grids,
  normalSize: size,
  smallSize: 15,
  spaing: 2,
  rows: 10,
  cols: 10,
  num: 0 
})


ReactDOM.render(
  <Game />,
  document.querySelector( '#root' )    
)