<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import commonMixin from '@/components/baiMap/base/mixins/common.js'
import bindEvents from '@/components/baiMap/base/bindEvent.js'
import {createLabel, createIcon} from '@/components/baiMap/base/factory.js'

export default {
  name: 'jason-marker',
  mixins: [commonMixin('overlay')],
  props: {
    points: {
      type: Array,
      default: [ { name: '', loaction: { lng: 1, lat: 1 } } ]
    },
    opts: {
      type: Object
    },

    contents: {
      type: Array
    }
  },
  watch: {
    points(val, oldVal) {
      this.reload()
    },
    opts(){
      this.reload()
    },
    contents( val, oldVal ){
      this.deletePoint( val )
    }
  },
  methods: {
    load () {
      const {BMap, map, points, opts } = this;

      points.forEach( item => {
        const overlay = new BMap.Marker( item.location );
        map.addOverlay( overlay );
    
        overlay.setLabel(createLabel(BMap, { content: item.name, opts,  } ))
        overlay.enableMassClear()
      } )

      this.deletePoint = contents => {
        var allOverlay = map.getOverlays();
        for (var i = 0; i < allOverlay.length -1; i++){
          if( allOverlay[i].getLabel ){
            if( contents.indexOf( allOverlay[i].getLabel().text ) ){
              console.log("allOverlay[i].getLabel()",allOverlay[i].getLabel() )
            }
          }
        }
      }



      // const overlay = new BMap.Marker(new BMap.Point(position.lng, position.lat), {
      //   offset,
      //   icon: icon && createIcon(BMap, icon),
      //   enableMassClear: massClear,
      //   enableDragging: dragging,
      //   enableClicking: clicking,
      //   raiseOnDrag,
      //   draggingCursor,
      //   rotation,
      //   shadow,
      //   title
      // })
    //   this.originInstance = overlay
    //   label && overlay && overlay.setLabel(createLabel(BMap, label))
    //   overlay.setTop(top)
    //   bindEvents.call(this, overlay)
    //   map.addOverlay(overlay)
    //   overlay.setAnimation(global[animation])
    }
  }
}
</script>
