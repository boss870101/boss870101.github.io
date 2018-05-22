ww<template>
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
        <Form-item label="物流">
          <Radio-group v-model="formValue.ftype">
            <Radio label="1">  
              <span>干线物流</span>
            </Radio>
            <Radio label="2">
              <span>第三方物流</span>
            </Radio>
            <Radio label="3">  
              <span>上门自提</span>
            </Radio>
        </Radio-group>
        </Form-item>
        <Form-item label="名称">
          <Input v-model="formValue.name" placeholder="请输入" style="width: 300px"></Input>
        </Form-item>
        <Form-item label="负责人">
          <Input v-model="formValue.manager" placeholder="请输入" style="width: 300px"></Input>
        </Form-item>
        <Form-item label="联系电话">
          <Input v-model="formValue.phone" placeholder="请输入" style="width: 300px"></Input>
        </Form-item>
        <Form-item label="排序码">
          <Input-number :min="1" v-model="formValue.oo"></Input-number>
        </Form-item>
      </Form>
    </Modal>
  </Card>
</template>
<script>
  import util from "@/libs/util";
  import moment from "moment";
  const dateFormat = 'YYYY-MM-DD HH:mm:ss';
  export default {
    name: 'line',
    data(){
      return {
        columns: [
          {
            "title": "名称",
            "key": "name",
          },
          {
            "title": "物流",
            render: ( h, params ) => h( 'span', 
              params.row.ftype === 1 ? 
              '干线物流' :  params.row.ftype === 2 ? 
              '第三方物流' : '上门自提' 
            )
          },
          {
            "title": "负责人",
            "key": "manager"
          },
          {
            "title": "联系电话",
            "key": "phone"
          },
          {
            "title": "排序码",
            "key": "oo"
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
            render: ( h, params ) => h( 'div', [ 
              h( 'Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => this.showModal( params.index, '编辑' )
                }
              }, '编辑' ),
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
          },
        ],

        dataSource: [
        ],
        modal: false,
        title: '送货路线',
        formValue: {
          name: '',
          oo: 1,
        },
        idx: '-1',

        options: {
          disabledDate(date){
            return date && date.valueOf() < Date.now() - 86400000;
          }
        },
        page_size: 1000,
        total: 0,
        page: 1,
      }
    },

    mounted(){
      this.fetchLine();
    },
    methods: {
      showModal( index, title ){
        this.modal = true;
        this.title = `${title}分类`;
        if( index !== -1 ){
          const { ftype, name, manager, phone, oo, id } = this.dataSource[index];
          this.formValue = {
            ftype,
            name,
            manager,
            phone,
            oo
          }
          this.idx = id;
        }else{
          this.formValue = {
            ftype: 1,
            name: '',
            oo: 1,
            phone: '',
            manager: '',
          }
          this.idx = -1;
        }
         
      },

      remove(index) {
        const {id} = this.dataSource[index];
        this.fetchs( 'delete', {}, id, index );
      },

      fetchLine() {
        util.bookAxios.get( '/setups/line/list/', {
          params: {
            page_size: this.page_size,
            page: this.page,
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

      fetchs( method, params = {}, id = 0, index = -1 ){
        let url = '', msg = '';
        if( method === 'create' ){
          url = '/setups/line/create/';
          msg = '创建';
        }else if( method === 'update' ){
          url = `/setups/line/${id}/update/`;
          msg = '更新';
        }else if( method === 'delete' ){
          url = `/setups/line/${id}/delete/`
          msg = '删除';
        }

        util.bookAxios.post( url, params ).then( response => {
          let { errcode, errmsg } = response.data;
          if( !errcode ){
            this.$Message.success( `${msg}成功` );
            this.fetchLine();      
          }else{
            this.$Message.error( errmsg );
          }   
        })   
      },

      handleOk(){
        if( this.idx !== -1 ){ 
          this.fetchs( 'update', this.formValue, this.idx );
        }else{
          this.fetchs( 'create', this.formValue );
        }
      },

      pageSizeChange( page_size ){
        this.page_size = page_size;
        this.fetchLine();
      },
      pageChange( page ){
        this.page = page;
        this.fetchLine();
      },
    }
  }
</script>