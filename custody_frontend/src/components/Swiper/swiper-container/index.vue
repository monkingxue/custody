<template>
  <div
    class="tab-container"
    @touchstart="startDrag"
    @mousedown="startDrag"
    @touchmove="onDrag"
    @mousemove="onDrag"
    @mouseup="endDrag"
    @touchend="endDrag"
  >
    <div
      ref="wrap"
      class="tab-container-wrap"
      :style="{
        width: styleWidth
      }"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.tab-container {
  overflow: hidden;
  position: relative;
}
.tab-container-wrap {
  display: flex;
}
.swipe-transition-550 {
  transition: transform 550ms ease-in-out;
}
.swipe-transition-300 {
  transition: transform 300ms ease-in-out;
}
</style>

<script>
const on = function(element, event, handler) {
  if (element && event && handler) {
    element.addEventListener(event, handler, false)
  }
}

const off = function(element, event, handler) {
  if (element && event && handler) {
    element.removeEventListener(event, handler, false)
  }
}

const once = function(el, event, fn) {
  var listener = function() {
    if (fn) {
      fn.apply(this, arguments)
    }
    off(el, event, listener)
  }
  on(el, event, listener)
}

export default {
  props: {
    value: [String, Number],
    swiperWidth: [Number],
    swipeable: Boolean,
    pad: {
      type: Number,
      default: 0
    },
    transitionTime: {
      type: Number,
      default: 550
    }
  },

  data() {
    return {
      start: { x: 0, y: 0 },
      swiping: false,
      activeItems: [],
      pageWidth: 0,
      clientWidth: 0,
      currentActive: null
    }
  },

  computed: {
    styleWidth() {
      return this.pad
        ? `${this.clientWidth - this.pad * 2}px` : 'auto'
    }
  },

  watch: {
    value(val) {
      this.currentActive = val
    },

    currentActive(val, oldValue) {
      this.$emit('input', val)
      if (!this.swipeable) return
      const lastIndex = this.$children.findIndex(
        item => item.id === (oldValue || val))
      this.swipeLeaveTransition(lastIndex)
    }
  },

  mounted() {
    this.currentActive = this.value
    if (!this.swipeable) return
    this.wrap = this.$refs.wrap
    this.windowWidth = this.wrap.clientWidth
    this.clientWidth = this.swiperWidth || this.windowWidth
    this.pageWidth = this.clientWidth - this.pad * 2
    this.limitWidth = this.pageWidth / 4
    this.pad && this.swipeMove(0)
    this.value > 1 && this.swipeLeaveTransition(this.value - 1)
  },

  methods: {
    swipeLeaveTransition(lastIndex = 0) {
      if (typeof this.index !== 'number') {
        this.index = this.$children.findIndex(
          item => item.id === this.currentActive)
        this.swipeMove(-lastIndex * this.pageWidth)
      }

      setTimeout(() => {
        this.wrap.classList.add(`swipe-transition-${this.transitionTime}`)
        this.swipeMove(-this.index * this.pageWidth, true)

        once(this.wrap, 'webkitTransitionEnd', () => {
          this.wrap.classList.remove(`swipe-transition-${this.transitionTime}`)
          // this.wrap.style.webkitTransform = ''
          this.swiping = false
          this.index = null
        })
      }, 0)
    },

    swipeMove(offset, isDrag = false) {
      this.wrap.style.webkitTransform = `translate3d(${offset + this.pad}px, 0, 0)`
      this.swiping = true
      if (isDrag) this.$emit('onDragPercent', (this.index * this.pageWidth - Math.abs(offset)) / this.pageWidth) // positive right2left / nagative left2right
    },

    startDrag(evt) {
      if (!this.swipeable) return
      evt = evt.changedTouches ? evt.changedTouches[0] : evt
      this.dragging = true
      this.start.x = evt.pageX
      this.start.y = evt.pageY
    },

    onDrag(evt) {
      if (!this.dragging) return
      let swiping
      const e = evt.changedTouches ? evt.changedTouches[0] : evt
      const offsetTop = e.pageY - this.start.y
      const offsetLeft = e.pageX - this.start.x
      const y = Math.abs(offsetTop)
      const x = Math.abs(offsetLeft)

      swiping = !(x < 5 || (x >= 5 && y >= x * 1.73))
      if (!swiping) return
      evt.preventDefault()

      let len = this.$children.length - 1
      // 当卡片宽度不到屏幕一半时， 应在倒数第二个卡片就不能再滑动了
      if (this.swiperWidth && this.swiperWidth <= (this.windowWidth * 0.5)) {
        len -= 1
      }
      const index = this.$children.findIndex(
        item => item.id === this.currentActive)
      const currentPageOffset = index * this.pageWidth
      const offset = offsetLeft - currentPageOffset
      const absOffset = Math.abs(offset)
      if (absOffset > len * this.pageWidth ||
          offset > 0) {
        this.swiping = false
        return
      }

      this.offsetLeft = offsetLeft
      this.index = index
      this.swipeMove(offset, true)
    },

    endDrag() {
      if (!this.swiping) return
      this.dragging = false
      const direction = this.offsetLeft > 0 ? -1 : 1
      const isChange = Math.abs(this.offsetLeft) > this.limitWidth

      if (isChange) {
        this.index += direction
        const child = this.$children[this.index]
        if (child) {
          this.currentActive = child.id
          return
        }
      }
      this.swipeLeaveTransition()
    }
  }
}
</script>
