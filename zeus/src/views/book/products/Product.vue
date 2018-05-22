<style scoped>
</style>
<template>
  <Card dis-hover>
    <Row>
      <Col span="8">
        <Card dis-hover>
          <div slot="title">
            <span style="font-size: 50px;">
              {{product.name}}
            </span>
            <span>
              <span>单价: </span>
              <Tag color="blue">{{product.price}}</Tag>
              <span>规格: </span>
              <Tag color="blue">{{product.spec}}</Tag>
              <span>上架: </span>
              <Tag color="blue">
                <Icon v-if="product.is_up" type="ios-checkmark-outline"></Icon> 
                <Icon v-else type="ios-close-outline"></Icon>
              </Tag>
            </span>
          </div>
          <Card dis-hover>
            <p slot="title">所在仓库</p>
            <Card dis-hover v-for="item of product.tag_warehouses" :key="item.id" style="width: 50%; display: inline-block">
              <p slot="title">{{item.name}}</p>
              <p>
                <span>创建时间: </span>
                <Tag color="blue">{{item.created_time | capitalize}}</Tag>
              </p>
              <p>
                <span>更新时间: </span>
                <Tag color="blue">{{item.updated_time | capitalize}}</Tag>
              </p>
            </Card>
          </Card>
          <p>
            <span>tag_ranks: </span>
            <Tag color="blue" v-for="item of product.tag_ranks" :key="item.id">{{item.name}}</Tag>
          </p>

          <p>
            <span>分类: </span>
            <Tag color="blue">{{product.classify.name}}</Tag>
          </p>
          <p>
            <span>gid: </span>
            <Tag color="blue">{{product.gid}}</Tag>
          </p>
          <p>
            <span>规格: </span>
            <Tag color="blue">{{product.spec}}</Tag>
          </p>
          <p>
            <span>stock: </span>
            <Tag color="blue">{{product.stock}}</Tag>
          </p>
          <p>
            <span>单价: </span>
            <Tag color="blue">{{product.price}}</Tag>
          </p>
          <p>
            <span>上架: </span>
            <Tag color="blue">{{product.is_up ? `<Icon type="ios-checkmark-outline"></Icon>` : `<Icon type="ios-close-outline"></Icon>`}}</Tag>
          </p>
          <p>
            <span>limit: </span>
            <Tag color="blue">{{product.limit}}</Tag>
          </p>
          <p>
            <span>desc: </span>
            <Tag color="blue">{{product.desc}}</Tag>
          </p>
          <p>
            <span>created_time: </span>
            <Tag color="blue">{{product.created_time | capitalize}}</Tag>
          </p>
          <p>
            <span>updated_time: </span>
            <Tag color="blue">{{product.updated_time | capitalize}}</Tag>
          </p>
          <p>
            <span>oo: </span>
            <Tag color="blue">{{product.oo}}</Tag>
          </p>
        </Card>
      </Col>
      <Col span="16">
        <Card dis-hover>
          <Date-picker 
            :value="date" 
            format="yyyy/MM/dd" 
            type="daterange" 
            placement="bottom-end" 
            placeholder="选择日期" 
            style="width: 200px">
          </Date-picker>
        </Card>
      </Col>
    </Row>
  </Card>
</template>
<script>
  import util from "@/libs/util";
  import moment from "moment";
  export default {
    name: 'product',
    data(){
      return {
        product: {
          name: '',
          price: '',
          spec: '',
          tag_warehouses: {
            name: ''
          },
          classify: {
            name: ''
          }
        },
        date: ['2016-01-01', '2016-02-15'],
        columns: [
          { type: 'selection', width: 60, align: 'center' }
        ],
      }
    },
    mounted(){
      this.fetchProduct();

    },

    methods: {
      fetchProduct(){
        util.bookAxios.get(`/products/product/${this.$route.params.id}/query/`).then((response) => {
          const { product, errcode, errmsg } = response.data;
          if( !errcode ){
            this.product = product;
            this.$Message.success( '获取商品成功' )
          }else{
            this.$Message.error( errmsg );
          }
        })
      },
      
    },

    filters: {
      capitalize(value){
        return moment(value).format('YYYY-MM-DD');
      }
    }
  }

</script>