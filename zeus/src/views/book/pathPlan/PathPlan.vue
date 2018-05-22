<template>
  <Card dis-hover :bordered="false">
    <div slot="title">
      <Date-picker 
        @on-change="dateChange" 
        type="month" format="yyyy 年 MM 月" 
        :value="date" placeholder="选择年月" 
        style="width: 116px; display: inline-block; margin-right: 10px">
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
      <Select 
        v-model="selectedLineId" 
        :filterable="true" 
        placeholder="请先择条路线"  
        style="width:200px; margin-right: 10px">
        <Option 
          :class="lines.length-1===index ? 'color' : ''" 
          v-for="(line, index) in lines" 
          :value="line.id" 
          :key="line.id">
          {{ line.name }}
        </Option>
      </Select>
      <Button type="error" @click="switchMap">切换到地图版</Button>
    </div>
    <Row>
      <Col span="24">
        <Table 
          @on-selection-change="selectShopsChange" 
          border 
          :columns="columns" 
          :data="shops">
        </Table>
        <Button 
          style="margin: 20px 14px 0 0;" 
          :disabled="!selection.length" 
          type="error" 
          @click="addLine">
          加入到路线
        </Button>
        <Button 
          v-if="is_created" 
          style="margin: 20px 14px 0 0;" 
          type="error" 
          @click="createPath">
          添加路线
        </Button>
        <Button 
          v-if="is_reset" 
          style="margin: 20px 14px 0 0;" 
          type="ghost" 
          @click="reset">
          重置
        </Button>
        <Button 
          v-if="is_reset" 
          style="margin: 20px 14px 0 0;" 
          type="info" 
          @click="confirmUpdate">
          确定保存
        </Button>
      </Col>
    </Row>
    <Modal
      v-model="lineModal"
      title="添加在下面路线"
      @on-ok="moveLineOk">
      <Radio-group v-model="line" vertical>
        <Radio v-if="!(line.id === selectedLineId )" :label="line.id" v-for="line in lines" :key="line.id">
          <span>{{line.name}}</span>
        </Radio>
      </Radio-group>
    </Modal>
    <Modal
      v-model="noplanModal"
      title="添加无安排路线"
      @on-ok="addLineOk">
      <Checkbox-group v-model="checkedShops" vertical>
        <Checkbox :label="shop.shop_id" v-for="shop in noplanShops" :key="shop.shop_id">
          <span>{{shop.info.province}}{{shop.info.city}}{{shop.info.district}}{{shop.info.address}} 
            {{shop.info.name}} {{shop.info.contact + '/' + shop.info.phone }} {{ shop.info.updated_time | capitalize }}</span>
        </Checkbox>
      </Checkbox-group>
    </Modal>
  </Card>
