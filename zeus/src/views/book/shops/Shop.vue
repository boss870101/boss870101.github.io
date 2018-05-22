<style scoped>
</style>
<template>
  <Card dis-hover>
    <Row>
      <Col span="6">
        <Card dis-hover>
          <div slot="title">
            <span style="font-size: 50px;">{{shop.name}}</span>
            <span>{{ shop.province + shop.city + shop.district + shop.address }}</span>
          </div>
          <Card dis-hover>
            <p slot="title">仓库</p>
            <Card dis-hover v-for="item of shop.tag_warehouses" :key="item.id"  style="width: 50%; display: inline-block">
              <p :key="item.name" slot="title">{{item.name}}</p>
              <p><span>创建时间: </span><Tag color="blue">{{item.created_time | capitalize}}</Tag></p>
              <p><span>更新时间: </span><Tag color="blue">{{item.updated_time | capitalize}}</Tag></p>
            </Card>
          </Card>
          <Card dis-hover style="margin-top: 18px;">
            <p slot="title">路线</p>
            <Card dis-hover>
              <p slot="title">{{12}}</p>
              <Row>
                <Col span="12">
                  <p><span>负责人: </span><Tag color="blue">{{11}}</Tag></span></p>
                  <p><span>联系电话: </span><Tag color="blue">{{00}}</Tag></span></p>
                </Col>
                <Col span="12">
                  <p><span>创建时间: </span><Tag color="blue">{{111}}</Tag></p>
                  <p><span>更新时间: </span><Tag color="blue">{{111}}</Tag></p>
                </Col>
              </Row>
            </Card>
          </Card>
        </Card>
      </Col>
      <Col span="18">
        <Card dis-hover>
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
        </Card>
      </Col>
    </Row>
  </Card>
</template>
<script>
  import util from "@/libs/util";
  import moment from "moment";
  const dateFormat = 'YYYY-MM-DD HH:mm:ss';
  export default {
    name: 'shop',
    data(){
      return {
        shop: '',
        self: this,
        params: {
          ftype:  3,
          status: 2,
          page_size: 30,
          page: 1,
          send_date__gte: '',
          send_date__lte: '',
          shop_id__in: this.$route.params.id
        },
        columns: [
          {
            "title": "订单号",
            "key": "num",
          },
          {
            title: '类型',
            key: 'ftype',
            width: 85,
            render: ( h, params ) => {
              if( params.row.ftype === 3 )
                return h( 'span', '正常订单' );
              else if( params.row.ftype === 2 )
                return h( 'span', '特殊订单' );
              else if( params.row.ftype === 1 )
                return h( 'span', '筹备订单' );
            } 
          },
          {
            "title": "订单状态",
            "key": "status",
            width: 85,
            render: ( h, params ) => {
              if( params.row.status == 1  )
                return h( 'span', '未提交' );
              else if( params.row.status == 2 )
                return h( 'span', '已提交' );
              else if( params.row.status == 3 )
                return h( 'span', '已审核' );
              else if( params.row.status == 4 )
                return h( 'span', '已发货' );
              else if( params.row.status == 5 )
                return h( 'span', '已完成' );
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
        ],
        dataSource: [],
      }
    },
    mounted(){
      this.fetchShop();
    },

    methods: {
      fetchShop(){
        util.bookAxios.get(`/shops/shop/${this.$route.params.id}/query/`).then((response) => {
          const { shop, errcode, errmsg } = response.data;
          if( !errcode ){
            this.shop = shop;
          }
        })
      },

      fetchOrders() {
        if( this.params.ftype == 0 )
          this.params.ftype = '';

        util.bookAxios.get( '/orders/order/list/',{ params: this.params}).then( response => {
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
        this.params.send_date__gte = date[ 0 ];
        this.params.send_date__lte = date[ 1 ];
      },
      
    },

    filters: {
      capitalize(value){
        return moment(value).format('YYYY-MM-DD HH:mm:ss');
      }
    },
  }

</script>