<template>
  <div style="width:352px; margin: 80px auto; border: 1px solid #e9eaec; padding: 15px">
    <Form 
      style="margin-top: 40px;" 
      ref="formInline" 
      :model="formInline" 
      :rules="ruleInline" 
      inline>
      <Form-item prop="username">
        <Input 
          type="text" 
          ref="username" 
          v-model="formInline.username" 
          placeholder="登录名">
          <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </Form-item>
      <Form-item prop="password">
        <div style="width: 100%; display: inline-block; vertical-align: middle">
          <Input 
            v-if="use_yzm"
            type="text" 
            ref="yzm"
            v-model="formInline.yzm" 
            value=""
            placeholder="验证码">
            <Icon type="ios-locked-outline" slot="prepend"></Icon>
          </Input>
          <Input 
            v-else
            type="password" 
            v-model="formInline.password" 
            placeholder="请填写密码">
            <Icon type="ios-locked-outline" slot="prepend"></Icon>
          </Input>
        </div>
        <!-- <Button 
          disabled
          style="margin-left: -5px; margin-top: 2px; width: 115px; dispaly: inline-block" 
          type="primary"
          @click="turnYzm">
          <span>{{ text }}</span>
        </Button> -->
      </Form-item>
      <Form-item style="width: 100%;">
        <Button 
          style="width: 100%;" 
          type="primary" 
          @click="handleSubmit('formInline')" 
          long>
          登录
        </Button>
      </Form-item>
    </Form>
    <div style="height: 2px; background-color: #d9d9d9; margin: 10px 0;"></div>
    <div class="thirdparty">
      <Button type="ghost" class="btn-party-wechat" @click="wechatLogin">
        <span>使用 微信 登录</span>
      </Button>
      <Button type="ghost" class="btn-party-dingtalk" @click="dingtalkLogin">
        <span>使用 钉钉 登录</span>
      </Button>
    </div>
  </div>
</template>
<script>
  import util from "@/libs/util";
  import Cookie from "js-cookie";
  import axios from "axios";
  import openWindow from "@/libs/openWindow";

  export default {
    data() {
      return {
        formInline: {
          username: '',
          password: '',
          domain: 'guming',
          yzm: ''
        },
        ruleInline: {
          username: [{
            required: true,
            message: '请输入正确的登录名 ！',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请填写密码',
            trigger: 'blur'
          }, {
            type: 'string',
            min: 6,
            message: '密码长度不能小于6位',
            trigger: 'blur'
          }],

        },
        time: 0,
        use_yzm: false,
      }
    },

    methods: {
      turnYzm(){
        const pattern = /^(13[0-9]|14[57]|15[012356789]|17[0135678]|18[0-9])[0-9]{8}$/;
        this.ruleInline.username = [{ 
          required: true, 
          message: '请输入正确的手机号 ！',
          pattern: pattern 
        }]

        if (!pattern.test(this.formInline.username)) {
          this.$refs.formInline.validate( ( valid ) => this.$refs.username.focus() )
          return;
        }

        this.use_yzm = true;
        this.formInline.password = [{
          required: true,
          message: '请填写验证码',
          trigger: 'blur'
        }]
        setTimeout( ()=> {
          this.$refs.yzm.focus();
        }, 300);
        //TODO: 短信绑定接口
        // this.$http.get('/sms/obtain/?mobile=' + this.formInline.username)
        //.then( response => {
        //   var data = response.body;
        //   if (data.errcode != 0) {
        //     this.show_username_helper = true;
        //     return;
        //   } else {
        //     this.time = 5;
        //     this.timer();
        //   }
        // }, response => {
        //   console.log(response.body);
        // });
      },

      timer(){
        if (this.time > 0) {
          this.time--;
          setTimeout(this.timer, 1000);
        }
      },

      dingtalkLogin(){
        const hash = Math.random().toString(36).slice(5)
        util.accountAxios.post('/third/login/', {
          domain: 'guming',
          ftype: 'dingtalk_qrcode',
          hash,
          href: window.location.href,
          action: 'signin'
        }).then( response => {
          let { errcode, url } = response.data;
          if (!errcode) {
            openWindow( url, 'dingtalk', 540, 540)

            let interval = setInterval(() => {
              util.accountAxios.post('/third/check/', {
                hash
              }).then( response => {
                let { errcode, token }= response.data
                if ( errcode !== -1 ) {
                  clearInterval(interval)
                  if( !errcode ){
                    Cookie.set( 'token', token, { 'max-age': 3000 } );//max-age: 3000秒  
                    this.$router.push({ name: 'Index' });
                  }else{
                    if( errcode === 10009 ){
                      this.$Message.error( 'state 错误' );
                    }else if( errcode === 10011 ){
                      this.$Message.error( '钉钉开放平台 openid 错误' );
                    }else if( errcode === 10003 ){
                      this.$Message.error( '不合法的企业配置信息' );
                    }else if( errcode === 10002 ){
                      this.$Message.error( '不合法的企业 id' );
                    }
                  }
                }
              })
            }, 3000)
          }
        })
      },

      wechatLogin(){
        const hash = Math.random().toString(36).slice(5)
        util.accountAxios.post('/third/login/', {
          domain: 'guming',
          ftype: 'wechat_qrcode',
          hash,
          href: window.location.href,
          action: 'signin'
        }).then( response => {
          let { errcode, url } = response.data;
          if (!errcode) {
            openWindow( url, 'wechat', 540, 540)

            let interval = setInterval(() => {
              util.accountAxios.post('/third/check/', {
                hash
              }).then( response => {
                let { errcode, token }= response.data
                if ( errcode !== -1 ) {
                  clearInterval(interval)
                  if( !errcode ){
                    Cookie.set( 'token', token, { 'max-age': 3000 } );//max-age: 3000秒  
                    this.$router.push({ name: 'Index' });
                  }else{
                    if( errcode === 10009 ){
                      this.$Message.error( 'state 错误' );
                    }else if( errcode === 10010 ){
                      this.$Message.error( '微信开放平台 openid 错误' );
                    }else if( errcode === 10003 ){
                      this.$Message.error( '不合法的企业配置信息' );
                    }else if( errcode === 10002 ){
                      this.$Message.error( '不合法的企业 id' );
                    }
                  }
                }
              })
            }, 3000)
          }
        })
      },

      handleSubmit(name){
        this.$refs[name].validate((valid) => {
          if (valid) {
            axios.post( 'https://account.wei3h.com/api/v1/third/jwt/token/', this.formInline ).then( response => {
              const { errcode, token, errmsg } = response.data;
              if( !errcode ){
                Cookie.set( 'token', token, { 'max-age': 3000 } );//max-age: 3000秒
                this.$router.push({ name: 'Index' })
              }else{
                if (errcode == 10005) {
                  this.$Message.error( '用户不存在' );
                } else if ( errcode == 10006) {
                  this.$Message.error( '密码错误' );
                }
              }
            } )
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },
    },

    computed: {
      text(){
        return this.time > 0 ? this.time + 's 后重新获取' : '获取验证码';
      }
    }
  }
</script>
<style scoped>
  .ivu-form-item.ivu-form-item-required{
    width: 100%;
  }

  .ivu-form-item-content{
    width: 318px;
  }

  .thirdparty{
    margin-top: 30px;
  }

  .btn-party-wechat{
    width:  100%;
    margin-bottom: 25px;
    border-color: #32c25a;
  }

  .btn-party-wechat span span{
    color: #32c25a;
  }

  .btn-party-wechat:hover span span{
    color: #3399ff;
  }

  .btn-party-dingtalk{
    width: 100%;
    margin-bottom: 25px;
  }
</style>
