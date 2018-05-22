<template>
  <div class="comp-full-calendar">
    <!-- header pick month -->
    <fc-header :current-month="currentMonth"
      :first-day="firstDay"
      :locale="locale"
      @change="emitChangeMonth">
    </fc-header>

    <!-- body display date day and events -->
    <div class="full-calendar-body" ref="dates">
      <div class="weeks">
        <strong class="week" v-for="dayIndex in 7">{{ (dayIndex - 1) | localeWeekDay(firstDay, locale) }}</strong>
      </div>
      <div class="week-row" v-for="week in currentDates">
        <div class="day-cell" v-for="day in week" track-by="$index"
             :class="{'today': day.isToday,
          'not-cur-month': !day.isCurMonth}" @click.stop="dayClick(day, $event, day.events)">
          <p class="day-number">{{day.monthDay}}</p>
          <div class="event-box">
            <event-card :event="event" :date="day.date" :firstDay="firstDay" v-for="event in day.events" :key="event.day">
              <template scope="p">
                <slot name="fc-event-card" :event="p.event">{{p.event.name}}</slot>
              </template>
            </event-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
  import dateFunc from './fullCalendar/dateFunc'
  import moment from 'moment';
  import EventCard from './fullCalendar/eventCard';
  import fcHeader from "./fullCalendar/header";

  export default {
    props : {
      events : { // events will be displayed on calendar
        type : Array,
        default : []
      },
      locale : {
        type : String,
        default : 'zh-cn'
      },
      firstDay : {
        type : Number | String,
        validator (val) {
          let res = parseInt(val);
          return res >= 0 && res <= 6
        },
        default : 0
      }
    },
    components : {
      EventCard,
      fcHeader,
    },
    mounted () {
      this.emitChangeMonth(this.currentMonth);
    },
    data () {
      return {
        currentMonth : moment().startOf('month'),
        isLismit : true,
        eventLimit : 3,
        showMore : false,
        selectDay : {}
      }
    },
    computed: {
      currentDates () {
        return this.getCalendar()
      }
    },
    methods : {
      emitChangeMonth (firstDayOfMonth) {
        this.currentMonth = firstDayOfMonth;

        let start = dateFunc.getMonthViewStartDate(firstDayOfMonth, this.firstDay);
        let end = dateFunc.getMonthViewEndDate(firstDayOfMonth, this.firstDay);

        this.$emit('changeMonth', start, end, firstDayOfMonth)
      },
      moreTitle (date) {
        if (!date) return '';
        return moment(date).format('ll');
      },
      getCalendar () {
        // calculate 2d-array of each month
        let monthViewStartDate = dateFunc.getMonthViewStartDate(this.currentMonth, this.firstDay);
        let calendar = [];

        for(let perWeek = 0 ; perWeek < 6 ; perWeek++) {
          let week = [];

          for(let perDay = 0 ; perDay < 7 ; perDay++) {
            week.push({
              monthDay : monthViewStartDate.date(),
              isToday : monthViewStartDate.isSame(moment(), 'day'),
              isCurMonth : monthViewStartDate.isSame(this.currentMonth, 'month'),
              weekDay : perDay,
              date : moment(monthViewStartDate),
              events : this.slotEvents(monthViewStartDate)
            });

            monthViewStartDate.add(1, 'day');
          }

          calendar.push(week);
        }

        return calendar
      },
      slotEvents (date) {

        // find all events start from this date
        let cellIndexArr = [];
        let thisDayEvents = this.events.filter( item => {
          let st = moment(item.day);
          let ed = moment(item.end ? item.end : st);

          return date.isBetween(st, ed, null, '[]');
        });

        return thisDayEvents
      },
  
      dayClick(day, jsEvent, events) {
        if( !day.isCurMonth ){
          return;
        }
        this.$emit('dayClick', day, jsEvent, events)
      },
    },
    filters: {
      localeWeekDay (weekday, firstDay, locale) {
        firstDay = parseInt(firstDay);
        const localMoment = moment().locale(locale);
        return localMoment.localeData().weekdaysShort()[(weekday + firstDay) % 7];
      }
    }
  }
  
