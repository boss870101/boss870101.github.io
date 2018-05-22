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
  <div>

  <Row>
    <i-col span="3">
      <Menu active-name="1" width="auto">
        <Menu-item name="1">
          <router-link tag="div" :to="{ name: 'PagesScheduleManagement' }">日程管理</router-link>
        </Menu-item>
        <Menu-item name="2">
          <router-link tag="div" :to="{ name: 'PagesPathPlan' }">路程规划</router-link>
        </Menu-item>
      </Menu>
    </i-col>
    <i-col span="21">
      <div class="layout-content-main">
        <router-view></router-view>
      </div>
    </i-col>
  </Row>

  </div>
</template>
<script>
  export default {

  }
</script>