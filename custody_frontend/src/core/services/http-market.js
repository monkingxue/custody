import { DI } from 'core'

export default class MarketHttp {
  getPrice() {
    return DI.get('baseMainHttp').get('/v2/market/price?symbol=ALL')
  }

  getOtcPrices(coin = 'btc', side = 'buy') {
    return DI.get('baseMainHttp').get(`/v2/market/otc_prices?coin=${coin}&side=${side}`)
  }

  sendRedPacket(data) {
    return DI.get('baseMainHttp').post('/red_packet/send', data)
  }

  getRedPacketById(id) {
    return DI.get('baseMainHttp').get(`/red_packet/detail?identifier=${id}`)
  }

  getSetting() {
    return DI.get('baseMainHttp').get('/v2/settings')
  }

  getWalletCoinSetting(coin) {
    return DI.get('baseMainHttp').get(`/wallet_coin_setting?coin_name=${coin}`)
  }

  getOtcCoinSetting() {
    return DI.get('baseMainHttp').get('/otc_coin_settings')
  }

  getNotice() {
    return DI.get('baseMainHttp').get('/config_article?tag=notice')
  }
}
