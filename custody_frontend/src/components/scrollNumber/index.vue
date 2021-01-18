<template>
  <span
    ref="scroll"
    class="scroll-number"
    :class="{din: useDin}"
  >
    <template
      v-if="text"
      :style="{fontSize: `${height}px`}"
    >{{ text }}</template>
  </span>
</template>
<style>
.scroll-number {
  display: flex;
}
.number-animate {
  overflow: hidden;
  position: relative;
}
.number-animate .number-animate-dot {
  float: left;
  text-align: center;
}
.number-animate .number-animate-dom {
  text-align: center;
  float: left;
  position: relative;
  top: 0;
}
.number-animate .animated {
  transition: all 1s ease 0s;
}
.number-animate .number-animate-dom span,
.number-animate .number-animate-dot span {
  float: left;
  width: 100%;
  height: 100%;
}
</style>
<script>
import { default as Scroll }  from './scroll'
const isNumeric = (n) => !isNaN(parseFloat(n)) && isFinite(n)

export default {
  props: {
    number: {
      type: [Number, String],
      default: ""
    },
    useDin: {
      type: Boolean,
      default: true
    },
    height: {
      type: Number,
      default: 14
    },
    width: {
      type: Number,
      default: 8
    }
  },
  data() {
    return {
      text: '',
      instance: null
    }
  },
  watch: {
    number: {
      immediate: false,
      handler() {
        this.updateNumber()
      }
    }
  },
  mounted() {
    this.updateNumber()
  },
  methods: {
    updateNumber() {
      const val = this.number
      if (!isNumeric(val)) {
        this.text = val
      } else {
        this.text = ''
        if (!this.instance) {
          this.instance =  new Scroll( {
            el: this.$refs.scroll,
            num: val,
            width: this.width,
            height: this.height,
            useDin: this.useDin
          })
        } else {
          this.instance.update(val, this.$refs.scroll)
        }
      }
    }
  }
}
</script>
