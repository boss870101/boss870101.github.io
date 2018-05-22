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

  .ivu-menu-item-group > div.ivu-menu-item-group-title{
    font-size: 22px !important;
  }

  .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu){
    background-color: #f5f4f4;
  }
</style>
<template>
  <Row>
    <i-col span="3">
      <Menu :active-name="pathName" width="auto">
        <Menu-item name="shops">
          <router-link tag="div" :to="{ name: 'BookShops' }">店铺列表</router-link>
        </Menu-item>
        <Menu-item name="orders">
          <router-link tag="div" :to="{ name: 'BookOrders' }">报货单列表</router-link>
        </Menu-item>
        <Menu-item name="arrangement">
          <router-link tag="div" :to="{ name: 'BookArrangement' }">送货安排</router-link>
        </Menu-item>
        <Menu-item name="pathPlan">
          <router-link tag="div" :to="{ name: 'BookPathPlan' }">路线规划</router-link>
        </Menu-item>
        <Menu-item name="classify">
          <router-link tag="div" :to="{ name: 'BookClassify' }">商品分类</router-link>
        </Menu-item>
        <Menu-item name="products">
          <router-link tag="div" :to="{ name: 'BookProducts' }">商品列表</router-link>
        </Menu-item>
        <Menu-item name="temp">
          <router-link tag="div" :to="{ name: 'BookTemp' }">模板列表</router-link>
        </Menu-item>
        <Menu-group title="配置">
          <template slot="title">
            <Icon type="ios-paper"></Icon>
            配置
          </template>
          <Menu-item name="setup">
            <router-link tag="div" :to="{ name: 'BookSetupsSetup' }">设置</router-link>
          </Menu-item>
          <Menu-item name="line">
            <router-link tag="div" :to="{ name: 'BookSetupsLine' }">送货路线列表</router-link>
          </Menu-item>
          <Menu-item name="rank">
            <router-link tag="div" :to="{ name: 'BookSetupsRank' }">店铺等级列表</router-link>
          </Menu-item>
          <Menu-item name="warehouse">
            <router-link tag="div" :to="{ name: 'BookSetupsWarehouse' }">仓库</router-link>
          </Menu-item>
        </Menu-group>
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
        if( !path )
          return 'home';

        if( path === 'shop' )
          return 'shops';

        if( path === 'pathPlanMap' )
          return 'pathPlan';

        if( path === 'editTemp' )
          return 'temp';
        
        if( path === 'product' )
          return 'products';

        if( path === 'order' )
          return 'orders';
        
        return path;
      }
    }
  }
</script>