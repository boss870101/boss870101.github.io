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
      <Form :model="formItem" :label-width="80">
        <Form-item label="内容">
          <Input v-model="formItem.content" placeholder="请输入" style="width: 300px"></Input>
        </Form-item>
        <Form-item label="过期时间">
          <Date-picker 
            :options="options" 
            type="datetime" 
            v-model="formItem.expired_at" 
            placeholder="选择日期和时间" 
            style="width: 200px">
          </Date-picker>
        </Form-item>
        <Form-item label="开关">
          <i-switch v-model="formItem.is_valid"></i-switch>
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
    name: 'announcements',
    data(){
      return {
        columns: [
          {
            "title": "内容",
            "key": "content",
          },
          {
            "title": "过期时间",
            render: ( h, params ) => h( 'span',
              moment( params.row.expired_at ).format( dateFormat )
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
          {
            "title": "创建人",
            "key": "user_id",
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
        title: '公告',
        formItem: {
          content: '',
          is_valid: true,
          expired_at: '',
        },
        idx: '-1',

        options: {
          disabledDate(date){
            return date && date.valueOf() < Date.now() - 86400000;
          }
        },
        page_size: 30,
        total: 0,
        page: 1,
      }
    },

    mounted(){
      this.fetchAnnouncements();
    },
    methods: {
      showModal( index, title ){
        this.modal = true;
        this.title = `${title}公告`;
        if( index !== -1 ){
          const { content, is_valid, expired_at, id } = this.dataSource[index];
          this.formItem = {
            content,
            is_valid,
            expired_at
          }
          this.idx = id;
        }else{
          this.formItem = {
            content: '',
            expired_at: moment(new Date()).valueOf(),
            is_valid: true
          }
          this.idx = -1;
        }
         
      },

      remove(index) {
        const {id} = this.dataSource[index];
        this.fetchs( 'delete', {}, id, index );
      },

      fetchAnnouncements() {
        let self = this;
        util.notificationAxios.get( '/announcements/announcement/list/', {
          params: {
            page: this.page,
            page_size: this.page_size,
          }
        } ).then( response => {
          const { errcode, results } = response.data;
          if( !errcode ){
            const { total, page_size, page } = response.data;
            self.dataSource = results;
            self.total = total;
            self.page_size = page_size;
            self.page = page;
          }
        } )
        .catch( error =>{
          console.log(error);
        })
      },

      fetchs( method, params = {}, id = 0, index = -1 ){
        let url = '';
        let msg = '';
        let self = this;
        if( method === 'create' ){
          url = '/announcements/announcement/create/';
          msg = '创建';
        }else if( method === 'update' ){
          url = `/announcements/announcement/${id}/update/`;
          msg = '更新';
        }else if( method === 'delete' ){
          url = `/announcements/announcement/${id}/delete/`
          msg = '删除';
        }

        util.notificationAxios.post( url, params ).then( response => {
          let { errcode, errmsg } = response.data;
          if( !errcode ){
            
            this.$Message.success( `${msg}成功` );
            self.fetchAnnouncements();      
          }else{
            this.$Message.error( errmsg );
          }   
        })   
      },

      handleOk(){
        let { expired_at } = this.formItem;
        this.formItem.expired_at = moment( expired_at ).valueOf();

        if( this.idx !== -1 ){ 
          this.fetchs( 'update', this.formItem, this.idx );
        }else{
          this.fetchs( 'create', this.formItem );
        }
      },
      pageSizeChange( page_size ){
        this.page_size = page_size;
        this.fetchAnnouncements();
      },
      pageChange( page ){
        this.page = page;
        this.fetchAnnouncements();
      },
    }
  }
</script>