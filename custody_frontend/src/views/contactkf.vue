<template>
  <div class="contactkf container-white">
    <div class="comm-list">
      <!-- <div class="comm-listitem spacebetw">
        <div>QQ</div>
        <CopyButton
          :text="1075317376"
        />
      </div> -->
      <div class="comm-listitem  noborder spacebetw">
        <div>{{ $t('wechat') }}</div>
        <CopyButton
          :text="customWechat"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { DI } from 'core'
import { CopyButton } from 'components'
const WECHAT_XIAOYA = 'onebtc918'

export default {
  components: {
    CopyButton
  },
  data() {
    return {
      customWechat: this.$template === 'cobo' ? WECHAT_XIAOYA : DI.get("CUSTOMER_SERVICE_WECHAT")
    }
  },
  mounted() {
    DI.get('utils').setTitle(this.$t('contactkf'))
  }
}
</script>
<style scoped>
.contactkf {
  min-height: 95vh;
}

</style>
