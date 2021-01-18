<template>
  <div class="container">
    <div class="nameContent">
      <div class="comm-inputcon mt30">
        <van-field
          ref="smsInput"
          v-model="nickName"
          class="pl40"
          maxlength="10"
          placeholder="请输入昵称"
        />
      </div>
      <div class="tc mt15 font12">
        <span class="graycolor">最少2个字，最多10个字</span>
      </div>
      <div class="mt40">
        <van-button
          size="large"
          round
          :class="isButtonEnable?'orange-btn':'gray-btn'"
          @click="SaveNickName"
        >
          保存
        </van-button>
      </div>
    </div>
  </div>
</template>
<script>
import { DI } from 'core'
import { Indicator, Message } from 'components'

export default {
  data () {
    return {
      title: '昵称设置',
      nickName: '',
      oldName: '',
      avatar: '',
      description: ''
    }
  },
  computed: {
    account () {
      return DI.get('auth').getUser()
    },
    isButtonEnable() {
      if(this.nickName === this.oldName || this.nickName.length < 2){
        return false
      }
      return true
    }
  },
  mounted () {
    DI.get('utils').setTitle('修改昵称')
    this.getCustomerProfile()
  },
  methods: {
    getCustomerProfile(){
      this.oldName = this.account.nickname
      this.nickName = this.account.nickname
      this.avatar = this.account.avatar
      this.description = this.account.description
    },
    SaveNickName(){
      if( this.nickName === this.oldName){
        return
      }
      let postObject = {
        avatar: this.imageUrl || '',
        nickname: this.nickName || '',
        description: this.description || ''
      }
      Indicator.open(this.$t('saving'))
      DI.get('authHttp')
        .saveProfile(postObject)
        .then(() => {
          Message(`${this.title}成功`)
          DI.get('auth').syncUser()
          this.$router.push({
            name: 'my'
          })
        })
        .catch(Message)
        .then(() => {
          Indicator.close()
        })
    }
  }
}
</script>
<style scoped>
.nameContent {
  padding: 40px 40px 40px 40px;
}
</style>
