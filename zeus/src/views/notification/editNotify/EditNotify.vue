<style>
  .demo-upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .demo-upload-list img{
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
<template>
  <Card dis-hover :bordered="false">
    <Steps :current="0">
      <Step title="进行中" content="新建内容"></Step>
      <Step title="待进行" content="发送组"></Step>
      <Step title="待进行" content="确定发送"></Step>
    </Steps>
    <Form 
      ref="formValue" 
      :model="formValue" 
      :label-width="80" 
      style="width: 60%; margin: 80px auto 0 auto"
      :rules="ruleValidate">
      <Form-item label="标题" prop="title">
        <Input v-model="formValue.title" placeholder="请输入标题"></Input>
      </Form-item>
      <Form-item label="作者" prop="author">
        <Input v-model="formValue.author" placeholder="请输入名称"></Input>
      </Form-item>
      <Form-item label="描述" prop="description">
        <Input v-model="formValue.description" placeholder="请输入描述"></Input>
      </Form-item>
      <Form-item label="分类" prop="classify">
        <Select v-model="formValue.classify" placeholder="请选分类">
          <Option v-for="item in classifies" :key="item.id" :value="item.id.toString()">
            {{item.name}}
          </Option>
        </Select>
      </Form-item>
      <Form-item label="标签" prop="tags">
        <Select v-model="formValue.tags" multiple placeholder="请选标签">
          <Option v-for="item in tags" :key="item.id" :value="item.id">
            {{item.name}}
          </Option>
        </Select>
      </Form-item>
      <Form-item label="排序码">
        <Input-number :min="1" v-model="formValue.oo"></Input-number>
      </Form-item>
      <Form-item label="是否有效">
        <i-switch v-model="formValue.is_valid"></i-switch>
      </Form-item>
      <Form-item label="是否加星">
        <i-switch v-model="formValue.is_star"></i-switch>
      </Form-item>
      <Form-item label="封面">
        <div class="demo-upload-list" v-if="formValue.cover">
          <template>
            <img :src="formValue.cover">
            <div class="demo-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemove"></Icon>
            </div>
          </template>
        </div>
        <Upload
          v-if="!formValue.cover"
          ref="upload"
          :show-upload-list="false"
          :on-success="handleSuccess"
          :format="['jpg','jpeg','png']"
          :max-size="2048"
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          multiple
          type="drag"
          action="//10.10.0.118:8001/utils/upload/"
          :headers= "{'Authorization': `bearer ${ptoken}`}"
          style="display: inline-block;width:58px;">
          <div style="width: 58px;height:58px;line-height: 58px;">
            <Icon type="camera" size="20"></Icon>
          </div>
        </Upload>
        <Modal title="查看图片" v-model="visible">
          <img :src="formValue.cover" v-if="visible" style="width: 100%">
        </Modal>
      </Form-item>
      <Form-item label="内容" prop="content">
        <Input v-model="formValue.content" type="textarea" style="display: none" placeholder="请输入..."></Input> 
        <script type="text/plain" id="editor"></script>
      </Form-item>
      <Form-item>
        <Button type="ghost" @click="handleReset('formValue')" style="margin-left: 8px">重置</Button>
        <Button type="primary" @click="handleSubmit('formValue')">下一步</Button>
      </Form-item>
    </Form>
  </Card>
</template>
<script>
  import util from "@/libs/util";
  export default {
    name: 'editNotify',
    data(){
      return {
        formValue: {
          title: '',
          author: '',
          description: '',
          classify: '',
          tags: [],
          is_valid: true,
          oo: 1,
          is_star: false,
          cover: '',
          content: '',
        },
        classifies: [],
        tags: [],
        ptoken: m_config.ptoken,

        imgName: '',
        visible: false,
        uploadList: '',

        editor: null,
        editorMsg: '',
        ruleValidate: {
          title: [
            { required: true, message: '标题不能为空', trigger: 'blur' }
          ],
          author: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '描述不能为空', trigger: 'blur' }
          ],
          classify: [
            { required: true, message: '请选分类', trigger: 'change' }
          ],
          tags: [
            { required: true, type: 'array', message: '至少选择一个标签', trigger: 'change' },
          ],
          content: [
            { required: true, message: '内容不能为空', trigger: 'blur' }
          ]
        }
      }
    },

    mounted(){
      const { id } = this.$route.params;
      this.fetchClassify();
      this.fetchTags();
      id && this.fetchs( 'query', {}, id ); 
      this.editor = UE.getEditor('editor');
      this.uploadList = this.$refs.upload.fileList;
    },
    methods: {
      fetchClassify(){
        util.notificationAxios.get('/setups/classify/list/', {
          params: {
            is_valid: true,
          }
        }).then((response) => {
          if( !response.data.errcode ){
            let { results } = response.data;
            this.classifies = results;
          }
        })
      },

      fetchTags(){
        util.notificationAxios.get('/setups/tag/list/', {
          params: {
            is_valid: true,
          }
        }).then((response) => {
          if( !response.data.errcode ){
            let { results } = response.data;
            this.tags = results;
          }    
        })
      },

      fetchs( method, params = {}, id = 0 ){
        let url = '';
        if( method === 'create' ){
          url = '/notifies/notify/create/';
        }else if( method === 'update' ){
          url = `/notifies/notify/${id}/update/`;
        }else if( method === 'query' ){
          url = `/notifies/notify/${id}/query/`;
        }
        if( method === 'query' ){
          util.notificationAxios.get( url )
          .then( response => {
            let { errcode, errmsg } = response.data;
            if( !errcode ){
              let { notify } = response.data;
              this.formValue = notify;
              this.formValue.tags = notify.tags.map( tag => tag.id );
              this.editor.ready( ()=>{
                this.editor.setContent( notify.content );
              } )
              this.formValue.classify = notify.classify.id.toString();
              this.$Message.success( '获取成功' );
            }else{
              this.$Message.error( errmsg );
            }
          })
        }else{
          util.notificationAxios.post( url, params )
          .then(response => {
            let { errcode, errmsg } = response.data;
            if( !errcode ){
              if( method === 'update' ){
                this.$router.push({ name: 'NotificationEditNotifyReceivers', params: { id: id} });
              }

              if( method === 'create' ){
                this.$router.push({ name: 'NotificationEditNotifyReceivers', params: { id: response.data.id } });
              }
            }else{
              this.$Message.error( errmsg );
            }    
          })      
        }  
      },

      handleReset(name){
        this.$refs[name].resetFields();
      },

      handleSubmit(name){
        this.formValue.content = this.editor.getContent();
        this.$refs[name].validate((valid) => {
          if(valid){
            const { id } = this.$route.params;
            id ? this.fetchs( 'update', this.formValue, id ) : this.fetchs( 'create', this.formValue );
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },

      handleView (name) {
        this.visible = true;
      },
      handleRemove (file) {
        this.formValue.cover = '';
      },
      handleSuccess (res, file) {
        this.formValue.cover = res.url;
      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
        });
      },
      handleMaxSize (file) {
        this.$Notice.warning({
          title: '超出文件大小限制',
          desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
        });
      },
    },

    destroyed() {
      this.editor.destroy();
    },
  }
</script>