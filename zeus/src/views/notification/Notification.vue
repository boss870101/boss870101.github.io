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
    <i-col span="3">
      <Menu :active-name="pathName" width="auto">
        <Menu-item name="notifies">
          <router-link tag="div" :to="{ name: 'NotificationNotifies' }">通知列表</router-link>
        </Menu-item>
        <Menu-item name="wikis">
          <router-link tag="div" :to="{ name: 'NotificationWikis' }">宝典列表</router-link>
        </Menu-item>
        <Menu-item name="publicities">
          <router-link tag="div" :to="{ name: 'NotificationPublicities' }">宣传宣导</router-link>
        </Menu-item>
        <Menu-item name="announcements">
          <router-link tag="div" :to="{ name: 'NotificationAnnouncements' }">公告</router-link>
        </Menu-item>
        <Menu-item name="tags">
          <router-link tag="div" :to="{ name: 'NotificationTags' }">标签管理</router-link>
        </Menu-item>
        <Menu-item name="classifies">
          <router-link tag="div" :to="{ name: 'NotificationClassifies' }">分类管理</router-link>
        </Menu-item>
        <Menu-item name="notification">
          <router-link tag="div" :to="{ name: 'NotificationSetups' }">配置</router-link>
        </Menu-item>
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
    computed: {
      pathName(){
        let path = this.$route.path.split('/')[2];

        if( !path ){
          return 'home';
        }

        if( path === 'notify' || path === 'editNotify' ||
            path === 'createNotify' || path === 'editNotifyReceivers' ||
            path === 'editNotifySend' )
          return 'notifies';

        if( path === 'wiki' || path === 'createWiki' ||
            path === 'editWiki' || path === 'editWikiSend' ||
            path === 'editWikiReceivers' )
          return 'wikis';

        if( path === 'publicity' || path === 'createPublicity' ||
            path === 'editPublicity' || path === 'editPublicityReceivers' ||
            path === 'editPublicitySend' )
          return 'publicities';

        return path;
      }
    }
  }
</script>