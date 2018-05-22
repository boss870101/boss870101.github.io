<template>
  <div class="full-calendar-header">
    <div class="header-center">
      <span class="prev-month" @click.stop="goPrev"><Icon type="chevron-left"></Icon></span>
      <span class="title">{{title}}</span>
      <span class="next-month" @click.stop="goNext"><Icon type="chevron-right"></Icon></span>
    </div>
  </div>
</template>
<script type="text/babel">
  import dateFunc from './dateFunc'
  import moment from 'moment';

  export default {
    props : {
      currentMonth : {},
      titleFormat  : {},
      firstDay     : {},
      monthNames   : {},
      locale       : {}
    },
    data () {
      return {
      }
    },
    computed: {
      title () {
        if (!this.currentMonth) return;
        return this.currentMonth.locale(this.locale).format('YYYY 年 MM 月')
      }
    },
    methods : {
      goPrev () {
        var newMonth = moment(this.currentMonth).subtract(1, 'months').startOf('month');
        this.$emit('change', newMonth);
      },
      goNext () {
        var newMonth = moment(this.currentMonth).add(1, 'months').startOf('month');
        this.$emit('change', newMonth);
      }
    }
  }
</script>
<style scoped>
.full-calendar-header{
  display: flex;
  align-items: center;
}
.full-calendar-header .header-left,
.full-calendar-header .header-right{
  flex:1;
}

.full-calendar-header .header-center{
  line-height: 30px;
  font-size: 22px;
  flex:3;
  text-align:center;
}

.full-calendar-header .header-center .title{
  margin: 0 10px;
}
.full-calendar-header .header-center .title .prev-month,.next-month{
  cursor: pointer;
}

.full-calendar-header .header-center .title .prev-month:hover,.next-month:hover{
  color: #4092ff;
}
</style>
