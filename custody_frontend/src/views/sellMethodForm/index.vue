<template>
  <div class="sell-form">
    <template v-if="isAlipay || isWeixin">
      <div
        class="sell-tip"
        @click="openTipDialog"
      >
        请上传您的{{ isAlipay ? '支付宝' : '微信' }}收款二维码
        <img src="../../assets/images/sell-help.png">
      </div>
      <div
        class="sell-upload"
        @click="onUploadClick"
      >
        <img
          v-if="imageUrl"
          key="qr"
          class="preview"
          :src="imageUrl"
        >
        <template v-else>
          <img
            v-if="isAlipay"
            key="alipay"
            src="../../assets/images/sell-alipay.png"
          >
          <img
            v-else
            key="wechat"
            src="../../assets/images/sell-wechat.png"
          >
        </template>
      </div>
    </template>
    <input
      ref="file"
      type="file"
      @change="handleFileUpload()"
    >
    <div
      v-if="isAlipay || isWeixin"
      class="comm-inputcon"
    >
      <van-field
        v-model="name"
        placeholder="姓名"
        :readonly="isSetCardNumber"
      />
    </div>
    <div
      v-if="isAlipay"
      class="comm-inputcon mt30"
    >
      <van-field
        v-model="alipayAddress"
        placeholder="支付宝账户"
      />
    </div>
    <div
      v-if="isWeixin"
      class="comm-inputcon mt30"
    >
      <van-field
        v-model="wechatAddress"
        placeholder="微信号"
      />
    </div>
    <template v-if="isBank">
      <div
        class="comm-inputcon mt30"
      >
        <van-field
          v-model="bankUserName"
          placeholder="收款人姓名"
          :readonly="isSetCardNumber"
        />
      </div>
      <div
        class="comm-inputcon mt30"
      >
        <van-field
          v-model="bankCardNumber"
          placeholder="银行卡号"
        />
      </div>
      <div
        class="comm-inputcon mt30"
      >
        <van-field
          v-model="bankName"
          placeholder="银行名称"
        />
      </div>
      <div
        class="comm-inputcon mt30"
      >
        <van-field
          v-model="bankAddress"
          placeholder="开户行地址（选填）"
        />
      </div>
    </template>
    <div class="mt30">
      <van-button
        size="large"
        round
        :disabled="!isButtonEnable"
        class="orange-btn"
        @click="goToNext"
      >
        {{ $t('commit') }}
      </van-button>
    </div>
    <div class="drawtip graycolor mt15">
      <p>{{ $t('notice') }}:</p>
      <p>*  请仔细核对收款账号信息。</p>
      <p>*  绑定的账号必须为本人真实账号。</p>
    </div>
  </div>
</template>
<script>
import { DI } from 'core'
import { Indicator, Message } from 'components'
import { Dialog } from 'vant'

const PAYMENT_TYPE = {
  ALIPAY: 1,
  WEIXINPAY: 2,
  CARD: 3
}

export default {
  data() {
    return {
      alipayAddress: '',
      wechatAddress: '',
      name: '',
      bankUserName: '',
      bankCardNumber: '',
      bankName: '',
      bankAddress: '',
      file: '',
      imageUrl: '',
      title: '',
      type: '',
      isManage: false,
      customWechat: DI.get("CUSTOMER_SERVICE_WECHAT")
    }
  },
  computed: {
    isButtonEnable() {
      if (this.isAlipay) {
        return this.imageUrl && this.name && this.alipayAddress
      }
      if (this.isWeixin) {
        return this.imageUrl && this.name && this.wechatAddress
      }
      return this.bankUserName && this.bankCardNumber && this.bankName
    },
    isAlipay() {
      return this.type === 'ALIPAY'
    },
    isSetCardNumber() {
      return this.account.set_card_number
    },
    account() {
      return DI.get('auth').getUser()
    },
    isWeixin() {
      return this.type === 'WEIXINPAY'
    },
    isBank() {
      return this.type === 'CARD'
    }
  },
  watch: {
    isSetCardNumber: {
      immediate: true,
      handler(val) {
        if (val) {
          const { name } = this.account
          this.name = name
          this.bankUserName = name
        }
      }
    }
  },
  mounted() {
    const { type } = this.$route.query
    const { config } = this.$route.params
    this.type = type || 'ALIPAY'
    let title = '银行卡设置'
    if (this.isAlipay) title = '支付宝设置'
    if (this.isWeixin) title = '微信设置设置'
    DI.get('utils').setTitle(title)
    this.title = title
    if (config) {
      this.isManage = true
      if (config.set) {
        if (this.isAlipay) {
          this.imageUrl = config.qr
          this.alipayAddress = config.account
          this.name = config.name
          return
        }
        if (this.isWeixin) {
          this.imageUrl = config.qr
          this.wechatAddress = config.account
          this.name = config.name
          return
        }
        if (this.isBank) {
          this.bankUserName = config.name
          this.bankCardNumber = config.card_number
          this.bankName = config.bank_name
          this.bankAddress = config.bank_address
          return
        }
      }
    }
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
      Indicator.open('上传中')
      let formData = new FormData()
      formData.append('qr', this.file)
      DI.get('receiptHttp')
        .uploadImage(formData, {
          timeout: 1000 * 60,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((res) => {
          this.imageUrl = res.image_url
        })
        .catch(Message)
        .then(() => {
          Indicator.close()
        })
    },
    goToNext(){
      let postObject = {
        receipt_type: PAYMENT_TYPE[this.type],
        name: this.name,
        account: this.isAlipay ? this.alipayAddress : this.wechatAddress,
        qr: this.imageUrl
      }
      if (this.isBank) {
        postObject = {
          receipt_type: PAYMENT_TYPE[this.type],
          name: this.bankUserName,
          card_number: this.bankCardNumber,
          bank_name: this.bankName,
          bank_address: this.bankAddress
        }
      }
      Indicator.open('提交中')
      DI.get('receiptHttp')
        .updateReceipt(postObject)
        .then(() => {
          Message(`${this.title}成功`)
          this.$router.push({
            name: this.isManage ? 'account' : 'buy'
          })
        })
        .catch(Message)
        .then(() => {
          Indicator.close()
        })
    },
    openTipDialog() {
      if (this.isAlipay) {
        Dialog.alert({
          title: '收款码上传步骤',
          messageAlign: 'left',
          message: `1. 打开支付宝，在【首页】顶部点击【收钱】。

2. 点击【保存图片】，将收款二维码保存到手机相册中。

3. 回到aBTC.one，在此页面上传您的收款二维码，即可完成操作。`
        })
        return
      }
      Dialog.alert({
        title: '收款码上传步骤',
        messageAlign: 'left',
        message: `1. 打开微信，依次选择【我】->【支付】->【收款码】->【二维码收款】。

2. 点击【保存收款码】，将收款二维码保存到手机相册中。

3. 回到aBTC.one，在此页面上传您的收款二维码，即可完成操作。`
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

.sell-form {
  background: #FFF;
  padding: 20px 30px;
}
.sell-form input {
  font-size:16px
}
.sell-tip {
  font-size: 14px;
  padding: 0 0 15px 0;
  img {
    width: 12px;
    display: inline-block;
  }
}
.sell-upload {
  img {
    width: 100%;
  }
  padding: 0 0 20px 0;
  .preview {
    width: 30%;
    margin: 0 auto;
  }
}

</style>
