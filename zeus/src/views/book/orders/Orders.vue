<template>
  <Card dis-hover :bordered="false">
    <div slot="title">
      <Select v-model="params.ftype" style="width:200px; margin-right: 10px;">
        <Option :value="0">全部订单</Option>
        <Option :value="1">筹备订单</Option>
        <Option :value="2">特殊订单</Option>
        <Option :value="3">正常订单</Option>
      </Select>
      <Select v-model="params.status" style="width:200px; margin-right: 10px;">
        <Option :value="1">未提交</Option>
        <Option :value="2">已提交</Option>
        <Option :value="3">已审核</Option>
        <Option :value="4">已发货</Option>
        <Option :value="5">已完成</Option>
      </Select>
      <Date-picker 
        :value="date" 
        format="yyyy-MM-dd" 
        type="daterange" 
        placement="bottom-end" 
        placeholder="选择日期"
        @on-change="dateChange" 
        style="width: 200px; display: inline-block; margin-right: 10px;">
      </Date-picker>
      <Button @click="fetchOrders" type="primary">查询</Button>
    </div>
    <Table border :columns="columns" :data="dataSource"></Table>
    <Page 
      style="float: right; margin-top: 30px" 
      :total="total" 
      :page-size="params.page_size" 
      :current="params.page"
      @on-page-size-change="pageSizeChange"
      @on-change="pageChange"
      show-total 
      show-elevator 
      show-sizer>
    </Page>
  </Card>
</template>
<script>
  import util from "@/libs/util";
  import moment from "moment";
  const dateFormat = 'YYYY-MM-DD HH:mm:ss';
  export default {
    name: 'orders',
    data(){
      return {
        self: this,
        columns: [
          {
            "title": "订单号",
            "key": "num",
            render: ( h, params ) => h( 'span', {
              class: "cell-active",
              on: {
                click: () => this.editOrder( params.row.id )
              }
            }, params.row.num )
          },
          {
            title: '类型',
            key: 'ftype',
            render: ( h, params ) => {
              const { ftype } = params.row;
              return h( 'span', ftype === 3 ?
                '正常订单' : ftype === 2 ?
                '特殊订单' : ftype === 1 ?
                '筹备订单' : ''
              )
            } 
          },
          {
            "title": "订单状态",
            "key": "status",
            render: ( h, params ) => {
              const { status } = params.row;
              return h( 'span', status === 1 ?
                '未提交' : status === 2 ?
                '已提交' : status === 3 ?
                '已审核' : status === 4 ?
                '已发货' : status === 5 ?
                '已完成' : ''
              )
            }
          },
          {
            "title": "订单模板",
            "key": "temp",
            render: ( h, params ) => h( 'span', params.row.temp.name )
          },
          {
            "title": "送货日期",
            "key": "send_date",
          },
          {
            "title": "总价",
            "key": "total_price"
          },
          {
            "title": "创建时间",
            render: ( h, params ) => h( 'span', 
              moment( params.row.created_time ).format( dateFormat ) 
            )
          },
          {
            "title": "更新时间",
            render: ( h, params ) => h( 'span', 
              moment( params.row.updated_time ).format( dateFormat )
            )
          },
          {
            "title": "操作",
            render: ( h, params ) => h( 'Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              on: {
                click: () => this.editOrder( params.row.id )
              }
            }, '编辑' )
          },
        ],
        dataSource: [
        ],
        date: moment().format( 'YYYY-DD-MM' ),
        modal: false,
        total: 0,
        ftype: '',
        params: {
          ftype:  3,
          status: 2,
          page_size: 30,
          page: 1,
          send_date__gte: '',
          send_date__lte: '',
        }
      }
    },

    mounted(){
      this.fetchOrders();
    },
    methods: {
      editOrder( id ){
        this.$router.push({name: 'BookOrder', params: { id: id }});
      },

      fetchOrders() {
        if( this.params.ftype == 0 )
          this.params.ftype = '';
        
        util.bookAxios.get( '/orders/order/list/',{ 
          params: this.params
        }).then( response => {
          const { errcode, results, total } = response.data;
          if( !errcode ){
            if( !this.params.ftype )
              this.params.ftype = 0;
            
            this.dataSource = results;
            this.total = total;
          }
        } )
      },

      dateChange( date ){
        this.params.send_date__gte = date[0];
        this.params.send_date__lte = date[1];
      },

      pageSizeChange( page_size ){
        this.params.page_size = page_size;
        this.fetchOrders();
      },

      pageChange( page ){
        this.params.page = page;
        this.fetchOrders();
      },
    },
  }
</script>

<style>
  .cell-active{
    cursor: pointer;

  }

  .cell-active:hover{
    color: #359aff;
  }
</style>