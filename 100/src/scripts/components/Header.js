import Component from "../libs/Component";

export default class Header extends Component{
  constructor( props ){
    super(props);
  }
  
  render(){
    return (
      <div>
        <div style={ { position: 'abslute', color: '#fff' } }>{ this.props.num }</div>
      </div>
    );
  }
}