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
  name: 'bm-marker',
  mixins: [commonMixin('overlay')],
  props: {
    position: {},
    offset: {},
    icon: {},
    points: {
      type: Array
    },
    massClear: {
      type: Boolean,
      default: true
    },
    dragging: {
      type: Boolean,
      default: false
    },
    clicking: {
      type: Boolean,
      default: true
    },
    raiseOnDrag: {
      type: Boolean,
      default: false
    },
    draggingCursor: {
      type: String
    },
    rotation: {
      type: Number
    },
    shadow: {
      type: Object
    },
    title: {
      type: String
    },
    label: {
      type: Object
    },
    animation: {
      type: String
    },
    top: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    position (val, oldVal) {
      this.reload()
    },
    // 'position.lat' (val, oldVal) {
    //   console.log("val lat", val)
    //   this.reload()
    // },
    // 'offset.width' (val, oldVal) {
    //   console.log("val width", val)
    //   const {BMap, originInstance} = this
    //   const width = parseFloat(val)
    //   if (val.toString() !== oldVal.toString()) {
    //     originInstance.setOffset(new BMap.Size(width, this.offset.height))
    //   }
    // },
    // 'offset.height' (val, oldVal) {
    //   console.log("val height", val)
    //   const {BMap, originInstance} = this
    //   const height = parseFloat(val)
    //   if (val.toString() !== oldVal.toString()) {
    //     originInstance.setOffset(new BMap.Size(this.offset.width, height))
    //   }
    // },
    icon: {
      deep: true,
      handler (val) {
        const {BMap} = this
        this.originInstance.setIcon(createIcon(BMap, val))
      }
    },
    massClear (val) {
      val ? this.originInstance.enableMassClear() : this.originInstance.disableMassClear()
    },
    dragging (val) {
      val ? this.originInstance.enableDragging() : this.originInstance.disableDragging()
    },
    clicking () {
      this.reload()
    },
    raiseOnDrag () {
      this.reload()
    },
    draggingCursor (val) {
      this.setDraggingCursor(val)
    },
    rotation (val) {
      this.setRotation(val)
    },
    shadow (val) {
      this.setShadow(val)
    },
    title (val) {
      console.log("val title", val)
      this.setTitle(val)
    },
    // label (val) {
    //   console.log("val label", val)
    //   this.reload()
    // },
    animation (val) {
      this.setAnimation(global[val])
    },
    top (val) {
      this.originInstance.setTop(val)
    },
    points(){
      console.log("val points", val)
      this.reload();
    }
  },
  methods: {
    load () {
      const {BMap, map, points, position, offset, icon, massClear, dragging, clicking, raiseOnDrag, draggingCursor, rotation, shadow, title, label, animation, top } = this
      const overlay = new BMap.Marker(new BMap.Point(position.lng, position.lat), {
        offset,
        icon: icon && createIcon(BMap, icon),
        enableMassClear: massClear,
        enableDragging: dragging,
        enableClicking: clicking,
        raiseOnDrag,
        draggingCursor,
        rotation,
        shadow,
        title
      })
      this.originInstance = overlay
      label && overlay && overlay.setLabel(createLabel(BMap, label))
      overlay.setTop(top)
      bindEvents.call(this, overlay)
      map.addOverlay(overlay)
      overlay.setAnimation(global[animation])
    }
  }
}
</script>
