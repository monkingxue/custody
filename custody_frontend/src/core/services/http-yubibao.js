import { DI } from 'core'

export default class YubibaoHttp {
  getCoinSetting() {
    return DI.get('baseMainHttp').get('/yubibao_coin_settings')
  }

  getContract() {
    return DI.get('baseMainHttp').get('/yubibao_contract_templates')
  }

  getVipSetting() {
    return DI.get('baseMainHttp').get('/yubibao_customer_setting')
  }

  getBalance() {
    return DI.get('baseMainHttp').get('/v2/yubibao_balance', { skipLoginRedirect: true })
  }

  getRecords(currency = 'BTC', page = 1, size = 20) {
    return DI.get('baseMainHttp').get(`/yubibao_interest_records?page=${page}&page_size=${size}&currency=${currency}`)
  }

  getContractRecords(id = 1, page = 1, size = 20) {
    return DI.get('baseMainHttp').get(`/yubibao_contract_records?page=${page}&page_size=${size}&contract_id=${id}`)
  }

  makeTransaction(data) {
    return DI.get('baseMainHttp').post('/yubibao_transaction', data)
  }

  makeContractTransaction(data) {
    return DI.get('baseMainHttp').post('/yubibao_contract_transaction', data)
  }
}
