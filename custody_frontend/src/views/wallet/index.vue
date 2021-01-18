<template>
  <WalletIntro
    v-if="!hasWallet || !isAuthenticated"
    @done="onFinishAnimi"
  />
  <WalletMain
    v-else
  />
</template>

<style>
</style>

<script>
// TODO: deprecated, replaced to walletMain #20190810
import { DI } from 'core'
import WalletIntro from '../walletIntro'
import WalletMain from '../walletMain'
const USER_HAS_WALLET = 'USER_HAS_WALLET'
export default {
  components: {
    WalletIntro,
    WalletMain
  },
  data() {
    return {
      userHasWallet: false
    }
  },
  computed: {
    hasWallet() {
      return DI.get('offlineStorage').get(USER_HAS_WALLET) || this.account.init_wallet || this.userHasWallet
    },
    isAuthenticated() {
      return DI.get('auth').isAuthenticated()
    },
    account() {
      return DI.get("auth").getUser()
    }
  },
  mounted() {
    this.syncUserTimer = setInterval(() => {
      DI.get('auth').syncUser()
    }, 1000 * 5)
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.syncUserTimer)
    next()
  },
  methods: {
    onFinishAnimi() {
      this.userHasWallet = true
      DI.get('accountHttp').initWallet()
        .then(() =>{
          DI.get('auth').syncUser()
        })
    }
  }
}
</script>