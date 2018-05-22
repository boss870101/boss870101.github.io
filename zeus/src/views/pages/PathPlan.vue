<template>
  <Card dis-hover>
    <Row>
      <Col span="22">
        <Menu class="menu" mode="horizontal">
          <Menu-item :name="index" v-for="(item, index) in pathList" :key="index">
            <div style="width: 100%; height: 100%;" @click.active="onClick(item.list)">{{item.title}}</div>
          </Menu-item>
        </Menu>
      </Col>
    </Row>
    <Row>
      <Col span="20">
        <baidu-map 
          style="width: 100%; height: 800px;"
          :center="{lng: 120.170604, lat: 30.279311}"
          :zoom="12"
          :scroll-wheel-zoom="true">
          <h-driving-route :points="points"></h-driving-route>
          <bm-marker 
            :points="points" 
            :position="item.location" 
            v-for="(item, index) in markerList" 
            :key="index" 
            :label="{content: item.name, opts: {offset: {width: 20, height: -10}}}">
          </bm-marker>
        </baidu-map>
      </Col>
      <Col span="4">
        <Collapse>
          <Panel :name="`${index + 1}`" v-for="(path, index) in pathList" :key="index">
            {{path.title}}
            <div slot="content" v-for="(item, i) in path.list" style="border: 1px solid #e3e8ee; padding: 5px;" :key="i">
              <p style="line-height: 30px">{{item.name}}</p>
              <Button :disabled="!i ? true : false" type="ghost" size="small">上移</Button>
              <Button type="ghost" :disabled="i === path.list.length-1 ? true : false " size="small">下移</Button>
              <Button type="primary" size="small">移动</Button>
              <Button type="error" size="small">删除</Button>
            </div>
          </Panel>
        </Collapse>
      </Col>
    </Row>
  </Card>
</template>
<script>
  export default {
    data () {
      return {
        pathPlan: false,
        points: [ 
          { lng: 120.114643, lat: 30.299706 },
          { lng: 120.029999, lat: 30.286352 },
          { lng: 120.046677, lat: 30.295011 },
        ],
        pathList: [
          { 
            title: '1 号路线',
            city: '杭州市',
            list: [ 
              { name: '莱茵矩正国际', location: { lng: 120.114643, lat: 30.299706 } },
              { name: '西溪北苑东区', location: { lng: 120.046677, lat: 30.295011 } },
              { name: '淘宝城一期', location: { lng: 120.029999, lat: 30.286352 } } 
            ] 
          },
          {
            title: '2 号路线',
            city: '杭州市',
            list: [
              { name: '浙江省杭州市西湖区古墩路588号', location: { lng: 120.105704, lat: 30.299807 } },
              { name: '浙江省杭州市西湖区文二西路', location: { lng: 120.080012, lat: 30.28671 } },
              { name: '浙江省杭州市西湖区竞舟路', location: { lng: 120.110087, lat: 30.279038 } }
            ]
          }
        ],

        markerList: [],
      }
    },

    created(){
      this.markers();
    },

    methods: {
      onClick( pathList ){
        let points = pathList.map( item => item.location );
        this.points = points;
      },

      markers(){
        this.pathList.forEach( path => {
          path.list.forEach( item => this.markerList.push( item ) );
        })
      },

      upMove(){

      },

      downMove(){

      },

      move(){

      },

      delete(){

      }, 
    },

    
    
  }
</script>
<style>
  .ivu-menu-vertical.ivu-menu-light:after{
    width: 0 !important;
  }
  .menu.ivu-menu.ivu-menu-light.ivu-menu-horizontal{
    line-height: 40px;
  }
  .menu.ivu-menu.ivu-menu-light.ivu-menu-horizontal .ivu-menu-item{
    padding: 0 8px;
    border: 1px solid #e3e8ee;
    height: 40px;
  }

</style>
