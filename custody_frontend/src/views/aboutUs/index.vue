<template>
  <div class="aboutus">
    <img src="../../assets/images/share/aboutus.png">
    <div
      class="btn btn-bugcrowd"
      @click="goToBugcrowd"
    >
      &nbsp;
    </div>
    <div
      class="btn btn-download"
      @click="goToDownload"
    >
      &nbsp;
    </div>
  </div>
</template>

<script>
import { DI } from "core"
import { Message } from "components"
import fetchBlobXHR from '@kpi/u/fetchBlobXHR'
import fileToBase64 from '@kpi/u/fileToBase64'

export default {
  data() {
    return {
      isFromAndroid: DI.get("utils").isFromAndroid()
    }
  },
  computed: {
    storeSetting() {
      return DI.get("store").state.setting.setting
    }
  },
  mounted() {
    this.$nextTick(() => {
      DI.get("utils").setTitle(this.$t('me.aboutUs'))
      DI.get('utils').setBody('bacnavyblue')
      if (DI.get('utils').isFromApp()) {
        DI.get("vue").$emit("set-header-right", {
          share: true,
          action: this.appShare
        })
      }
    })
  },
  methods: {
    goToBugcrowd() {
      window.location = "https://www.bugcrowd.com/"
    },
    goToDownload() {
      DI.get('utils').goToDownloadApp(this.storeSetting)
    },
    appShare() {
      // app 原生分享 share(base64 : string)
      fetchBlobXHR(require("../../assets/images/share/aboutus.png"))
        .then(blob => fileToBase64(blob))
        .then(base64 => {
          DI.get("utils").appShareImg(base64)
        })
        .catch(Message)
    }
  }
}
</script>

<style scoped lang="less">
.aboutus {
  min-height: 100vh;
  background-color: #2b1a60;

  position: relative;
  img {
    width: 100%;
  }
  .btn {
    position: absolute;
  }
  .btn-bugcrowd {
    display: block;
    left: 7%;
    bottom: 32.8%;
    width: 86%;
    height: 50px;
  }
  .btn-download {
    display: block;
    left: 25%;
    bottom: 7.1%;
    width: 50%;
    height: 26px;
  }
}
</style>
