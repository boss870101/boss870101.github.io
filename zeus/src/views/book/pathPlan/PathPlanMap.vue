<style scoped>
  .ivu-menu-vertical.ivu-menu-light::after{
    width: 0 !important;
  }
  .menu.ivu-menu.ivu-menu-light.ivu-menu-horizontal{
    line-height: 40px;
    bottom: 0;
  }

  .menu.ivu-menu.ivu-menu-light.ivu-menu-horizontal.ivu-menu-light::after{
    height: 0;
  }

  .menu.ivu-menu.ivu-menu-light.ivu-menu-horizontal .ivu-menu-item{
    padding: 0 8px;
    border: 1px solid #e3e8ee;
    height: 40px;
  }

  .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item-active, 
  .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item:hover, 
  .ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu-active, 
  .ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu:hover{
    background-color: #f5f4f4;
  }

  .ivu-col > .line-specialitys{
    margin-left: 16px;
    border: 1px solid #e3e8ee;
  }

  .ivu-col > .line-specialitys > .lines-list > h3{
    line-height: 40px;
    font-size: 16px;
    padding: 0 0 0 16px;
    color: #4cb97b;
    background-color: #f5f5f5;
  }

  .ivu-col > .line-specialitys > .lines-list > ul{
    position: relative;
    padding: 12px 12px 0px 12px;
  }

  .ivu-col > .line-specialitys .lines-list > ul > li{
    border: 1px solid #e3e8ee; 
    padding: 5px;
  }

  .ivu-col > .line-specialitys > .lines-list > ul > li:nth-child(1){
    
  }

  .line-name-list{
    line-height: 40px;
    border:  0;
    display: block;
    margin: 0;
    padding: 0;
    outline: 0;
    list-style: none;
    color: #657180;
    font-size: 14px;
    position: relative;
  }

  .line-name-list li{
    padding: 0 8px;
    border: 1px solid #e3e8ee;
    height: 40px;
    float: left;
    display: block;
    outline: 0;
    list-style: none;
    font-size: 14px;
    position: relative;
    z-index: 1;
    cursor: pointer;
    transition: all .2s ease-in-out;
    box-sizing: border-box;
  }

  .line-name-list li:hover{
    color: #fff;
    background-color: rgba(51,153,255,.9);
  }

  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
  }
  .demo-spin-col{
    height: 100px;
    position: relative;
    border: 1px solid #eee;
  }

  .ivu-spin.ivu-spin-show-text{
    position: fixed;
    z-index: 8;
    display: table;
    width: 100%;
    height: 100%;
    background-color: rgba(145, 146, 146, 0.55);
    text-align: center;
    vertical-align: middle;
  }

  .loader{
    display: inline-block
  }
