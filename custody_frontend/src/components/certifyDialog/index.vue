<template>
  <van-dialog
    v-model="alertFlagCom"
    :show-confirm-button="false"
  >
    <div class="certify-confirm-dialog">
      <img
        v-if="dialogImg"
        :src="dialogImg"
        width="58"
      >
      <div
        v-if="dialogTitle"
        class="confirm-title"
      >
        {{ dialogTitle }}
      </div>
      <div class="confirm-content">
        <slot />
      </div>
      <button
        v-if="confirmButtonShow"
        @click="confirmClick"
      >
        {{ confirmButtonText || $t('confirm') }}
      </button>
      <button
        v-if="cancelButtonShow"
        :class="confirmButtonShow ? ['cancel-btn', 'mt20'] : ''"
        @click="cancelClick"
      >
        {{ cancelButtonText || $t('cancel') }}
      </button>
    </div>
    <img
      v-if="cancelImgShow"
      class="btn-close"
      src="../../assets/images/icon-close.png"
      width="40"
      @click="cancelClick"
    >
  </van-dialog>
</template>

<script>
export default {
  props: {
    dialogImg: {
      type: [String],
      default: ''
    },
    dialogTitle: {
      type: [String],
      default: ''
    },
    alertFlag: {
      type: [Boolean],
      default: false
    },
    confirmButtonShow: {
      type: [Boolean],
      default: false
    },
    confirmButtonText: {
      type: [String],
      default: ''
    },
    cancelButtonShow: {
      type: [Boolean],
      default: false
    },
    cancelButtonText: {
      type: [String],
      default: ''
    },
    cancelImgShow: {
      type: [Boolean],
      default: false
    }
  },
  data() {
    return {
      alertFlagCom: this.alertFlag
    }
  },
  watch: {
    alertFlag(val) {
      this.alertFlagCom = val
    }
  },
  methods: {
    confirmClick() {
      this.$emit('confirmDialog')
    },
    cancelClick() {
      this.$emit('cancelDialog')
    }
  }
}
</script>

<style scoped lang='less'>
.certify-confirm-dialog {
  padding: 30px 40px;
  img {
    margin: 0 auto;
  }
  .confirm-title {
    text-align: center;
    font-size: 16px;
    color: #000;
    margin-top: 10px;
    font-weight: bold;
  }
  .confirm-content {
    padding: 20px 0;
    font-size: 14px;
    color: #000;
    line-height: 25px;
  }
  button {
    display: block;
    width: 100%;
    outline: none;
    background-color: #00C3D2;
    height: 48px;
    line-height: 48px;
    text-align: center;
    color: #fff;
    font-size: 16px;
    border: none;
    border-radius: 5px;
  }
  .cancel-btn {
      background-color: #fff;
      color: #00C3D2;
      border: 2px solid #DDDDDD;
      border-radius: 5px;
  }
}
.van-dialog {
    overflow: visible!important;
    .btn-close {
      position: absolute;
      left: 50%;
      margin-left: -20px;
      bottom: -60px;
    }
}
</style>
