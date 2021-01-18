<template>
  <div
    class="tab-container"
    @touchstart="startDrag"
    @touchmove="onDrag"
    @touchend="endDrag"
  >
    <div
      ref="wrap"
      class="tab-container-wrap"
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
.swipe-transition {
  transition: transform 150ms ease-in-out;
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
    value: String,
    swipeable: Boolean,
    touchable: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      start: { x: 0, y: 0 },
      swiping: false,
      activeItems: [],
      pageWidth: 0,
      currentActive: this.value
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
        item => item.id === oldValue)
      this.swipeLeaveTransition(lastIndex)
    }
  },

  mounted() {
    if (!this.swipeable) return
    this.wrap = this.$refs.wrap
    this.pageWidth = this.wrap.clientWidth
    this.limitWidth = this.pageWidth / 4
  },

  methods: {
    swipeLeaveTransition(lastIndex = 0) {
      if (typeof this.index !== 'number') {
        this.index = this.$children.findIndex(
          item => item.id === this.currentActive)
        this.swipeMove(-lastIndex * this.pageWidth)
      }

      setTimeout(() => {
        this.wrap.classList.add('swipe-transition')
        this.swipeMove(-this.index * this.pageWidth, true)

        once(this.wrap, 'webkitTransitionEnd', () => {
          this.wrap.classList.remove('swipe-transition')
          this.wrap.style.webkitTransform = ''
          this.swiping = false
          this.index = null
        })
      }, 0)
    },

    swipeMove(offset, isDrag = false) {
      this.wrap.style.webkitTransform = `translate3d(${offset}px, 0, 0)`
      this.swiping = true
      if (isDrag) this.$emit('onDragPercent', (this.index * this.pageWidth - Math.abs(offset)) / this.pageWidth) // positive right2left / nagative left2right
    },

    startDrag(evt) {
      if (!this.swipeable) return
      if (!this.touchable) return
      evt = evt.changedTouches[0]
      this.dragging = true
      this.start.x = evt.pageX
      this.start.y = evt.pageY
    },

    onDrag(evt) {
      if (!this.touchable) return
      if (!this.dragging) return
      let swiping
      const e = evt.changedTouches[0]
      const offsetTop = e.pageY - this.start.y
      const offsetLeft = e.pageX - this.start.x
      const y = Math.abs(offsetTop)
      const x = Math.abs(offsetLeft)

      swiping = !(x < 5 || (x >= 5 && y >= x * 1.73))
      if (!swiping) return
      evt.preventDefault()

      const len = this.$children.length - 1
      const index = this.$children.findIndex(
        item => item.id === this.currentActive)
      const currentPageOffset = index * this.pageWidth
      const offset = offsetLeft - currentPageOffset
      const absOffset = Math.abs(offset)

      if (absOffset > len * this.pageWidth ||
          (offset > 0 && offset < this.pageWidth)) {
        this.swiping = false
        return
      }

      this.offsetLeft = offsetLeft
      this.index = index
      this.swipeMove(offset, true)
    },

    endDrag() {
      if (!this.touchable) return
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
