<template>
  <div class="comm-list payment">
    <div
      class="comm-listitem rightrow"
      @click="goToAvatar"
    >
      <div class="flex-left-right my-right">
        <span>{{ $t('me.avatar') }}</span>
        <div class="circular">
          <img
            v-if="isSetAvatar"
            :src="account.small_avatar"
            class="avatar comm-list-right"
          >
          <img
            v-else
            src="../../assets/images/avatar-guest.png"
            class="avatar comm-list-right"
          >
        </div>
      </div>
    </div>
    <div
      class="comm-listitem rightrow"
      @click="goToNickname"
    >
      <div class="flex-left-right my-right">
        <span>{{ $t('me.nickname') }}</span>
        <span class="comm-list-right">{{
          isSetNickname
            ? account.nickname
            : $t("me.emptyField")
        }}
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import { DI } from 'core'

export default {
  data() {
    return {
      avatar: "",
      nickName: ''
    }
  },
  computed: {
    isSetAvatar() {
      return this.account.small_avatar !== ""
    },
    isSetNickname() {
      return this.account.nickname !== ""
    },
    account() {
      return DI.get('auth').getUser()
    }
  },
  mounted() {
    DI.get('utils').setTitle(this.$t("me.profile"))
    DI.get('utils').setBackAction(() => {
      DI.get('auth').syncUser()
      this.$router.push('account')
    })
    this.avatar = this.account.small_avatar
    this.nickname = this.account.nickname
  },
  methods: {
    goToAvatar(){
      this.$router.push({ name: 'avatar' })
    },
    goToNickname(){
      this.$router.push({ name: 'nickname' })
    }
  }
}
</script>
<style scoped lang="less">
.circular{
  margin: 17px 0;
}
.payment {
  background: #FFF;
}
.payalipay {
  background:url("../../assets/images/alipay.png")no-repeat  center;
  background-size:100%;
}
.paywx {
  background:url("../../assets/images/wx.png")no-repeat  center;
  background-size:100%;
}
.paybank {
  background:url("../../assets/images/bank.png")no-repeat  center;
  background-size:100%;
}
.commend{
    font-size:12px;
    font-weight:bold;
    background: #fef4e8;
    padding:2px 5px;
    border-radius:4px;
}
.my-right {
  width: 90%;
}
.comm-list-right {
  font-size: 12px;
  color: #999;
}
.withdraw-popup {
  height: calc(100vh - 44px - 40px);
  margin-top: 40px;
.title {
    font-size: 18px;
    font-weight: bold;
    padding: 15px 0 10px;
    text-align: left;
    display: flex;
    justify-content: space-between;
    i {
      width: 20px;
    }
  }
  .info {
    padding: 15px 0 0;
    font-size: 16px;
    color: #636363;
  }
.withdraw-pass{
  padding: 40px 0;
}
.withdraw-btn {
  margin-bottom: 40px;
}
.withdraw-cancel-btn {
  background: #999!important;
  box-shadow: none;
  opacity: .6;
  margin-top: -10px;
}
}
.extra-fee {
  background: #FE7355;
  font-weight:bold;
  color: #fff;
  font-size: 12px;
  padding: 2px 8px;
  height: 20px;
  vertical-align: top;
  border-radius: 10px;
}
</style>
