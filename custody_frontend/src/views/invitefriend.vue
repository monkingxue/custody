<template>
  <div>
    <div
      class="invitecon rel"
      @click="share()"
    >
      <div class="abs background">
        <img
          src="../assets/images/invite-bg.png"
        >
      </div>
      <div class="abs title">
        <img
          src="../assets/images/invite-title.png"
        >
      </div>
      <div class="abs ewmcode">
        <img
          src="../assets/images/code.png"
          width="100"
        >
      </div>
      <div class="abs slogan">
        <p>下载 APP</p>
        <p>购买你的第一枚比特币</p>
      </div>
    </div>
  </div>
</template>
<script>
import { DI } from 'core'
export default {
  mounted() {
    DI.get('utils').setTitle(this.$t('invitefriend'))
    DI.get('vue').$emit('hide-pad')
  },
  methods: {
    share() {
      if (DI.get('utils').isFromApp()) {
        window.location = 'onebtc://share'
      }
    }
  }
}
</script>
<style scoped lang="less">
.invitecon {
  height: 100vh;
  background: #F2F8FF
}
.title {
  width: 100%;
  top: 15%;
  img {
    width: 75%;
    margin: 0 auto;
  }
}
.background {
  width: 100%;
  top: 55%;
}
.ewmcode{
  bottom:5%;
  left:7%;
}
.slogan {
bottom:5%;
  left:40%;
  height: 100px;
  font-weight: bold;
  font-size: 16px;
  p {
    padding-top: 20px;
  }
  p:last-child{
    padding-top: 5px;
  }

}
</style>