</script>

<style scoped>
  .comp-full-calendar{
    font-family: "elvetica neue", tahoma, "hiragino sans gb";
    padding:20px;
    background: #fff;
    width: 100%;
  }

  .comp-full-calendar ul,p{
    margin:0;
    padding:0;
  }

  .full-calendar-body{
    margin-top: 20px;
    display: table;
    width: 100%;
  }
  
  .full-calendar-body .weeks{
    display: table-row;
  }

  .full-calendar-body .weeks .week{
    display: table-cell;
    width: 14.285714286%;
    line-height: 2;
    text-align: center;
    border: 1px solid #e0e0e0;
  }

  .full-calendar-body .week-row{
    border: 1px solid #e0e0e0;
    display: table-row;
  }

  .full-calendar-body .week-row .day-cell{
    display: table-cell;
    width: 14.285714286%;
    padding:4px;
    height: 132px;
    border: 1px solid #e0e0e0;
  }

  .full-calendar-body .week-row .day-cell .day-number{
    text-align: right;
  }

       /*  &.today{
          background-color:#fcf8e3;
        }

        &.not-cur-month{
          .day-number{
            color:rgba(0,0,0,.24);
          }
        } */

  .full-calendar-body .week-row .day-cell .event-box .event-item{
    cursor: pointer;
    font-size:12px;
    background-color:#C7E6FD;
    margin-bottom:2px;
    color: rgba(0,0,0,.87);
    padding:0 0 0 4px;
    height: 18px;
    line-height: 18px;
    white-space: nowrap;
    border-radius: 2px;
    // overflow: hidden;
    text-overflow: ellipsis;
  }

  .full-calendar-body .week-row .day-cell .event-box .event-item  .is-start{
    border-radius : 3px;
    pointer-events: none;
  }

           /*  &.bg-red{
              background-color: #f15533;
            }

            &.is-end{
               margin-right: 4px;
            }

            &.is-opacity{
              opacity: 1;
              pointer-events: none;
            } */

  .full-calendar-body .week-row .day-cell .event-box .event-item .dates-events{
    position: relative;
    width: 100%;
  }

  .full-calendar-body .week-row .day-cell .event-box .event-item .dates-events .events-week{
    display: inline-block;
  }

  .full-calendar-body .week-row .day-cell .event-box .event-item .dates-events .events-week .events-day{
    cursor: pointer;
    flex:1;
    text-overflow: ellipsis;
  }

  .full-calendar-body .week-row .day-cell .event-box .event-item .dates-events .events-week .day-number{
    text-align: right;
    padding:4px 5px 4px 4px;
    opacity: 0;
  }

  .full-calendar-body .week-row .day-cell .event-box .event-item .more-events{
    position:absolute;
    width: 150px;
    z-index: 2;
    border:1px solid #eee;
    box-shadow: 0 2px 6px rgba(0,0,0,.15);
  }

  .full-calendar-body .week-row .day-cell .event-box .event-item .more-events .more-header{
    background-color:#eee;
    padding:5px;
    display: flex;
    align-items : center;
    font-size: 14px;
  }

  .full-calendar-body .week-row .day-cell .event-box .event-item .more-events .more-header .title{
    flex:1;
  }

  .full-calendar-body .week-row .day-cell .event-box .event-item .more-events .more-header .close{
    margin-right: 2px;
    cursor: pointer;
    font-size: 16px;
  }

  .full-calendar-body .week-row .day-cell .event-box .event-item .more-events .more-body{
    height: 146px;
    overflow: hidden;
  }

  .full-calendar-body .week-row .day-cell .event-box .event-item .more-events .more-body .body-list{
    height: 144px;
    padding:5px;
    overflow: auto;
    background-color:#fff;
  }

  .full-calendar-body .week-row .day-cell .event-box .event-item .more-events .more-body .body-list .body-item{
    cursor: pointer;
    font-size:12px;
    background-color:#C7E6FD;
    margin-bottom:2px;
    color: rgba(0,0,0,.87);
    padding:0 0 0 4px;
    height: 18px;
    line-height: 18px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

</style>