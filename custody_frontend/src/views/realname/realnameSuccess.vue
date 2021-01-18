<template>
  <div class="container">
    <div
      v-if="!verifySuccess"
      class="drawcontent"
    >
      <div
        class="orangeclock tc"
        style="margin-top: 5vh;"
      >
        <div class="loading-wrap">
          <van-loading
            type="spinner"
            size="44px"
            color="#00C3D2"
          />
        </div>
      </div>
      <p class="mt30 font18 bold tc">
        提交成功，审核中…
      </p>
    </div>
    <div
      v-else
      class="drawcontent"
    >
      <div
        class="orangeclock tc"
        style="margin-top: 10vh;"
      >
        <p>
          <img
            src="../../assets/images/icon-idcard-success.png"
            width="80"
            style="margin:0 auto;"
          >
        </p>
      </div>
      <p class="mt30 font18 bold tc">
        {{ $t('tips24') }}
      </p>
      <div class="mt30">
        <van-button
          size="large"
          round
          class="orange-btn"
          @click="tomine"
        >
          {{ $t('confirm') }}
        </van-button>
      </div>
    </div>
  </div>
</template>
<script>
import { DI } from 'core'

export default {
  data() {
    return {
      cardCountry: '',
      cardType: '',
      name: '',
      cardNumber: '',
      verifySuccess: false
    }
  },
  computed: {
    // displayName() {
    //   return `${DI.get('filters').cutString(this.name, 1)}**`
    // },
    // displayCard() {
    //   return this.cardNumber.replace(/^(.{4})(?:\d+)(.{4})$/,"$1******$2")
    // }
  },
  mounted() {
    DI.get('utils').setBackAction(() => {this.$router.push('/account')})
    DI.get('utils').setTitle(this.$t('realname'))
    const { params } = this.$route
    if (params.name) {
      this.name = params.name
      this.cardNumber = params.cardNumber
      this.cardType = params.cardType
      this.cardCountry = params.cardCountry
    }
    setTimeout(() => {
      this.verifySuccess = true
    }, 1000 * 2)
  },
  methods: {
    tomine(){
      this.$router.push({ name: 'account' })
    }
  }
}
</script>
<style>

.drawcontent{
    padding:40px;
}
.van-uploader{
  vertical-align: middle;
}
.uploadpic{
  padding:20px;
  background: #fafefe;
  border:1px dashed #04d2b1;
  border-radius:4px;

}
.flexlayone {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}
.pd10{
  padding: 10px;
}
.loading-wrap {
  width: 44px;
  margin: 0 auto;
}
</style>
