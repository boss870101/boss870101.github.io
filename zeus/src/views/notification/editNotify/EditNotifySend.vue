<template>
  <Card dis-hover :bordered="false">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" style="width: 400px; margin: 40px auto">
      <Form-item label="发送方式" prop="items">
        <Checkbox-group v-model="formValidate.items">
          <Checkbox label="1" disabled>信息</Checkbox>
          <Checkbox label="2">微信</Checkbox>
          <Checkbox label="3" disabled>钉钉</Checkbox>
        </Checkbox-group>
      </Form-item>
      <Form-item label="发送时间" prop="send_type">
        <Radio-group v-model="formValidate.send_type">
          <Radio label="1">立即发送</Radio>
          <Radio label="2">定时发送</Radio>
        </Radio-group>
      </Form-item>
      <Form-item v-if="formValidate.send_type - 1" label="选择日期时间">
        <Date-picker 
          :options="options" 
          type="datetime" 
          v-model="formValidate.send_time" 
          placeholder="选择日期和时间"
          style="width: 200px">
        </Date-picker>
      </Form-item>
      <Form-item style="margin: 20px 0;">
        <Button type="ghost">
          <router-link 
            tag="button" 
            :to="{ name: 'NotificationEditNotifyReceivers' }"
            style="border: 0; background-color: #fff">
            上一步
          </router-link>
        </Button>
        <Button type="primary" @click="handleSubmit('formValidate')" style="margin-left: 8px">确定发送</Button>
      </Form-item>
    </Form>
  </Card>
</template>

<script>
  import util from "@/libs/util";
  import moment from "moment";
  const dateFormat = 'YYYY-MM-DD HH:mm:ss';
  export default {
    name: 'editNotifySend',
    data () {
      return {
        formValidate: {
          items: ['2'],
          send_type: '1',
          send_time: moment( new Date() ).valueOf(),
        },

        options: {
          disabledDate(date){
            return date && date.valueOf() < Date.now() - 86400000;
          }
        },

        ruleValidate: {
          send_type: [
            { required: true, message: '请选择发送方式', trigger: 'change' }
          ],
          items: [
            { required: true, type: 'array', min: 0, message: '至少选择一个方式', trigger: 'change' },
          ],
        }
      }
    },

    methods: {
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let { send_time } = this.formValidate;
            this.formValidate.send_time = moment( send_time ).valueOf();
            this.fetch( this.formValidate );
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },

      fetch( params = {} ){
        const { id } = this.$route.params;
        util.notificationAxios.post(`/notifies/notify/${id}/send/`, 
          params
        ).then((response) => {
          let { errcode, errmsg } = response.data;
          if( !errcode ){
            this.$router.push({ name: 'NotifyDetailPage', params: { id: id } });
          }else{
            this.$Message.error( errmsg );
          }  
        })
      },
    }
  }
</script>

<style>

</style>
