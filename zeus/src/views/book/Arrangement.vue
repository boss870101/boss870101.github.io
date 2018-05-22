<style>
  .jason.ivu-menu-vertical .ivu-menu-item{
    padding: 3px 24px;
  }

  .jason.ivu-menu-vertical .ivu-menu-item-group-title{
    color: #000;
    font-size: 16px;
  }

  .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu){
    background-color: #f5f4f4;
  }
</style>
<template>
  <Card dis-hover>
    <Row>
      <Col span="5">
        <Menu class="jason" active-name="1" style="width: 100%" @on-select="selectedPath">
          <Menu-group title="路线列表">
            <Menu-item :name="path.id" v-for="path in paths" :key="path.id">
              {{path.tag_line.name}}
            </Menu-item>
          </Menu-group>
        </Menu>
      </Col>
      <Col span="19">
        <full-calendar 
          :events="fcEvents" 
          locale="zh-cn"
          @changeMonth="changeMonth"
          @dayClick="dayClick">
        </full-calendar>
      </Col>
    </Row>
    <Modal
      v-model="modal"
      width="350"
      @on-cancel="cancel">
      <p v-if="hasPath" slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>{{`${date} 删除确认`}}</span>
      </p>
      <p v-else slot="header" style="color:#f60;text-align:center">
        <Icon type="help-circled"></Icon> 
        <span>{{`${date} 添加确认`}}</span>
      </p>
      <div v-if="hasPath" style="text-align:center">
        <p style="font-size: 20px">是否删除该条路线？</p>
      </div>
      <div v-else style="text-align:center">
        <p style="font-size: 20px">是否添加该条路线？</p>
      </div>
      <div v-if="hasPath" slot="footer">
        <Button type="error" size="large" long @click="onSubmit">删除</Button>
      </div>
      <div v-else slot="footer">
        <Button type="info" size="large" long @click="onSubmit">添加</Button>
      </div>
    </Modal>
  </Card>
</template>
<script>
  import fullCalendar from '@/components/fullCalendar';
  import util from "@/libs/util";
  import moment from "moment";
  const year = moment().year(), month = moment().month();
  export default {
    name: 'arrangement',
    components: {
      fullCalendar,
    },

    data(){
      return {
        fcEvents: [],
        year: year,
        month: month,
        selected: [],
        firstDayMonth: moment().format( 'YYYY-M' ) + '-01',
        lastDayMonth: year + month + moment().daysInMonth(),
        modal: false,
        paths: [],
        pathId: -1,
        dayEvents: '',
        hasPath: false,
        date: '',
      }
    },
    mounted(){
    },

    methods: {
      changeMonth(start, end, current) {
        const date = current.format( 'YYYY-MM' );
        this.year = current.format( 'YYYY' );
        this.month = current.format( 'M' );
        this.firstDayMonth = date + '-01';
        this.lastDayMonth = date + '-' + current.daysInMonth();
        this.fetchPath();
      },

      dayClick(day, jsEvent, events){
        if( ~this.pathId )
          this.modal = true;

        for( let { id } of events )
          if( id === this.pathId )
            this.hasPath = true;

        this.date = day.date.format( 'YYYY-MM-DD' );
      },

      onSubmit(){
        this.fetchUpdate();
        this.modal = false;
        this.hasPath = false;
      },

      selectedPath( id ){
        this.pathId = id;
        this.fetchArrangement();
      },

      cancel(){
        this.hasPath = false;
      },

      fetchUpdate( params = {} ){
        util.bookAxios.post( '/plans/arrangement/update/path/', 
          { 
            path: this.pathId, 
            day: this.date 
          } 
        ).then( response => {
          const { errcode, errmsg } = response.data;
          if( !errcode ){
            this.$Message.success( '操作成功' );
            this.fetchArrangement();
          }else{
            this.$Message.error( errmsg );
          }
        } )
      },
     
      // fcEvents = [ { name: '', day: '', id: '' } ] 日历显示的事件
      fetchArrangement(){
        util.bookAxios.get( `/plans/arrangement/path/${this.pathId}/list/`).then( response => {
          const { errcode, arrangements, tag_line } = response.data;
          if( !errcode ){
            this.fcEvents = arrangements.map( item => ({ day: item, id: this.pathId }) );
          }
        })
      },

      selectionChange( selection ){
        this.selected = selection.map( item => item.id );
      },

      fetchPath(){
        util.bookAxios.get( '/plans/path/list/', {
          params: { 
            year: this.year,
            month: this.month
          }
        } ).then( response => {
          const { errcode, results } = response.data;
          if( !errcode ){
            this.paths = results;
          }
        } )
      }
    },
  }

</script>