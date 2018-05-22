<style scoped>
  .layout-content-main {
    padding:10px;
  }

  .ivu-menu-vertical .ivu-menu-item{
    padding: 0;
  }

  .ivu-menu-vertical .ivu-menu-item > div{
    padding: 14px 24px;
  }
</style>
<template>  
  <Row>
    <i-col span="5">
      <Menu active-name="1" width="auto">
        <Menu-item name="1">
          <router-link tag="div" to="111">店铺管理</router-link>
        </Menu-item>
        <Menu-item name="2">
          <router-link tag="div" to="111">用户管理</router-link>
        </Menu-item>
        <Menu-item name="3">
          <router-link tag="div" to="111">用户权限</router-link>
        </Menu-item>
      </Menu>
    </i-col>
    <i-col span="19">
      <div class="layout-content-main">
        <router-view></router-view>
      </div>
    </i-col>
  </Row>
</template>
<script>
  import axios from "axios";
  export default {
    mounted: function(){
      this.fetch();
    },

    data(){
      return {
        menus: '',
        loading: true,
      }
    },

    methods: {
      fetch(){
        const url = 'http://static.pibig.cn/menu2.json';
        axios.get(url).then(response => {
          if( !response.data.errcode ){
            const { menus } = response.data;
            
            this.menus = menus;
            this.loading = false;
          }
        })
      }
    },

  }
</script>

