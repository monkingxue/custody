import { DI } from 'core'
// import { Message } from 'components'

const PAIR_CONNECTION = "/"
const SYMBOL_CONNECTION = "_"
const POLLING_TOAST = "POLLING_TOAST"

export default class Utils {
  setBody(bodyClass) {
    DI.get('vue').$emit('set-body', bodyClass)
  }

  toggleBodyClass(bodyClass) {
    DI.get('vue').$emit('toggle-body-class', bodyClass)
  }

  setTitle(title) {
    DI.get('vue').$emit('set-title', title)
  }

  setBackAction(action) {
    DI.get('vue').$emit('set-header-left', {
      action
    })
  }

  revertBackAction() {
    DI.get('vue').$emit('revert-header-left')
  }

  humanizeByName(constant, value) {
    const o = DI.get(constant)
      .filter(oo => (oo.value === value))
    return o[0] ? o[0].name : value
  }

  getUA() {
    return window.navigator.userAgent.toLowerCase()
  }

  isFromApp() {
    return this.getUA().indexOf('abtc') > -1 || typeof share === "function"
  }

  isFromWeChat() {
    return this.getUA().indexOf('micromessenger') > -1
  }

  isFromAndroid() {
    return this.getUA().indexOf('android') > -1
  }

  isFromiOS() {
    return this.getUA().indexOf('iphone') > -1
  }

  isFromMobile() {
    return this.isFromAndroid() || this.isFromiOS()
  }

  setMixpanelEvent(scope, event) {
    // window.mixpanel.track && window.mixpanel.track(event)
    window._hmt && window._hmt.push(['_trackPageview', '/#/custom_event_' + scope + '_' + event])
    window._hmt && window._hmt.push(['_trackEvent', scope, event])
  }

  openImgNewTab(base64) {
    const win = window.open("")
    let html = ''

    html += '<html>'
    html += '<body style="margin:0!important">'
    html += '<img width="100%" src="' + base64 + '"  />'
    html += '</body>'
    html += '</html>'

    setTimeout(() => {
      win.document.write(html)
    }, 0)
  }

  appShareImg(base64) {
    if (this.isFromApp()) {
      window.share && window.share(base64)
    }
  }

  appSaveImg(base64) {
    if (this.isFromApp()) {
      window.save && window.save(base64)
    }
  }

  appVibrate(level = 0) {
    if (this.isFromApp()) {
      window.vibrate && window.vibrate(level)
    }
  }

  appPaste() {
    if (this.isFromApp()) {
      let result = window.paste()
      if (typeof result === 'string') {
        return new Promise((resolve) => {
          return resolve(result)
        })
      }
      window.callbackObject.pasteResult = ""
      return new Promise((resolve) => {
        (function waitForFoo(){
          if (
            typeof window.callbackObject === 'object'
            && window.callbackObject.pasteResult
          ) {
            return resolve(window.callbackObject.pasteResult)
          }
          setTimeout(waitForFoo, 100)
        })()
      })
    }
  }

  appScreenshot(fullscreen = false) {
    if (this.isFromApp()) {
      window.screenshot && window.screenshot(fullscreen)
    }
  }

  appShare() {
    if (!this.isFromApp()) return
    this.toggleBodyClass('app-share-wrap')
    setTimeout(() => {
      this.appScreenshot()
    }, 100)
    setTimeout(() => {
      this.toggleBodyClass('app-share-wrap')
    }, 110)
  }

  goToDownloadApp(setting) {
    let link = setting.android_app_download_link
    if (this.isFromiOS()) {
      link = setting.ios_app_download_link
    }
    window.location = link
  }

  getBaseFromSymbol(symbol = 'BTC_USDT') {
    if (symbol.indexOf(SYMBOL_CONNECTION) === -1) {
      return null
    }
    return symbol.split(SYMBOL_CONNECTION)[0]
  }

  getQuoteFromSymbol(symbol = 'BTC_USDT') {
    if (symbol.indexOf(SYMBOL_CONNECTION) === -1) {
      return null
    }
    return symbol.split(SYMBOL_CONNECTION)[1]
  }

  formatPairItem(item) {
    item["base"] = DI.get("utils").getBaseFromSymbol(item.symbol)
    item["quote"] = DI.get("utils").getQuoteFromSymbol(item.symbol)
    return item
  }

  formatPairArray(pairArr) {
    return pairArr.map(item => {
      return this.formatPairItem(item)
    })
  }

  getPairFromSymbol(symbol = 'BTC_USDT') {
    return symbol && symbol.replace(SYMBOL_CONNECTION, PAIR_CONNECTION)
  }

  getPairWithSpace(symbol = 'BTC_USDT') {
    return symbol && symbol.replace(SYMBOL_CONNECTION, ` ${PAIR_CONNECTION} `)
  }

  getCoinIconUrlFromSetting(coin, coinSetting) {
    if (!coinSetting) {
      coinSetting = coin
      coin = coinSetting.name
    }
    return coinSetting && coinSetting["use_device_icon"]
      ? DI.get('BI_LOCAL_ICON')[coin]
      : coinSetting["icon_url"]
  }

  pollingToast(message, type) {
    if (!message.response || !message.response.data) {
      let polling = DI.get("offlineStorage").get(POLLING_TOAST)
      polling = polling ? JSON.parse(polling) : []
      if (!Array.isArray(polling)) {
        DI.get("offlineStorage").remove(POLLING_TOAST)
        polling = []
      }
      // if (!polling.length) {
      //   Message(message)
      // }
      if (typeof(type) === "string") {
        if (polling.indexOf(type) !== -1) {
          return
        }
        polling.push(type)
        DI.get("offlineStorage").set(POLLING_TOAST, JSON.stringify(polling))
      }
    }
  }

  clearPollingToast(response, type) {
    let polling = DI.get("offlineStorage").get(POLLING_TOAST)
    polling = polling ? JSON.parse(polling) : []

    if (!Array.isArray(polling)) {
      DI.get("offlineStorage").remove(POLLING_TOAST)
      return
    }

    if (response && polling.indexOf(type) !== -1) {
      const index = polling.indexOf(type)
      polling.splice(index, 1)
    }
    if (!polling.length) {
      DI.get("offlineStorage").remove(POLLING_TOAST)
    } else {
      DI.get("offlineStorage").set(POLLING_TOAST, JSON.stringify(polling))
    }
  }
}
