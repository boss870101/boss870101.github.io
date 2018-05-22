<template>
  <Card dis-hover :bordered="false">
    <div slot="title">
      <Input icon="search" placeholder="请输入..." style="width: 200px"></Input>
      <Button>查询</Button>
      <Button type="primary" @click="showModal( -1, '新建')">新建</Button>
    </div>
    <Table border :columns="columns" :data="dataSource"></Table>
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
    <Modal
      v-model="modal"
      :title="title"
      width="500"
      @on-ok="handleOk">
      <Form :model="formValue" :label-width="80">
        <Form-item label="名称">
          <Input v-model="formValue.name" placeholder="请输入" style="width: 300px"></Input>
        </Form-item>
        <Form-item label="商品分类" prop="classify">
          <Select v-model="formValue.classify" placeholder="请选商品分类">
            <Option v-for="item in classifies" :key="item.id" :value="item.id">
              {{item.name}}
            </Option>
          </Select>
        </Form-item>
        <Form-item label="仓库" prop="tag_warehouses">
          <Select v-model="formValue.tag_warehouses" multiple placeholder="请选仓库">
            <Option v-for="item in warehouses" :key="item.name" :value="item.id">
              {{item.name}}
            </Option>
          </Select>
        </Form-item>
        <Form-item label="店铺等级" prop="tag_ranks">
          <Select v-model="formValue.tag_ranks" multiple placeholder="请选店铺等级">
            <Option v-for="rank in ranks" :key="rank.name" :value="rank.id">
              {{rank.name}}
            </Option>
          </Select>
        </Form-item>
        <Form-item label="规格" prop="spec">
          <Input v-model="formValue.spec" placeholder="请输入规格"></Input>
        </Form-item>
        <Form-item label="单位" prop="unit">
          <Input v-model="formValue.unit" placeholder="请输入单位"></Input>
        </Form-item>
        <Form-item label="换算率" prop="stock">
          <Input v-model="formValue.stock" placeholder="请输入换算率"></Input>
        </Form-item>
        <Form-item label="价格" prop="price">
          <Input v-model="formValue.price" placeholder="请输入价格"></Input>
        </Form-item>
        <Form-item label="最大值" prop="limit">
          <Input v-model="formValue.limit" placeholder="请输入最大值"></Input>
        </Form-item>
        <Form-item label="步长" prop="step">
          <Input v-model="formValue.step" placeholder="请输入步长"></Input>
        </Form-item>
        <Form-item label="描述" prop="desc">
          <Input v-model="formValue.desc" placeholder="请输入描述"></Input>
        </Form-item>
        <Form-item label="排序码">
          <Input-number :min="1" v-model="formValue.oo"></Input-number>
        </Form-item>
        <Form-item label="是否上架">
          <i-switch v-model="formValue.is_up"></i-switch>
        </Form-item>
      </Form>
    </Modal>
    <Modal
      v-model="tempModal"
      title="添加到模板"
      width="500"
      @on-ok="selectedTemp">
      <Table 
        @on-selection-change="selectionChange" 
        border 
        :columns="tempColumns" 
        :data="tempData">
      </Table>
    </Modal>
  </Card>
