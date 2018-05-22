<style>
 .ivu-table .shop-deleted-red td{
    background-color: #f7615b;
    color: #000;
  }

  .ivu-table .shop-amount td{
    background-color: #d0e9de;
    color: #000;
  }

  .table.table-bordered{
    font-size: 16px;
  }

  .table.table-bordered tbody tr td{
    padding: 0 2px;
    line-height: 30px;
  }

  .table.table-bordered tbody tr th{
    padding: 0;
    text-align: right;
    line-height: 30px;
  }

</style>
<template>
  <Card dis-hover :bordered="false">
    <div slot="title" v-show="order.status < 4">
      <Button type="success" @click="kucun">库存</Button>
      <Button type="warning" @click="check">审核</Button>
      <Button type="info" @click="showModal( -1, '新增' )">新增商品</Button>
    </div>
    <Card dis-hover style="margin-bottom: 20px;">
      <table class="table table-bordered">
        <tbody>
          <tr>
            <th>订单号:</th>
            <td>{{ order.num }}</td>
            <th>加盟商:</th>
            <td><Button @click="orderPage" type="primary">{{ shop.name }}</Button></td>
            <th>订单状态:</th>
            <td>
              <span v-if="order.status == 1" style="color: red">未提交</span>
              <span v-if="order.status == 2" style="color: red">已提交</span>
              <span v-if="order.status == 3" style="color: red">已审核</span>
              <span v-if="order.status == 4" style="color: red">已发货</span>
              <span v-if="order.status == 5" style="color: red">已完成</span>
            </td>
            <th>配送方式:</th>
            <td>
              <span>{{order.logistics.tag_line.ftype == 1 ? '干线物流' : order.logistics.tag_line.ftype == 2 ? '第三方物流' : '上门自提' }}</span>
            </td>
            <th>承运方:</th>
            <td>
              <span>{{order.logistics.name}}</span>
            </td>
          </tr>
          <tr>
            <th>送货日期:</th>
            <td>{{ order.send_date }}</td>
            <th>模板:</th>
            <td><Button @click="tempPage" type="primary">{{ order.temp.name }}</Button></td>
            <th>订单类型:</th>
            <td>
              <span v-if="order.ftype == 1" >畴备订单</span>
              <span v-if="order.ftype == 2" style="color: red">特殊订单</span>
              <span v-if="order.ftype == 3">正常订单</span>
            </td>
          </tr>
          <tr>
            <th>下单时间:</th>
            <td>{{ (order.created_time) | capitalize }}</td>
            <th>更新时间:</th>
            <td>{{ (order.update_time) | capitalize }}</td>
            <th v-show="order.logistics.tag_line.ftype == 2">运单编号:</th>
            <td v-show="order.logistics.tag_line.ftype == 2">
              <span>{{order.logistics.num}}</span>
            </td>
            <th>配送时间:</th>
            <td>
              <span>{{order.send_date}}</span>
            </td>
          </tr>
          <tr>
            <th>总价:</th>
            <td colspan="5">{{ order.total_price }}</td>
          </tr>
          <tr>
            <th>备注:</th>
            <td colspan="5">
              <Input v-if="order.status == '3'" v-model="order.content"></Input>
              <span v-else>{{ order.content }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </Card>

    <Table 
      border 
      :row-class-name="rowClassName" 
      :columns="columns" 
      :data="dataSource">
    </Table>
    <Modal
      v-model="modal"
      :title="title"
      width="500"
      @on-ok="handleOk">
      <Form :model="formValue" :label-width="80">
        <Form-item label="数量" prop="amount">
          <Input-number 
            :max="limit" 
            :min="0" 
            :step="step" 
            v-model="formValue.amount">
          </Input-number>
        </Form-item>
      </Form>
    </Modal>
    <Modal
      v-model="productModal"
      title="选择一个商品"
      width="800"   
      cancel-text
      @click="productOk">
      <div style="border-bottom: 1px solid #f0f4f7; width: 100%; height: 40px; margin-bottom: 20px;">
        <Input 
          ref="search"
          v-model="keyword" 
          icon="ios-search" 
          placeholder="请输入..." 
          style="width: 300px">
        </Input>
        <Button @click="searchProduct(keyword)">查询</Button>
      </div>
      <Table 
        border  
        :columns="allColumns" 
        :data="allDataSource"
        @on-selection-change="selectionChange">
      </Table>
      <Page 
        style="float: right; margin-top: 30px" 
        :total="total" 
        :page-size="page_size" 
        :current="page"
        @on-page-size-change="pageSizeChange"
        @on-change="pageChange"
        show-total 
        show-elevator 
        show-sizer>
      </Page>
      <div slot="footer">
        <Button type="primary" size="large"  @click="productOk">确定</Button>
      </div>
    </Modal>
    <Modal
      v-model="checkModal"
      @on-ok="nextCheck"
      @on-cancel="cancel">
      <p style="font-size: 26px;">已提交审核是否进入到下个审核订单</p>
    </Modal>
  </Card>
</template>
<script>
  import util from "@/libs/util";
  import moment from "moment";
  const dateFormat = 'YYYY-MM-DD HH:mm:ss';
  export default {
    name: 'order',
    data(){
      return {
        self: this,
        order: { 
          status: 1,
          temp: { 
            name: '' 
          }, 
          logistics: { 
            tag_line: { 
              name: '',
              manager: '',
              phone: '',
              created_time: 11,
              update_time: 11,
              ftype: 1,
            } 
          } 
        },
        modal: false,
        productModal: false,
        columns: [
          {
            title: '商品名',
            render: ( h, params ) => h( 'span', params.row.product.name )
          },
          {
            title: '规格',
            key: 'product.spec',
            render: ( h, params ) => h( 'span', params.row.product.spec )
          },
          {
            title: '单位',
            key: 'unit',
            render: ( h, params ) => h( 'span', params.row.product.unit )
          },
          {
            title: '商品单价',
            key: 'price',
            render: ( h, params ) => h( 'span', params.row.product.price )
          },
          {
            title: '换算率',
            key: 'step',
            render: ( h, params ) => h( 'span', params.row.product.step )
          },
          {
            title: '下单数量',
            render: ( h, params ) => {
              const { pre_edited, amount } = params.row;
              if( pre_edited > 0 ){
                return h( 'span', {
                  style: {
                    color: 'red'
                  }
                }, amount )
              }else{
                return h( 'span', amount )
              }
            }
          },
          {
            title: '可用库存',
            render: ( h, params ) => params.row.kucun ?
              params.row.amount > params.row.kucun ? 
              h( 'span', {
                style: {
                  color: 'red'
                }
              }, params.row.kucun ) :
              h( 'span', params.row.kucun ) : ''
          },
          {
            title: '小计',
            key: 'amount'
          },
          {
            "title": "操作",
            render: ( h, params ) => {
              if( this.order.status > 3 ){
                return '';
              }

              return　h( 'div', [
                h( 'Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => this.showModal( params.index, '编辑', params.row.id )
                  }
                }, '编辑' ),
                h( 'Poptip', {
                  props: {
                    confirm: true,
                    tiele: '您确认删除这条内容吗？'
                  },
                  on: {
                    'on-ok': () => this.remove( params.index, params.id )
                  }
                }, [ 
                  h( 'Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    }
                  }, '删除' )
                ] )
              ] )
            }
          },
        ],

        dataSource: [],
        title: '商品',
        checkModal: false,

        allColumns: [
          {
            type: 'selection',
            width: 60,
            align: 'center',
          },
          {
            "title": "名称",
            "key": "name",
          },
          {
            "title": "分类",
            render: ( h, params ) => h( 'span', 
              params.row.classify && params.row.classify.name 
            )
          },
          {
            "title": "规格",
            "key": "spec",
          },
          {
            "title": "数量",
            "key": "unit",
          },
          {
            "title": "limit",
            "key": "limit",
          },
          {
            "title": "价格",
            key: "price"
          },
        ],

        allDataSource: [],
        selectedProducts: [],
        selectedItemIds: [],
        disabledItemIds: [],

        formValue: {
          amount: 1,
          is_deleted: false,
        },
        idx: '-1',
        classifies: '',
        warehouses: [],
        ranks: [],
        step: 1,
        limit: 1,

        page_size: 30,
        total: 0,
        page: 1,
        pages: 1,
        name: '',
        keyword: '',
        shop: '',
        nextId: '',
      }
    },

    mounted(){
      this.fetchOrder();
    },

    methods: {
      fetchOrder() {
        util.bookAxios.get( `/orders/order/${this.$route.params.id}/query/` )
        .then( response => {
          const { errcode, order } = response.data;
          if( !errcode ){
            const { items } = order;
            this.order = order;
            this.fetchShop();
            this.dataSource = items;
            this.disabledItemIds = items.map( item => item.product.id );
          }
        } )
      },

      fetchUpdate( params ){
        util.bookAxios.post( 
          `/orders/order/${this.$route.params.id}/item/${this.idx}/update/`, params )
        .then( response => {
          const { errcode, errmsg } = response.data;
          if( !errcode ){
            this.$Message.success( '更新成功' );
            this.fetchOrder();
          }else{
            this.$Message.error( errmsg );
          }

        } )
        this.idx = -1;
      },

      fetchAddOrber(){
        util.bookAxios.post( `/orders/order/${this.$route.params.id}/item/add/`, {
          products: this.selectedItemIds,
        } ).then( response => {
          const { errcode, errmsg } = response.data;

          if( !errcode ){
            this.$Message.success( '添加成功' );
            this.fetchOrder();
          }else{
            this.$Message.error( errmsg );
          }
        } )
      },

      rowClassName (row, index) {
        if( row.is_deleted ){
          return 'shop-deleted-red';
        }else if( row.amount === 0 ){
          return 'shop-amount'
        }
      },

      handleOk(){
        this.fetchUpdate( this.formValue );
      },

      remove( index, id ){
        this.idx = id;
        let { amount, is_deleted } = this.dataSource[ index ];
        let params = {
          is_deleted: true,
          amount: amount
        }
        this.fetchUpdate( params );
      },

      showModal( index, title, id ){
        this.title = `${title}商品`;
        if( index !== -1 ){
          this.modal = true;
          let { amount, is_deleted, step, limit } = this.dataSource[ index ];
          this.formValue = { amount, is_deleted };
          this.step = step;
          this.limit = limit;
          this.idx = id;
        }else{
          this.fetchProducts();
          this.productModal = true;
        }
        
      },

      fetchShop(){
        util.bookAxios.get(`/shops/shop/${this.order.shop_id}/query/`)
        .then((response) => {
          const { shop, errcode, errmsg } = response.data;
          if( !errcode ){
            this.shop = shop;
          }
        })
      },

      fetchProducts(){
        util.bookAxios.get('/products/product/list/', {
          params: {
            page: this.page,
            page_size: this.page_size,
            classify: this.classify,
            is_up: 'True',
            name__icontains: this.keyword
          }
        }).then((response) => {
          const { errcode, results, total, page, pages, page_size } = response.data;
          if( !errcode ){
            this.total = total;
            this.page = page;
            this.pages = pages;
            this.page_size = page_size; 
            this.allDataSource = [ ...results ];

            this.allDataSource.forEach( i => {
              if ( ~this.disabledItemIds.indexOf(i['id'])) {
                i._disabled = true;
              }
            })
          }
        })
      },

      searchProduct( keyword ){
        this.products = [];
        this.page = 1;
        this.pages = 1;
        this.classify = '';
        this.classify_name = '全部';
        this.fetchProducts();
        this.$refs.search.cancel();
      },

      productOk(){
        this.selectedItemIds = this.selectedProducts.map( item => item.id );
        this.productModal = false;
        if( !this.selectedItemIds.length ){
          return;
        }
        this.fetchAddOrber();
      },

      selectionChange( selection ){
        this.selectedProducts = selection;  
      },

      orderPage(){
        this.$router.push({name: 'BookShop', params: { id: this.order.shop_id }});
      },

      tempPage(){
        this.$router.push({ name: 'BookTemp' })
      },

      kucun(){
        util.bookAxios.post( `/orders/order/${this.$route.params.id}/kucun/` )
        .then( response => {
          const { errcode, kucun } = response.data;
          if( !errcode ){
            let dataSource = [ ...this.dataSource ];
            let passed = true;
            dataSource.forEach( item => {
              kucun.forEach( it => {
                if( item.id === it.id ){
                  item['kucun'] = it.kucun;
                  if( item.amount > item.kucun ){
                    passed = false;
                  }
                }
              } )
            } );
            this.dataSource = [ ...dataSource ];

            if( passed ){
              this.$Message.success( '库存检测通过' )
            }else{
              this.$Message.error( '库存不足', 10 )
            }
          }
        } )
      },

      check(){
        let stop = false;
        for( let item of this.dataSource ){
          if( item.amount === 0 && !item.is_deleted ){
            stop = true;
          }
        }

        if (stop) {
          this.$Message.error( '有数量为 0' )
          return;
        }


        util.bookAxios.post( `/orders/order/${this.$route.params.id}/check/` )
        .then( response => {
          const { errcode, next } = response.data;
          if( !errcode ){
            if( next == 0 ){
              this.$router.push({ name: 'BookOrders' });
            }
            this.nextId = next;
            this.checkModal = true;
          }
        } )
      },

      pageSizeChange( page_size ){
        this.page_size = page_size;
        this.fetchProducts();
      },

      pageChange( page ){
        this.page = page;
        this.fetchProducts();
      },

      cancel(){
        this.$router.push({ name: 'BookOrders' });
      },

      nextCheck(){
        this.$router.push({ name: 'BookOrder', params: { id: this.nextId }})
      }
    },

    watch: {
      '$route': 'fetchOrder'
    },

    filters: {
      capitalize(value){
        return moment(value).format('YYYY-MM-DD HH:mm:ss');
      }
    },
  }
</script>