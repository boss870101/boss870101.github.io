<template>
  <Card dis-hover :bordered="false">
    <div slot="title">
      <div style="margin: 20px 0">是否使用微信小程序发送 <i-switch v-model="use_wxaapp" disabled></i-switch></div>
      <Button v-show="dataSource.length !== ftype.length" type="primary" @click="showModal( -1, '新建')">新建</Button>
    </div>
    <Table border :columns="columns" :data="dataSource"></Table>
    <Modal v-model="modal" width="1000" :title="title">
      <Form ref="formValue" :model="formValue" :label-width="100">
        <Form-item label="选择模板类型" prop="ftype" :rules="{required: true, message: '模板类型不能为空', trigger: 'change'}">
          <Input v-if="~idx" v-model="ftype[formValue.ftype].value" disabled></Input>
          <Select v-if="!~idx" v-model="formValue.ftype" placeholder="请选择模板类型" >
            <Option 
              v-for="item in ftype"
              v-show="item.disabled" 
              :key="item.value"
              :value="item.value">
              {{item.name}}
            </Option>
          </Select>
        </Form-item>
        <Form-item label="temp_id" prop="temp_id" :rules="{required: true, message: 'temp_id不能为空', trigger: 'change'}">
          <Input type="text" v-model="formValue.temp_id" placeholder="temp_id"></Input>
        </Form-item>
        <Row v-for="(item, index) in formValue.items" :key="index">
          <Col span="5">
            <Form-item  :label="`key${index}`" :prop="`items.${index}.key`" :rules="{required: true, message: `key${index}不能为空`, trigger: 'blur'}">
              <Input type="text" v-model="item.key" :placeholder="`key${index}`"></Input>
            </Form-item>
          </Col>
          <Col span="5">
            <Form-item  :label="`颜色${index}`" :prop="`items.${index}.color`" :rules="{required: true, message: `颜色${index}不能为空`, trigger: 'blur'}">
              <Input type="text" v-model="item.color" :placeholder="`颜色${index}`"></Input>
            </Form-item>
          </Col>
          <Col span="10">
            <Form-item  :label="`默认值${index}`">
              <Input type="text" v-model="item.data" :placeholder="`默认值${index}`"></Input>
            </Form-item>
          </Col>
          <Col span="2" offset="1">
            <Button type="ghost" @click="handleRemove(index)">删除</Button>
          </Col>
        </Row>
        <Form-item>
          <Row>
            <Col span="24">
              <Button type="dashed" long @click="handleAdd" icon="plus-round">新增</Button>
            </Col>
          </Row>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="handleSubmit('formValue')">提交</Button>
      </div>
    </Modal>
  </Card>
</template>
<script>
  import util from "@/libs/util";
  import moment from "moment";
  const dateFormat = 'YYYY-MM-DD HH:mm:ss';
  export default {
    name: 'setups',
    data(){
      return {
        self: this,
        columns: [
          {
            "title": "模板样式类型",
            "key": "ftype",
            render: ( h, params ) => h( 'span', this.ftype[params.row.ftype].name )
          },
          {
            "title": "temp_id",
            "key": "temp_id",
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
          }
        ],
        dataSource: [
        ],

        ftype: { 
          'OPENTM207041675': { value: 'OPENTM207041675', name: '收到用户反馈问题通知', disabled: true },
          'OPENTM400074547': { value: 'OPENTM400074547', name: '货单审核汇款提醒', disabled: true },
          'OPENTM401167039': { value: 'OPENTM401167039', name: '账单提醒', disabled: true },
          'OPENTM200605630': { value: 'OPENTM200605630', name: '任务处理通知', disabled: true },
          'OPENTM207441523': { value: 'OPENTM207441523', name: '登录提醒', disabled: true },
          'OPENTM400169197': { value: 'OPENTM400169197', name: '反馈处理进度', disabled: true },
          'OPENTM400034414': { value: 'OPENTM400034414', name: '报货单提交成功提醒', disabled: true },
          'OPENTM400034430': { value: 'OPENTM400034430', name: '发货提醒', disabled: true },
          'OPENTM203215453': { value: 'OPENTM203215453', name: '资料发送提醒', disabled: true },
        },

        use_wxaapp: false,

        modal: false,
        title: '新建',
        formValue: {
          ftype: '',
          temp_id: '',
          items: [
            { key: '', color: '', data: '' }
          ]
        },
        idx: -1,
        page_size: 10,
        total: 0,
        page: 1,
      }
    },

    mounted(){
      this.fetchTemp();
    },
    methods: {
      showModal( index, title ){
        this.modal = true;
        this.title = `${title}配置`;
        if( index !== -1 ){
          const { ftype, temp_id, items, id } = this.dataSource[index];
          this.formValue = {
            ftype,
            temp_id,
            items
          }
          this.idx = id;
        }else{
          this.formValue = {
            ftype: '',
            temp_id: '',
            items: [
              { key: '', color: '', data: '' }
            ]
          }
          this.idx = -1;
        }  
      },
      remove(index) {
        const {id} = this.dataSource[index];
        this.ftype[ this.dataSource[ index ].ftype ].disabled = true;
        this.fetchs( 'delete', {}, id, index );
      },

      fetchTemp() {
        util.notificationAxios.get( '/setups/temp/list/' )
        .then( response => {
          const { errcode, temps } = response.data;
          if( !errcode ){
            const { total, page_size, page } = response.data;
            this.dataSource = temps;
            this.dataSource.forEach( item => {
              this.ftype[ item.ftype ].disabled = false;
            } )
          }
        } )
      },

      fetchSetup(){
        util.notificationAxios.get( '/setups/setup/query/' )
        .then( response => {
          const { errcode, setup } = response.data;
          if( !errcode ){
            this.use_wxaapp = setup.use_wxaapp;
          }
        } )
      },

      fetchs( method, params = {}, id = 0, index = -1 ){
        let url = '', msg = '';

        if( method === 'create' ){
          url = '/setups/temp/create/';
          msg = '创建';
        }else if( method === 'update' ){
          url = `/setups/temp/${id}/update/`;
          msg = '更新';
        }else if( method === 'delete' ){
          url = `/setups/temp/${id}/delete/`
          msg = '删除';
        }

        util.notificationAxios.post( url, params ).then( response => {
          let { errcode, errmsg } = response.data;
          if( !errcode ){
            this.$Message.success( `${msg}成功` );
            this.fetchTemp();
            this.modal = false;
          }else{
            this.$Message.error( errmsg );
          }   
        })   
      },

      handleOk(){
        this.handleSubmit( 'formValue' );
      },
    
      handleAdd () {
        this.formValue.items.push(
          { key: '', color: '', data: '' }
        );
      },
      handleRemove (index) {
        this.formValue.items.splice(index, 1);
      },

      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if( this.idx !== -1 ){ 
              this.fetchs( 'update', this.formValue, this.idx );
            }else{
              this.fetchs( 'create', this.formValue );
            }
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },
    }
  }
</script>