import { DI } from 'core'

export default class ReceiptHttp {
  uploadImage(data, config) {
    return DI.get('baseMainHttp').post('receipt/qr/upload', data, config)
  }

  updateReceipt(data) {
    return DI.get('baseMainHttp').post('receipt/update', data)
  }

  getReceiptInfo() {
    return DI.get('baseMainHttp').get('receipt/detail')
  }
}
