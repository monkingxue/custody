<template>
  <div>
    <div
      class="invitecon rel"
    >
      <div
        v-show="showSwipe"
        class="abs container"
      >
        <van-swipe
          indicator-color="#3f46b4"
          @change="onImgChange"
        >
          <van-swipe-item
            v-for="(item, index) in imageArr"
            :key="index"
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
        <div class="share-btn">
          <van-button
            size="large"
            class="red-btn"
            round
            @click="onShare"
          >
            <span>分享好友</span>
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { DI } from 'core'
import QRCode from '@kpi/qrcode'
import addImg from './addImg'
import { Message, Indicator } from 'components'

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
      qrcodestr: '',
      init: false,
      redInfo: {},
      twoKeyReady: []
    }
  },
  computed: {
    account() {
      return DI.get('auth').getUser()
    }
  },
  watch: {
    twoKeyReady(val) {
      if (val && val.length >= 2) {
        this.generageQrCode()
      }
    },
    account: {
      immediate: true,
      handler(val) {
        if (val.invite_code) {
          this.twoKeyReady.push('userInfo')
        }
      }
    },
    'redInfo.identifier': {
      immediate: true,
      handler(val) {
        if (val) {
          this.redInfo.extra = JSON.parse(this.redInfo.extra)
          this.twoKeyReady.push('redInfo')
        }
      }
    }
  },
  mounted() {
    DI.get('utils').setTitle('分享页面')
    DI.get('vue').$emit('hide-pad')
    DI.get('utils').setBody('bacgray')
    DI.get('utils').setBackAction(() => {
      this.showSwipe = false
      this.$router.go(-1)
    })
    const { query, params } = this.$route
    if (params.redInfo) {
      this.redInfo = params.redInfo
    } else if (query.id) {
      this.getRedInfoById(query.id)
    }
  },
  methods: {
    getRedInfoById(id) {
      Indicator.open(this.$t('loading'))
      DI.get('marketHttp')
        .getRedPacketById(id)
        .then((res) => {
          this.redInfo = res
        })
        .catch(Message)
        .then(() => {
          Indicator.close()
        })
    },
    generageQrCode() {
      const { identifier } = this.redInfo
      const { redTarget } = this.redInfo.extra
      const amount = this.redInfo.cny_amount
      const inviteCode = this.account.invite_code
      const urlArr = window.location.href.split("/")
      let domainUrl = urlArr[0] + "//" + urlArr[2]
      if (this.isFromApp) domainUrl = 'https://abtc.one'
      this.windowLocation = `${domainUrl}/#/landingRed?redCode=${identifier}&target=${redTarget}&amount=${amount}&inviteCode=${inviteCode}`
      this.qrcodestr =  new QRCode({
        size: 100,
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
      this.$router.push({
        name: 'imgPreview',
        params: {
          img: this.imageArr[this.imgIndex]
        }
      })
      DI.get('utils').setMixpanelEvent('share', 'h5_save_poster')
    },
    onImgChange(index) {
      this.imgIndex = index
    },
    appShare() {
      // window.location = 'onebtc://share/' + this.imageArr[this.imgIndex]
      // app 原生分享 share(base64 : string)
      DI.get('utils').setMixpanelEvent('share', 'app_share_poster')
      DI.get('utils').appShareImg(this.imageArr[this.imgIndex])
    },
    onShare() {
      if (this.isFromApp) {
        this.appShare()
      } else {
        this.onSave()
      }
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
  .image-container {
    flex: 1;
    margin: 60px auto 0 auto;
    overflow: hidden;
    object-fit: contain;
    .image-box {
      padding-bottom: 10px;
      .share-image {
        height: 70vh;
        margin: 10px auto 0;
      }
      .shadow{
        box-shadow: 2px 2px 10px 0px #999
      }
    }
  }

  .share-btn{
    margin: 30px 30px 0;
  }
}

</style>
