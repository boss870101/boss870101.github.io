<style scoped>
  .layout {
    border:1px solid #d7dde4;
    background:#f5f7f9;
  }
  .layout-logo {
    width:100px;
    height:30px;
    background:#5b6270;
    border-radius:3px;
    float:left;
    position:relative;
    top:15px;
    left:20px;
  }
  .layout-nav {
    width:420px;
    margin:0 auto;
  }
  .layout-assistant {
    width:600px;
    margin:0 auto;
    height:inherit;
  }
  .layout-breadcrumb {
    padding:10px 15px 0;
  }
  .layout-content {
    min-height: 900px;
    margin:5px;
    overflow:hidden;
    background:#fff;
    /*border-radius:4px;
    */
  }
  .layout-ceiling {
    background:#464c5b;
    padding:10px 0;
    overflow:hidden;
  }
  .layout-ceiling-main {
    float:right;
    margin-right:15px;
  }
  .layout-ceiling-main a {
    color:#9ba7b5;
  }
  .layout-copy {
    text-align:center;
    padding:10px 0 20px;
    color:#9ea7b4;
  }

  .ivu-select-dropdown{

  }

  .ivu-menu-vertical .ivu-menu-item{
    padding: 0;
  }

  .ivu-menu-vertical .ivu-menu-item > div{
    padding: 14px 24px;
  }

  .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu){
    background-color: #f5f4f4;
  }
</style>
<template>
  <div>
    <div class="layout">
      <div class="layout-ceiling">
        <div class="layout-ceiling-main">
          <span>{{username}}</span>|
          <a href="#">帮助中心</a>|
          <router-link tag="a" :to="{ name: 'Security' }">安全中心</router-link>|
          <a href="#">服务大厅</a></div>
      </div>
      <Menu mode="horizontal" :active-name="pathName">
        <div class="layout-assistant">
         <!--  <Menu-item name="home">
            <router-link tag="div" :to="{ name: 'Home' }">首页</router-link>
          </Menu-item> -->
          <!-- <Menu-item name="pages">
            <router-link tag="div" :to="{ name: 'PagesScheduleManagement' }">Pages</router-link>
          </Menu-item> -->
          <Menu-item name="book">
            <router-link tag="div" :to="{ name: 'BookArrangement' }">报货系统</router-link>
          </Menu-item>
          <!-- <Menu-item name="pimedia">
            <router-link tag="div" to="pimedia">电视机系统</router-link>
          </Menu-item> -->
          <Menu-item name="notification">
            <router-link tag="div" :to="{ name: 'NotificationNotifies' }">通知文档中心</router-link>
          </Menu-item>
          <Menu-item name="accounts" >
            <router-link tag="div" :to="{ name: 'AccountsShops' }">基础数据</router-link>
          </Menu-item>
        </div>
      </Menu>
    </div> 
    <div class="layout-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default{
    data(){
      return {
        username: m_config.username
      }
    },

    mounted(){
    },

    computed: {
      pathName(){
        let path = this.$route.path.split('/')[1];
        if( !path ){
          this.$router.push({ name: 'BookShops' })
          return 'book';
        }
        return path;
      }
    }
  }
</script> 