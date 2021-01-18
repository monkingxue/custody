<template>
  <div class="popup">
    <van-popup
      v-model="dialogFlag"
      position="bottom"
      :overlay="false"
      transition="fadeLight"
      :duration="0"
      :overlay-style="{
        width: '100.5%'
      }"
    >
      <div class="container">
        <HeaderCommon
          :left="{action: onHeaderBack}"
          :title="headerTitle"
          :background-class="headerColor"
        />
        <slot />
      </div>
    </van-popup>
  </div>
</template>
<script>
import { HeaderCommon } from '../index'
export default {
  components: {
    HeaderCommon
  },
  props: {
    headerTitle: String,
    headerColor: String
  },
  data() {
    return {
      dialogFlag: false
    }
  },
  methods: {
    onHeaderBack() {
      this.onClose()
    },
    onOpen() {
      this.dialogFlag = true
    },
    onClose() {
      this.dialogFlag = false
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="less">
.popup {
  /deep/ .van-popup--bottom {
    width: 100.5%;
  }
  .container {
    height: 100vh;
    width: 100%;
  }

}
</style>
<style>
.fadeLight-enter-active, .fadeLight-leave-active {
  transition: opacity .001s ease-in-out;
}
.fadeLight-enter, .fadeLight-leave-to {
  opacity: .8;
}
</style>
