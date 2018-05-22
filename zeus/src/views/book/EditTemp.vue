<style scoped>
  .ivu-btn.ivu-btn-primary.ivu-btn-large{
    margin-right: 50px;
  }

  .ivu-icon.ivu-icon-arrow-down-b.ivu-select-arrow{
    display: none;
  }
</style>
<template>
  <div>
  <Card dis-hover :bordered="false">
    <div slot="title">
    </div>
    <Form 
      ref="formValue" 
      :model="formValue" 
      :label-width="80" 
      style="width: 80%; margin: 0px auto 0 auto">
      <Form-item 
        label="名称" 
        prop="name"
        :rules="{required: true, message: '名称不能为空', trigger: 'blur'}">
        <Input v-model="formValue.name" placeholder="请输入标题"></Input>
      </Form-item>
      <Form-item
        label="选择对应路线" 
        prop="tag_lines"
        :rules="{ required: true, type: 'array', min: 1, message: '至少选择一条路线', trigger: 'change' }">
        <Select v-model="formValue.tag_lines" multiple style="width: 80%">
          <Option v-for="line in lines" :value="line.id" :key="line.id">{{ line.name }}</Option>
        </Select>
        
        <Modal
          v-model="plansModal"
          title="选择对应送货路线">
          <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
            <Checkbox
              :indeterminate="indeterminate"
              :value="planCheckedAll"
              @click.prevent.native="planCheckAll">
              全选
            </Checkbox>
          </div>
          <Checkbox-group v-model="formValue.tag_lines" @on-change="checkAllGroupChange">
            <Checkbox 
              :label="line.id" 
              v-for="line in lines" 
              :key="line.id">
              {{line.name}}
            </Checkbox>
          </Checkbox-group>
        </Modal>
        <Button type="ghost" @click="checkedPath">选择路线</Button>
      </Form-item>
      <Form-item label="是否有效">
        <i-switch v-model="formValue.is_valid"></i-switch>
      </Form-item>
      <Form-item label="用于筹备">
        <i-switch v-model="formValue.is_for_prepared"></i-switch>
      </Form-item>
      <Form-item label="用于特殊">
        <i-switch v-model="formValue.is_for_everyday"></i-switch>
      </Form-item>
      <Row style="height: 30px">
        <Col span="8" style="text-align: center">商品</Col>
        <Col span="5" style="text-align: center">数量</Col>
        <Col span="5" style="text-align: center">排序</Col>
        <Col span="4" style="text-align: center">操作</Col>
      </Row>
      <!-- product -->
      <Row v-for="(item, index) in selectedItems" :key="item.id">
        <Col span="8" style="margin-bottom: 20px">
          <Input :min="1" v-model="item.product.name" :disabled="true"></Input>
        </Col>
        <Col span="5" style="text-align: center">
          <Input-number :min="1" v-model="item.amount"></Input-number>
        </Col>
        <Col span="5" style="text-align: center">
          <Input-number :min="1" v-model="item.oo"></Input-number>
        </Col>
        <Col span="4" style="text-align: center">
          <Button type="ghost" @click="handleRemove(index)">删除</Button>
        </Col>
      </Row>

      <Row>
        <Col span="24">
          <Button type="dashed" long @click="addProducts" icon="plus-round">选择商品并可以新增多个</Button>
        </Col>
      </Row>
      <Row style="margin-top: 20px; text-align: center;">
        <Col span="24">
          <Button type="primary" @click="onSubmit('formValue')">提交</Button>
          <Button type="ghost" @click="handleReset('formValue')" style="margin-left: 8px">重置</Button>
        </Col>
      </Row>
    </Form>
    <Modal
      v-model="productModal"
      title="选择商品"
      width="800"   
      cancel-text
      @click="productOk">
      <div style="border-bottom: 1px solid #f0f4f7; width: 100%; height: 40px; margin-bottom: 20px;">
        <Input 
          ref="search"
          v-model="name" 
          icon="ios-search" 
          placeholder="请输入..." 
          style="width: 300px">
        </Input>
        <Button @click="searchProduct(name)">查询</Button>
      </div>
      <Table 
        border 
        :columns="columns" 
        :data="dataSource"
        @on-selection-change="selectionChange">
      </Table>
      <Page 
        style="float: right; margin-top: 30px" 
        :total="total" 
        :page-size="page_size" 
        :current="page"
        show-total 
        show-elevator 
        show-sizer>
      </Page>
      <div slot="footer">
        <Button type="primary" size="large"  @click="productOk">确定</Button>
      </div>
    </Modal>
  </Card>
