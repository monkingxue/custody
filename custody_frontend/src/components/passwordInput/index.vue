<template>
  <div
    class="password-input"
    :class="{
      hide: hidePass,
      redActive: redActive,
      yellowActive: yellowActive
    }"
  >
    <span :class="{active: getActive(0)}">{{ getDisplayCode(0) }}</span>
    <span :class="{active: getActive(1)}">{{ getDisplayCode(1) }}</span>
    <span :class="{active: getActive(2)}">{{ getDisplayCode(2) }}</span>
    <span :class="{active: getActive(3)}">{{ getDisplayCode(3) }}</span>
    <span :class="{active: getActive(4)}">{{ getDisplayCode(4) }}</span>
    <span :class="{active: getActive(5)}">{{ getDisplayCode(5) }}</span>
    <input
      ref="passInput"
      v-model="code"
      type="number"
      maxlength="6"
      @focus="onFocus"
      @blur="onBlur"
    >
  </div>
</template>

<style scoped lang="less">
.password-input{
    position: relative;
  text-align: left;
  display: flex;
  justify-content: space-between;
  &.hide {
    > span {
    line-height: 50px;
    }
  }
  &.redActive .active {
    border-color: #EC4A4A;
  }
  &.yellowActive .active {
    border-color: #D6AF74;
  }
  .active {
    border: 1px solid #00C3D2;
  }
  > span {
    border: 1px solid #DDDDDD;
    width: 40px;
    height: 40px;
    margin-left: .5rem;
    text-align: center;
    vertical-align: middle;
    box-shadow: 0 2px 2px 0 #eee;
    font-size: 26px;
    line-height: 40px;
    &:first-child{
      margin-left: 0;
    }
  }
  > input {
    position: absolute;
    width: 300%;
    margin-left: -200%;
    color: #fff;
    opacity: 0;
    left: 0;
    height: 100%;
    font-size: 100px;
  }
}
</style>

<script>
export default {
  props: {
    hidePass: {
      type: Boolean,
      default: false
    },
    yellowActive: {
      type: Boolean,
      default: false
    },
    redActive: {
      type: Boolean,
      default: false
    },
    autoFocus: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      code: ''
    }
  },
  watch: {
    code: {
      handler(val) {
        let co = val
        if (co && co.length > 6) {
          co = co.slice(0, 6)
          this.code = co
        }
        this.$emit('onChange', co)
      }
    }
  },
  mounted() {
    if (this.autoFocus) {
      this.$nextTick(() => {
        this.$refs.passInput.focus()
      })
    }
  },
  methods: {
    onFocus(e) {
      this.$emit('onFocus', e)
    },
    onBlur(e) {
      this.$emit('onBlur', e)
    },
    clear() {
      this.code = ""
    },
    getActive(index) {
      const count = this.code.length
      return count === index
    },
    getDisplayCode(index) {
      const displayCode = this.code[index]
      return displayCode ? (this.hidePass ? '*' : displayCode) : ''
    }
  }
}
</script>
