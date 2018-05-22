<style scoped>
</style>
<template>
  <Card dis-hover>
    <Tabs value="name1" @on-click="tabsClick">
      <Tab-pane label="基本信息" name="name1">
        <Card dis-hover style="width: 600px; margin: 0 auto">
          <div slot="title">
            <span>{{shop.name}}</span>
          </div>
          <p style="line-height: 40px;">
            <span style="display: inline-block; width: 100px; text-align: right">
              联系人：
            </span>
            <span style="padding-left: 12px;">
              {{ shop.contact }}
            </span>
          </p>
          <p style="line-height: 40px;">
            <span style="display: inline-block; width: 100px; text-align: right">
              联系电话：
            </span>
            <span style="padding-left: 12px;">
              {{ shop.phone }}
            </span>
          </p>
          <p style="line-height: 40px;">
            <span style="display: inline-block; width: 100px; text-align: right">
              创建时间：
            </span>
            <span style="padding-left: 12px;">
              {{ shop.created_time | capitalize }}
            </span>
          </p>
          <p style="line-height: 40px;">
            <span style="display: inline-block; width: 100px; text-align: right">
              加入时间：
            </span>
            <span style="padding-left: 12px;">
              {{ shop.joined_time | capitalize }}
            </span>
          </p>
          <p style="line-height: 40px;">
            <span style="display: inline-block; width: 100px; text-align: right">
              更新时间：
            </span>
            <span style="padding-left: 12px;">
              {{ shop.updated_time | capitalize }}
            </span>
          </p>
          <p style="line-height: 40px;">
            <span style="display: inline-block; width: 100px; text-align: right">
              店铺状态：
            </span>
            <span style="padding-left: 12px;">
              <Tag 
                :color="shop.staus === 2 ? 'blue' : shop.staus === 1 ? 'yellow' : 'red'">
                {{ shop.staus | searchStaus }}
              </Tag>
            </span>
          </p>
          <p style="line-height: 40px;">
            <span style="display: inline-block; width: 100px; text-align: right;">
              地址：
            </span>
            <span style="padding-left: 12px;">
              {{ shop.province + shop.city + shop.district }}
            </span>
          </p>
        </Card>
      </Tab-pane>
      <Tab-pane label="成员列表" name="name2">
        <Card dis-hover>
          <div slot="title">
            <Button type="primary" @click="()=>this.inviteModal = true">邀请用户</Button>
          </div>
          <Table border :columns="columns" :data="relationships"></Table>
        </Card>
      </Tab-pane>
    </Tabs>
    <Modal
      v-model="modifyRoleModal"
      title="修改角色"
      @on-ok="modifyRoleOk"
      @on-cancel="cancel">
        <div style="text-align: center;">
          <span>角色：</span>
          <Select v-model="role" style="width:200px">
            <Option :value="1">店员</Option>
            <Option :value="2">店长</Option>
            <Option :value="3">店主</Option>
          </Select>
        </div>
      </Form>
    </Modal>
    <Modal 
      v-model="inviteModal"
      title="邀请用户"
      @on-ok="inviteOk"
      @on-cancel="cancel"
      width="320">
      <Form ref="formInvite" :model="formInvite" :rules="rules" :label-width="80">
        <Form-item prop="role" label="用户角色">
          <Select v-model="formInvite.role" style="width:200px">
            <Option :value="1">店员</Option>
            <Option :value="2">店长</Option>
            <Option :value="3">店主</Option>
          </Select>
        </Form-item>
        <Form-item prop="date" label="有效期">
          <Date-picker 
            type="datetime"
            :value="formInvite.date" 
            placeholder="选择有效日期"
            @on-change="dateChange"
            @on-clear="()=> formInvite.date = ''"
            :options="optionsDate"
            format="yyyy-MM-dd HH:mm:ss" 
            style="width: 160px; display: inline-block">
          </Date-picker>
        </Form-item>
        <Form-item>
          <Button 
            type="primary" 
            @click="qrCode">
            生成二维码
          </Button>
        </Form-item>
        <Form-item style="margin-bottom: 0px">
          <jason-qrcode 
            :src="qrcodeUrl" 
            :size="qrcodeSize" 
            :level="level"
            background="#fff"
            foreground="#000">
          </jason-qrcode>
          <p style="color: green;" v-show="qrcodeUrl">将二维码发送给用户，用微信扫一扫</p>
        </Form-item>
      </Form>
    </Modal>
    <Modal
      v-model="rsPasswordModal"
      tilte="重置密码"
      width="300">
      <Form 
        ref="formUser"
        :model="formUser"
        :rules="rules">
        <Form-item prop="password" label="新密码">
          <Input type="password" v-model="formUser.password" placeholder="Password">
            <Icon type="ios-locked-outline" slot="prepend"></Icon>
          </Input>
        </Form-item>
        <Form-item prop="checkPass" label="再次确认">
          <Input type="password" v-model="formUser.checkPass" placeholder="Password">
            <Icon type="ios-locked-outline" slot="prepend"></Icon>
          </Input>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="primary" size="large"  @click="submit">确定</Button>
      </div>
    </Modal>
  </Card>
