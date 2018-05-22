import fetchJSONP from "../../libs/fetchJSONP";

export default class Home extends React.Component{
  constructor( props ){
    super(props);
    this.state = { 
      import: '',
      value: null,
      translate: '',
      web: '',
      web1: '',
      web2: ''
    }; 
  }
  
  onSearch( event ){
    this.setState( { value: event.target.value } )
  }

  onAdd( value ){
    
    let url = `http://fanyi.youdao.com/openapi.do?keyfrom=jason512&key=653961669&type=data&doctype=jsonp&version=1.1&q=${ value }`;  
    
    fetchJSONP( url ).then(  result=>{
      this.setState( { 
        import: result.query,
        translate: `${result.translation[ 0 ]}`,
        web: `${result.web[ 0 ].key} ${result.web[ 0 ].value[0]}`,
        web1: `${result.web[ 1 ].key} ${result.web[ 1 ].value[0]}`,
        web2: `${result.web[ 2 ].key} ${result.web[ 2 ].value[0]}`
      } ) 

    } );
  }

  onKeyDown( event ){
    
    if( event.keyCode !==　13)
      return;
    this.onAdd( this.state.value );
  }

  render(){
    return ( 
      <div className="body">
        <h1>中英互译</h1>
        <div className="wrapper">
          <input className="input-phone" type='text'　onKeyDown={ this.onKeyDown.bind( this ) }  onChange={ this.onSearch.bind( this ) } />
          <button　onClick={ this.onAdd.bind( this, this.state.value ) } >确定</button>
        </div>
        <div className="result">
          <h2>{ this.state.import }</h2>
          <p>{ this.state.translate }</p>
          <p>{ this.state.web }</p>
          <p>{ this.state.web1 }</p>
          <p>{ this.state.web2 }</p>
        </div>
      </div>
    );
  }
}
