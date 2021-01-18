<template>
  <span
    class="font14 bold"
    @click="onClick"
  >
    <span
      v-if="!isCounting"
      :class="[disabled ? 'graycolor' : activeClass]"
      class="touch-opacity"
    >
      {{ $t('login.getSmsCode') }}
    </span>
    <span
      v-else
      class="graycolor"
    >
      {{ $t('login.resendSmsAfter', { time: displayTimer }) }}
    </span>
  </span>
</template>

<style scoped>
.redcolor {
  color: #EC4A4A
}
</style>

<script>
const countSeconds = 60
export default {
  props: {
    disabled: {
      type: Boolean,
      default: true
    },
    redActive: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isCounting: false,
      timeoutStamp: 0,
      displayTimer: countSeconds
    }
  },
  computed: {
    activeClass() {
      if (this.redActive) return 'redcolor'
      return 'orangecolor'
    }
  },
  methods: {
    onClick() {
      if (this.disabled || this.isCounting) {
        return
      }
      this.isCounting = true
      this.startTimer()
      this.$emit('click')
    },
    startTimer() {
      this.timeoutStamp = new Date().getTime() + countSeconds * 1000

      const timeoutFn = () => {
        setTimeout(() => {
          if (this.timeoutStamp - new Date() <= 0) {
            // invalidate
            this.isCounting = false
            this.displayTimer = countSeconds
            return
          }
          this.displayTimer = Math.round((this.timeoutStamp - new Date().getTime()) / 1000)
          timeoutFn()
        }, 1000)
      }

      timeoutFn()
    }
  }
}
</script>