</template>
<script>
  import util from "@/libs/util";
  import moment from "moment";
  import jasonQrcode from "@/components/qrcode/jasonQrcode";
  const dateFormat = 'yyyy-MM-dd HH:mm:ss';

  export default {
    name: 'shop',
    components: {
      jasonQrcode,
    },
    data(){
      // date rules
      const validateDate = ( rule, value, callback ) => {
        if( value > new Date().valueOf() ){
          callback();
        }else{
          callback( new Error( '必须大于现在时间' ) );
        }
      }

      // 密码安全性要求
      const validatePass1 = ( rule, value, callback ) => {
        // 6-16位, 数字, 字母, 字符至少包含两种, 同时不能包含中文和空格
        let reg = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{8,16}$/;
        if (!reg.test(value)) {
          callback(new Error('密码长度需8-16位，且包含字母和字符'))
        } else {
          callback()
        }
      };
      // 监测两次密码是否相同
      const validatePass2 = ( rule, value, callback ) => {
        value === '' ? callback(new Error('请再次输入密码')) :
          value !== this.formUser.password ? callback(new Error('两次输入密码不一致!')) :
          callback()
      };

      // invite user rules
      const rules = {
        role: [ 
          { required: true, message: '请选择用户角色', trigger: 'blur', type: 'number' }
        ],
        date: [
          { required: true, message: '请选择失效期', type: 'number' },
          { validator: validateDate, trigger: 'blur' }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            validator: validatePass1,
            trigger: 'blur'
          }
        ],
        checkPass: [
          {
            required: true,
            message: '请再次输入密码',
            trigger: 'blur'
          },
          {
            validator: validatePass2,
            trigger: 'blur'
          }
        ],
      }
      return {
        shop: {},
        inviteModal: false,
        rsPasswordModal: false,
        formUser: {
          username: '',
          checkPass: ''
        },
        idx: -1,
        qrcodeUrl: '',
        qrcodeSize: 0,
        level: 'Q', //误差校正水平 'L' 'Q', 'M', 'H'
        role: '',
        relationships: [],
        columns: [
          {
            title: '用户名',
            align: 'center',
            render: ( h, params ) => h( 'span', params.row.info.username )
          },
          {
            "title": "是否禁用",
            align: 'center',
            render: ( h, params ) => h( 'Icon', {
              props: {
                type: params.row.info.is_active ? 
                'ios-checkmark-outline' : 'ios-close-outline' 
              },
              style: {
                color: params.row.info.is_active ? '#f00' : '#000'
              }
            } )
          },
          {
            title: '角色',
            align: 'center',
            render: ( h, params ) => h( 'span', 
              params.row.role == 1 ? '店员' : 
              params.row.role == 2 ? '店长' : '店主' )
          },
          {
            title: 'uuid',
            align: 'center',
            render: ( h, params ) => h( 'span', params.row.info.uuid )
          },
          {
            title: '加入时间',
            align: 'center',
            render: ( h, params ) => h( 'span', 
              moment( params.row.joined_time ).format( 'YYYY-MM-DD' )
            )
          },
          {
            title: '最后登录时间',
            align: 'center',
            render: ( h, params ) => h( 'span', 
              moment( params.row.info.last_time ).format( 'YYYY-MM-DD' )
            )
          },
          {
            title: '操作',
            align: 'center',
            width: 300,
            render: ( h, params ) => h( 'div', [
              h( 'Button', {
                props: {
                  type: params.row.info.is_active ? 'primary' : 'error',
                  size: 'small'
                },
                on: {
                  click: () => this.forbidden( params.row.id )
                }
              }, params.row.info.is_active ? '启用' : '禁用' ),
              h( 'Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: 'marginLeft: 5px',
                on: {
                  click: () => this.resetPassword( params.row.id )
                }
              }, '重置密码' ),
              h( 'Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                },
                style: 'marginLeft: 5px',
                on: {
                  click: () => this.modifyRole( params.row )
                }
              }, '修改角色' ),
              h( 'Button', {
                props: {
                  type: 'error',
                  size: 'small',
                },
                style: 'marginLeft: 5px',
                on: {
                  click: () => this.deleteRelationship( params.row.id )
                }
              }, '删除关系' )
            ])
          }
        ],

        modifyRoleModal: false,
        formPassword: {
          password: ''
        },
        formInvite: {
          role: '',
          date: moment( new Date() ).valueOf() + 3600000,
        },
        rules,
        optionsDate: {
          disabledDate(date){
            return date && date.valueOf() < Date.now() - 86400000;
          }
        },
        user_id: -1
      }
    },
    mounted(){
      this.fetchShop();
    },

    methods: {
      fetchShop(){
        util.accountAxios.get(`/enterprises/shop/${this.$route.params.id}/query/`)
        .then((response) => {
          const { shop, errcode, errmsg } = response.data;
          if( !errcode ){
            this.$Message.success( '获取店铺成功' )
            this.shop = shop;
          }else{
            this.$Message.error( errmsg )
          }
        })
      },

      fetchRelationship(){
        util.accountAxios.get(
          `/enterprises/shop/${this.$route.params.id}/relationship/list/`
        ).then((response) => {
          const { relationships, errcode, errmsg } = response.data;
          if( !errcode ){
            this.fetchRelationshipInfos( relationships );
          }else{
            this.$Message.error( errmsg )
          }
        })
      },

      fetchRelationshipInfos( relationships ) {
        let ids = relationships.map( item => item.user_id );
        util.accountAxios.post( '/users/user/batch/', {
          ids
        } ).then( response => {
          const { errcode, users } = response.data;
          if( !errcode ){
            ids.forEach((i, index) => {
              users.forEach( item => {
                if (item.id === i) {
                  relationships[index]['info'] = item;
                }
              })
            } )
          
            this.relationships = [ ...relationships ];
          }
        } )
      },

      modifyRoleOk(){
        const { id } = this.$route.params;
        util.accountAxios.post(`/users/user/${id}/resetrole/`, {
          shop_id: id,
          new_role: this.role
        }).then((response) => {
          const { errcode, errmsg } = response.data;
          if( !errcode ){
            this.$Message.success( '修改角色成功' )
            this.fetchRelationship();
          }else{
            this.$Message.error( errmsg )
          }
        })
      },

      cancel(){
        this.date = moment( new Date() ).valueOf() + 3600000;
        this.formInvite.role = '';
        this.qrcodeUrl = '';
        this.qrcodeSize = 0;
        this.user_id = -1;
      },

      tabsClick( value ){
        if( value === 'name2' ){
          this.fetchRelationship();
        } 
      },  

      dateChange( date ){
        this.formInvite.date = date ? moment( date ).valueOf() : '';
      },

      forbidden( id ){
        util.accountAxios.post(`/users/user/${id}/active/`).then((response) => {
          const { errcode, url, code, errmsg } = response.data;
          if( !errcode ){
            for( let item of this.relationships ){
              if( item.user_id === id ){
                this.$Message.success( item.info.is_active ? '启用用户成功' : '禁用用户成功' );
                item.info.is_active = !item.info.is_active;
                break;
              }
            }
          }else{
            this.$Message.error( errmsg );
          }
        })
      },
      
      modifyRole( row ){
        this.modifyRoleModal = true;
        this.role = row.role;
        this.user_id = row.id;
      },

      submit(){
        this.$refs.formUser.validate( valid => {
          if( valid ){
            util.accountAxios.post( `/users/user/${this.idx}/reset/`, {
              new_password: this.formUser.password
            }).then((response) => {
              const { errcode, errmsg } = response.data;
              if( !errcode ){
                this.$Message.success( '重置密码成功' );
                this.rsPasswordModal = false;
                this.idx = -1;
              }else{
                this.$Message.error( errmsg );
              }
            }) 
          }else{
            this.$Message.error( '表单验证失败' )
          }
        } )
      },

      resetPassword( id ){
        this.rsPasswordModal = true;
        this.idx = id;
      },

      deleteRelationship( id ){
        util.accountAxios.post( '/users/relationship/delete/', {
          shop_id: id,
          user_id: id,
        } ).then((response) => {
          const { errcode, errmsg } = response.data;
          if( !errcode ){
            this.$Message.success( '册除关系成功' );
            for( let [ index, item ] of this.relationships.entries() ){
              if( item.user_id === id ){
                this.relationships.splice( index, 1 );
                break;
              }
            }
          }else{
            this.$Message.error( errmsg );
          }
        })
      },

      inviteOk(){

      },

      qrCode(){
        this.$refs.formInvite.validate((valid) => {
          if (valid) {
            util.accountAxios.post('/users/invition/create/', {
              shop_id: this.$route.params.id,
              role: this.formInvite.role,
              expired_time: moment( this.date ).valueOf()
            })
            .then((response) => {
              const { errcode, url, code, errmsg } = response.data;
              if( !errcode ){
                this.$Message.success( '二维码生成成功' )
                this.qrcodeUrl = url;
                this.qrcodeSize = 80;
              }else{

              }
            })
          }else {
            this.$Message.error('表单验证失败!');
          }
        })
      }
    },

    filters: {
      capitalize(value){
        return moment(value).format('YYYY-MM-DD HH:mm:ss');
      },
      searchStaus( value ){
        return value === 2 ? '正常' : value === 1 ? '筹备' : '关闭'
      }
    },
  }

</script>