</template>
<script>
  import moment from "moment";
  import util from "@/libs/util";

  export default {
    data () {
      return {
        year: moment().year(),
        month: moment().month() + 1,
        date: moment().format( 'YYYY-MM' ),
        pathList: [],
        lines: [],
        line: '',
        selectedLineId: '',
        phone: '',
        shop_id: '', 
        indeterminate: false,
        checkAll: false,
        selection: [],
        shops: [],
        shopsCopy: [],
        noplanShops: [],
        checkedShops: [],
        lineModal: false,
        noplanModal: false,
        self: this,
        tag_line_id: -1,
        path_id: '',

        is_created: false,
        path: [],
        is_reset: false,
        columns: [
          {
            type: 'selection',
            align: 'center'
          },
          {
            title: '编码',
            align: 'center',
            render: ( h, params ) => h( 'span', params.row.info.code )
          },
          {
            title: '店铺',
            align: 'center',
            render: ( h, params ) => h( 'span', params.row.info.name )
          },
          {
            title: '地址',
            align: 'center',
            render: ( h, params ) => h( 'span',
              params.row.info.city + params.row.info.district + params.row.info.address
            )
          },
          {
            title: '联系人',
            align: 'center',
            render: ( h, params ) => h( 'span', params.row.info.contact )
          },
          {
            title: '联系电话',
            align: 'center',
            render: ( h, params ) => h( 'span', params.row.info.phone )
          },
          {
            title: '店铺状态',
            align: 'center',
            render: ( h, params ) => h( 'span', params.row.info.status == 0 ? '关闭' :  
              params.row.info.status == 1 ? '筹备' : '正常' 
            )
          },
          {
            title: '加入时间',
            align: 'center',
            render: ( h, params ) => h( 'span', 
              moment( params.row.info.joined_time ).format( 'YYYY-MM-DD' )
            )
          },
          {
            title: '操作',
            align: 'center',
            render: ( h, params ) => h( 'div', [ 
              h( 'Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  disabled: !params.index
                },
                on: {
                  click: ()=> this.moveUp( params.index )
                }
              }, '上移' ),
              h( 'Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  disabled: this.shops.length-1 === params.index
                },
                on: {
                  click: () => this.moveDown( params.index )
                }
              }, '下移' ),
              h( 'Poptip', {
                props: {
                  confirm: true,
                  title: '您确认删除这条内容吗？',
                },
                on: {
                  'on-ok': () => this.onRemoveLine( params.row.shop_id )
                }
              }, [
                h( 'Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  }
                }, '删除' )
              ])
            ])
          }
        ]
      }
    },

    mounted(){
      this.fetchLines();
    },

    methods: {
      fetchLines(){
        util.bookAxios.get( '/setups/line/list/', {
          params: {
            page_size: 1000,
            page: 1
          }
        } ).then( response => {
          const { errcode, results } = response.data;
          if( !errcode ){
            this.lines = results;
            this.lines.push({ id: -1, name: '暂无安排' })
          }
        } )
      },

      fetchShopInfos( shop_ids, is_modal = false ) {
        let ids = shop_ids.map( item => item.shop_id );
        util.bookAxios.post( '/shops/shop/batch/', {
          shop_ids: ids
        } ).then( response => {
          const { errcode, shops } = response.data;
          if( !errcode ){
            ids.forEach((i, index) => {
              shops.forEach( item => {
                if (item.shop_id == i) {
                  shop_ids[index]['info'] = item;
                }
              })
            } )
            if( is_modal ){
              this.noplanShops = [ ...shop_ids ];
            }else{
              this.shopsCopy = [ ...shop_ids ];
              this.shops = [ ...shop_ids ];
            }
          }
        } )
      },

      fetchPath( tag_line_id, is_modal = false ){
        if (tag_line_id === -1) {
          util.bookAxios.post( '/plans/path/noplan/', {
            params: {
              year: this.year,
              month: this.month
            }
          } ).then( response => {
          const { errcode, shops } = response.data;
            let shop_ids = shops;
            this.fetchShopInfos(shop_ids, is_modal);
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
                this.fetchShopInfos(shop_ids);
              }else{
                this.$Message.info( '此路线无数据' )
                this.lines.map( item => {
                  if (item.id == tag_line_id ) {
                    this.tag_line_id = tag_line_id;
                  }
                })
              }
            }
          } )
        }
      },

      fetchs( params = {}){
        util.bookAxios.post( '/plans/path/update/', params ).then( response => {
          const { errcode, errmsg } = response.data;
          if( !errcode ){
            this.$Message.success( `成功` );
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
            this.fetchPath( this.tag_line_id );
            this.selection = [];
            this.line = '';
          }
        } )
      },

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

      dateChange( date ){
        const re = /[0-9]+/g;
        date = date.match( re ).join('-');
        this.year = moment( date ).year();
        this.month = moment( date ).month() + 1;
      },

      moveUp(index){
        this.is_reset = true;
        this.shops.splice( index-1, 0, this.shops.splice( index, 1 )[0] );
      },

      moveDown(index){
        this.is_reset = true;
        this.shops.splice( index + 1, 0, this.shops.splice( index, 1 )[0] );
      },

      createPath(){
        this.noplanModal = true;
        this.fetchPath( -1, true );
        this.checkedShops = [];
      },

      reset(){
        this.shops = [ ...this.shopsCopy ];
        this.is_reset = false;
      },

      confirmUpdate(){
        let shops = this.path.map( (item, index, arr) => ({ shop_id: item.shop_id, oo: arr.length - index }) );
        let params = { shops: shops, year: this.year, month: this.month, tag_line: this.tag_line_id };
        this.fetchs( params );
        this.is_reset = false;
      },

      onRemoveLine( id ){
        util.bookAxios.post( `/plans/path/${this.path_id}/${id}/delete/` ).then( response => {
          const { errcode, errmsg } = response.data;
          if( !errcode ){
            this.$Message.success( '删除路线成功' );
            this.fetchPath( this.tag_line_id );
          }
        } )
      },

      addLine(){
        this.lineModal = true;
      },

      moveLineOk(){
        const params = { 
          year: this.year,
          month: this.month,
          from_tag_line_id: -1,
          to_tag_line_id: this.line,
          shop_ids: this.selection,
        }
        this.fetchPathMove( params );
      },

      addLineOk(){
        const params = { 
          year: this.year,
          month: this.month,
          from_tag_line_id: -1,
          to_tag_line_id: this.selectedLineId,
          shop_ids: this.checkedShops,
        }
        this.fetchPathMove( params );
      },

      selectShopsChange( selection ){
        this.selection = selection.map( item => item.shop_id );
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

      switchMap(){
        this.$router.push({ name: 'BookPathPlanMap' });
      },
    },

    watch: {
      'selectedLineId'( val ){
        this.shops = [];
        this.selection = [];
        if( !~val ){
          this.is_created = false;
        }else{
          this.is_created = true;
        }

        this.fetchPath( val );
      }
    },

    filters: {
      capitalize(value){
        return moment(value).format('YYYY-MM-DD');
      }
    }
  }
</script>
<style>
  .ivu-menu-vertical.ivu-menu-light::after{
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

  .ivu-select-item.color{
    color: #f93100;
  }

</style>
