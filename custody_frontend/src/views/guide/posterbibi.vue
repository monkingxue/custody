<template>
  <div class="guide-bibi">
    <img src="../../assets/images/share/bibiposter.png">
    <div class="sectionBtn">
      <img src="../../assets/images/guide/poster-bibi-btn.png">
      <span @click="toPair">&nbsp;</span>
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
    return {}
  },
  mounted() {
    this.$nextTick(() => {
      DI.get("utils").setTitle("币币聚合交易")
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
    toPair() {
      this.$router.push({
        name: "chart",
        params: {
          symbol: "BTC_USDT"
        },
        query: {
          from: "home"
        }
      })
    },
    appShare() {
      // app 原生分享 share(base64 : string)
      fetchBlobXHR(require("../../assets/images/share/bibiposter.png"))
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
.guide-bibi {
  min-height: 100vh;
  background-color: #2b1a60;
  padding-bottom: 50px;

  img {
    width: 100%;
  }

  .sectionBtn {
    position: relative;
    margin-top: 20px;
    span {
      position: absolute;
      display: block;
      left: 10%;
      top: 0;
      width: 80%;
      height: 76%;
    }
  }
}
</style>
