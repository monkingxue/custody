<template>
  <div v-if="visible">
    <div class="dialog-wrapper">
      <div class="dialog">
        <div class="main">
          <div class="icon">
            <img src="../../assets/images/icon-logout.png">
          </div>
          <div class="content">
            {{ $t('me.confirmLogout') }}
          </div>
          <van-button
            size="large"
            round
            class="orange-btn"
          >
            {{ $t('confirm') }}
          </van-button>
          <van-button
            size="large"
            round
            class="cancel-btn bold mt20"
          >
            {{ $t('cancel') }}
          </van-button>
        </div>
        <div class="bot-cancel">
          <img src="./cancel.png">
        </div>
      </div>
    </div>
    <black-mask />
  </div>
</template>
<script>
import Mask from '../mask'

export default {
  components: {
    'black-mask': Mask
  },
  props: {
    text: String
  },
  data() {
    return {
      visible: false
    }
  }
}
</script>
<style lang="less">
  .dialog-wrapper {
    top: 50%;
    left: 50%;
    position: fixed;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    box-sizing: border-box;
    text-align: center;
    z-index: 100;
  }

  .dialog {
    .main {
      width: 65vw;
      background: #FFF;
      padding: 40px 30px;
      .icon img{
        margin: 0 auto;
        width: 80px;
      }
      .title {
        font-size: 20px;
        font-weight: bold;
        margin: 20px 0 10px;
      }
      .content {
        font-size: 16px;
        margin: 20px 0;
      }
      .cancel-btn {
        height:46px;
        border:1px solid #ddd!important;
        color:#00C3D2!important;
        border-radius: 4px;
      }
    }
    .bot-cancel img{
      margin: 0 auto;
      width: 50px;
      margin-top: 30px;
    }
  }

</style>
