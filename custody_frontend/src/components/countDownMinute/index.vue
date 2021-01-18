<template>
  <span
    v-if="minute"
  >
    {{ minute }}:{{ second }}
  </span>
</template>

<script>
const formatNum = (n) => {
  return n < 10 ? '0' + n : '' + n
}
export default {
  props: {
    time: {
      type: Number,
      default: 60 * 15
    }
  },
  data() {
    return {
      minutes: 0,
      seconds: 0,
      timmerId: null
    }
  },
  computed: {
    second() {
      return formatNum(this.seconds)
    },
    minute() {
      return formatNum(this.minutes)
    }
  },
  watch: {
    time: {
      immediate: true,
      handler(val, oldVal) {
        if (val !== oldVal && val > 0) {
          this.minutes = Math.floor(val / 60)
          this.seconds = val % 60
          clearInterval(this.timmerId)
          this.timer()
        }
      }
    }
  },
  methods: {
    timer() {
      this.timmerId = window.setInterval( () =>{
        if (this.seconds == '00' && this.minutes != '00') {
          this.seconds = 59
          this.minutes -= 1
        }else if(this.minutes == '00' && this.seconds == '00'){
          this.seconds = 0
          clearInterval(this.timmerId)
        }else{
          this.seconds -= 1
        }

      },1000)
    }
  }
}
</script>
