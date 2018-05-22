const fetchJSONP = ( url, callbackParam = 'callback' ) => new Promise( ( resolve, reject ) => {
  url = new URL( url );

  let callbackName;

  if( !( callbackName = url.searchParams.get( callbackParam ) ) ){
    callbackName = `a${ Math.random().toString( 36 ).slice( 2 ) }${ Date.now().toString( 36 ).slice( 2 ) }`;
    url.searchParams.set( callbackParam, callbackName );
  }

  if( !window[ callbackName ] ){
    window[ callbackName ] = data => {
      resolve( data );
      delete window[ callbackName ];
    }
  }

  let script = document.createElement( 'script' );
  script.type = 'text/javascript';
  script.src = url.href;
  
  document.documentElement.appendChild( script );
} );

export default fetchJSONP;