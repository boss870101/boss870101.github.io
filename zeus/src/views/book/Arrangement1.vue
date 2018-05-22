<style scoped>
</style>
<template>
  <Card dis-hover>
    <Row>
      <Col span="24">
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
      width="900"
      :title="`${date} 路线安排`"
      @on-ok="onSubmit(date, idx)"
      @on-cancel="cancel">
      <Table 
        @on-selection-change="selectionChange" 
        border 
        :columns="columns" 
        :data="paths">
      </Table>
    </Modal>
  </Card>
</template>
<script>
  import fullCalendar from '@/components/fullCalendar';
  import util from "@/libs/util";
  import moment from "moment";
  export default {
    name: 'arrangement',
    components: {
      fullCalendar,
    },

    data(){
      return {
        fcEvents: [],
        fcEventsMap: '',
        year: moment().year(),
        month: moment().month(),
        selected: [],
        firstDayMonth: '',
        lastDayMonth: '',
        modal: false,
        paths: [],
        pathIds: [],
        date: '',
        idx: 0,
        temp: '',
        self: this,
        columns: [
          { type: 'selection', width: 60, align: 'center' }
        ],
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
        this.fetchArrangement();
      },

      dayClick(day, jsEvent, events){
        this.date = `${day.date.format( 'YYYY-MM-DD' )}`;
        this.modal = true;
        this.temp = events
        this.fetchPath( events );
        this.columns = [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '名称',
            render: ( h, params ) => h( 'span', params.row.tag_line.name )
          },
          {
            title: '当月日期',
            render: ( h, params ) => this.fcEventsMap.get( 
              `${params.row.id}-${params.row.tag_line.name}` ).map( day =>
              h( 'Tag', {
                props: {
                  color: this.date === day ? 'red' : 'blue'
                }
              }, day )
            ) 
          },
          {
            title: '当月总计',
            render: ( h, params ) => h( 'Tag', {
              style: {
                fontSize: '16px',
                fontWeight: 900
              }
            },  this.fcEventsMap.get( `${params.row.tag_line.name}-${params.row.id}` ) )
          }
        ]
      },

      onSubmit( date, idx ){
        const params = { paths: this.selected, day: date }
        if( !idx ){
          this.fetchUpdate( params );
        }else{
          this.fetchUpdate( params )
        }
      },

      cancel(){
        this.selected = [];
        this.idx = 0;
      },

      fetchUpdate( params = {} ){
        util.bookAxios.post( '/plans/arrangement/update/', params ).then( response => {
          const { errcode, errmsg } = response.data;
          if( !errcode ){
            this.$Message.success( '更新成功' );
            this.selected = [];
            this.idx = 0;
            this.fetchArrangement( { year: this.year, month: this.month } )
          }else{
            this.$Message.error( errmsg );
          }
        } )
      },
     
      // fcEvents = [ { name: '', day: '', id: '' } ] 日历显示的事件
      fetchArrangement( params = {} ){
        util.bookAxios.get( '/plans/arrangement/list/',{ 
          params: { 
            day__gte: this.firstDayMonth,
            day__lte: this.lastDayMonth,
            page_size: 100,
          }
        }).then( response => {
          const { errcode, results } = response.data;
          if( !errcode ){
            this.fcEvents = [];
            this.fcEventsMap = new Map;
            results.forEach( item => {
              item.paths.forEach( path =>{
                this.fcEvents.push( { name: path.tag_line.name, day: item.day, id: path.id } )
                if( this.fcEventsMap.has( `${path.id}-${path.tag_line.name}` ) ){
                  this.fcEventsMap.set( `${path.id}-${path.tag_line.name}`, this.fcEventsMap.get( `${path.id}-${path.tag_line.name}` ).concat( item.day ) );
                  this.fcEventsMap.set( `${path.tag_line.name}-${path.id}`, this.fcEventsMap.get( `${path.tag_line.name}-${path.id}`) + 1 );
                }else{
                  this.fcEventsMap.set( `${path.id}-${path.tag_line.name}`, [ item.day ] )
                  this.fcEventsMap.set( `${path.tag_line.name}-${path.id}`, 1 )
                }
              } )
            } )
          }
        })
      },

      selectionChange( selection ){
        this.selected = selection.map( item => item.id );
      },

      fetchPath( events ){
        util.bookAxios.get( '/plans/path/list/', {
          params: { 
            year: this.year,
            month: this.month
          }
        } ).then( response => {
          const { errcode, results } = response.data;
          if( !errcode ){
            this.paths = results;
            this.pathIds = this.paths.map( path => path.id );
            events.forEach( item => {
              this.selected.push(item.id);
              this.paths[ this.pathIds.indexOf( item.id ) ]._checked = true;
            } );

            this.selected.forEach( id => {
              this.fcEvents.forEach( item  => {
                if( id === item.id ){
                  item.cssClass = 'bg-red';
                }
              })
            } )
          }
        } )
      }
    },
  }

</script>