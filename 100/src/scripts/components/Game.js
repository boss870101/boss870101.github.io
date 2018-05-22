import Component from "../libs/Component";
import "./Game.scss";
import drag from "../libs/drag";
import closest from "../libs/closest";
import HTML from "../libs/HTML";

export default class Game extends Component{
  constructor( props ){
    super(props);
    this.importSharedState( 'cols', 'rows', 'gridData', 'normalSize', 'spaing', 'smallSize' )
    let de = document.documentElement;
    let { rows, cols, spaing, normalSize } = this.sharedState;
    this.screenWidth = de.clientWidth;
    this.gameTop = 80;
    this.gameSize = rows * normalSize + ( rows - 1 ) * spaing;
    this.gameLeft = ( this.screenWidth - this.gameSize ) / 2;
    this.gameContainer = [];
    this.gridsArr;
    this.gridsBlock;
    this.addBlock = new Map;
    this.score = new Map;
    this.Result;
    this.count = 0;
    this.scoreEl = null;
    this.num = 0;
    window.addEventListener( 'touchmove', (e)=> e.preventDefault(), false );
  }
  
  blockBgContainer(){
    let { cols, rows, normalSize, spaing } = this.sharedState;
    
    for( let y = 0; y < cols; y++ )
      for( let x = 0; x < rows; x++ )
        this.gameContainer.push( { 
          left: `${  x * normalSize + x * spaing }px`,
          top: `${  y * normalSize + y * spaing }px`,
          backgroundColor: '#4b4b4b',
          width: `${normalSize}px`,
          height: `${normalSize}px`,
          borderRadius: '6px'
        } );
      
    return <div className="game-container" style={ { left: `${this.gameLeft}px`, top: `${this.gameTop}px` } }>{ 
      this.gameContainer.map( ( el, index )=><div className="grid-item" key={index} style={el}></div> ) 
    }</div>
  }

  gridBlock( gridData, shape ){
   return shape.map( ( el, index )=><div key={ index } className={ `block x${ el.x } y${ el.y }` } style={ { backgroundColor: gridData.color } } ></div> )
  }

  gridsBlockStyle( x, width, height ){
    let { rows, cols, spaing, normalSize, smallSize } = this.sharedState;
    let { gameSize, gameLeft, gameTop } = this;

      return {
        left: `${ x ? x===1 ? gameLeft + ( gameSize -
        width * ( smallSize + (width - 1)  * 1 ) ) / 2  :
        gameLeft + gameSize - width * ( smallSize + width * 1 ) : gameLeft}px`,
        top: `${gameTop + gameSize + 60 - (height * ( smallSize + (height - 1) * 1 ))/2 }px`
      }
  }

  createGrid(){
    let { cols, rows, normalSize, spaing, gridData } = this.sharedState;
    let { gameSize, gameLeft, gameTop } = this;
    this.gridsArr=[];
    for( let i = 0; i < 3; i++ )
      this.gridsArr.push( gridData[ Math.floor( Math.random() * gridData.length ) ] );

    return <div className="grids">{ 
      this.gridsArr.map( ( item, index )=><div 
        className="grids-block"
        data-index={`${ index }`}
        key={ Math.random() }
        style={ this.gridsBlockStyle( index, item.width, item.height ) }><div className="small block">{
         this.gridBlock( item, item.shape ) 
        }</div></div> )
      }</div>
  }

  blockListBox(){
    let { cols, rows, normalSize, spaing, gridData } = this.sharedState; this.Result=[];
    let grids = this.createGrid();
    this.Result.push( grids );
    return this.Result;
  }

  onMoving( el,position ){
    el.style.left = position[ 0 ] + 'px';
    el.style.top = position[ 1 ] + 'px';
  }

  returnHomePosition( el, homePosition ){
    
    el.style.left = homePosition[ 0 ] + 'px';
    el.style.top = homePosition[ 1 ] + 'px';
    this.gridsBlock.firstChild.classList.add( 'small' );
    this.gridsBlock.firstChild.classList.remove( 'normal' );
  }

