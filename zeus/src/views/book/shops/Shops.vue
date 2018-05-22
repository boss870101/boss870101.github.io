<template>
  <Card dis-hover :bordered="false">
    <Row>
      <Col span="24">
        <Table 
          @on-row-click="detailPage" 
          :row-class-name="rowClassName" 
          border 
          :columns="columns"
          :data="shops">
        </Table>
      </Col>
      <Modal
        v-model="modal"
        :title="title"
        width="500"
        @on-ok="handleOk">
        <Form :model="formValue" :label-width="80">
          <Form-item label="路线" prop="tag_line">
            <Select v-model="formValue.tag_line" placeholder="请选择路线">
              <Option v-for="line in lines" :key="line.id" :value="line.id">
                {{line.name}}
              </Option>
            </Select>
          </Form-item>
          <Form-item label="仓库" prop="tag_warehouses">
            <Select v-model="formValue.tag_warehouses" multiple placeholder="请选tag_warehouses">
              <Option v-for="item in warehouses" :key="item.id" :value="item.id">
                {{item.name}}
              </Option>
            </Select>
          </Form-item>
          <Form-item label="级别" prop="tag_ranks">
            <Select v-model="formValue.tag_ranks" multiple placeholder="请选tag_ranks">
              <Option v-for="rank in ranks" :key="rank.id" :value="rank.id">
                {{rank.name}}
              </Option>
            </Select>
          </Form-item>
        </Form>
      </Modal>
    </Row>
  </Card>
</template>
<script>
  import moment from "moment";
  import util from "@/libs/util";

  export default {
    data () {
      return {
        shops: [],
        shopIds: [],
        title: '编辑',
        modal: false,
        formValue: {
          tag_line: 3,
          tag_warehouses: [],
          tag_ranks: [],
          charge_id: 'aa',
        },
        warehouses: [],
        ranks: [],
        lines: [],
        idx: '-1',
        columns: [
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
            title: '路线',
            render: ( h, params ) => h( 'span', params.row.tag_line.name )
          },
          {
            title: '仓库',
            render: ( h, params ) => params.row.tag_warehouses.map( item =>
              h( 'Tag', item.name )
            )
          },
          {
            title: '级别',
            align: 'center',
            width: 80,
            render: ( h, params ) => h( 'span', params.row.tag_rank.name )
          },
          {
            title: '地址',
            align: 'center',
            render: ( h, params ) => h( 'span', 
              params.row.info.city + params.row.info.district + params.row.info.address )
          },
          {
            title: '负责人',
            key: 'charge_id',
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
            width: 100,
            render: ( h, params ) => h( 'span', 
              params.row.info.status == 0 ? '关闭' : params.row.info.status == 1 ?
               '筹备' : '正常' )
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
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => this.detailPage( params.row )
                }
              }, '查看' ),
              h( 'Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  disabled: true
                },
                on: {
                  click: () => this.showModal( params.index )
                }
              }, '编辑' )
            ])
          }
        ]
      }
    },

    mounted(){
      this.fetchShops();
    },

    methods: {
      fetchWarehouse(){
        util.bookAxios.get('/setups/warehouse/list/').then((response) => {
          const { results, errcode } = response.data;
          if( !errcode ){
            this.warehouses = results;
          }    
        })
      },

      fetchLine() {
        util.bookAxios.get( '/setups/line/list/', {
          params: {
            page_size: 1000,
            page: 1,
          }
        } ).then( response => {
          const { errcode, results } = response.data;
          if( !errcode ){
            this.lines = results;
          }
        } )
      },

      fetchRanks(){
        util.bookAxios.get('/setups/rank/list/').then((response) => {
          const { results, errcode } = response.data;
          if( !errcode ){
            this.ranks = results;
          }    
        })
      },

      async fetchShops(){
        let response = await util.bookAxios.get( '/shops/shop/list', {
          params: {
            page_size: 1000,
            page: 1
          }
        } );

        let { errcode, results } = response.data;

        if( !errcode ){
          let shop_ids = results.map( item => item.shop_id );
          let response = await util.bookAxios.post( '/shops/shop/batch/', {
            shop_ids
          } );
          let { errcode, shops } = response.data;

          if( !errcode ){
            shop_ids.forEach(( i, index ) => {
              shops.forEach( item => {
                if( item.shop_id == i ){
                  results[ index ][ 'info' ] = item;
                }
              } )
            });

            this.shops = [ ...results ];
          }
        }
      },

      // fetchShops(){
      //   util.bookAxios.get( '/shops/shop/list/', {
      //     params: {
      //       page_size: 1000,
      //       page: 1
      //     }
      //   } ).then( response => {
      //     const { errcode, results } = response.data;
      //     if( !errcode ){
      //       this.fetchShopInfos( results );
      //     }
      //   } )
      // },

      // fetchShopInfos( shop_ids ) {
      //   let ids = shop_ids.map( item => item.shop_id );
      //   util.bookAxios.post( '/shops/shop/batch/', {
      //     shop_ids: ids
      //   } ).then( response => {
      //     const { errcode, shops } = response.data;
      //     if( !errcode ){
      //       ids.forEach((i, index) => {
      //         shops.forEach( item => {
      //           if (item.shop_id == i) {
      //             shop_ids[index]['info'] = item;
      //           }
      //         })
      //       } )
          
      //       this.shops = [ ...shop_ids ];
      //     }
      //   } )
      // },

      fetchs( method, params = {}, id = 0, index = -1 ){
        let url = '', msg = '';
        if( method === 'create' ){
          url = '/shops/shop/create/';
          msg = '创建';
        }else if( method === 'update' ){
          url = `/shops/shop/${id}/update/`;
          msg = '更新';
        }else if( method === 'delete' ){
          url = `/shops/shop/${id}/delete/`
          msg = '删除';
        }

        util.bookAxios.post( url, params ).then( response => {
          let { errcode, errmsg } = response.data;
          if( !errcode ){
            this.$Message.success( `${msg}成功` );
            this.fetchClassify();      
          }else{
            this.$Message.error( errmsg );
          }   
        })   
      },

      rowClassName (row, index) {
        if( row.info.status == 0 ){
          return 'shop-status-red'
        }else if( row.info.status == 1 ){
          return 'shop-status-green'
        }else if( row.info.status == 2 ){
          return '';
        }
      },

      showModal( index, title ){
        this.fetchLine();
        this.fetchWarehouse();
        this.fetchRanks();
        this.modal = true;
        this.title = `${title}店铺`;
        if( index !== -1 ){
          let { tag_warehouses, tag_ranks, tag_line, id, charge_id } = this.shops[index];
          tag_warehouses = tag_warehouses.map( item => item.id );
          tag_ranks = tag_ranks.map( item => item.id );
          tag_line = tag_line.id;
          this.formValue = { tag_line, charge_id, tag_warehouses, tag_ranks }
          this.idx = id;
        }else{
          this.formValue = {
            tag_line: '',
            tag_warehouses: [],
            tag_ranks: [],
            charge_id: 'aa',
          }
          this.idx = -1;
        }
         
      },

      detailPage( currentRow ){
        this.$router.push({name: 'BookShop', params: { id: currentRow.id }});
      },
      handleOk(){
        if( this.idx !== -1 ){ 
          this.fetchs( 'update', this.formValue, this.idx );
        }else{
          this.fetchs( 'create', this.formValue );
        }
      },

    },

  }
</script>
<style>
  .ivu-table .shop-status-red td{
    background-color: #c9e5f5;
    color: #000;
  }

  .ivu-table .shop-status-green td{
    background-color: #e2f0e4;
    color: #000;
  }

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
