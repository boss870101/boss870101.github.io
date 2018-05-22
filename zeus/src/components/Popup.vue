<style scoped>
</style>
<template>
  <Card>
    <Row>
      <Col span="20">
        <full-calendar 
          :events="fcEvents" 
          locale="zh-cn"
          @changeMonth="changeMonth"
          @dayClick="dayClick">
        </full-calendar>
      </Col>
      <Col span="4">
        <ul style="folat: left; width: 200px">
          <li></li>
        </ul>
      </Col>
    </Row>
    <Modal
      v-model="modal"
      :title="`${date} 路线安排`"
      @on-ok="ok(date)"
      @on-cancel="cancel">
      <Checkbox-group v-model="checked">
        {{checkedCopy}}
        <div v-for="item in pathList">
          <Checkbox :label="item.id" :key="item.id">
            <span>{{item.name}}</span>
          </Checkbox>
        </div>
    </Checkbox-group>
    </Modal>
  </Card>
</template>
<script>
  import fullCalendar from './fullCalendar';
  import moment from "moment";
  export default {
    name: 'scheduleManagement',
    components: {
      fullCalendar,
    },

    data(){
      return {
        fcEvents: [ { name: '1号', day: '2017-04-25', id: 1 } ],
        modal: false,
        pathList: [
          { name: '1号', id: 1 },
          { name: '2号', id: 2 },
          { name: '3号', id: 3 },
          { name: '4号', id: 4 },
          { name: '5号', id: 5 },
          { name: '6号', id: 6 },
          { name: '7号', id: 7 },
          { name: '8号', id: 8 },
          { name: '9号', id: 9 },
          { name: '10号', id: 10 },
          { name: '11号', id: 11 },
          { name: '12号', id: 12 },
          { name: '13号', id: 13 },
          { name: '14号', id: 14 },
          { name: '15号', id: 15 },
          { name: '16号', id: 16 },
          { name: '17号', id: 17 },
          { name: '18号', id: 18 },
          { name: '19号', id: 19 },
          { name: '20号', id: 20 },
        ],
        checked: [],
        checkedCopy: [], 
        date: '',
      }
    },
    mounted(){

    },

    methods: {
      changeMonth(start, end, current) {
        console.log('changeMonth', start, end, current.format( 'YYYY-MM' ))
      },
      dayClick(day, jsEvent, events){
        this.date = `${day.date.format( 'YYYY-MM-DD' )}`
        this.modal = true;
        this.$emit('dayClick', day, jsEvent, events)
      },
      ok( date ){
        if( this.checkedCopy.length ){ 
          this.checkedCopy.forEach( id => this.fcEvents.forEach( ( item, index ) => {
            if( date === item.day && item.id === id ){
              this.fcEvents.splice( index, 1 );
            }
          } ));
        }

        if( this.checked.length ){
          this.pathList.forEach( item => this.checked.forEach( id => {
            if( item.id === id ){
              let fcEvent = Object.assign( {}, item );
              fcEvent.day = date;
              this.fcEvents.push( fcEvent );
            }
          } ) )
        }
        
        this.checkedCopy = [];
        this.checked = [];
      },
      cancel(){
        this.checked = [];
        this.checkedCopy = [];
      },
    },
  }

</script>