<style>
  .layout-content-main{

  }  
</style>
<template>
  <Card dis-hover :bordered="false">
    <div slot="title">
      <Input icon="search" placeholder="请输入..." style="width: 200px"></Input>
      <Button>查询</Button>
      <Button type="primary" @click.native="routerLink(-1)">新建</Button>
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
  </Card>
</template>
<script>
  import util from "@/libs/util";
  import moment from "moment";
  const dateFormat = 'YYYY-MM-DD HH:mm:ss';
  export default {
    name: 'publicities',
    data(){
      return {
        self: this,
        columns: [
          {
            "title": "标题",
            render: ( h, params ) => h( 'span', params.row.title )
          },
          {
            "title": "分类",
            render: ( h, params ) => h( 'span', params.row.classify.name )
          },
          {
            "title": "标签",
            render: ( h, params ) => params.row.tags.map( tag => 
              h( 'Tag', {
                props: {
                  color: 'blue'
                }
              }, tag.name )
            )
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
                  click: () => this.detailPage( params.row.id )
                }
              }, '查看' ),
              h( 'Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => this.routerLink( params.row.id )
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
              ] ),
              h( 'Button', {
                props: {
                  type: 'success',
                  size: 'small'
                }
              }, '发送' )
            ] ) 
          }
        ],

        dataSource: [
        ],
        modal: false,
        idx: '-1',
        page_size: 30,
        total: 0,
        page: 1,
      }
    },

    mounted(){
      this.fetchPublicities();
    },
    methods: {
      remove(index) {
        const {id} = this.dataSource[index];
        this.fetchDelete( id, index );
      },

      fetchPublicities() {
        let self = this;
        util.notificationAxios.get( '/publicities/publicity/list/', {
          params: {
            page: this.page,
            page_size: this.page_size,
          }
        }).then( response => {
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

      fetchDelete( id = 0, index = -1 ){
        let self = this;
        const url = `/publicities/publicity/${id}/delete/`;
        util.notificationAxios.post( url ).then( response => {
          let { errcode, errmsg } = response.data;
          if( !errcode ){
            this.$Message.success( '删除成功' );
            self.fetchPublicities();      
          }else{
            this.$Message.error( errmsg );
          }   
        })   
      },

      routerLink( index ){
        if( ~index ){
          this.$router.push({name: 'NotificationEditPublicity', params: { id: index }});
        }else{
          this.$router.push({name: 'NotificationCreatePublicity'})
        }
      },

      detailPage( id ){
        this.$router.push({name: 'PublicityDetailPage', params: { id: id }});
      },
      pageSizeChange( page_size ){
        this.page_size = page_size;
        this.fetchPublicities();
      },
      pageChange( page ){
        this.page = page;
        this.fetchPublicities();
      },
    }
  }
</script>