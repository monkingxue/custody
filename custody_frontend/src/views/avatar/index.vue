<template>
  <div class="avatar-form">
    <div
      v-if="!small_avatar"
      class="avatar-tip"
    >
      {{ $t('me.pleaseUploadAvatar') }}
    </div>
    <div
      class="avatar-upload"
      @click="onUploadClick"
    >
      <img
        v-if="small_avatar"
        :key="small_avatar"
        class="preview"
        :src="small_avatar"
      >
      <img
        v-else
        src="../../assets/images/uploadAvatar.png"
      >
    </div>
    <input
      ref="file"
      type="file"
      @change="handleFileUpload()"
    >
    <div class="mt30">
      <van-button
        size="large"
        round
        :disabled="!isButtonEnable"
        class="orange-btn"
        @click="saveAvatar"
      >
        {{ $t('save') }}
      </van-button>
    </div>
  </div>
</template>
<script>
import { DI } from 'core'
import { Indicator, Message } from 'components'
import AvatarCache from '../avatarCache'

export default {
  mixins: [AvatarCache],
  data() {
    return {
      avatar: '',
      small_avatar: '',
      small_avatar_old: '',
      nickName: '',
      description: '',
      file: '',
      title: ''
    }
  },
  computed: {
    account() {
      return DI.get('auth').getUser()
    },
    isButtonEnable() {
      return this.small_avatar !== this.small_avatar_old
    }
  },
  mounted() {
    DI.get('utils').setTitle(this.$t('updateAvatar'))
    this.small_avatar = this.account.small_avatar
    this.small_avatar_old = this.account.small_avatar
  },
  methods: {
    onUploadClick() {
      this.$refs.file.click()
    },
    handleFileUpload(){
      this.file = this.$refs.file.files[0]
      this.submitFile()
    },
    submitFile(){
      Indicator.open(this.$t('uploading'))
      let formData = new FormData()
      formData.append('avatar', this.file)
      DI.get('authHttp')
        .saveAvatar(formData, {
          timeout: 1000 * 60,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((res) => {
          this.avatar = res.image_url
          this.small_avatar = res.small_image_url + '?' + Date.now()
        })
        .catch(Message)
        .then(() => {
          setTimeout(()=>{
            Indicator.close()
          }, 1000 * 3)
        })
    },
    saveAvatar(){
      let postObject = {
        avatar: this.avatar || '',
        nickname: this.account.nickname || '',
        description: this.account.description || ''
      }
      Indicator.open(this.$t('saving'))
      DI.get('authHttp')
        .saveProfile(postObject)
        .then(() => {
          Message(`${this.title}成功`)
          this.removeCache()
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

<style scoped lang="less">
input[type="file"]{
  position: absolute;
  top: -500px;
  opacity: 0;
  top: 0;
  left: 0;
}

.avatar-form {
  background: #FFF;
  padding: 20px 30px;
}
.avatar-form input {
  font-size:16px
}
.avatar-tip {
  font-size: 14px;
  padding: 0 0 15px 0;
  img {
    width: 12px;
    display: inline-block;
  }
}
.avatar-upload {
  img {
    width: 100%;
    height: auto;
    overflow: hidden;
  }
  .preview {
    width: 100%;
    margin: 0 auto;
  }
}

</style>
