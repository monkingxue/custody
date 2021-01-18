import { DI } from 'core'

export default class RingkingHttp {
  getStockList(page = '1', pageSize = '20') {
    return DI.get('baseMainHttp').get(`/stocks?page=${page}&page_size=${pageSize}`)
  }

  getMultipleStockPrice(stockNames = 'AAPL,IBM') {
    return DI.get('baseMainHttp').get(`/multiple_stock_price?stock_names=${stockNames}`)
  }

  getStockInfo(symbol = 'AAPL') {
    return DI.get('baseMainHttp').get(`/stock_info?symbol=${symbol}`)
  }

  getStockChart(symbol = 'AAPL', period = '1d') {
    return DI.get('baseMainHttp').get(`/stock_chart?symbol=${symbol}&period=${period}`)
  }
}
