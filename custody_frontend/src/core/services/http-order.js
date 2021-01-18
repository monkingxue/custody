import { DI } from 'core'

export default class OrderHttp {
  placeOrder(data) {
    return DI.get('baseMainHttp').post('/v2/order/place', data)
  }

  getOrderList({
    page = 1, size = 15, status = 'all'
  }) {
    return DI.get('baseMainHttp').get(`/v2/orders?page=${page}&page_size=${size}&status=${status}`)
  }

  getOrderListOtc({
    page = 1, size = 15
  }) {
    return DI.get('baseMainHttp').get(`/otc_orders?page=${page}&page_size=${size}`)
  }

  getOrderDetailById(id) {
    return DI.get('baseMainHttp').get(`/v2/order/${id}`)
  }

  cancelOrder(data) {
    return DI.get('baseMainHttp').post('/order/cancel', data)
  }

  processOrder(data) {
    return DI.get('baseMainHttp').post('/order/processing', data)
  }

  getTransactions(currency = 'BTC', page = 1) {
    return DI.get('baseMainHttp').get(`/transactions?page=${page}&page_size=50&currency=${currency}`)
  }

  createWithdraw(data) {
    return DI.get('baseMainHttp').post('/withdraw/create', data)
  }

  getDepositAddress(currency = 'BTC') {
    return DI.get('baseMainHttp').get(`/deposit/address?currency=${currency}`)
  }

  getDepositAddressV2(currency = 'BTC') {
    return DI.get('baseMainHttp').get(`/v2/get_deposit_address?currency=${currency}`)
  }

  getWithdrawDetail(withdraw_id) {
    return DI.get('baseMainHttp').get(`/withdraw/${withdraw_id}`)
  }

  otcChangeMerchant(data) {
    return DI.get('baseMainHttp').post('/otc_change_merchant', data)
  }
}
