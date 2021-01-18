<template>
  <div>
    <van-dialog
      v-model="dialogFlag"
      class="dialog-wrap"
      :show-confirm-button="false"
    >
      <div class="dialog-box">
        <div
          v-if="title"
          class="dialog-title"
        >
          {{ title }}
        </div>
        <div class="dialog-content">
          <slot />
        </div>
        <van-button
          v-if="!hideBtn"
          size="large"
          class="bold"
          :class="btnClass"
          @click="onConfirm"
        >
          {{ $t(btnText) }}
        </van-button>
      </div>
      <img
        class="btn-close img-btn-dark"
        src="../../assets/images/icon-close.png"
        width="40"
        @click="onClose"
      >
    </van-dialog>
  </div>
</template>

<style scoped lang="less">
.dialog-wrap {
  &.van-dialog {
    overflow: visible;
    width: 80%;
  }
  .btn-close {
    position: absolute;
    left: 50%;
    margin-left: -20px;
    bottom: -100px;
  }

  .dialog-box {
    padding: 40px 30px;
    .dialog-title {
      text-align: center;
      font-size: 16px;
      color: #000;
      font-weight: bold;
      padding-bottom: 10px;
    }
    .dialog-content {
      padding: 10px 0;
      font-size: 12px;
      line-height: 20px;
    }
  }
}
</style>

<script>
export default {
  props: {
    title: String,
    btnClass: {
      type: String,
      default: 'orange-btn'
    },
    btnText: {
      type: String,
      default: 'confirm'
    },
    hideBtn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogFlag: false
    }
  },
  methods: {
    onOpen() {
      this.dialogFlag = true
    },
    onConfirm() {
      this.dialogFlag = false
      this.$emit('confirm')
    },
    onClose() {
      this.dialogFlag = false
      this.$emit('close')
    }
  }
}
</script>