  up( el, position, homePosition ){
    let block = this.gridsArr[ el.dataset.index ];
    const game = ReactDOM.findDOMNode( this );
    let { cols, rows, normalSize, spaing } = this.sharedState;
    let { gameSize, gameLeft, gameTop } = this;
    let x = position[ 0 ] - gameLeft;
    let y = position[ 1 ] - gameTop;
    let X = Math.round( x / ( normalSize + spaing ) );
    let Y = Math.round( y / ( normalSize + spaing ) );
    let left = X * ( normalSize + spaing ) + gameLeft;
    let top = Y * ( normalSize + spaing ) + gameTop;

    for( let item of block.shape ){
      if( this.addBlock.has( ( Y + item.y ) + '' + ( X + item.x ) ) ){
        this.returnHomePosition( el, homePosition );
        return;
      }
    }

    if( X < 0 || X + block.width > 10 || Y < 0 || Y + block.height > 10 ){
      this.returnHomePosition( el, homePosition );
    }else{ 
      for( let item of block.shape ){

        let html = HTML( `<div style="
          left:${ item.x ? left + item.x * spaing + item.x * normalSize : left }px;top:${ item.y ? top + item.y *
        spaing + item.y * normalSize : top }px;background-color:${
        block.color }; width:${ normalSize }px; height:${ normalSize 
        }px; position:absolute;border-radius: 6px;"></div>` ).append( game );


        this.addBlock.set( ( Y + item.y ) + '' + ( item.x + X ), html );

        if( this.score.has( 'x' + ( X + item.x ) ) )
          this.score.get( 'x' +( X + item.x ) ).s++;
        else
          this.score.set( 'x' + ( X + item.x ), { s: 1 } );
        
        if( this.score.has( 'y' + ( Y + item.y ) ) )
          this.score.get( 'y' + ( Y + item.y ) ).s++;
        else
          this.score.set( 'y' + ( Y + item.y ), { s: 1 } );
          
      }
      let eliminateScore = 0;

      this.num += block.shape.length;

      let scoreArr = [];

      for( let item of this.score ){
        if( item[ 1 ].s === 10 ){
          let index = item[ 0 ][ 0 ] === 'y' ? 0 : 1;
          for( let i of this.addBlock ){
            if( i[ 0 ][ index ] === item[ 0 ][ 1 ] ){
              i[ 1 ].parentNode.removeChild( i[ 1 ] );
              this.addBlock.delete( i[ 0 ] );
            } 
          }
          scoreArr.push( item[ 0 ] );   
        }               
      }

      for( let item of scoreArr ){
        let index = item[ 0 ] === 'y' ? 'x' : 'y';
        for( let i = 0; i < rows; i++ ){
          this.score.get( index + i ).s --;
        }
      }

      eliminateScore = scoreArr.length * 10;

      for( let item of scoreArr ){
        this.score.get( item ).s = 0;
        scoreArr = [];
      }
      
      this.scoreEl.innerHTML = this.num + eliminateScore;
      
      this.count++;

      this.gridsArr.splice( el.dataset.index, 1, null );  
      
      if( this.count%3 === 0 ){
        this.Result = [];
        this.forceUpdate();
      }
        
      el.style.display = 'none';
      el.style.left = left + 'px';
      el.style.top = top + 'px';

      this.gameOver( this.gridsArr );
      
    }
  }

  appropriate( block ){
    let { rows, cols, spaing, normalSize, smallSize } = this.sharedState;
    let { shape } = block;

    for( let y = 0; y <= rows - block.height; y ++ )
      for( let x = 0; x <= cols - block.width; x ++ )
        if( shape.every( s => !this.addBlock.has( `${ y + s.y }${ x + s.x }` ) ) )
          return true;

    return false;
  }

  gameOver( block ){
    const game = ReactDOM.findDOMNode( this );
    if( this.addBlock.size > 30 ){  
      if( !block.filter( el => el ).some( this.appropriate.bind( this ) ) ){
        let header = HTML( `<div class="game-over" style="left:${ this.gameLeft + 20 }px;"><span>GAME OVER</span><input type="button" value="重玩" /></div>` ).append( game );
        header.lastChild.addEventListener( 'click', event=>{
          window.location.reload();
        }, false );
      }
     
    }     
  }

  componentDidMount(){
    const game = ReactDOM.findDOMNode( this );
    let { rows, cols, spaing, normalSize, smallSize } = this.sharedState;
    let { gameSize, gameLeft, gameTop } = this;
    const isMobile = ()=> /mobile/gi.test( navigator.userAgent );
    let touchStart = isMobile() ? 'touchstart' : 'mousedown';  
    let touchMove = isMobile() ? 'touchmove' : 'mousemove';

    if( !this.scoreEl )
      this.scoreEl = HTML( `<div class="score" style="left: ${ gameLeft + 20 }px; top: ${ gameTop / 2 - 5 }px;">0</div>` ).append( game ); 

    game.addEventListener( touchStart, event=>{
      this.gridsBlock = closest( event.target, '.grids-block' );

      if( this.gridsBlock ){
        let { firstChild } = this.gridsBlock;
        firstChild.classList.remove( 'small' );
        firstChild.classList.add( 'normal' );
        firstChild.style.zIndex = 2;
        drag( event, this.onMoving.bind(this), this.up.bind( this ) );
      }
             
    }, false );

    window.addEventListener( 'orientationchange', (e)=>{
      console.log( 1 );
      if( orientation === 90 ){
        game.style.transformOrigin = '50% 60%'
        game.style.transform = 'rotate( -90deg )'
      }
    },false );
  }

  render(){
    return (
      <div className="game">
        { this.blockBgContainer() }
        { this.blockListBox() }
      </div>
    )
  }
}