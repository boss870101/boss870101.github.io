<template>
  <Card dis-hover :bordered="false">
    <div slot="title">
      {{formValue.classify}}
      <Input icon="search" placeholder="请输入..." style="width: 200px"></Input>
      <Button>查询</Button>
      <Button type="primary" @click="routerLink(-1)">新建</Button>
    </div>
    <Table border :columns="columns" :data="dataSource"></Table>
    <Page 
      style="float: right; margin-top: 30px" 
      :total="total" 
      :page-size="page_size" 
      :current="page"
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
    name: 'temp',
    data(){
      return {
        columns: [
          {
            "title": "名称",
            "key": "name",
          },
          {
            "title": "允许路线",
            render: ( h, params ) => params.row.tag_lines.map( item => 
              h( 'Tag', {
                props: {
                  color: 'blue'
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
          {
            "title": "用于筹备",
            render: ( h, params ) => h( 'Icon', {
              props: {
                type: params.row.is_for_prepared ? 
                'ios-checkmark-outline' : 'ios-close-outline'
              }
            } )
          },
          {
            "title": "用于特殊",
            render: ( h, params ) => h( 'Icon', {
              props: {
                type: params.row.is_for_everyday ? 
                'ios-checkmark-outline' : 'ios-close-outline'
              }
            } )
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
            key: 'action',
            align: 'center',
            render: ( h, params ) => h( 'div', [
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
                  click: () => this.remove( params.row.id )
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
          desc: '',
          items: [],
          tag_warehouses: [],
        },
        idx: '-1',
        productItems: [],
        warehouses: [],
        options: {
          disabledDate(date){
            return date && date.valueOf() < Date.now() - 86400000;
          }
        },
        classify: '',
        name: '',
        page_size: 30,
        total: 0,
        page: 1,
        pages: 1
      }
    },

    mounted(){
      this.fetchTemp();
    },
    methods: {
      remove(id) {
        this.fetchDelete( id );
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
            this.dataSource = results;
            this.total = total;
            this.page_size = page_size;
            this.page = page;
          }
        } )
      },

      routerLink( index ){
        if( ~index ){
          this.$router.push({name: 'BookEditTemp', params: { id: index }});
        }else{
          this.$router.push({name: 'BookCreateTemp'})
        }
      },

      fetchDelete( id = 0 ){
        util.bookAxios.post( `/products/temp/${id}/delete/` ).then( response => {
          let { errcode, errmsg } = response.data;
          if( !errcode ){
            this.$Message.success( '删除成功' );
            this.fetchTemp();      
          }else{
            this.$Message.error( errmsg );
          }   
        })   
      },
    }
  }
</script>