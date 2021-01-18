<template>
  <div class="container">
    <div class="drawcontent">
      <div class="commflex top-label">
        <div>
          <span class="bold">地区:</span>
          <span>中国</span>
        </div>
        <div>
          <span class="bold">证件类型:</span>
          <span>身份证</span>
        </div>
      </div>
      <div class="h72">
        <div
          class="comm-inputcon mt15"
          :class="[nameFocus?'inputFocus':'',nameBlur?'inputBlur':'']"
        >
          <van-field
            v-model="name"
            :placeholder="$t('tips15')"
            @focus="inputFocus(0)"
            @blur="inputBlur(0)"
          />
        </div>
        <span
          v-show="nameBlur"
          class="error-message"
        >请输入正确的姓名</span>
      </div>
      <div class="h72">
        <div
          class="comm-inputcon mt20"
          :class="[cardNumberFocus?'inputFocus':'',cardNumberBlur?'inputBlur':'']"
        >
          <van-field
            v-model="cardNumber"
            :placeholder="$t('tips16')"
            maxlength="18"
            @focus="inputFocus(1)"
            @blur="inputBlur(1)"
          />
        </div>
        <span
          v-show="cardNumberBlur"
          class="error-message"
        >请输入正确的身份证号</span>
      </div>

      <div class="mt20">
        <van-button
          size="large"
          round
          :disabled="!isButtonEnable"
          class="orange-btn"
          @click="submit"
        >
          {{ $t('commit') }}
        </van-button>
      </div>
      <div
        class="mt15"
        @click="goOtherCertify"
      >
        <p class="goOtherCertify">
          没有中国地区身份证？点击选择其他认证方式
        </p>
      </div>
      <!-- <div class="drawtip graycolor mt15">
        <p>{{ $t('notice') }}:</p>
        <p>* 根据“反洗钱”相关法律规定，用户必须进行实名认证。</p>
        <p>* 实名信息必须为本人真实信息。</p>
        <p>* 每个有效证件仅能用于一个账号。</p>
        <p>* 请用与实名信息一致的支付宝、微信、银行卡进行交易，否则不予放币。</p>
      </div> -->
    </div>
    <van-dialog
      v-model="submitAlertFlag"
      class="certify-dialog-wrap"
      :show-confirm-button="false"
    >
      <div class="certify-confirm-dialog">
        <img
          src="../../assets/images/icon-idcard-success.png"
          width="58"
        >
        <div class="confirm-title">
          确认提交以下认证信息？
        </div>
        <div class="confirm-content">
          <div class="commflex">
            <span>国家或地区:</span><span>{{ zone }}</span>
          </div>
          <div class="commflex">
            <span>证件类型:</span><span>身份证</span>
          </div>
          <div class="commflex">
            <span>姓名:</span><span>{{ name }}</span>
          </div>
          <div class="commflex">
            <span>证件号码:</span><span>{{ cardNumber }}</span>
          </div>
        </div>
        <!-- <button @click="gotoPay">
          我已知晓
        </button> -->
        <button @click="tonext">
          确定
        </button>
        <button
          class="mt20 cancel-btn"
          @click="() => (submitAlertFlag = false)"
        >
          取消
        </button>
      </div>
    </van-dialog>
  </div>
</template>
<script>
import { DI } from 'core'
import { Indicator, Message } from 'components'
export default {
  data() {
    return {
      submitAlertFlag: false,
      cardNumber: '',
      name: '',
      zone: '中国',
      cardType: '身份证',
      nameFocus: false,
      cardNumberFocus: false,
      nameBlur: false,
      cardNumberBlur: false
    }
  },
  computed: {
    isButtonEnable() {
      return this.isLegalName && this.isLegalCardNumber
    },
    isLegalName(){
      var pattern = new RegExp(/^[\u4e00-\u9fa5]+$/)
      return this.name && pattern.test(this.name)
    },
    isLegalCardNumber(){
      var pattern = new RegExp((/^[0-9Xx]+$/))
      return this.cardNumber && pattern.test(this.cardNumber) && this.cardNumber.length === 18
    }
  },
  mounted() {
    DI.get('utils').setTitle(this.$t('realname'))
    DI.get('utils').setBackAction(() => {
      if(this.$route.query === 'payment'){
        this.$router.replace({
          name: 'buy'
        })
        return
      }
      this.$router.go(-1)
    })
  },
  methods: {
    inputFocus(item){
      this.nameFocus = false
      this.cardNumberFocus = false
      if(item === 0){
        this.nameBlur = false
        this.nameFocus = true
      }
      if(item === 1){
        this.cardNumberBlur = false
        this.cardNumberFocus = true
      }
    },
    inputBlur(item){
      if(item === 0){
        this.nameFocus = false
        if(!this.isLegalName){
          this.nameBlur = true
        }
      }
      if(item === 1){
        this.cardNumberFocus = false
        if(!this.isLegalCardNumber){
          this.cardNumberBlur = true
        }
      }
    },
    submit(){
      this.submitAlertFlag = true
    },
    tonext(){
      Indicator.open('提交中')
      DI.get('accountHttp')
        .verifyByIdCard({
          name: this.name,
          card_number: this.cardNumber,
          card_country: this.zone
        })
        .then(() => {
          DI.get('auth').syncUser()
          this.$router.push({
            name: 'realnameSuccess',
            params: {
              // cardNumber: this.cardNumber,
              // name: this.name
              cardCountry: this.zone,
              cardType: this.cardType,
              name: this.name,
              cardNumber: this.cardNumber
            }
          })
        })
        .catch(Message)
        .then(() => {
          Indicator.close()
        })
    },
    goOtherCertify(){
      this.$router.push({ name: 'otherCertify' })
    }

  }
}
</script>

<style scoped lang="less">

.drawcontent {
  padding: 30px 40px;
}
.drawcontent input {
  font-size:16px
}
.top-label {
  padding-bottom: 10px;
}
.drawcode {
  display:inline-block;
  width:25px;
  height:50px;
  background:url("../../assets/images/icon08.png") no-repeat center;
  background-size:100%;
  vertical-align:middle;
}
.yzm .van-password-input__security {
  height:45px;
}
.goOtherCertify{
  opacity: 0.8;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #3f46b4;
  text-align: center;
  line-height: 24px;
  text-decoration:underline;
  padding-top: 10px;
}

.error-message{
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #F7441A;
    letter-spacing: 0;
}
.h72{
    height: 72px;
}

.inputFocus{
    border: 1px solid #00C3D2!important;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.06)!important;
}
.inputBlur{
    border: 1px solid #F7441A!important;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.06)!important;
}

.certify-confirm-dialog {
  padding: 30px;
  img {
    margin: 0 auto;
  }
  .confirm-title {
    text-align: center;
    font-size: 16px;
    color: #000;
    margin-top: 10px;
    font-weight: bold;
  }
  .confirm-content {
    padding: 20px 0;
    font-size: 14px;
    color: #000;
    line-height: 25px;
  }
  button {
    display: block;
    width: 100%;
    outline: none;
    background-color: #00C3D2;
    height: 48px;
    line-height: 48px;
    text-align: center;
    color: #fff;
    font-size: 16px;
    border: none;
    border-radius: 5px;
  }
  .cancel-btn{
      background-color: #fff;
      color: #00C3D2;
      border: 2px solid #DDDDDD;
      border-radius: 5px;
  }
}
.van-dialog {
    overflow: visible!important;
}

</style>
