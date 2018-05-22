const distance = ( coord1, coord2 ) => Math.floor(Math.pow( Math.pow( coord1.x - coord2.x, 2 ) + Math.pow( coord1.y - coord2.y, 2 ), 1/2 ));
const centre = ( coord1, coord2 ) => ( { x: ( coord1.x + coord2.x ) / 2, y: ( coord1.y + coord2.y ) / 2 } );
//端点名和坐标
const points = [
  { x: 59, y: 42, name: 'A' },
  { x: 553, y: 137, name: 'B' },
  { x: 725, y: 47, name: 'C' },
  { x: 800, y: 400, name: 'D' },
  { x: 653, y: 643, name: 'E' },
  { x: 91, y: 686, name: 'F' },
  { x: 59, y: 617, name: 'G' },
  { x: 297, y: 572, name: 'H' },
  { x: 48, y: 560, name: 'I' },
  { x: 68, y: 63, name: 'J' },
  { x: 501, y: 223, name: 'K' },
  { x: 581, y: 552, name: 'L' },
  { x: 144, y: 632, name: 'M' },
  { x: 75, y: 551, name: 'N' },
  { x: 181, y: 215, name: 'O' },
  { x: 75, y: 279, name: 'P' },
  { x: 87, y: 175, name: 'Q' },
  { x: 195, y: 361, name: 'R' }
];
//相连点
const links = [ 'AB','BC','CD','DE','EF','FG','GH','HI','IA','JK','KC','KB','CL','LM','ME','NP', 'OP', 'NL','OJ','OL', 'PQ', 'PR', 'OQ', 'OR' ];

const pointByName = new Map;
const distances = new Map;
//端点坐标存起来

const start = document.querySelector( '#from' );
const end = document.querySelector( '#to' );

for( let point of points ){
  pointByName.set( point.name, point );

  let option1 = document.createElement( 'option' );
  let option2 = document.createElement( 'option' );

  option1.innerHTML = point.name;
  option2.innerHTML = point.name;
  start.appendChild( option1 );
  end.appendChild( option2 );
}
//相连两点的距离存起来
for( let link of links ){
  let d = distance( pointByName.get( link[ 0 ] ), pointByName.get( link[ 1 ] ) );

  distances.set( link, d );
  distances.set( `${ link[ 1 ] }${ link[ 0 ] }`, d );
}

const canvas = document.querySelector( '#map' );
const c = canvas.getContext( '2d' );

//画线
const drawLine = ( pointA, pointB, color = '#ccc', lineWidth = 1 ) => {
  c.strokeStyle = color;
  c.lineWidth = lineWidth;
  c.beginPath();
  c.moveTo( pointA.x, pointA.y );
  c.lineTo( pointB.x, pointB.y );
  c.stroke();
}
//画路径
const drawPath = path => {
  for( let i = 1; i < path.length; i ++ )
    drawLine( path[ i - 1 ], path[ i ], '#0037FF', 4 );
}
//画端点名
const drawName = ( point, name ) => {
  c.fillStyle = 'red';
  c.fillText( name, point.x, point.y );
}
//画两个端点的距离
const drawDistance = ( pointA, pointB ) => {
  let origin = centre( pointA, pointB );
  drawName( origin, distances.get( `${ pointA.name }${ pointB.name }` ) );
}
//画出所有相关的信息
const drawMap = () => {
  const nameCache = new Set;

  for( let link of links ){
    let pointA = pointByName.get( link[ 0 ] );
    let pointB = pointByName.get( link[ 1 ] );

    drawLine( pointA, pointB );

    if( !nameCache.has( pointA ) ){
      drawName( pointA, pointA.name );
      nameCache.add( pointA );
    }

    if( !nameCache.has( pointB ) ){
      drawName( pointB, pointB.name );
      nameCache.add( pointB );
    }

    drawDistance( pointA, pointB );
  }
}

// path: [ { journey, point }, { journey, point }, ... ]
//递归计算出最短的路径
const calcShortestPath = ( fromPoint, toPoint ) => {
  const shorterPathByPoint = new Map;

  const searchSider = ( fromPoint, sourcePath ) => {
    for( let distance of distances ){
      if( distance[ 0 ][ 0 ] === fromPoint.name ){
        let sidePointName = distance[ 0 ][ 1 ];

        if( sourcePath.some( pathPoint => pathPoint.name === sidePointName ) )
          continue;

        let lastPoint = sourcePath[ sourcePath.length - 1 ];
        let journey = lastPoint ? lastPoint.journey : 0;
        let point;

        journey += distance[ 1 ];
        point = shorterPathByPoint.get( sidePointName );
          
        if( !point || point.journey > journey ){
          point = Object.create( pointByName.get( sidePointName ) );
          point.journey = journey;

          let pathPoint = { journey, point };
          shorterPathByPoint.set( sidePointName, {
            journey,
            path: sourcePath.concat( [ point ] )
          } );
    
          searchSider( point, sourcePath.concat( [ point ] ) );
        }
      }
    }
  }

  searchSider( fromPoint, [] );

  return shorterPathByPoint.get( toPoint.name );
}

drawMap();

const form = document.querySelector( 'form' );

form.addEventListener( 'submit', ( event )=>{
  const pointAName = start.value;
  const pointBName = end.value;

  if( pointAName === pointBName ){
    event.preventDefault();
    return;
  }

  const fromPoint = pointByName.get( pointAName );
  const shortestPath = calcShortestPath( fromPoint, pointByName.get( pointBName ) );

  shortestPath.path.unshift( fromPoint );

  c.clearRect( 0, 0, 1000, 1000 );
  drawMap();

  drawPath( shortestPath.path );

  event.preventDefault();
}, false );


