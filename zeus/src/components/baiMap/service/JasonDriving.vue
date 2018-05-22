<template>
</template>
<script>
  import {createPoint, createAllPoint } from "@/components/baiMap/base/factory";
  import bindEvents from '@/components/baiMap/base/bindEvent.js'
  import commonMixin from '@/components/baiMap/base/mixins/common';

  export default {
    name: 'jason-driving',
    mixins: [commonMixin('overlay')],
    props: {
      startPoint: {
        type: Object,
      },
      points: {
        type: Array
      },
      policy: {
        type: String,
        default: 'BMAP_DRIVING_POLICY_AVOID_HIGHWAYS'
      },
      enableDragging: {
        type: Boolean,
        default: false
      },
      autoViewport: {
        type: Boolean,
        default: true
      },
      color: {
        type: String,
        default: '#fff'
      },
      planData: {
        type: Object
      },
      shopsIndex: {
        type: Number
      },
    },
    watch: {
      points( vo, v1 ){
        this.reload();
      },
    },
    methods: {
      load () {
        const self = this;
        const {BMap, map, startPoint, points, policy, autoViewport, enableDragging, shopsIndex, color } = this;
        const driving = new BMap.DrivingRoute( map, 
          {
            renderOptions: {
              map,
              autoViewport,
              enableDragging
            },

            policy,
            onSearchComplete( e ){
              self.$emit( 'on-search-complete', e, driving, shopsIndex );
            },

            onPolylinesSet( e ){
              self.$emit( 'on-poly-lines-set', e, color );
            },

            onMarkersSet( e ){
              self.$emit( 'on-markers-set', e, color );
            },

            onInfoHtmlSet( e ){
              self.$emit( 'on-info-html-set', e );
            },

            onResultsHtmlSet( e ){
              self.$emit( 'on-results-html-set', e );
            }
          }
        );

        let end, waypoints = [];
        let start = createPoint( BMap, startPoint );
         
        points.forEach(( item, index, arr ) => {
          if( index === arr.length - 1 ){
            end = item.location;
          }else{
            waypoints.push( item.location )
          }
        })
    
        points.length > 0 && driving &&
        driving.search( start, end,{ waypoints } );
      }
    }
  }
</script>