<template>
  <Card dis-hover :bordered="false">
    <Steps :current="1">
      <Step title="进行中" content="新建内容"></Step>
      <Step title="待进行" content="发送组"></Step>
      <Step title="待进行" content="确定发送"></Step>
    </Steps>
    <Tabs type="card" style="margin: 80px 0 0 0">
      <Tab-pane label="个人">
        <Transfer
          :list-style="transferStyle"
          :titles="['未选', '已选']"
          :data="usersDataSource"
          :target-keys="usersTargetKeys"
          filterable
          :render-format="renderUsers"
          @on-change="usersChange">
        </Transfer>
      </Tab-pane>
      <Tab-pane label="部门">
        <Transfer
          :list-style="transferStyle"
          :titles="['未选', '已选']"
          :data="departmentsDataSource"
          :target-keys="departmentsTargetKeys"
          filterable
          :render-format="renderDepartments"
          @on-change="departmentsChange">
        </Transfer>
      </Tab-pane>
      <Tab-pane label="组">
        <Transfer
          :list-style="transferStyle"
          :data="groupsDataSource"
          :target-keys="groupsTargetKeys"
          :titles="['未选', '已选']"
          filterable
          :render-format="renderGroups"
          @on-change="groupsChange">
        </Transfer>
      </Tab-pane>
    </Tabs>
    <div style="width: 160px; margin: 40px auto">
      <Button type="ghost">
        <router-link 
          style="border: 0; background-color: #fff" 
          tag="button" :to="{name: 'NotificationEditNotify'}">
          上一步
        </router-link>
      </Button>
      <Button type="primary" @click="next">下一步</Button>
    </div>
  </Card>
</template>

<script>
  import util from "@/libs/util";
  export default {
    name: 'editNotifyReceivers',

    data(){
      return {
        usersDataSource: [],
        departmentsDataSource: [],
        groupsDataSource: [],
        usersTargetKeys: [],
        departmentsTargetKeys: [],
        groupsTargetKeys: [],
        transferStyle: {
          width: '340px',
          height: '340px'
        }
      }
    },

    created(){
      this.fetchAllReceivers();
    },

    methods: {
      
      usersChange(newTargetKeys) {
        this.usersTargetKeys = newTargetKeys;
      },

      departmentsChange(newTargetKeys){
        this.departmentsTargetKeys = newTargetKeys;
      },

      groupsChange(newTargetKeys){
        this.groupsTargetKeys = newTargetKeys;
      },

      fetchReceivers(){
        util.notificationAxios.get(`/publicities/publicity/${this.$route.params.id}/receiver/list/`, {
          responseType: 'json'
        }).then((response) => {
          let { errcode, errmsg } = response.data;
          if( !errcode ){
            let { users, departments, groups } = response.data;
            users = users.map( item => item.key );
            departments = departments.map( item => item.key );
            groups = groups.map( item => item.key );
            this.usersTargetKeys = users;
            this.departmentsTargetKeys = departments;
            this.groupsTargetKeys = groups;
            this.$Message.success( '获取成功' );
          }else{
            this.$Message.error( errmsg );
          }
        })
      },

      fetchAllReceivers(){
        util.notificationAxios.get('/utils/receiver/list/', {
          responseType: 'json'
        }).then((response) => {
          let { errcode, errmsg } = response.data;
          if( !errcode ){
            this.fetchReceivers();
            let { users, departments, groups } = response.data;
            this.usersDataSource = users;
            this.departmentsDataSource = departments;
            this.groupsDataSource = groups;
          }else{
            this.$Message.error( errmsg );
          }      
        })
      },

      fetchUpdateReceivers(){
        let { id } = this.$route.params;
        let { usersTargetKeys, departmentsTargetKeys, groupsTargetKeys } = this;
        util.notificationAxios.post(`/publicities/publicity/${id}/receiver/create/`, {
          users: usersTargetKeys,
          departments: departmentsTargetKeys,
          groups: groupsTargetKeys
        }).then((response) => {
          let { errcode, errmsg } = response.data;
          if( !errcode ){
            this.$router.push({ name: 'NotificationEditPublicitySend', params: { id: id } });
          }else{
            this.$Message.error( errmsg );
          }
        })
      },

      next(){
        this.fetchUpdateReceivers()
      },

      renderUsers(item){
        return item.username;
      },

      renderDepartments(item){
        return item.name;
      },

      renderGroups(item){
        return `${item.service}-${item.name}`;
      },
    }
  }
</script>

<style>
  .ivu-transfer{
    width: 736px;
    margin: 0 auto;
  }
</style>
