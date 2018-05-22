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
      </Form>
    </Modal>
  </Card>
</template>
<script>
  import util from "@/libs/util";
  import moment from "moment";
  const dateFormat = 'YYYY-MM-DD HH:mm:ss';
  export default {
    name: 'warehouse',
    data(){
      return {
        columns: [
          {
            "title": "名称",
            "key": "name",
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
        title: '仓库',
        formValue: {
          name: '',
        },
        idx: '-1',

        options: {
          disabledDate(date){
            return date && date.valueOf() < Date.now() - 86400000;
          }
        },
        page_size: 10,
        total: 0,
        page: 1,
      }
    },

    mounted(){
      this.fetchWarehouse();
    },
    methods: {
      showModal( index, title ){
        this.modal = true;
        this.title = `${title}仓库`;
        if( index !== -1 ){
          const { name, id } = this.dataSource[index];
          this.formValue = {
            name
          }
          this.idx = id;
        }else{
          this.formValue = {
            name: '',
          }
          this.idx = -1;
        }
         
      },

      remove(index) {
        const {id} = this.dataSource[index];
        this.fetchs( 'delete', {}, id, index );
      },

      fetchWarehouse() {
        util.bookAxios.get( '/setups/warehouse/list/', {
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
          url = '/setups/warehouse/create/';
          msg = '创建';
        }else if( method === 'update' ){
          url = `/setups/warehouse/${id}/update/`;
          msg = '更新';
        }else if( method === 'delete' ){
          url = `/setups/warehouse/${id}/delete/`
          msg = '删除';
        }

        util.bookAxios.post( url, params ).then( response => {
          let { errcode, errmsg } = response.data;
          if( !errcode ){
            this.$Message.success( `${msg}成功` );
            this.fetchWarehouse();      
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
        this.fetchWarehouse();
      },
      pageChange( page ){
        this.page = page;
        this.fetchWarehouse();
      },
    }
  }
</script>