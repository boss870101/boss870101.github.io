<template>
  <Card dis-hover :bordered="false">
    <Tabs @on-click="callback" type="card" style="margin: 80px 0 0 0">
      <Tab-pane label="内容">
        <Form 
          :label-width="80" 
          style="width: 60%; margin: 80px auto 0 auto">
          <Form-item label="标题">
            <Tag type="border" color="blue">{{formValue.title}}</Tag>
          </Form-item>
          <Form-item label="作者">
            <Tag type="border" color="blue">{{formValue.author}}</Tag>
          </Form-item>
          <Form-item label="描述">
            <Tag type="border" color="blue">{{formValue.description}}</Tag>
          </Form-item>
          <Form-item label="分类">
            <Tag type="border" color="blue">{{formValue.classify.name}}</Tag>
          </Form-item>
          <Form-item label="标签">
            <Tag type="border" v-for="tag in formValue.tags" :key="tag.name" color="blue">{{tag.name}}</Tag>
          </Form-item>
          <Form-item label="排序码">
            <Tag type="border" color="blue">{{formValue.oo}}</Tag>
          </Form-item>
          <Form-item label="是否有效">
            <Tag type="border" color="blue">
              <Icon v-if="formValue.is_valid" type="ios-checkmark-outline"></Icon>
              <Icon v-if="!formValue.is_valid" type="ios-close-outline"></Icon>
            </Tag>
          </Form-item>
          <Form-item label="是否加星">
            <Tag type="border" color="blue">{{formValue.title}}</Tag>
          </Form-item>
          <Form-item label="封面">
            <div class="demo-upload-list" v-if="formValue.cover">
              <img :src="formValue.cover">
            </div>
          </Form-item>
          <Form-item label="内容">
            <div v-html="formValue.content">
            </div>
          </Form-item>
        </Form>
      </Tab-pane>
      <Tab-pane label="发送组">
        <div>{{groups}}</div>
      </Tab-pane>
      <Tab-pane label="发送记录">
        <Table border :columns="columns" :data="dataSource"></Table>
      </Tab-pane>
    </Tabs>
    <div style="width: 160px; margin: 40px auto">
      <i-button type="primary" size="small" @click="editContent">编辑</i-button>
      <Poptip confirm title="您确认删除这条内容吗？"
        @on-ok="remove">
        <i-button type="error" size="small">删除</i-button>
      </Poptip>
      <i-button type="success" size="small" @click="send">发送</i-button>
    </div>
  </Card>
</template>

<script>
  import util from "@/libs/util";
  import moment from "moment";
  const dateFormat = 'YYYY-MM-DD HH:mm:ss';
  const plainOptions = [ '短信', '微信', '钉钉' ];
  export default {
    name: 'detailPage',

    data(){
      return {
        formValue: {
          title: '',
          author: '',
          description: '',
          classify: '',
          tags: [{name: ''}],
          is_valid: true,
          oo: 1,
          is_star: false,
          cover: '',
          content: '',
        },

        self: this,
        columns: [
          {
            "title": "创建时间",
            render: ( h, params ) => h( 'span', 
              moment( params.row.created_time ).format( dateFormat )
            )
          },
          {
            title: '完成时间',
            key: 'finished_time',
            render: ( h, params ) => h( 'span',
              moment( params.row.finished_time ).format( dateFormat )
            )
          },
                    {
            "title": "更新时间",
            render: ( h, params ) => h( 'span', 
              moment( params.row.updated_time ).format( dateFormat )
            )
          },
          {
            title: '发送方式',
            key: 'items',
            render: ( h, params ) => params.row.items.map( item => 
              h( 'span', plainOptions[ item.ftype - 1 ] )
            )
          }
        ],

        dataSource: [],
        groups: '',
        url: '',
        deleteUrl: '',
        index: '',
        NotificationName: '',
        paramsId: '',
        editPage: '',
        sendPage: '',
      }
    },

    created(){
      this.initialValue();
      this.fetch();
    },

    methods: { 
      initialValue(){
        const { name } = this.$route;
        const { id } = this.$route.params;
        this.paramsId = id;
        if( name === 'NotifyDetailPage' ){
          this.url = `/notifies/notify/${id}/query/`;
          this.deleteUrl = `/notifies/notify/${id}/delete/`;
          this.index = 'notify';
          this.NotificationName = 'NotificationNotifies';
          this.editPage = 'NotificationEditNotify';
          this.sendPage = 'NotificationEditNotifySend';
        }else if( name === 'PublicityDetailPage' ){
          this.url = `/publicities/publicity/${id}/query/`;
          this.deleteUrl = `/publicities/publicity/${id}/delete/`;
          this.index = 'publicity';
          this.NotificationName = 'NotificationPublicities';
          this.editPage = 'NotificationEditPublicity';
          this.sendPage = 'NotificationEditPublicitySend';
        }else if( name === 'WikiDetailPage' ){
          this.url = `/wikis/wiki/${id}/query/`;
          this.deleteUrl = `/wikis/wiki/${id}/delete/`;
          this.index = 'wiki';
          this.NotificationName = 'NotificationWikis';
          this.editPage = 'NotificationEditWiki';
          this.sendPage = 'NotificationEditWikiSend';
        }
      },

      fetch(){
        util.notificationAxios.get( this.url, {} ).then( response => {
          let { errcode, errmsg } = response.data;
          if( !errcode ){
            let data = response.data[ this.index ];
            this.formValue = data;
            this.$Message.success('获取成功');
          }else{
            this.$Message.error( errmsg );
          }
        })
      },

      fetchHistory(){
        util.notificationAxios.get( this.url, {} ).then( response => {
          let { errcode, errmsg } = response.data;
          if( !errcode ){
            let { histories } = response.data;
            this.dataSource = histories;
            this.$Message.success('获取成功');
          }else{
            this.$Message.error( errmsg );
          }
        })
      },

      fetchReceiver(){
        util.notificationAxios.get( this.url, {} ).then( response => {
          let { errcode, errmsg } = response.data;
          if( !errcode ){
            this.groups = response.data,
            this.$Message.success('获取成功');
          }else{
            this.$Message.error( errmsg );
          }
        })
      },

      callback( key ){
        if( key === 1 ){
          this.fetchReceiver(); 
        }
        if( key === 2 ){
          this.fetchHistory();
        }
      },

      fetchDelete(){
        const { deleteUrl, NotificationName } = this;
        util.notificationAxios.post( deleteUrl ).then( response => {
          let { errcode, errmsg } = response.data;
          if( !errcode ){
            this.$Message.success( '删除成功' );
            this.$router.push({name: NotificationName});
          }else{
            this.$Message.error( errmsg );
          }   
        })   
      },

      remove(){
        this.fetchDelete();
      },

      editContent(){
        this.$router.push({ name: this.editPage, params: { id: this.paramsId } });
      },
      send(){
        this.$router.push({ name: this.sendPage, params: { id: this.paramsId } });
      },
    },
  }
</script>

<style>

</style>
