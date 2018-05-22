<template>
  <div>
    <slot></slot>
  </div>
</template>
<script>
  import {createPoint, createAllPoint } from "@/components/baiMap/base/factory";
  import bindEvents from '@/components/baiMap/base/bindEvent.js'
  import commonMixin from '@/components/baiMap/base/mixins/common';

  export default {
    name: 'jason-geocoder',
    mixins: [commonMixin('overlay')],
    props: {
      lineAddress: {
        type: Array
      }, //[ { name: '门店名', address: '门店地址' } ]
      points: {
        type: Array
      },
      start: {
        type: String
      }
    },
    watch: {
      lineAddress(){
        this.reload();
      },
      points(){
        this.reload();
      },
    },
    methods: {
      load () {
        const self = this;
        const {BMap, map, lineAddress, points } = this;
        const myGeo = new BMap.Geocoder();

        let geoPoints = [];

        lineAddress.forEach( item => {
          myGeo.getPoint( item.address, point => {
            if( point ){
              geoPoints.push( { 
                name: item.name, 
                location: point, 
                address: item.address,
                linesIndex: item.linesIndex,
                icon: item.icon
              });
              
              if( geoPoints.length === lineAddress.length ){
                self.$emit( 'get-points', geoPoints );
              }
            }
          } )
        } )
      }
    }
  }
</script>