</div>
</template>
<script>
  import util from "@/libs/util";
  import moment from "moment";
  const dateFormat = 'YYYY-MM-DD HH:mm:ss';
  export default {
    name: 'editTemp',
    data(){
      return {
        plansModal: false,
        productModal: false,
        startTemp: {},
        startItems: [],
        startItemsIds: [],
        formValue: {
          name: '',
          tag_lines: [],
          items: [],
          is_valid: true,
          is_for_prepared: false,
          is_for_everyday: true,
        },
        selectedItems: [],
        selectedItemIds: [],
        indeterminate: false,
        lineChecked: [],
        planCheckedAll: false,
        nowProtductItems: [],
        selectedProducts: [],
        lines: [],
        classifies: '',
        columns: [
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
            "title": "单位",
            "key": "unit",
          },
          {
            "title": "最大值",
            "key": "limit",
          },
          {
            "title": "价格",
            key: "price"
          },
        ],
        name: '',

        dataSource: [
        ],
        page_size: 30,
        total: 0,
        page: 1,
        pages: 1,    
      }
    },

    mounted(){
      if( this.$route.params.id ){
        this.fetchTemp();
      }
      this.fetchLines();
    },
    methods: {
      fetchTemp() {
        util.bookAxios.get( `/products/temp/${this.$route.params.id}/query/`).then( response => {
          const { errcode, temp } = response.data;
          if( !errcode ){
            this.formValue.name = temp.name;
            this.formValue.is_valid = temp.is_valid;
            this.formValue.is_for_prepared = temp.is_for_prepared;
            this.formValue.is_for_everyday = temp.is_for_everyday;
            this.formValue.tag_lines = temp.tag_lines.map( item => item.id );
            this.selectedItems = temp.items.map( item => {
              this.selectedItemIds.push(item.product.id);
              return item;
            })

            this.startItems = [ ...this.selectedItems ];
            this.startItemsIds = [ ...this.startItemsIds ];
            this.startTemp = Object.assign( {}, this.formValue );
            this.startTemp.tag_lines = [ ...this.formValue.tag_lines ]
          }
        } )
      },

      fetchLines(){
        util.bookAxios.get('/setups/line/list/').then((response) => {
          const { errcode, results } = response.data;
          if( !errcode ){
            this.lines = results;
          }
        })
      },

      fetchClassifies () {
        util.bookAxios.get('/products/classify/list/', {
          params: {
            page: 1,
            page_size: 1000
          }
        }).then( response => {
          const { errcode, results } = response.data
          if(!errcode){
            this.classifies = results;
          }
          this.classifies.push({
            id: '',
            name: '全部'
          })
        })
      },

      fetchProducts(){
        util.bookAxios.get('/products/product/list/', {
          params: {
            page: this.page,
            page_size: this.page_size,
            classify: this.classify,
            is_up: 'True',
            name__icontains: this.name
          }
        }).then((response) => {
          const { errcode, results, total, page, pages, page_size } = response.data;
          if( !errcode ){
            this.total = total;
            this.page = page;
            this.pages = pages;
            this.page_size = page_size; 
            this.dataSource = [ ...results ];

            this.dataSource.forEach( i => {
              if ( ~this.selectedItemIds.indexOf(i['id'])) {
                i._checked = true;
              }
            })
          }
        })
      },

      fetchs( method, params = {}, id = 0 ){
        let url = '', msg = '';
        if( method === 'create' ){
          url = '/products/temp/create/';
          msg = '创建';
        }else if( method === 'update' ){
          url = `/products/temp/${id}/update/`;
          msg = '更新';
        }

        util.bookAxios.post( url, params ).then( response => {
          let { errcode, errmsg } = response.data;
          if( !errcode ){
            this.$Message.success( `${msg}成功` );
            this.$router.push({ name: 'BookTemp' });
          }else{
            this.$Message.error( errmsg );
          }   
        })   
      },

      selectionChange( selection ){
        this.selectedProducts = selection;  
      },


      checkedPath(){
        this.plansModal = true;
      },

      //select product ok
      productOk(){
        this.selectedItemIds = [];
        const items = this.nowProtductItems;
        const items_ids = items.map( item => item.product.id);
        
        this.selectedItems = this.selectedProducts.map( item => {
          var amount = item.limit;
          let oo = 1;
          let idx = items_ids.indexOf(item.id);
          if ( ~idx ) {
            amount = items[idx]['amount'];
            oo = items[idx]['oo'];
          }

          this.selectedItemIds.push(item.id);

          return {
            product: item,
            amount: amount,
            oo: oo
          }
        })
        this.productModal = false;
      },

      handleRemove( index ){
        this.selectedItems.splice(index, 1);
        this.selectedItemIds.splice( index, 1 );
      },

      addProducts(){
        this.nowProtductItems = [ ...this.selectedItems ];
        this.productModal = true;
        this.fetchProducts();
      },

      searchProduct( name ){
        this.products = [];
        this.page = 1;
        this.pages = 1;
        this.classify = '';
        this.classify_name = '全部';
        this.fetchProducts();
        this.$refs.search.cancel();
      },

      onSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            const { id } = this.$route.params;
            let params = this.formValue;
            let items = this.selectedItems.map( item => ({ product: item.product.id, amount: item.amount, oo: item.oo }) )
            params.items = items;

            if( id ){
              this.fetchs( 'update', params, id )  
            }else{
              this.fetchs( 'create', params, )
            }
            
            this.$Message.success('提交成功!');
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },

      handleReset(){
        this.formValue = Object.assign( {}, this.startTemp );
        this.selectedItems = [ ...this.startItems ];
      },
      //checked All plans 
      planCheckAll () {
        if( this.indeterminate ) {
          this.planCheckedAll = false;
        }else{
          this.planCheckedAll = !this.planCheckedAll;
        }

        this.indeterminate = false;

        if( this.planCheckedAll ){
          this.formValue.tag_lines = this.lines.map( line => line.id );
        }else{
          this.formValue.tag_lines = [];
        }
      },
      //checked plans change
      checkAllGroupChange (data) {
        if (data.length === this.lines.length ){
          this.indeterminate = false;
          this.planCheckedAll = true;
        } else if (data.length > 0 ) {
          this.indeterminate = true;
          this.planCheckedAll = false;
        } else {
          this.indeterminate = false;
          this.planCheckedAll = false;
        }
      },
    }
  }
</script>