<template>
  <div>
    <div
      class="invitecon rel"
    >
      <div
        v-show="showSwipe"
        class="container"
      >
        <van-swipe
          indicator-color="#3f46b4"
          @change="onImgChange"
        >
          <van-swipe-item
            v-for="item in imageArr"
            :key="item"
          >
            <div class="image-container">
              <div class="image-box">
                <img
                  class="share-image"
                  :class="{shadow: imageArr.length > 1}"
                  :src="item"
                >
              </div>
            </div>
          </van-swipe-item>
        </van-swipe>
        <div
          v-if="isFromApp"
          class="btn-wrap"
          :style="{width: `${btnWidth}px`}"
        >
          <div
            class="btn"
            @click="appShare()"
          >
            <span class="btn-inside">分享好友</span>
          </div>
          <div
            class="btn"
            @click="onSave()"
          >
            <span class="btn-inside">保存图片</span>
          </div>
        </div>
        <div
          v-else
          class="action-area"
        >
          <div
            @click="onSave()"
          >
            <img
              src="../../assets/images/icon-save.png"
            >
            <span>保存图片</span>
          </div>
          <div
            id="copyId"
            :data-clipboard-text="windowLocation"
            @click="onCopy()"
          >
            <img
              src="../../assets/images/icon-copy.png"
            >
            <span>复制链接</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { DI } from 'core'
import { Toast } from 'vant'
import Clipboard from 'clipboard'
import QRCode from '@kpi/qrcode'
import addImg from './addImg'

const height = window.innerHeight

export default {
  mixins: [addImg],
  data() {
    return {
      showSwipe: true,
      windowLocation: '',
      isFromApp: DI.get('utils').isFromApp(),
      imageArr: [
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8+OnLfwAJiwPYYV850wAAAABJRU5ErkJggg=='
      ],
      imgIndex: 0,
      inviteCode: '',
      qrcodestr: '',
      btnWidth: Math.round(height * 0.7 * 750 / 1440),
      init: false
    }
  },
  computed: {
    account() {
      return DI.get('auth').getUser()
    },
    formatedMobile() {
      return DI.get('filters')
        .formatMobile(this.account.identity.split('-')[1])
    },
    imageTextMobile() {
      return `用户${this.formatedMobile}`
    }
  },
  watch: {
    account: {
      immediate: true,
      handler(val) {
        if (!this.inviteCode && val.invite_code) {
          setTimeout(this.generageQrCode, 300)
        }
      }
    }
  },
  mounted() {
    DI.get('utils').setTitle(this.$t('inviteFriend'))
    DI.get('vue').$emit('hide-pad')
    DI.get('utils').setBody('bacgray')
    DI.get('utils').setBackAction(() => {
      this.showSwipe = false
      this.$router.go(-1)
    })
  },
  methods: {
    generageQrCode() {
      const urlArr = window.location.href.split("/")
      let domainUrl = urlArr[0] + "//" + urlArr[2]
      if (this.isFromApp) domainUrl = 'https://abtc.one'
      this.inviteCode = this.account.invite_code.toUpperCase()
      this.windowLocation = `${domainUrl}/#/landingA?inviteCode=${this.inviteCode}`
      this.qrcodestr =  new QRCode({
        size: 150,
        text: this.windowLocation
      }).toDataURL()
      this.generageShareImg()
    },
    updateImgArr(img) {
      if (this.init) {
        this.imageArr.push(img)
      } else {
        this.init = true
        this.imageArr = [img]
      }
    },
    onSave() {
      if (this.isFromApp) {
        DI.get('utils').appSaveImg(this.imageArr[this.imgIndex])
        DI.get('utils').setMixpanelEvent('share', 'app_save_poster')
      } else {
        this.$router.push({
          name: 'imgPreview',
          params: {
            img: this.imageArr[this.imgIndex]
          }
        })
        DI.get('utils').setMixpanelEvent('share', 'h5_save_poster')
      }
    },
    onCopy() {
      const clipboard = new Clipboard('#copyId')
      clipboard.on('success', () => {
        Toast(this.$t('copySuccess'))
        clipboard.destroy()
      })
      clipboard.on('error', () => {
        clipboard.destroy()
      })
    },
    onImgChange(index) {
      this.imgIndex = index
    },
    appShare() {
      // window.location = 'onebtc://share/' + this.imageArr[this.imgIndex]
      // app 原生分享 share(base64 : string)
      DI.get('utils').setMixpanelEvent('share', 'app_share_poster')
      DI.get('utils').appShareImg(this.imageArr[this.imgIndex])
    }
  }
}
</script>
<style scoped lang="less">
.van-swipe {
overflow: unset;
}
.invitecon {
  height: 100vh;
  background: #F1F2F4
}

.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .image-container {
    flex: 1;
    margin: 64px auto 0;
    overflow: hidden;
    object-fit: contain;
    .image-box {
      .share-image {
        height: 70vh;
        margin: 0 auto;
      }
      .shadow{
        box-shadow: 2px 2px 10px 0px #999
      }
    }
  }

  .btn-wrap{
    margin: 20px auto 0;
  }
  .btn {
    height: 40px;
    margin-bottom: 15px;
    background: #00C3D2;
    box-shadow: 0 10px 10px 0 rgba(0, 195, 210, 0.25);
    border-radius: 4px;
    text-align: center;

    .btn-inside {
      font-size: 16px;
      letter-spacing: 0;
      text-align: center;
      line-height: 40px;
      color: #FFF;

      img {
        display: inline-block;
        width: 16px;
        vertical-align: top;
      }
    }
  }

  .action-area {
    left:0;
    right: 0;
    bottom: 0;
    height: 25vh;
    display: flex;
    align-items: center;
    justify-content: space-around;
    text-align: center;
    img {
      width: 50%;
      margin: 0 auto;
    }
    span {
      font-size: 14px;
      line-height: 44px;
    }
  }
}

</style>
