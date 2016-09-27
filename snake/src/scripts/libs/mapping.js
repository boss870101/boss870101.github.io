export var mapping = function( fields, records ){
  return function( fieldName, fromFieldName ){
    var index,fromIndex,map;

    index = fields.indexOf( fieldName );
    fromIndex = fields.indexOf( fromFieldName );
    map = new Map();

    records.forEach( function( record ){
      map.set( record[ fromIndex ], record[ index ] );
    } );

    return function( value ){
      return map.get( value );
    };
  };
};
