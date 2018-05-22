<template>
  <Card dis-hover :bordered="false">
    <div slot="title">
      <div style="margin: 0 0 10px 10px;">
        <Button type="primary" @click="editUser( -1 )">新建用户</Button>
      </div>
      <div>
        <Input 
          v-model="username" 
          placeholder="请输入用户名..." 
          style="width: 100px; margin-left: 10px">
        </Input>
        <Select clearable v-model="role" style="width:120px; margin-left: 10px">
          <Option :value="1" label="普通用户">
          </Option>
          <Option :value="2" label="管理员">
          </Option>
          <Option :value="3" label="超极管理员">
          </Option>
        </Select>
        <Select clearable v-model="is_active" style="width:120px; margin-left: 10px">
          <Option :value="1" label="禁用">
          </Option>
          <Option :value="2" label="正常">
          </Option>
        </Select>
        <Date-picker 
          :value="joinedDate" 
          format="yyyy-MM-dd" 
          type="daterange"
          @on-change="joineDateChange"
          placement="bottom-end" 
          placeholder="选择加入日期" 
          style="width: 200px; display: inline-block; margin-left: 10px;">
        </Date-picker>
        <Date-picker 
          :value="lastLoginDate" 
          format="yyyy-MM-dd" 
          type="daterange"
          @on-change="lastLoginDateChange"
          placement="bottom-end" 
          placeholder="选择最后登录日期" 
          style="width: 200px; display: inline-block; margin-left: 10px;">
        </Date-picker>
        <Button type="primary" @click="search" style="margin-left: 10px">查询</Button>
      </div>
    </div>
    <Row>
      <Col span="24">
        <Table 
          border 
          :columns="columns" 
          :data="users">
        </Table>
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
      </Col>
    </Row>
    <Modal 
      v-model="editUserModal"
      :title="title + '用户'"
      width="360">
      <Form ref="formUser" :model="formUser" :label-width="100" :rules="rules">
        <Form-item v-show="this.idx === -1" prop="username" label="新建用户名">
          <Input 
            type="text" 
            v-model="formUser.username" 
            placeholder="请输入新用户名">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </Form-item>
        <Form-item v-show="this.idx === -1" prop="password" label="密码">
          <Input type="password" v-model="formUser.password" placeholder="请输入新密码">
            <Icon type="ios-locked-outline" slot="prepend"></Icon>
          </Input>
        </Form-item>
        <Form-item v-show="this.idx === -1" prop="checkPass" label="再次输入">
          <Input type="password" v-model="formUser.checkPass" placeholder="请在次确定输入">
            <Icon type="ios-locked-outline" slot="prepend"></Icon>
          </Input>
        </Form-item>
        <Form-item label="姓名" prop="name">
          <Input v-model="formUser.name" placeholder="请输入姓名"></Input>
        </Form-item>
        <Form-item label="联系电话" prop="mobile">
          <Input v-model="formUser.mobile" placeholder="请输入手机号码"></Input>
        </Form-item>
        <Form-item prop="role" clearable label="用户角色">
          <Select v-model="formUser.role" style="width:200px">
            <Option :value="1">普通用户</Option>
            <Option :value="2">管理员</Option>
            <Option :value="3">超极管理员</Option>
          </Select>
        </Form-item>
        <Form-item label="是否禁用">
          <i-switch v-model="formUser.is_active"></i-switch>
        </Form-item>

      </Form>
      <div slot="footer">
        <Button @click="handleReset">重置</Button>
        <Button type="primary" size="large"  @click="editUserOk">确定</Button>
      </div>
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
  import moment from "moment";
  import util from "@/libs/util";

  export default {
    data () {
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

      const validateMobile = ( rule, value, callback ) => {
        const pattern = /^(13[0-9]|14[57]|15[012356789]|17[0135678]|18[0-9])[0-9]{8}$/;
        if( !pattern.test( value ) ){
          callback( new Error( '请输入正确的手机号码' ) );
        }else{
          callback();
        }
      }

      const validateUsername = ( rule, value, callback ) => {
        util.accountAxios.post( '/users/user/check/', {
          username: value
        } ).then((response) => {
          const { errcode, errmsg } = response.data;
          if( !errcode ){
            callback();
          }else{
            callback( new Error( '该用户名已存在请重新输入' ) );
          }
        })
      }

      const rules = {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            validator: validateUsername,
            trigger: 'blur'
          }
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
        name: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: 'blur'
          },
          {
            validator: validateMobile,
            trigger: 'blur'
          }
        ],
        role: [
          {
            required: true,
            message: '请选择用户角色',
            type: 'number'
          }
        ]
      }
        
      return {
        title: '',
        users: [],
        user: {},
        username: '',
        name: '',
        role: '',
        formUser: {
          username: '',
          checkPass: '',
          name: '',
          mobile: '',
          role: '',
          is_active: false
        },
        editUserModal: false,
        rsPasswordModal: false,
        idx: -1,
        joinedDate: [],
        lastLoginDate: [],
        is_active: '',
        joined_time__gte: '',
        joined_time__lte: '',
        last_login__gte: '',
        last_login__lte: '',
        columns: [
          {
            title: '用户名',
            align: 'center',
            key: 'username'
          },
          {
            title: '姓名',
            align: 'center',
            key: 'name'
          },
          {
            title: '联系电话',
            align: 'center',
            key: 'mobile'
          },
          {
            title: '角色',
            align: 'center',
            render: ( h, params ) => h( 'span', 
              params.row.role == 1 ? '普通用户' : 
              params.row.role == 2 ? '管理员' : '超级管理员' )
          },
          {
            "title": "是否禁用",
            align: 'center',
            render: ( h, params ) => h( 'Icon', {
              props: {
                type: params.row.is_active ? 
                'ios-checkmark-outline' : 'ios-close-outline' 
              },
              style: {
                color: params.row.is_active ? 'red' : '#000'
              }
            } )
          },
          {
            title: 'uuid',
            align: 'center',
            key: 'uuid'
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
              moment( params.row.last_time ).format( 'YYYY-MM-DD' )
            )
          },
          {
            title: '操作',
            align: 'center',
            width: 300,
            render: ( h, params ) => h( 'div', [
              h( 'Button', {
                props: {
                  type: params.row.is_active ? 'primary' : 'error',
                  size: 'small'
                },
                on: {
                  click: () => this.forbidden( params.row, params.row.id )
                }
              }, params.row.is_active ? '启用' : '禁用' ),
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
                  click: () => this.editUser( params.row )
                }
              }, '编辑' )
            ])
          }
        ],
        rules,
        idx: -1,
        page_size: 30,
        page: 1,
        total: 0,
      }
    },
    mounted(){
      this.fetchUsers();
    },

    methods: {
      fetchUsers(){
        util.accountAxios.get( '/users/user/list/', {
          params: {
            page_size: this.page_size,
            page: this.page,
            username__icontains: this.username,
            is_active: this.is_active === 1 ? false : this.is_active === '' ? '' : 'True',
            role: this.role,
            joined_time__gte: this.joined_time__gte,
            joined_time__lte: this.joined_time__lte,
            last_login__gte: this.last_login__gte,
            last_login__lte: this.last_login__lte
          }
        } ).then( response => {
          const { errcode, results, page_size, page, total } = response.data;
          if( !errcode ){
            this.users = results;
            this.page_size = page_size;
            this.page = page;
            this.total = total;
          }
        } )
      },

      onRowClick( row ){
        this.$router.push({name: 'AccountsUser', params: { id: row.id } });
      },

      joineDateChange( date ){
        this.joinedDate = date;
        this.joined_time__gte = date[0] ? moment(date[0]).valueOf() : date[0];
        this.joined_time__lte = date[1] ? moment(date[1]).valueOf() : date[1];
      },

      lastLoginDateChange( date ){
        this.lastLoginDate = date;
        this.last_login__gte = date[0] ? moment(date[0]).valueOf() : date[0];
        this.last_login__lte = date[1] ? moment(date[1]).valueOf() : date[1];
      },

      pageSizeChange( page_size ){
        this.page_size = page_size;
        this.fetchUsers();
      },
      pageChange( page ){
        this.page = page;
        this.fetchUsers();
      },

      search(){
        this.fetchUsers();
      },

      forbidden( row, id ){
        util.accountAxios.post(`/users/user/${id}/active/`).then((response) => {
          const { errcode, errmsg } = response.data;
          if( !errcode ){
            !this.$Message.success( `${ row.is_active ? '用户已禁用成功' : '用户已启用成功' }` )
            row.is_active = !row.is_active;
          }else{
            this.$Message.error( errmsg );
          }
        })
      },

      resetPassword( id ){
        this.rsPasswordModal = true;
        this.idx = id;
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

      editUser( row ){
        this.handleReset();
        if( row === -1 ){
          this.title = '新建';
          this.formUser = {
            role: '',
            mobile: '',
            username: '',
            name: '',
            is_active: false,
            password: '',
            checkPass: ''
          }
          this.idx = -1;
          this.editUserModal = true;
        }else{
          this.title = '编辑';
          this.user = row;
          this.idx = row.id;
          this.editUserModal = true;
          this.formUser.role = row.role;
          this.formUser.mobile = row.mobile;
          this.formUser.name = row.name;
          this.formUser.is_active = row.is_active;
        }
      },

      handleReset(){
        if( this.idx === -1 ){
          this.$refs.formUser.resetFields();
        }else{
          this.formUser.role = this.user.role;
          this.formUser.mobile = this.user.mobile;
          this.formUser.name = this.user.name;
          this.formUser.is_active = this.user.is_active;
        }
      },

      editUserOk(){
        if( this.idx === -1 ){
          this.$refs.formUser.validate( valid => {
            if( valid ){
              util.accountAxios.post( `/users/user/create/`, 
                this.formUser
              ).then((response) => {
                const { errcode, errmsg } = response.data;
                if( !errcode ){
                  this.$Message.success( '创建用户成功' );
                  this.editUserModal = false;
                  this.fetchUsers();
                }else{
                  this.$Message.error( errmsg );
                }
              }) 
            }else{
              this.$Message.error( '表单验证失败' )
            }
          } )
        }else{
          util.accountAxios.post( `/users/user/${this.idx}/update/`, 
            this.formUser
          ).then((response) => {
            const { errcode, errmsg } = response.data;
            if( !errcode ){
              const { name, role, is_active, mobile } = this.formUser;
              this.$Message.success( '更新用户成功' );
              this.user.name = name;
              this.user.role = role;
              this.user.mobile = mobile;
              this.user.is_active = is_active;
              this.editUserModal = false;
            }else{
              this.$Message.error( errmsg );
            }
          })
        }
      },

      usernameFocus(){
        console.log("1", 1)
      }
    },

    watch: {
      'selectedLine'( val ){
        this.users = [];
        this.selection = [];
        if( !~val ){
          this.is_created = false;
        }else{
          this.is_created = true;
        }
        this.fetchPath( val );
      }
    },

    filters: {
      capitalize(value){
        return moment(value).format('YYYY-MM-DD');
      }
    }
  }
</script>
<style>
  .ivu-menu-vertical.ivu-menu-light::after{
    width: 0 !important;
  }
  .menu.ivu-menu.ivu-menu-light.ivu-menu-horizontal{
    line-height: 40px;
  }
  .menu.ivu-menu.ivu-menu-light.ivu-menu-horizontal .ivu-menu-item{
    padding: 0 8px;
    border: 1px solid #e3e8ee;
    height: 40px;
  }

  .ivu-select-item.color{
    color: #f93100;
  }

</style>
