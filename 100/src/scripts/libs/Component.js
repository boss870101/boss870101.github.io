const clone = ( ()=>{
  const s = /str|num|boo|und/, f = /fun/, m = /date|rege/i;

  return ( json, buffer = new Map() ) =>{
    let t, i, r;

    t = typeof json;

    if( s.test( t ) || !json )
      return json;

    if( f.test( t ) )
      return new Function( 'return ' + json.toString() )();

    if( m.test( json.constructor ) )
      return new json.constructor( json.valueOf() );

    i = buffer.get( json );

    if( i > 1 ){
      return void 0;
    }else{
      buffer.set( json, ++ i || 1 );
    }

    r = 'length' in json ? [] : {};

    for( i in json )
      if( json.hasOwnProperty( i ) )
        r[ i ] = clone( json[ i ], buffer );

    return r;
  }
} )();

//深度比较两个对象
const equal = ( () => {
  const s = /num|str|boo/, f = /fun/, m = /date|rege/i;

  return ( a, b ) => {
    let t, i, c;

    t = typeof a;

    if( a === b )
      return true;

    if( t !== typeof b )
      return false;

    if( a !== a && b !== b )
      return true;

    if( s.test( t ) || !a || !b )
      return a === b;

    if( f.test( t ) || m.test( a.constructor ) )
      return a.toString() === b.toString();

    c = new Map;

    Object.keys( a ).concat( Object.keys( b ) ).forEach( i => c.set( i, 1 ) );

    for( i of c )
      if( !equal( a[ i[ 0 ] ], b[ i[ 0 ] ] ) )
        return false;

    return true;
  }
} )();


const allComponents = [];　//用来存所有主件
const globalStore = {};　//用来存取初史化里的数据

export default class Component extends React.Component{
  constructor( props ){
    super( props );

    this.uniqueId = Math.random().toString( 36 ).slice( 2 );
    this.sharedState = {};　
    this.storeUpSharedState = {};
    allComponents.push( this );
  }
　
  importSharedState( ...names ){
    for( let name of names ){
      let state = globalStore[ name ];

      if( state === undefined )
        state = globalStore[ name ] = {};

      if( this.storeUpSharedState[ name ] === undefined )
        this.storeUpSharedState[ name ] = clone( state );

      this.sharedState = globalStore;
    }
  }

  assign( prop ){
    return element =>this[ prop ] = element;
  }

  updateSharedState( ...names ){
    const shouldUpdateComponents = {};

    for( let name of names ){
      if( this.sharedState[ name ] === undefined )
        continue;

      let state = this.sharedState[ name ]; 
       
    
      //遍历所有主件检查是否有变动，变动的数据储存起来
      for( let component of allComponents ){
        if( !equal( component.storeUpSharedState[ name ], state ) ){
          component.sharedState[ name ] = state;
          component.storeUpSharedState[ name ] = clone( state );
          shouldUpdateComponents[ component.uniqueId ] = component;
        }
      }
    }
　　　
　　//更新主件变动过的数据　
    Object.keys( shouldUpdateComponents ).forEach( key => {
      shouldUpdateComponents[ key ].forceUpdate();
    } );
  }
  
  //初史化数据的方法
  static initSharedState( store ){
    for( let name in store ){
      if( store.hasOwnProperty( name ) )
        globalStore[ name ] = store[ name ];
    }
  }
}