</style>
<template>
  <Card dis-hover>
    <div slot="title">
      <Date-picker 
        @on-change="dateChange" 
        type="month" 
        format="yyyy 年 MM 月" 
        :value="date" 
        placeholder="选择年月" 
        style="width: 116px; display: inline-block; margin-right: 10px;">
      </Date-picker>
      <Button 
        style="margin-right: 10px" 
        type="error">
        {{`${month}月份路线表`}}
      </Button>
      <Button 
        style="margin-right: 10px" 
        type="ghost" 
        @click="copyPath">
        {{`复制为${ month + 1 === 13 ? 1 : month + 1}月份`}}
      </Button>
      <Button 
        type="error" 
        @click="switchTable">
        切换到表格版
      </Button>
    </div>
    <div style="position: relative">
      <Spin fix v-show="spinShow">
        <div class="loader">
          <Icon type="load-c" size=80 style="color: red" class="demo-spin-icon-load"></Icon>
          <div>Loading</div>
        </div>
      </Spin>
      <Row>
        <Col span="24" style="margin-bottom: 16px;">
          <ul class="line-name-list" ref="lineNameList">
            <li 
              v-for="(line, index) in lines"
              :data-color="colorMap[ index ]"
              :data-name="line.name"
              data-checked=""
              :key="index" 
              ref="lin"
              @click.active="onClickLine(line, index, shops.length-1, $refs.lin)">
              {{line.name}}
            </li>
          </ul>
        </Col>
      </Row>
      <Row>
        <Col span="18">
          <baidu-map 
            style="width: 100%; height: 800px;"
            class="baiduMap"
            :center="{ lng: 121.256889, lat: 28.47779 }"
            :zoom="12"
            :scroll-wheel-zoom="true">
            <jason-geocoder
              :lineAddress="linesAddress"
              @get-points="getPoints"
            />
            <jason-driving
              @on-search-complete="onSearchComplete" 
              @on-poly-lines-set="onPolylinesSet"
              @on-markers-set="onMarkersSet"
              @on-info-html-set="onInfoHtmlSet"
              @on-results-html-set="onResultsHtmlSet"
              :points="pathPlan.locations"
              :startPoint="startPoint.location"
              :shopsIndex="pathPlan.shopsIndex"
              :color="pathPlan.color"
            />
            <bm-marker  
              v-for="(item, index) in markersPoint" 
              :position="item.location" 
              :key="index"
              :label="{content: item.name, opts: {offset: {width: 20, height: -10}}}">
            </bm-marker>
            <bm-marker
              :position="startPoint.location"
              :label="{ content: startPoint.name, opts: { offset: { width: 20, height: -10 } } }"
            />
          </baidu-map>
        </Col>
        <Col span="6">
          <div class="line-specialitys">
            <div 
              class="lines-list" 
              v-for="(item, shopsIndex) in shops" 
              :key="shopsIndex">
              <h3>{{item.title}}</h3>
              <ul>
                <li v-for="( shop, shopIndex ) in item.shops" :key="shop.id">
                  <p>{{shop.address}}</p>
                  <Button 
                    @click="upMove( item.linesIndex, shopsIndex, shopIndex )" 
                    :disabled="!shopIndex ? true : false" 
                    type="ghost" size="small">
                    上移
                  </Button>
                  <Button 
                    @click="downMove( item.linesIndex, shopsIndex, shopIndex )" 
                    type="ghost" 
                    :disabled="shopIndex === item.shops.length-1 ? true : false " 
                    size="small">
                    下移
                  </Button>
                  <Button 
                    type="primary" 
                    @click="moveLine( 
                      shop.shop_id, 
                      item.lineId,
                      shopIndex,
                      shop.info.name,
                      item.linesIndex, 
                      shopsIndex
                    )" 
                    size="small">
                    移动
                  </Button>
                  <Poptip confirm title="您确认删除这条内容吗？"
                    @on-ok="onRemoveLine( 
                      item.pathId, 
                      shop.shop_id, 
                      item.linesIndex, 
                      shopsIndex, 
                      shopIndex,
                      shop.info.name
                    )">
                    <i-button type="error" size="small">删除</i-button>
                  </Poptip>
                </li>
                <li style="margin-bottom: 12px;">
                  <div>
                    <span>总路程：</span>
                    <span style="color: red;">
                      {{item.planData.distance}}
                    </span>
                  </div>
                  <div>
                    <span>总用时：</span>
                    <span style="color: red;">
                      {{item.planData.time}}
                    </span>
                  </div>
                  <div v-for="( shop, shopIndex ) in item.shops" :key="shop.id">
                    <span v-if="!shopIndex">大溪万开物流中心</span>
                    <span v-else>
                      {{item.shops[ shopIndex - 1 ].info.name}}
                    </span>
                    <Icon type="android-send"></Icon>
                    <span>{{shop.info.name}}</span>
                    <Icon type="arrow-right-a"></Icon>
                    <span style="color: red;">
                      {{item.planData.eachDistance[ shopIndex ]}}
                    </span>
                  </div>
                </li> 
              </ul>
            </div>
            <div class="lines-list" v-show="noplanShops">
              <h3>{{noplanShops.title}}</h3>
              <ul>
                <li v-for="( shop, shopIndex ) in noplanShops.shops" :key="shop.id">
                  <p>{{shop.address}}</p>
                  <Button 
                    type="primary" 
                    @click="moveLine( 
                      shop.shop_id, 
                      noplanShops.lineId, 
                      shopIndex,
                      shop.info.name 
                    )" 
                    size="small">
                    移动
                  </Button>
                </li>
              </ul>
            </div>
            <!-- <pre>nopathPlan:{{nopathPlan}}pathPlans:{{pathPlans}}</pre> -->
          </div>
        </Col>
      </Row>
    </div>
    <Modal
      v-model="modal"
      cancelText
      title="路线">
      <p>{{lineName}} 路线未设置</p>
    </Modal>
    <Modal
      v-model="lineModal"
      title="添加在下面路线"
      @on-ok="moveLineOk">
      <Radio-group v-model="lineId" vertical>
        <Radio 
          v-if="!(line.id === selectedLineId || line.id === -1 )" 
          :label="line.id" 
          v-for="line in lines" 
          :key="line.id">
          <span>{{line.name}}</span>
        </Radio>
      </Radio-group>
    </Modal>
    <Modal
      v-model="noplanModal"
      title="添加在下面路线"
      @on-ok="noplanMoveOk">
      <Radio-group v-model="lineId" vertical>
        <Radio 
          v-if="!(line.id === -1)" 
          :label="line.id" 
          v-for="line in lines" 
          :key="line.id">
          <span>{{line.name}}</span>
        </Radio>
      </Radio-group>
    </Modal>
  </Card>
