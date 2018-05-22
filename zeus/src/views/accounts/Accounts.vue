<style scoped>
  .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu){
    background-color: #f5f4f4;
  }
</style>
<template>
  <Row>
    <i-col span="3">
      <Menu :active-name="pathName" width="auto">
        <Menu-item name="shops">
          <router-link tag="div" :to="{ name: 'AccountsShops' }">店铺管理</router-link>
        </Menu-item>
        <Menu-item name="users">
          <router-link tag="div" :to="{ name: 'AccountsUsers' }">用户管理</router-link>
        </Menu-item>
        <!-- <Menu-item name="arrangement">
          <router-link tag="div" :to="{ name: 'BookArrangement' }">权限管理</router-link>
        </Menu-item> -->
      </Menu>
    </i-col>
    <i-col span="21">
      <div class="layout-content-main">
        <router-view></router-view>
      </div>
    </i-col>
  </Row>
</template>
<script>
  export default {
    data(){
      return {
        
      }
    },

    computed: {
      pathName(){
        let path = this.$route.path.split('/')[2];
        if( !path ){
          return 'home';
        }
        
        if( path === 'shop' ){
          return 'shops'
        }

        return path;
      }
    }
  }
</script>