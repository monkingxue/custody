import { DI } from 'core'

export default class RingkingHttp {
  getCryptoMarketCap() {
    return DI.get('baseMainHttp').get('/v2/crypto_market_cap')
  }

  getCryptoDominance(period = 'all') {
    return DI.get('baseMainHttp').get(`/v2/crypto_dominance?period=${period}`)
  }
}
