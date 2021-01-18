<template>
  <div class="container">
    <div class="drawcontent">
      <div class="h72">
        <div 
          class="comm-inputcon certify"
          :class="[zoneFocus?'inputFocus':'',zoneBlur?'inputBlur':'']"
        >
          <van-field
            v-model="zone"
            placeholder="请输入您所在的国家或地区(非中国大陆)"
            @focus="inputFocus(0)"
            @blur="inputBlur(0)"
          />
        </div>
        <span
          v-show="zoneBlur"
          class="error-message"
        >请输入正确的国家或者地区</span>
      </div>
      <div class="h72">
        <div
          class="comm-inputcon mt20"
          :class="[cardTypeFocus?'inputFocus':'',cardTypeBlur?'inputBlur':'']"
        >
          <van-field
            v-model="cardType"
            placeholder="请输入您的证件类型，如护照、身份证"
            @focus="inputFocus(1)"
            @blur="inputBlur(1)"
          />
        </div>
        <span
          v-show="cardTypeBlur"
          class="error-message"
        >请输入正确的证件类型</span>
      </div>
      <div class="h72">
        <div
          class="comm-inputcon mt20"
          :class="[nameFocus?'inputFocus':'',nameBlur?'inputBlur':'']"
        >
          <van-field
            v-model="name"
            :placeholder="$t('tips15')"
            @focus="inputFocus(2)"
            @blur="inputBlur(2)"
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
            placeholder="请输入您的证件号码"
            @focus="inputFocus(3)"
            @blur="inputBlur(3)"
          />
        </div>
        <span
          v-show="cardNumberBlur"
          class="error-message"
        >请输入正确的证件号码</span>
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
            <span>证件类型:</span><span>{{ cardType }}</span>
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
      selfRouter: 'otherCertify',
      submitAlertFlag: false,
      cardNumber: '',
      name: '',
      zone: '',
      cardType: '',
      zoneFocus: false,
      cardTypeFocus: false,
      nameFocus: false,
      cardNumberFocus: false,
      zoneBlur: false,
      cardTypeBlur: false,
      nameBlur: false,
      cardNumberBlur: false
    }
  },
  computed: {
    isButtonEnable() {
      return this.isLegalName && this.isLegalZone && this.isLegalCardType && this.isLegalCardNumber 
    },
    isLegalName(){
      var pattern = new RegExp(/^[\u4e00-\u9fa5a-zA-Z]+$/)
      return this.name && pattern.test(this.name)
    },
    isLegalZone(){
      var pattern = new RegExp(/^[\u4e00-\u9fa5a-zA-Z]+$/)
      return this.zone && pattern.test(this.zone)
    },
    isLegalCardType(){
      var pattern = new RegExp(/^[\u4e00-\u9fa5a-zA-Z]+$/)
      return this.cardType && pattern.test(this.cardType)
    },
    isLegalCardNumber(){
      var pattern = new RegExp(/^[a-zA-Z0-9]+$/)
      return this.cardNumber && pattern.test(this.cardNumber)
    }
  },
  created() {
    this.scrollTo = window.scrollTo
    window.scrollTo = () => {}
  },
  beforeRouteLeave(to, from, next) {
    window.scrollTo = this.scrollTo
    next()
  },
  mounted() {
    DI.get('utils').setTitle(this.$t('realname'))
  },
  methods: {
    inputFocus(item){
      this.zoneFocus = false
      this.cardTypeFocus = false
      this.nameFocus = false
      this.cardNumberFocus = false
      if(item === 0){
        this.zoneBlur = false
        this.zoneFocus = true
      }
      if(item === 1){
        this.cardTypeBlur = false
        this.cardTypeFocus = true
      }
      if(item === 2){
        this.nameBlur = false
        this.nameFocus = true
      }
      if(item === 3){
        this.cardNumberBlur = false
        this.cardNumberFocus = true
      }
    },
    inputBlur(item){
      if(item === 0){
        this.zoneFocus = false
        if( !this.isLegalZone ){
          this.zoneBlur = true
        }
      }
      if(item === 1){
        this.cardTypeFocus = false
        if(!this.isLegalCardType){
          this.cardTypeBlur = true
        }
      }
      if(item === 2){
        this.nameFocus = false
        if(!this.isLegalName){
          this.nameBlur = true
        }
      }
      if(item === 3){
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
          card_country: this.zone,
          card_type: this.cardType
        })
        .then(() => {
          this.$router.push({
            name: 'realnameSuccess',
            params: {
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
    }
  }
}
</script>

<style scoped lang="less">
.drawcontent {
  padding:40px;
}
.drawcontent input {
  font-size:16px
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
.error-message{
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #F7441A;
    letter-spacing: 0;
}
.h72{
    height: 72px;
}
</style>

<style scoped lang="less">
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
