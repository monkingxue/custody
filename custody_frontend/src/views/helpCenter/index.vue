<template>
  <div class="otherset container-white">
    <div
      v-if="false"
      class="comm-listitem rightrow"
      @click="goToFaq"
    >
      <i class="iconFaq" />
      <div>{{ $t('me.FAQ') }}</div>
    </div>
    <div
      class="comm-listitem rightrow"
      @click="contactkf"
    >
      <i class="contactus" />
      <div>{{ $t('contactkf') }}</div>
    </div>
  </div>
</template>

<script>
import { DI } from 'core'

export default {
  mounted() {
    DI.get('utils').setTitle(this.$t('me.helpCenter'))
  },
  methods: {
    goToFaq() {
      window.location = "https://abtc.zendesk.com/hc/zh-cn/categories/360001766213-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98"
    },
    contactkf(){
      this.$router.push({ name: 'contactkf' })
    }
  }
}
</script>
<style scoped>
.otherset {
  min-height: 95vh;
}
.contactus {
  background:url("../../assets/images/icon05.png")no-repeat  center;
  background-size:100%;
}
.iconFaq{
  background:url("../../assets/images/icon20.png")no-repeat  center;
  background-size:100%;
}
</style>