</template>
<script>
  import moment from "moment";
  import util from "@/libs/util";
  // import '@/assets/utf8-php/ueditor.config.js'
  // import '@/assets/utf8-php/ueditor.all.min.js'
  // import '@/assets/utf8-php/lang/zh-cn/zh-cn.js'
  // import '@/assets/utf8-php/ueditor.parse.min.js'

  export default {
    data () {
      return {
        year: moment().year(),
        month: moment().month() + 1,
        date: moment().format( 'YYYY-MM' ),
        modal: false,
        pathPlan: {
          locations: [ {
            "name": "1",
            "location": {
              "lng": 1,
              "lat": 2
            },
            "address": "",
            shopsIndex: -1,
          } ],
          shopsIndex: 0,
          color: '',
        },
        pathPlans: [],// [ { pathPlan } ]
        nopathPlan: [],// [ { pathPlan } ]
        lines: [], // [ { id: 2, name: '福建' } ]
        // shops: [ { 
        //   title: '圆通', 
        //   linesIndex: 1, 
        //   shopsIndex: 0, 
        //   pathId: 40, 
        //   lineId: 3, 
        //   planData: { time: '', distance: '', eachDistance: [], color: '' }, 
        //   shops: [],
        //   address: ''
        // } ]
        shops: [], 
        startPoint: { 
          name: '大溪万开物流中心', 
          location: { lng: 120, lat: 30 } 
        },
        //[{ address: '', name: '', linesIndex: 1, icon: {} }]
        linesAddress: [],
        //由linessAddress 生成的 ponits [{ address: '', name: '', linesIndex: 1, icon: {} }]
        markersPoint: [],
        // { title: '暂无安排', lineId: -1, linesIndex: 4, shops: [], address: '' }
        noplanShops: {}, 
        // click lines list  
        index: 0,
        colorMap: [],//[ randomColor, randomColor ]
        spinShow: false,
        lineName: '',
        lineModal: false,
        noplanModal: false,
        lineId: '',
        selectedLineId: '',
        moveData: {},
        tag_line_id: -1,
        icon: { 
          url: 'http://ijsuc.com/map-icon/0018f5.png',
          size: {
            width: 50,
            height: 50
          }
        }
      }
    },

    created(){
      this.fetchLines();
    },

    mounted(){
      this.$refs.lineNameList.addEventListener( 'click', ( event )=>{
        const { target } = event;
        if( !target.dataset.checked ){
          target.style.backgroundColor = target.dataset.color;
          target.style.color = '#fff';
          target.setAttribute( 'data-checked', 'checked' );
        }else{
          target.style.backgroundColor = '#fff';
          target.style.color = '#6e7787';
          target.setAttribute( 'data-checked', '' );
        }
      }, false );

      this.fetchSetup();
    },

    methods: {
      // title
      dateChange( date ){
        const re = /[0-9]+/g;
        date = date.match( re ).join('-');
        this.year = moment( date ).year();
        this.month = moment( date ).month() + 1;
      },

      onpolylinesset( e ){
        console.log("e", e)
      },

      copyPath(){
        const params = {
          "from_year": this.year,
          "from_month": this.month,
          "to_year": this.month + 1 === 13 ? this.year + 1 : this.year,
          "to_month": this.month + 1 === 13 ? 1 : this.month + 1 
        }

        this.fetchCopyPath( params );
      },

      switchTable(){
        this.$router.push({ name: 'BookPathPlan' });
      },

      //lines list
      onClickLine( line, linesIndex, shopIndex, els ){
        this.index = linesIndex;
        if( !els[ linesIndex ].dataset.checked ){
          this.spinShow = true;
          this.fetchPath( line.id, line.name, linesIndex );
        }else{
          this.markersPoint = this.markersPoint.filter( item => item.linesIndex !== linesIndex );

          if( linesIndex !== els.length - 1 ){
            this.shops.forEach( ( item, i ) => {
              if( item.linesIndex === linesIndex ){
                this.shops.splice( i, 1 );
                this.pathPlans.splice( i, 1 );
              }
            } )
            this.clearPlan( linesIndex, els );
          }else{
            this.noplanShops = {};
          }
        }
      },

      //用地址获取 回来 经韦度 [ linesAddress ] => markersPoint pathPlan pathPlans nopathPlan
      getPoints( location ){
        const locationMap = new Map;
        const arr = [];

        for( let item of location ){
          locationMap.set( item.name, item ); 
        }

        this.markersPoint.push( ...location );

        for( let item of this.linesAddress ){
          arr.push( locationMap.get( item.name ) )
        }

        //最后一个无路线安排不生成路线规划
        if( this.index !== this.lines.length-1 ){
          this.pathPlan = { 
            locations: [ ...arr ], 
            shopsIndex: this.shops.length - 1,
            color: this.colorMap[ this.index ]
          };
          this.pathPlans.push( { 
            locations: [ ...arr ], 
            shopsIndex: this.shops.length - 1,
            color: this.colorMap[ this.index ]
          } );
        }else{
          this.nopathPlan = [ ...arr ]
        }
      },

      //driving 
      onSearchComplete( results, driving, shopsIndex ){
        if( driving.getStatus() != BMAP_STATUS_SUCCESS ){
          return;
        }

        if( driving.getStatus() == BMAP_STATUS_SUCCESS ){
          let time, distance;
          let eachDistance = [];
          let s = [];
          let plan = results.getPlan(0);

          time = plan.getDuration(true);
          distance = plan.getDistance(true)

          for( let j = 0;j < plan.getNumRoutes(); j++){
            let route = plan.getRoute(j);
            eachDistance.push( route.dg / 1000 + '公里' );

            for(let i = 0; i < route.getNumSteps(); i++){
              let step = route.getStep(i);
              s.push((i + 1) + ". " + step.getDescription());
            }
          }

          if( ~shopsIndex ){
            let { planData } = this.shops[ shopsIndex ];
            planData.time = time;
            planData.distance = distance;
            planData.eachDistance = eachDistance;
          }
          // this.$refs.route.innerHTML = s.join( '<br/>' );
        }
      },
      // 设置路径规划成功 router => [] 路径相关信息  
      onPolylinesSet( routes, color ){
        // console.log("routes", routes)
        setTimeout(function () {
          routes.forEach( item => {
            item.Ti.V.setAttribute( 'stroke', color )
          } )
        }, 400)
      },
      // 设置路径规划成功 markerSet => [] 起 经 终 点相关信息
      onMarkersSet( markerSet, color ){
        // console.log("markerSet, color", markerSet);
        color = color.replace( /#/, 'A');
        markerSet.forEach( item => {
          if( item.marker ){
            item.marker.zc.classList.add( color )
          }else{
            item.Km.zc.classList.add( color );
          }
        })
      },

      onInfoHtmlSet( html ){
        console.log("html", html)
      },

      onResultsHtmlSet( resHtml ){
        console.log("resHtml", resHtml)
      },

      upMove( linesIndex, shopsIndex, shopIndex ){
        this.spinShow = true;
        this.clearPlan( linesIndex, this.$refs.lin );
        this.shops[shopsIndex].shops.splice( 
          shopIndex - 1, 0, this.shops[ shopsIndex ].shops.splice( 
            shopIndex, 1 
          )[0] 
        );

      
        let locations = this.pathPlans[ shopsIndex ].locations;
        locations.splice( shopIndex - 1, 0, locations.splice( shopIndex, 1 )[ 0 ] );
        this.pathPlan = Object.assign( {}, this.pathPlans[ shopsIndex ] );

        let shops = this.shops[shopsIndex].shops.map( (item, index, arr) => 
          ({ shop_id: item.shop_id, oo: arr.length - index }) );

        let params = { 
          shops: shops, 
          year: this.year, 
          month: this.month, 
          tag_line: this.shops[shopsIndex].lineId
        };

        this.fetchUpdate( params );
      },

      downMove( linesIndex, shopsIndex, shopIndex ){
        this.spinShow = true;
        this.clearPlan( linesIndex, this.$refs.lin );

        this.shops[shopsIndex].shops.splice( 
          shopIndex + 1, 0, this.shops[shopsIndex].shops.splice( 
            shopIndex, 1 
          )[0] 
        );

        let locations = this.pathPlans[ shopsIndex ].locations;
        locations.splice( shopIndex + 1, 0, locations.splice( shopIndex, 1 )[ 0 ] );
        this.pathPlan = Object.assign( {}, this.pathPlans[ shopsIndex ] );
        
        let shops = this.shops[shopsIndex].shops.map( (item, index, arr) => 
          ({ shop_id: item.shop_id, oo: arr.length - index }) );

        let params = { 
          shops: shops, 
          year: this.year, 
          month: this.month, 
          tag_line: this.shops[shopsIndex].lineId
        };
      
        this.fetchUpdate( params );
      },

      moveLine( shop_id, lineId, shopIndex, shopName, linesIndex, shopsIndex = -1 ){
        if( ~lineId ){
          this.lineModal = true;
        }else{
          this.noplanModal = true;
        }
        this.selectedLineId = lineId;
        this.moveData = { shop_id, lineId, shopsIndex, linesIndex, shopIndex, shopName };
      },

      moveLineOk(){
        if( !this.lineId )
          return;

        const { length } = this.shops;
        const { linesIndex, lineId, shop_id, shopsIndex, shopIndex, shopName } = this.moveData;
        const params = { 
          year: this.year,
          month: this.month,
          from_tag_line_id: lineId,
          to_tag_line_id: this.lineId,
          shop_ids: [ shop_id ],
        }
        
        this.spinShow = true;
        //有安排路线和无安排路线
        
        this.clearPlan( linesIndex, this.$refs.lin);
      
        if( length > 1 && this.shops.some( item => item.lineId === this.lineId ) ){
          this.shops.forEach( (item, index ) => {
            if( item.lineId === this.lineId ){
              this.clearPlan( item.linesIndex, this.$refs.lin );

              let currenShop = this.shops[ shopsIndex ].shops.splice( shopIndex, 1 )[ 0 ];
              this.shops[ index ].shops.push( currenShop );
              
              //移动后已无路线安排清除 lines 的点击状态
              if( this.shops.length < length ){
                let target = this.$refs.lin[ linesIndex ];
                target.style.backgroundColor = '#fff';
                target.style.color = '#6e7787';
                target.setAttribute( 'data-checked', '' );
              }

              let locations = this.pathPlans[ shopsIndex ].locations;
              let currenLocation = locations.splice( shopIndex, 1 )[ 0 ];
              this.pathPlan = Object.assign( {}, this.pathPlans[ shopsIndex ] );
              const self = this;
              setTimeout(function () {
                self.pathPlans[ index ].locations.push( currenLocation );
                self.pathPlan = Object.assign( {}, self.pathPlans[ index ] );
              }, 400)
            }
          })
        }else{
          this.shops[ shopsIndex ].shops.splice( shopIndex, 1 );
          let locations = this.pathPlans[ shopsIndex ].locations;
          let currenLocation = locations.splice( shopIndex, 1 )[ 0 ];
          this.pathPlan = Object.assign( {}, this.pathPlans[ shopsIndex ] );
          this.markersPoint = this.markersPoint.filter( item => item.name !== shopName );
        }
        
        this.pathPlans = this.pathPlans.filter( item => item.locations.length );
        this.shops = this.shops.filter( item => item.shops.length );
        this.fetchPathMove( params );
      },

      noplanMoveOk(){
        if( !this.lineId )
          return;

        const { length } = this.shops;
        const { linesIndex, lineId, shop_id, shopsIndex, shopIndex, shopName } = this.moveData;
        const params = { 
          year: this.year,
          month: this.month,
          from_tag_line_id: lineId,
          to_tag_line_id: this.lineId,
          shop_ids: [ shop_id ],
        }

        this.spinShow = true;

        if( this.shops.some( item => item.lineId === this.lineId ) ){
          this.shops.forEach( (item, index ) => {
            if( item.lineId === this.lineId ){
              this.clearPlan( item.linesIndex, this.$refs.lin );
              let currenNoplanShop = this.noplanShops.shops.splice( shopIndex, 1 )[0];
              this.shops[ index ].shops.push( currenNoplanShop );
              let nopathPlan = this.nopathPlan.splice( shopIndex, 1 )[0];

              nopathPlan.linesIndex = this.pathPlans[ index ].locations[ 0 ].linesIndex;
              this.pathPlans[ index ].locations.push( nopathPlan );
              this.pathPlan = Object.assign( {}, this.pathPlans[ index ] );
            }
          });
        }else{
          this.noplanShops.shops.splice( shopIndex, 1 );
          this.nopathPlan.splice( shopIndex, 1 );
          this.markersPoint = this.markersPoint.filter( item => item.name !== shopName );
        }

        if( !this.noplanShops.shops.length ){
          this.noplanShops = {};
          let target = this.$refs.lin[ this.$refs.lin.length - 1 ];
          target.style.backgroundColor = '#fff';
          target.style.color = '#6e7787';
          target.setAttribute( 'data-checked', '' );
        }

        this.fetchPathMove( params );
      },

      onRemoveLine( pathId, id, linesIndex, shopsIndex, shopIndex, shopName ){
        let { length } = this.shops;
        this.clearPlan( linesIndex, this.$refs.lin );
        let deleteLine = this.shops[shopsIndex].shops.splice( shopIndex, 1 )[0];
        this.shops = this.shops.filter( item => item.shops.length );
        
        this.spinShow = true;

        let nopathPlan = this.pathPlans[ shopsIndex ].locations.splice( shopIndex, 1 )[0]
        if( this.noplanShops.shops ){
          this.nopathPlan.push( nopathPlan );
        }
    
        this.pathPlan = Object.assign( {}, this.pathPlans[ shopsIndex ] );

        if( this.noplanShops.shops ){
          this.noplanShops.shops.push( deleteLine );
        }else{
          this.markersPoint = this.markersPoint.filter( item => item.name !== shopName );
        }

        //删除后已无路线安排清除 lines 的点击状态
        if( this.shops.length < length ){
          let target = this.$refs.lin[ linesIndex ];
          target.style.backgroundColor = '#fff';
          target.style.color = '#6e7787';
          target.setAttribute( 'data-checked', '' );
        }
        
        
        this.pathPlans = this.pathPlans.filter( item => item.locations.length );

        this.fetchDelete( pathId, id );
      },

      clearPlan( linesIndex, els ){
        const baiduMap = document.querySelector( '.baiduMap' );
        const paths = baiduMap.querySelectorAll( 'path' );
        const BMapMarker = baiduMap.querySelectorAll( 
          `.${this.colorMap[ linesIndex ].replace( /#/, 'A')}` 
        );
        Array.from( paths ).forEach( path => {
          if( path.getAttribute( 'stroke' ) === els[linesIndex].dataset.color ){
            path.parentNode.removeChild( path );
          }
        } );
        Array.from( BMapMarker ).forEach( marker => {
          marker.parentNode.removeChild( marker );
        } )
      },

      //获取服务器数据
      fetchCopyPath( params = {} ){
        util.bookAxios.post( '/plans/path/copy/', params ).then( response => {
          const { errcode, errmsg } = response.data;

          if( !errcode ){
            this.$Message.success( '复制成功' );
          }else{
            this.$Message.error( errmsg );
          }
        } )
      },

      //线路列表
      fetchLines(){
        util.bookAxios.get( '/setups/line/list/', {
          params: {
            page_size: 1000,
            page: 1
          }
        } ).then( response => {
          const { errcode, results } = response.data;
          if( !errcode ){
            const col = [ '123456789a', '123456789a', '13456789ab', '12345690ab', '45789abcdef', '56789abcde' ]
            const getRandomColor = () => {
            const colArr = col.map( (item) => 
                item[ Math.floor( Math.random() * 10 ) ] 
              );
              let color = '#' + colArr.join('');
              return color;
            }
            
            this.lines = results;
            this.lines.push({ id: -1, name: '暂无安排' })
            this.colorMap = results.map( item => getRandomColor() );
          }
        } )
      },
      // 商店
      fetchShopInfos( shop_ids, lineId, lineName, linesIndex, pathId ) {
        let ids = shop_ids.map( item => item.shop_id );
        util.bookAxios.post( '/shops/shop/batch/', {
          shop_ids: ids
        } ).then( response => {
          const { errcode, shops } = response.data;
          if( !errcode ){
            let addr = [];
            let planData = {
                time: '',
                distance: '',
                eachDistance: [],
                color: ''
              }
            ids.forEach((i, index) => {
              shops.forEach( item => {
                if (item.shop_id == i) {
                  shop_ids[index]['info'] = item;
                  let { province, city, district, address } = shop_ids[index].info;
                  shop_ids[index]['address'] = province + city + district + address;
                  addr.push( { 
                    address: shop_ids[index].address, 
                    name: shop_ids[index].info.name,
                    linesIndex,
                    icon: ~lineId ? '' : this.icon 
                  } );
                }
              })
            } )
            if( addr.length ){
              this.linesAddress = addr; 
              if( ~lineId ){
                this.shops.push({ 
                  title: lineName, 
                  linesIndex,
                  shopsIndex: this.shops.length,
                  pathId,
                  lineId,
                  planData,
                  shops: [...shop_ids],
                });
              }else{
                this.noplanShops = {
                  title: lineName,
                  lineId,
                  linesIndex,
                  shops: [ ...shop_ids ]
                }
              }
            }else{
              this.modal = true;
              this.lineName = lineName;
              const clickEl = this.$refs.lin[ linesIndex ];
              clickEl.style.backgroundColor = '#fff';
              clickEl.style.color = '#6e7787';
              clickEl.setAttribute( 'data-checked', '' );
            }

            const self = this;
            setTimeout(function () {
              self.spinShow = false; 
            }, 400)
          }
        } )
      },
      //路径 商店 id 用来获取商店地址信息
      fetchPath( tag_line_id, lineName, linesIndex ){
        if (tag_line_id === -1) {
          util.bookAxios.post( '/plans/path/noplan/', {
            params: {
              year: this.year,
              month: this.month
            }
          } ).then( response => {
          const { errcode, shops } = response.data;
          
            let shop_ids = shops;
            this.fetchShopInfos(shop_ids, tag_line_id, lineName, linesIndex );
          } )
        }else {
          util.bookAxios.get( '/plans/path/list/', {
            params: {
              year: this.year,
              month: this.month,
              tag_line__in: tag_line_id
            }
          } ).then( response => {
            const { errcode, results } = response.data;
            if( !errcode ){
              if( results.length > 0 ){
                let shop_ids = results[0].shops;
                this.tag_line_id = results[0].tag_line.id;
                this.fetchShopInfos(shop_ids, tag_line_id, lineName, linesIndex, results[0].id );
              }else{
              
                this.lines.map( item => {
                  if (item.id == tag_line_id) {
                    this.tag_line_id = tag_line_id;
                  }
                })
              }
            }
          } )
        }
      },
      //送货起点经韦
      fetchSetup(){
        util.bookAxios.get( '/setups/setup/query/' )
        .then( response => {
          const { errcode, setup } = response.data;
          if( !errcode ){
            const { lng, lat } = setup;
            // console.log("lng, lat", lng, lat)
            let startPoint = {
              name: '大溪万开物流中心', 
              location: { lng: lng, lat: lat }
            }
            
            this.startPoint = startPoint;
          }
        } )
      },

      fetchUpdate( params = {}){
        util.bookAxios.post( '/plans/path/update/', params ).then( response => {
          const { errcode, errmsg } = response.data;
          if( !errcode ){
            this.$Message.success( `成功` );
            const self = this;
            setTimeout(function () {
              self.spinShow = false;
            }, 600)
          }else{
            this.$Message.error( errmsg )
          }

        } )
      },

      fetchPathMove( params = {} ){
        util.bookAxios.post( '/plans/path/move/', params ).then( response => {
          const { errcode, errmsg } = response.data;
          if( !errcode ){
            this.$Message.success( '移动路线成功' );
            this.lineId = '';
            const self = this;
            setTimeout(function () {
              self.spinShow = false; 
            }, 800)
          }
        } )
      },

      fetchDelete( pathId, id ){
        util.bookAxios.post( `/plans/path/${pathId}/${id}/delete/` ).then( response => {
          const { errcode, errmsg } = response.data;
          if( !errcode ){
            if( !this.spinShow ){
              this.$Message.success( '删除路线成功' );
            }else{
              const self = this;
              setTimeout(function () {
                self.$Message.success( '删除路线成功' );
                self.spinShow = false;
              }, 400)
            }
          }
        } )
      }

    },
  }
</script>