<template>
  <Card dis-hover :bordered="false">
    <Form 
      ref="formValue" 
      :model="formValue" 
      :label-width="120" 
      style="width: 80%; margin: 40px auto 0 auto">
      <Form-item label="是否允许筹备阶段报货">
        <i-switch v-model="formValue.can_prepare_ordered"></i-switch>
      </Form-item>
      <Form-item label="是否有特殊订单报货">
        <i-switch v-model="formValue.can_everyday_ordered"></i-switch>
      </Form-item>
      <Form-item label="是否需要补单">
        <i-switch v-model="formValue.can_checking"></i-switch>
      </Form-item>
      <Form-item label="订货提前开始天数">
        <Input-number :min="1" v-model="formValue.start_day"></Input-number>
      </Form-item>
      <Form-item label="订货提前结束天数">
        <Input-number :min="1" v-model="formValue.end_day"></Input-number>
      </Form-item>
      <Form-item label="是否短信通知">
        <i-switch v-model="formValue.can_sms_notified"></i-switch>
      </Form-item>
      <Form-item label="是否微信通知">
        <i-switch v-model="formValue.can_wechat_notified"></i-switch>
      </Form-item>
      <Form-item label="是否钉钉通知">
        <i-switch v-model="formValue.can_dingtalk_notified"></i-switch>
      </Form-item>
      <Form-item label="是否webhook通知">
        <i-switch v-model="formValue.can_webhook_notified"></i-switch>
      </Form-item>
      <Form-item label="钉钉webhook">
        <Input v-model="formValue.dingtalk_webhook_url" type="textarea" placeholder="请输入..." style="width: 200px"></Input>
      </Form-item>
      <Form-item label="第三方链接">
        <Input v-model="formValue.third_push_url" type="textarea" placeholder="请输入..." style="width: 200px"></Input>
      </Form-item>
      <Form-item label="基础运费（／公里）">
        <Input-number :min="0" v-model="formValue.base_shipping"></Input-number>
      </Form-item>
      <Form-item label="特殊订单报货周期">
        <Select v-model="formValue.everyday_ftype" style="width:80px">
          <Option :value="1">周</Option>
          <Option :value="2">月</Option>
        </Select>
      </Form-item>
      <Form-item label="特殊订单报货日期">
        <Input-number :min="1" :max="formValue.everyday_ftype === 1 ? 7 : 31" v-model="formValue.everyday_value"></Input-number>
      </Form-item>
      <Form-item label="经度">
        <Input-number :min="1" v-model="formValue.lng"></Input-number>
      </Form-item>
      <Form-item label="纬度">
        <Input-number :min="1" v-model="formValue.lat"></Input-number>
      </Form-item>
      <Form-item label="创建时间">
        <span>{{formValue.created_time}}</span>
      </Form-item>
      <Form-item label="更新时间">
        <span>{{formValue.updated_time}}</span>
      </Form-item>
      <Form-item>
        <Poptip confirm title="您确认更改吗？"
          @on-ok="handleSubmit">
          <i-button type="primary">确定</i-button>
        </Poptip>
      </Form-item>
    </Form>
  </Card>
</template>
<script>
  import util from "@/libs/util";
  import moment from "moment";
  const dateFormat = 'YYYY-MM-DD HH:mm:ss';
  export default {
    name: 'setup',
    data(){
      return {
        formValue: {
          lng: 100,
          lat: 38,
          start_day: 1,
          base_shipping: 0
        }
      }
    },

    mounted(){
      this.fetchSetup();
    },
    methods: {
      remove(index) {
        const {id} = this.dataSource[index];
        this.fetchs( 'delete', {}, id, index );
      },

      fetchSetup(){
        util.bookAxios.get( '/setups/setup/query/' )
        .then( response => {
          const { errcode, setup } = response.data;
          if( !errcode ){
            this.formValue = setup;
            this.formValue.base_shipping = Number( this.formValue.base_shipping );
            this.formValue.created_time = moment(this.formValue.created_time).format(dateFormat);
            this.formValue.updated_time = moment(this.formValue.updated_time).format(dateFormat);
          }
        } )
      },

      updateSetup( params = {} ){
        util.bookAxios.post( '/setups/setup/update/', params ).then( response => {
          let { errcode, errmsg } = response.data;
          if( !errcode ){
            this.$Message.success( '更新成功' );
          }else{
            this.$Message.error( errmsg );
          }   
        })   
      },

      handleSubmit() {
        delete this.formValue.created_time;
        delete this.formValue.updated_time;
        this.updateSetup( this.formValue );
      },
    }
  }
</script>
<style scoped>
.ivu-form-item{
  width: 49%;
  display: inline-block;
}
</style>