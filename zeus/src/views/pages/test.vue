<style scoped>
</style>
<template>
  <popup @dayClick="dayClick"></popup>
</template>
<script>
  import popup from "../../components/Popup";
  export default {
    components: {
      popup,
    },
    data(){
      return {

      }
    },

    methods: {
      dayClick( day, jsEvent, events ){
        console.log("day, jsEvent, events", day, jsEvent, events)
      }
    }
  }
</script>