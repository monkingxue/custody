import { DI } from 'core'

export default class PairHttp {
  getPairPriceByName(nameArr = ['BTC_USDT']) {
    return DI.get('baseMainHttp').get(`v2/multiple_pair_price?pair_names=${nameArr.join(',')}`)
  }

  getPairListV2(data) {
    return DI.get('baseMainHttp').get('/v2/coins', data)
  }

  getIEOCoins() {
    return DI.get('baseMainHttp').get('/v2/ieo_coins')
  }

  getHotCoins() {
    return DI.get('baseMainHttp').get('/v2/hot_coins')
  }

  placeExchangeOrder(data) {
    return DI.get('baseMainHttp').post('exchange/order/place', data)
  }

  placeLimitOrder(data) {
    return DI.get('baseMainHttp').post('/v2/bibi/place_limit_order', data)
  }

  cancelLimitOrder(data) {
    return DI.get('baseMainHttp').post('/v2/bibi/cancel_limit_order', data)
  }

  getExchangeOrders(page = 1, size = 15, status = 'all', symbol = 'all', recent = 0) {
    return DI.get('baseMainHttp').get(`exchange/orders?page=${page}&page_size=${size}&status=${status}&symbol=${symbol}&recent=${recent}`)
  }

  getNiuyanCoinChart(coin_id = 'bitcoin', type = '1d') {
    return DI.get('baseMainHttp').get(`niuyan_chart?type=${type}&coin_id=${coin_id}`)
  }

  getNiuyanCoinInfo(coin_id = 'bitcoin') {
    return DI.get('baseMainHttp').get(`niuyan_info?coin_id=${coin_id}`)
  }

  getCoinInfo(coin) {
    return DI.get('baseMainHttp').get(`/coin_info?coin=${coin}`)
  }

  getMarketsInfo(symbol = 'BTC_USDT') {
    return DI.get('baseMainHttp').get(`/pair_price_aggregation?symbol=${symbol}`)
  }

  getMarketDepth(symbol, limit = '50') {
    return DI.get('baseMainHttp').get(`/v3/market_depth?symbol=${symbol}&limit=${limit}`)
  }

  getTradeStat(symbol) {
    return DI.get('baseMainHttp').get(`/exchange/trade/stat?symbol=${symbol}`)
  }

  getPairSearch(data) {
    return DI.get('baseMainHttp').get('/pair/search', data)
  }

  getPairChart(pair_name = 'pgs_usdt', period = '1d') {
    return DI.get('baseMainHttp').get(`/v2/pair_chart?pair_name=${pair_name}&period=${period}`)
  }

  getAssetSearch(data) {
    return DI.get('baseMainHttp').get('/asset/search', data)
  }

  getHotSearch() {
    return DI.get('baseMainHttp').get('/hot_search_coins')
  }

  getArticles(page = 1, pageSize = 10) {
    return DI.get('baseMainHttp').get(`/articles?page=${page}&page_size=${pageSize}`)
  }

  getDepthAnalysis(coin) {
    return DI.get('baseMainHttp').get(`/depth_analysis?coin=${coin}`)
  }
}
