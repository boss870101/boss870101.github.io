<template>
  <Card style="width:350px; margin: 0 auto">
    <div slot="title">安全中心</div>
    <div style="text-align: center">
      <Button type="success" size="large" @click="wechatBind">绑定微信</Button>
      <Button type="info" @click="dingtalkBind" size="large">绑定钉钉</Button>
    </div>
  </Card>
</template>
<script>
  import util from "@/libs/util";
  import openWindow from "@/libs/openWindow";
  import Cookie from "js-cookie";

  export default {
    data () {
      return {
      }
    },

    methods: {
      wechatBind() {
        const hash = Math.random().toString(36).slice(5)
        util.accountAxios.post('/third/login/', {
          domain: 'guming',
          ftype: 'wechat_qrcode',
          hash,
          href: window.location.href,
          action: 'bind'
        }).then( response => {
          let { errcode, url } = response.data;
          if (!errcode) {
            openWindow( url, 'wechat', 540, 540)
            let interval = setInterval( () => {
              util.accountAxios.post('/third/check/', {
                hash
              }).then( response => {
                let { errcode, token } = response.data;
                if ( errcode !== -1 ) {
                  clearInterval(interval)
                  if( !errcode ){
                    Cookie.set( 'token', token, { 'max-age': 3000 } );//max-age: 3000秒  
                    this.$Message.success( '绑定成功' );
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

      dingtalkBind(){
        const hash = Math.random().toString(36).slice(5)
        util.accountAxios.post('/third/login/', {
          domain: 'guming',
          ftype: 'dingtalk_qrcode',
          hash,
          href: window.location.href,
          action: 'bind'
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
                    this.$Message.success( '绑定成功' );
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
    }
  }
</script>