</template>
<script>
  import util from "@/libs/util";
  import moment from "moment";
  const dateFormat = 'YYYY-MM-DD HH:mm:ss';
  export default {
    name: 'products',
    data(){
      return {
        tempModal: false,
        columns: [
          {
            "title": "名称",
            "key": "name",
          },
          {
            "title": "分类",
            filters: [
                {
                    label: '手机',
                    value: 1
                },
                {
                    label: '电话',
                    value: 2
                }
            ],
            filterMultiple: false,
            filterMethod (value, row) {
              if( value === 1 ){
                return row.classify.name === '手机';
              }else if( value === 2 ){
                return row.classify.name === '电话';
              }
            },
            render: ( h, params ) => h( 'span', 
              params.row.classify && params.row.classify.name 
            )
          },
          {
            "title": "编码",
            key: "gid"
          },
          {
            "title": "规格",
            key: "spec"
          },
          {
            "title": "单位",
            key: "unit"
          },
          {
            "title": "价格",
            key: "price"
          },
          {
            "title": "最大数量",
            key: "limit"
          },
          {
            "title": "步长",
            key: "step"
          },
          {
            "title": "排序码",
            "key": "oo"
          },
          {
            "title": "上架",
            "width": 65,
            render: ( h, params ) => h( 'Icon', {
              props: {
                type: params.row.is_up ? 'ios-checkmark-outline' : 'ios-close-outline'
              }
            })
          },
          {
            "title": "更新时间",
            render: ( h, params ) => h( 'span',
              moment( params.row.updated_time ).format( dateFormat )
            )
          },
          {
            "title": "操作",
            key: 'action',
            align: 'center',
            render: ( h, params ) => h( 'div', [
              h( 'Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => this.detailPage( params.row.id )
                }
              }, '查看' ),
              h( 'Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => this.showModal( params.index )
                }
              }, '编辑' ),
              h( 'Button', {
                props: {
                  type: params.is_up ? 'error' : 'success',
                  size: 'small'
                },
                on: {
                  click: () => this.clickUp( params.row.id, params.row.is_up )
                }
              }, params.is_up ? '下架' : '上架' ),
              h( 'Poptip', {
                props: {
                  confirm: true,
                  title: '您确认删除这条内容吗？'
                },
                on: {
                  'on-ok': () => this.remove( params.index )
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
        ],

        dataSource: [
        ],
        modal: false,
        title: '分类',
        formValue: {
          name: '',
          is_up: true,
          oo: 1,
          gid: '',
          sid: '',
          spec: 0,
          unit: '',
          stock: '',
          price: '',
          limit: '',
          step: '',
          desc: '',
          classify: 3,
          tag_warehouses: [],
          tag_ranks: [],
        },
        tempData: [],
        tempColumns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            "title": "名称",
            "key": "name",
          },
          {
            "title": "允许路线",
            render: ( h, params ) => params.row.tag_lines.map( item => 
              h( 'Tag', {
                props: {
                  color: 'red'
                }
              }, item.name )
            )
          },
          {
            "title": "是否有效",
            render: ( h, params ) => h( 'Icon', {
              props: {
                type: params.row.is_valid ? 'ios-checkmark-outline' : 'ios-close-outline'
              }
            } )
          },
        ],
        idx: '-1',
        classifies: '',
        warehouses: [],
        ranks: [],
        options: {
          disabledDate(date){
            return date && date.valueOf() < Date.now() - 86400000;
          }
        },
        page_size: 30,
        total: 0,
        page: 1,
        tempId: -1,
        temps: [], 
      }
    },

    mounted(){
      this.fetchProduct();
    },
    methods: {
      showModal( index, title ){
        this.fetchClassify();
        this.fetchWarehouse();
        this.fetchRanks();
        this.modal = true;
        this.title = '编辑分类';
        if( index !== -1 ){
          let { name, is_up, oo, gid, sid, spec, unit, desc, stock, price, limit, step, tag_warehouses, tag_ranks, classify, id } = this.dataSource[index];
          tag_warehouses = tag_warehouses.map( item => item.id );
          tag_ranks = tag_ranks.map( item => item.id );
          classify = classify.id;
          this.formValue = { name, is_up, oo, gid, sid, spec, unit, stock, price, limit, step, classify, desc, tag_warehouses, tag_ranks }
          this.idx = id;
        }else{
          this.formValue = {
            name: '',
            oo: 1,
            is_up: true,
            gid: '',
            sid: '',
            spec: 0,
            unit: '',
            stock: '',
            price: '',
            limit: '',
            step: '',
            desc: '',
            tag_warehouses: [],
            tag_ranks: [],
          }
          this.idx = -1;
        }   
      },

      remove(index) {
        const {id} = this.dataSource[index];
        this.fetchs( 'delete', {}, id, index );
      },

      fetchProduct() {
        util.bookAxios.get( '/products/product/list/', {
          params : {
            page_size: this.page_size, 
            page: this.page,
            is_valid: true
          }
        } ).then( response => {
          const { errcode, results } = response.data;
          if( !errcode ){
            const { total, page_size, page } = response.data;
            this.dataSource = results;
            this.total = total;
            this.page_size = page_size;
            this.page = page;
          }
        } )
      },

      fetchClassify(){
        util.bookAxios.get('/products/classify/list/').then((response) => {
          if( !response.data.errcode ){
            let { results } = response.data;
            this.classifies = results;
          }
        })
      },

      fetchWarehouse(){
        util.bookAxios.get('/setups/warehouse/list/').then((response) => {
          const { results, errcode } = response.data;
          if( !errcode ){
            this.warehouses = results;
          }    
        })
      },

      fetchRanks(){
        util.bookAxios.get('/setups/rank/list/').then((response) => {
          const { results, errcode } = response.data;
          if( !errcode ){
            this.ranks = results;
          }    
        })
      },

      fetchs( method, params = {}, id = 0 ){
        let url = '', msg = '';
        if( method === 'create' ){
          url = '/products/product/create/';
          msg = '创建';
        }else if( method === 'update' ){
          url = `/products/product/${id}/update/`;
          msg = '更新';
        }else if( method === 'delete' ){
          url = `/products/product/${id}/delete/`;
          msg = '删除';
        }else if( method === 'up' ){
          url = `/products/product/${id}/up/`;
          msg = '';
        }

        util.bookAxios.post( url, params ).then( response => {
          let { errcode, errmsg, id, action } = response.data;
      
          if( !errcode ){
            this.$Message.success( `${msg}成功` );
            if( action ){
              this.tempModal = true;
              this.fetchTemp();
              this.tempId = id;
            }

            this.fetchProduct();      
          }else{
            this.$Message.error( errmsg );
          }   
        })   
      },

      fetchTemp() {
        util.bookAxios.get( '/products/temp/list/', {
          params: {
            page: this.page,
            page_size: this.page_size,

          }
        } ).then( response => {
          const { errcode, results } = response.data;
          if( !errcode ){
            const { total, page_size, page } = response.data;
            this.tempData = results;
            this.total = total;
            this.page_size = page_size;
            this.page = page;
          }
        } )
      },

      clickUp( id, is_up ){
        this.fetchs( 'up', { is_up: !is_up }, id );
      },

      detailPage( id ){
        this.$router.push({name: 'BookProduct', params: { id: id }});
      },

      handleOk(){
        if( this.idx !== -1 ){ 
          this.fetchs( 'update', this.formValue, this.idx );
        }else{
          this.fetchs( 'create', this.formValue );
        }
      },

      selectedTemp(){
        util.bookAxios.post( `/products/product/${this.tempId}/temp/`, {
          temps: this.temps
        } ).then( response => {
          const { errcode } = response.data;
          if( !errcode ){
            this.$Message.success( '模板添加成功' )
          }
        } )
      },

      selectionChange( selection ){
        this.temps = selection.map( ({id}) => id ); 
      },

      pageSizeChange( page_size ){
        this.page_size = page_size;
        this.fetchProduct();
      },

      pageChange( page ){
        this.page = page;
        this.fetchProduct();
      },
    }
  }
</script>