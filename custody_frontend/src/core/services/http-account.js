import { DI } from 'core'

export default class AccountHttp {
  getAccountDetail(id) {
    return DI.get('baseMainHttp').get(`customer/${id}`)
  }

  verifyByIdCard(data) {
    return DI.get('baseMainHttp').post('/customer/verify/', data)
  }

  updateFundPassword(data) {
    return DI.get('baseMainHttp').post('/customer/fund_password/', data)
  }

  getInviteList(page = 1) {
    return DI.get('baseMainHttp').get(`/invite/list?page_size=5&page=${page}`)
  }

  getRebateList(page = 1) {
    return DI.get('baseMainHttp').get(`/rebate/list?page_size=5&page=${page}`)
  }

  getAccountStat() {
    return DI.get('baseMainHttp').get('/customer/stat')
  }

  initWallet() {
    return DI.get('baseMainHttp').post('customer/init_wallet')
  }

  getVipStatus() {
    return DI.get('baseMainHttp').get('/customer/credit')
  }

  updateOtcPartnerInfo(data) {
    return DI.get('baseMainHttp').post('/customer/otc_partner/update', data)
  }

  getBalanceChart(period = '1d') {
    return DI.get('baseMainHttp').get(`/balance_chart?period=${period}`)
  }

  getGoogleAuthInfo() {
    return DI.get('baseMainHttp').get('bind_google_auth')
  }

  sendGoogleAuthSms(data) {
    return DI.get('baseMainHttp').post('/send_google_auth_code', data)
  }

  bindGoogleAuth(data) {
    return DI.get('baseMainHttp').post('/bind_google_auth', data)
  }

  unbindGoogleAuth(data) {
    return DI.get('baseMainHttp').post('/unbind_google_auth', data)
  }
}
